# Migración entre versiones

> Guía técnica. La versión resumida y bilingüe está en el sitio:
> `https://deskui.codehive.com.co/#/migracion`.

DeskUI se distribuye *copy & own*: el CLI copia el código al proyecto y el
archivo pasa a ser del consumidor. Por eso no existe un `upgrade` de paquete:
migrar es comparar la versión nueva del registry con la copia local y decidir qué
cambios se aceptan.

## Política de versiones

- El proyecto usa [SemVer](https://semver.org/). Hasta 1.0, las versiones
  menores (`0.x`) pueden incluir cambios incompatibles; se documentan siempre en
  `CHANGELOG.md` y en esta guía.
- El CLI y el registry incluido comparten versión. Instalar componentes con el
  registry del paquete garantiza que todos usan la misma instantánea.
- Los cambios incompatibles se anuncian en el changelog con la sección
  **Cambiado** y una entrada de migración.
- El documento del Page Builder tiene su propio `version`. Un cambio de esquema
  debe subir esa versión y añadir una migración en `normalizeDocument`; hoy una
  versión distinta se rechaza con un error visible.

## 0.1.0 → 0.2.0

0.2.0 es la primera versión publicada. Incluye el rebranding a DeskUI, el
catálogo de Fase 1–3 completo, i18n y las skills para agentes.

| Área | 0.1.0 | 0.2.0 | Acción |
| --- | --- | --- | --- |
| Producto | Marca anterior | **DeskUI** | Revisar textos y metadatos propios |
| CLI | `deskui` | `deskui` | Sin cambio |
| Imports | `@deskui/*` | `@deskui/*` | Sin cambio |
| Tema base | Identificadores antiguos | `classic` | Volver a seleccionar el tema |
| Tema degradado | Identificadores antiguos | `gradient` | Volver a seleccionar el tema |
| Plantilla CSS | Nombre anterior | `deskui.css` | Reemplazar o renombrar |
| `localStorage` (sitio y builder) | Prefijo anterior | `deskui-*` | La preferencia antigua se ignora |
| MIME del builder | Prefijo anterior | `application/x-deskui-builder` | Sin acción en JSON |
| Registry | 33 items | 49 items | `deskui add` de lo nuevo |
| i18n | No existía | `DeskUILocaleProvider` + item `i18n` | Envolver la app si se usan textos internos |

Los identificadores antiguos **no** se mantienen como alias. No hay codemod
automático porque los archivos son del consumidor y pueden estar editados.

## Procedimiento

1. **Fijar la versión y el registry**

   ```bash
   npx deskui --version
   export DESKUI_REGISTRY="https://deskui.codehive.com.co/r"
   npx deskui list
   ```

   Para una migración reproducible, apunta a una copia concreta del registry o
   usa el registry incluido en el CLI de esa versión.

2. **Simular**

   ```bash
   npx deskui add button input label --dry-run
   ```

   El resultado muestra archivos destino y conflictos. No escribe nada.

3. **Comparar**

   Descarga el item y compara con el archivo local:

   ```bash
   npx deskui add button --dry-run
   diff -u src/components/ui/button.tsx /ruta/temporal/button.tsx
   ```

   Si el archivo no se ha editado, se puede sobrescribir. Si se ha editado, se
   integra a mano: el CLI no hace merge.

4. **Aplicar**

   ```bash
   npx deskui add button --overwrite
   ```

   Sin `--overwrite`, el CLI se detiene ante contenido distinto. `--force`
   reemplaza también `components.json` y solo debe usarse en instalaciones
   limpias.

5. **Añadir lo nuevo**

   ```bash
   npx deskui add panel card separator toolbar
   npx deskui add desktop start-menu window-manager
   npx deskui add file-explorer wizard properties-dialog notepad terminal
   npx deskui add blue-screen screensaver minesweeper
   ```

6. **CSS, fuentes y tema**

   - Reemplaza `styles/deskui.css` si no lo habías personalizado; si lo hiciste,
     integra los tokens y utilidades nuevos.
   - Mantén `fonts/W95FA-OFL.txt` junto a los `.woff`/`.woff2`.
   - Vuelve a aplicar `data-theme="classic"` o `data-theme="gradient"`.

7. **Page Builder**

   - Exporta el JSON antes de actualizar el sitio.
   - Reimporta el JSON después; los identificadores de tema desconocidos se
     resuelven a `classic`.
   - Un JSON con otra versión de esquema se rechaza con un error visible: el
     builder aún no migra documentos automáticamente.

8. **Verificar**

   ```bash
   pnpm typecheck
   pnpm test
   pnpm build
   pnpm test:e2e   # si el proyecto usa Playwright
   ```

   Comprueba teclado, foco, contraste y axe en las pantallas tocadas.

## Compatibilidad

- **Se considera incompatible**: renombrar props o exports, cambiar la estructura
  de un componente, cambiar tokens obligatorios, subir la versión del documento
  del builder sin migración o cambiar el formato del registry.
- **Se considera compatible**: añadir componentes, props opcionales, variantes,
  temas o items al registry; cambiar textos internos con el diccionario.
- Los componentes exportados desde `@deskui/ui` y los copiados con el CLI
  comparten API; una diferencia entre ambos es un bug.

## Rollback

El CLI no es transaccional. Ante un fallo:

1. Restaura los archivos desde la rama o copia de seguridad.
2. Ejecuta `deskui init` solo si el CSS o los helpers quedaron inconsistentes.
3. Reporta la versión del CLI, el componente y el mensaje de error.

## Checklist de migración

- [ ] Versión y registry fijados.
- [ ] `add --dry-run` revisado componente por componente.
- [ ] Archivos editados a mano fusionados, no sobrescritos.
- [ ] Dependencias npm instaladas.
- [ ] Tema, CSS y fuentes actualizados.
- [ ] JSON del builder reimportado y revisado.
- [ ] `typecheck`, tests y build en verde.
- [ ] axe sin violaciones nuevas.

## Enlaces

- [Changelog](../CHANGELOG.md)
- [Publicación](releasing.md)
- [Despliegue](deployment.md)
- [Guía de migración en el sitio](../apps/docs/src/content/guides/migracion.mdx)
