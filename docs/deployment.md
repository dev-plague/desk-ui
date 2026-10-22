# Despliegue del sitio y del registry

> Destino: **`https://deskui.codehive.com.co`** en el VPC. El sitio y el
> registry se sirven desde el mismo dominio, con el registry bajo **`/r`**, que
> es la URL por defecto del CLI. Hay dos caminos: **Dokploy** (recomendado) o un
> servidor propio con nginx.

## Qué se despliega

`pnpm release:build` genera un único artefacto estático:

```text
apps/docs/dist/
├── index.html
├── assets/            # JS, CSS y fuentes con hash
├── favicon.svg
├── llms.txt
├── llms-full.txt
└── r/                 # registry compatible con shadcn
    ├── registry.json
    └── *.json
```

No hay servidor de aplicación ni variables de entorno: el sitio es una SPA con
router por hash y el registry son archivos JSON. Cualquier servidor estático con
HTTPS sirve.

## Build

```bash
pnpm install --frozen-lockfile
pnpm release:verify          # typecheck + tests + build + release:check
pnpm release:bundle          # artifacts/deskui-site-<versión>.tar.gz + SHA-256
test -f apps/docs/dist/index.html
test -f apps/docs/dist/r/registry.json
sha256sum -c artifacts/deskui-site-*.tar.gz.sha256
```

El orden importa: el registry se compila en `packages/ui/dist/registry`, se copia
a `apps/docs/public/r` y Vite lo incluye en `dist/r`. Si `dist/r` no existe, el
build se hizo sin `registry:site`.

## Dokploy

Ruta recomendada para el VPC. El repositorio incluye `Dockerfile`,
`.dockerignore` y `deploy/nginx.conf`: Dokploy construye la imagen, Traefik
publica el dominio y nginx sirve el sitio y el registry. No hay que configurar
TLS dentro del contenedor.

### 1. Requisitos

- Registro DNS `A`/`AAAA` de `deskui.codehive.com.co` apuntando al servidor de
  Dokploy.
- Puertos 80 y 443 abiertos para Traefik.
- Repositorio de GitHub conectado en Dokploy (GitHub App o deploy key).
- Al menos ~2 GB de RAM para el build (pnpm + Vite + Tailwind).

### 2. Crear la aplicación

1. **Project → Create Service → Application**.
2. **Provider**: GitHub → `dev-plague/desk-ui`, rama `master`.
3. **Build type**: `Dockerfile`.
   - Dockerfile path: `Dockerfile`.
   - Base directory: `/` (raíz del monorepo).
4. **Port**: `80`.
5. No definas variables de entorno, volúmenes ni comando de arranque.
6. Activa **Auto Deploy** si quieres que cada push a `master` reconstruya.

El Dockerfile usa `pnpm build:site`, así que genera el registry, el sitio y los
`llms.txt` sin empaquetar el CLI. La imagen final es nginx con `dist/` dentro.

### 3. Dominio y HTTPS

En **Domains → Add Domain**:

| Campo | Valor |
| --- | --- |
| Host | `deskui.codehive.com.co` |
| Path | `/` |
| Service port | `80` |
| HTTPS | activado |
| Certificate | Let's Encrypt |

Dokploy y Traefik terminan TLS y redirigen HTTP a HTTPS. No añadas certificados
ni `listen 443` a `deploy/nginx.conf`.

### 4. Desplegar y verificar

Lanza el deploy desde Dokploy y espera a que el contenedor esté healthy. Después:

```bash
curl -fsS https://deskui.codehive.com.co/ | grep -q "DeskUI"
curl -fsS https://deskui.codehive.com.co/r/registry.json \
  | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const r=JSON.parse(d);console.log(r.items.length+' items')})"

npx @deskui/cli@0.2.0 list --registry https://deskui.codehive.com.co/r
```

Comprueba también las cabeceras:

```bash
curl -sI https://deskui.codehive.com.co/r/registry.json   # max-age=300
curl -sI https://deskui.codehive.com.co/assets/<archivo>  # immutable
```

Y en navegador: `#/`, `#/componentes/toolbar`, `#/constructor`, `#/migracion` y
el selector ES/EN.

### 5. Actualizaciones y rollback

- **Actualizar**: push a `master`; el webhook reconstruye la imagen y Traefik
  cambia el contenedor cuando pasa el healthcheck.
- **Rollback**: **Deployments → Rollback** a un despliegue anterior. El sitio y
  el registry vuelven juntos porque viven en la misma imagen.
- **Healthcheck**: `/` (incluido en el Dockerfile) o `/r/registry.json` si
  prefieres validar el registry.

### 6. Si tu Dokploy tiene build type «Static»

Puedes usarlo, pero pierdes el control de cabeceras de `deploy/nginx.conf`.
Configura:

```text
Build command:    corepack enable && pnpm install --frozen-lockfile && pnpm build:site
Publish directory: apps/docs/dist
Port:             80
```

Para producción se recomienda Dockerfile: el registry necesita `Content-Type:
application/json`, caché corta y CORS, y los assets necesitan caché inmutable.

### Notas

- El dominio es parte del contrato: `DEFAULT_REGISTRY` en el CLI apunta a
  `https://deskui.codehive.com.co/r`. Si cambia, hay que publicar una versión
  nueva del CLI o usar `--registry`.
