# Publicación y versionado

> Procedimiento para cortar una versión, empaquetar el CLI, publicarlo en npm y
> desplegar el sitio con su registry. Estado vivo en `PROGRESS.md`; el despliegue
> del sitio se detalla en `deployment.md`.

## Alcance

| Artefacto | Destino | Quién lo publica |
| --- | --- | --- |
| CLI `deskui` | npm (público) | persona con sesión de npm |
| Sitio de documentación | `https://deskui.codehive.com.co` | despliegue del VPC |
| Registry | `https://deskui.codehive.com.co/r` | el mismo despliegue del sitio |
| `@deskui/ui` | no se publica (privado) | — |

`@deskui/ui` sigue siendo privado: el producto copiable es el par CLI + registry.
Publicarlo obligaría a mantener dos fuentes de verdad y a empaquetar los `.tsx`.

## Política de versiones

- SemVer. Hasta 1.0, una versión menor puede incluir cambios incompatibles.
- El CLI, el registry incluido y el registry del sitio comparten versión.
- Una versión publicada no se reescribe: si hay un fallo, se publica un parche.
- Los cambios incompatibles requieren entrada en `CHANGELOG.md`,
  `docs/migration.md` y la guía `#/migracion`.

## Cómo cortar una versión

1. **Elegir la versión** según SemVer y anotarla.

2. **Actualizar versiones** (las cuatro deben coincidir):

   ```text
   package.json
   packages/ui/package.json
   packages/cli/package.json
   apps/docs/package.json
   ```

3. **Actualizar el changelog**:

   - `CHANGELOG.md` con la sección `## [x.y.z] — fecha`.
   - `apps/docs/src/content/guides/cambios.mdx` y `.en.mdx`.
   - Si hay cambios incompatibles, `docs/migration.md` y la guía de migración.

4. **Verificar**:

   ```bash
   pnpm release:verify
   ```

   Encadena `typecheck`, tests, build de release y `release:check`. El build
   genera, en este orden: registry de la UI, copia a `apps/docs/public/r`, CLI
   empaquetado, `llms.txt` y sitio.

5. **Empaquetar el CLI**:

   ```bash
   pnpm release:pack
   tar -tzf artifacts/deskui-x.y.z.tgz | head -40
   ```

   El tarball debe incluir `package/dist`, `package/registry`,
   `package/templates`, `package/README.md` y `package/LICENSE`.

   Para desplegar el sitio, `pnpm release:bundle` genera
   `artifacts/deskui-site-x.y.z.tar.gz` con `dist/` completo (incluido `r/`) y
   su archivo `.sha256`.

6. **Probar el tarball como consumidor**:

   ```bash
   mkdir /tmp/deskui-consumer && cd /tmp/deskui-consumer
   npm init -y
   npm install /ruta/al/artifacts/deskui-x.y.z.tgz
   npx deskui init --no-install
   npx deskui add button dialog --no-install
   ```

7. **Publicar en npm**:

   ```bash
   npm login
   npm publish artifacts/deskui-x.y.z.tgz
   ```

   `publishConfig.access = "public"` ya está en el paquete. Para una previa:

   ```bash
   npm publish artifacts/deskui-x.y.z-beta.0.tgz --tag next
   ```

8. **Verificar la publicación**:

   ```bash
   npm view deskui version dist-tags
   npx deskui@x.y.z --version
   npx deskui@x.y.z list
   ```

9. **Desplegar el sitio y el registry** antes o a la vez que npm, para que la
   URL por defecto del CLI (`https://deskui.codehive.com.co/r`) ya responda.
   Ver `deployment.md`.

10. **Cerrar el corte**: actualizar `PROGRESS.md`, `REQUIREMENTS.md`,
    `DECISIONS.md` y el changelog del sitio si quedó algo pendiente.

## Orden recomendado

1. Sitio + registry en el VPC.
2. Comprobación del registry remoto:

   ```bash
   curl -fsS https://deskui.codehive.com.co/r/registry.json | head
   node packages/cli/dist/index.js list --registry https://deskui.codehive.com.co/r
   ```

3. `npm publish`.
4. Anuncio y enlaces.

Publicar primero el sitio evita que un `npx deskui` recién instalado caiga en un
registry que aún no existe.

## Qué comprueba `release:check`

- Versiones alineadas en raíz, UI, CLI y docs.
- Sección `CHANGELOG.md` para la versión actual.
- Metadatos npm del CLI (`name`, `bin`, `files`, `license`, `publishConfig`).
- Registry compilado, número de items y archivos por item.
- Copia del registry en el sitio y en el paquete del CLI.
- `dist/index.js` presente.

`licenses:check` es independiente y revisa las licencias de las dependencias.

## Rollback

| Situación | Acción |
| --- | --- |
| Tarball defectuoso antes de publicar | Borrar `artifacts/` y repetir el corte |
| Versión publicada con un fallo | Publicar un parche; no reutilizar la versión |
| Versión publicada insegura | `npm deprecate deskui@x.y.z "motivo"` y publicar el parche |
| Sitio roto | Redesplegar el artefacto anterior (ver `deployment.md`) |
| Registry roto | Redesplegar `apps/docs/public/r` de la versión anterior |

`npm unpublish` solo se contempla en las primeras 72 horas y con una versión sin
consumidores; por defecto se prefiere `deprecate` + parche.

## Checklist

- [ ] Versión decidida y aplicada en los cuatro `package.json`.
- [ ] `CHANGELOG.md`, changelog del sitio y guía de migración actualizados.
- [ ] `pnpm release:verify` en verde.
- [ ] `pnpm licenses:check` en verde.
- [ ] Tarball revisado e instalado en un proyecto limpio.
- [ ] Bundle del sitio generado y SHA-256 verificado.
- [ ] Registry desplegado y accesible por HTTPS.
- [ ] `npm publish` con la etiqueta correcta.
- [ ] `npx deskui@x.y.z --version` responde.
- [ ] `PROGRESS.md` y `roadmap.md` reflejan el corte.

## Enlaces

- [Despliegue](deployment.md)
- [Migración](migration.md)
- [Licencias](licenses.md)
- [Changelog](../CHANGELOG.md)
