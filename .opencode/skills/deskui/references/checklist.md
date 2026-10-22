# Checklist de revisión DeskUI

## API y estructura

- [ ] Se usa el componente correcto, no un `div` con clases que lo imitan.
- [ ] Los imports apuntan a `@/components/ui/<archivo>` en un consumidor o a
  `@deskui/ui` en el monorepo.
- [ ] Se pasan `aria-label`/`aria-labelledby` a regiones, ventanas y diálogos.
- [ ] Las props explícitas de texto tienen prioridad sobre i18n.
- [ ] No se añaden dependencias nuevas sin justificar peso y licencia.

## Visual

- [ ] Solo tokens semánticos; sin colores hex sueltos.
- [ ] `bevel-raised` / `bevel-sunken` en lugar de sombras modernas.
- [ ] Sin `border-radius`, `blur` ni animaciones largas.
- [ ] Densidad 21–23 px en escritorio; 24 px de área táctil en móvil.
- [ ] Un solo botón primario por formulario.
- [ ] Jerarquía: una ventana principal, paneles internos y diálogos solo cuando
  bloquean el flujo.

## Accesibilidad

- [ ] Todo control tiene etiqueta visible o nombre accesible.
- [ ] El foco es visible con `focus-dotted` y no se elimina.
- [ ] El recorrido con Tab sigue el orden visual.
- [ ] Enter/Espacio activan botones, checkboxes, switches y radios.
- [ ] Escape cierra diálogos, menús y el buscador.
- [ ] Las flechas funcionan en `Tabs`, `MenuBar`, `Toolbar`, `TreeView` y
  `Pagination` cuando aplica.
- [ ] El diálogo atrapa el foco y lo devuelve al cerrar.
- [ ] Contraste correcto en `classic`, `gradient` y `high-contrast`.
- [ ] `prefers-reduced-motion` respetado en `Screensaver` y animaciones.

## Formularios

- [ ] `Label` + `htmlFor`/`id` en cada campo.
- [ ] `FormDescription` para ayuda y `FormMessage` para errores.
- [ ] Los campos obligatorios se validan en el navegador.
- [ ] El botón Cancelar está a la izquierda del primario.
- [ ] El formulario se puede enviar con Enter cuando corresponde.

## Datos

- [ ] `Table` tiene cabecera y nombres accesibles.
- [ ] La selección usa `selected` y no solo color.
- [ ] `Pagination` tiene `aria-current="page"` en la página actual.
- [ ] `ListBox` conserva el tamaño y la selección nativa.
- [ ] `StatusBar` no es el único lugar donde se comunica un error.

## i18n

- [ ] La app está envuelta con `DeskUILocaleProvider` si necesita inglés.
- [ ] Los textos propios de la app también se traducen.
- [ ] `<html lang>` coincide con el idioma activo.
- [ ] Los `aria-label` y placeholders están traducidos.
- [ ] El cambio de idioma no requiere recargar.

## Pruebas

- [ ] `pnpm typecheck` pasa.
- [ ] `pnpm test` pasa.
- [ ] `pnpm test:e2e` pasa si se tocó el sitio o un flujo crítico.
- [ ] `pnpm build` pasa si se tocó el registry o el CLI.
- [ ] La pantalla se probó con teclado y con axe.