- No hay almacenamiento persistente: cada deploy es una imagen inmutable.
- El CLI se sigue publicando aparte en npm; Dokploy solo despliega el sitio.

## Servidor propio con nginx

Si no usas Dokploy, mantén releases versionadas y un symlink `current`:

```bash
RELEASE="/srv/deskui/releases/$(date +%Y%m%d-%H%M%S)"
install -d "$RELEASE"
tar -xzf artifacts/deskui-site-<versión>.tar.gz -C "$RELEASE"
chown -R www-data:www-data "$RELEASE"
ln -sfn "$RELEASE" /srv/deskui/current
```

Conserva las tres últimas releases para poder volver atrás. La extracción va a
un directorio nuevo, así que el sitio en producción no se toca hasta cambiar el
symlink.

## Nginx

```nginx
server {
    listen 80;
    server_name deskui.codehive.com.co;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name deskui.codehive.com.co;

    root /srv/deskui/current;
    index index.html;

    ssl_certificate     /etc/letsencrypt/live/deskui.codehive.com.co/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/deskui.codehive.com.co/privkey.pem;

    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
    add_header X-Frame-Options SAMEORIGIN always;

    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml text/plain;

    # El HTML cambia con cada release: no se cachea.
    location = /index.html {
        add_header Cache-Control "no-cache" always;
    }

    # Assets con hash: inmutables.
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable" always;
        try_files $uri =404;
    }

    # Registry: cache corta para poder corregir una release.
    location /r/ {
        add_header Cache-Control "public, max-age=300" always;
        add_header Access-Control-Allow-Origin "*" always;
        types { application/json json; }
        default_type application/json;
        try_files $uri =404;
    }

    # Texto para agentes: cache media.
    location ~ ^/(llms\.txt|llms-full\.txt)$ {
        add_header Cache-Control "public, max-age=3600" always;
        types { text/plain txt; }
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Notas:

- El fallback a `index.html` es defensivo: las rutas del sitio usan `#/`, así que
  el servidor siempre recibe `/`.
- No hace falta configurar `base` en Vite: el sitio se sirve en la raíz del
  dominio.
- Añade HSTS (`Strict-Transport-Security`) solo cuando HTTPS esté verificado en
  todos los subdominios que uses.
- Si el VPC usa un proxy o balanceador delante, los headers de caché deben
  respetarse; evita que el proxy cachee `index.html`.

## DNS y TLS

1. Apunta `deskui.codehive.com.co` al balanceador o a la IP del VPC.
2. Emite el certificado con Let's Encrypt (`certbot --nginx`) o el gestor del
   VPC.
3. Comprueba la renovación automática y el redirect 80 → 443.
4. Verifica que el dominio sin `www` es el canónico y que no hay contenido
   duplicado.

## Smoke tests tras desplegar

```bash
curl -fsS https://deskui.codehive.com.co/ | grep -q "DeskUI"
curl -fsS https://deskui.codehive.com.co/r/registry.json \
  | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{const r=JSON.parse(d);if(!Array.isArray(r.items)||!r.items.length)process.exit(1);console.log(r.items.length+' items')})"

node packages/cli/dist/index.js list --registry https://deskui.codehive.com.co/r
node packages/cli/dist/index.js add button --dry-run --cwd /tmp/deskui-smoke \
  --registry https://deskui.codehive.com.co/r
```

Y en navegador:

- `https://deskui.codehive.com.co/#/` carga el escritorio.
- `#/componentes/toolbar` y `#/constructor` funcionan.
- El selector ES/EN conserva `?lang=en` al recargar.
- `/llms.txt` y `/llms-full.txt` responden como `text/plain`.
- `/r/registry.json` responde `application/json` y sin autenticación.

## Rollback

```bash
ls -1 /srv/deskui/releases
ln -sfn /srv/deskui/releases/<anterior> /srv/deskui/current
```

Si el fallo está solo en el registry, también puedes redesplegar una release
anterior del sitio: el CLI acepta `--registry` con cualquier URL o ruta, así que
un consumidor puede fijar una instantánea concreta mientras se corrige.

## Operación

- **Monitorización**: comprobación HTTP de `/` y `/r/registry.json` cada minuto.
- **Logs**: access/error de nginx; vigila 404 en `/r/*` (síntoma de build
  incompleto).
- **Tamaño**: el registry son ~50 archivos pequeños; no requiere CDN, pero un
  CDN delante del sitio no rompe nada.
- **SEO**: el sitio es una SPA; los metadatos se actualizan en cliente. Para
  indexación completa por ruta haría falta prerender o SSR (fuera del alcance de
  esta fase).

## Checklist

- [ ] `pnpm release:verify` en verde.
- [ ] `apps/docs/dist/r/registry.json` presente y con 49 items.
- [ ] Imagen Docker construida y healthcheck `healthy` (Dokploy).
- [ ] Dominio con HTTPS en Dokploy, o release + symlink en servidor propio.
- [ ] Smoke tests de sitio, registry y CLI.
- [ ] Rollback comprobado (deployment anterior en Dokploy o release previa).
- [ ] `PROGRESS.md` refleja el despliegue.

## Enlaces

- [Publicación y versionado](releasing.md)
- [Migración](migration.md)
- [Arquitectura](architecture.md)
