# Despliegue del sitio y del registry

> Destino: **`https://deskui.codehive.com.co`** en el VPC, servido como sitio
> estático. El registry vive en el mismo dominio, bajo **`/r`**, que es la URL
> por defecto del CLI.

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

## Publicación atómica

Mantén releases versionadas y un symlink `current`:

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
- [ ] Release copiada y symlink actualizado.
- [ ] HTTPS válido y redirect 80 → 443.
- [ ] Smoke tests de sitio, registry y CLI.
- [ ] Release anterior conservada para rollback.
- [ ] `PROGRESS.md` refleja el despliegue.

## Enlaces

- [Publicación y versionado](releasing.md)
- [Migración](migration.md)
- [Arquitectura](architecture.md)
