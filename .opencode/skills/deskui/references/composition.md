# Guía de composición de DeskUI

Reglas prácticas para combinar ventanas, paneles, formularios y barras de
herramientas sin romper la densidad ni la accesibilidad.

## Jerarquía antes que decoración

Una pantalla clásica se lee de arriba abajo: barra de título, menú, contenido y
barra de estado. El bisel no sustituye a la jerarquía.

- Usa **una sola ventana principal** por pantalla.
- Reserva los diálogos para decisiones que bloquean el flujo.
- Si necesitas tres niveles de marcos para explicar una sección, el problema es
  la estructura, no el CSS.

## Ventanas y paneles

| Pieza | Uso |
| --- | --- |
| `Window` | Ventana de la aplicación, con `TitleBar` y `StatusBar` |
| `Panel` | Región interna con bisel propio |
| `GroupBox` | Agrupar controles de formulario con una leyenda |
| `Card` | Repetir elementos de un catálogo; no es un layout principal |
| `Tabs` | Alternar vistas de propiedades sin apilar ventanas |
| `ScrollArea` | Contenido largo con barra clásica de 16 px |

```tsx
<Window aria-label="Preferencias de red">
  <Window.TitleBar title="Preferencias de red" />
  <Window.Body className="grid gap-2">
    <GroupBox legend="Equipo">
      <Label htmlFor="host">Nombre del equipo</Label>
      <Input id="host" defaultValue="PC-01" />
    </GroupBox>
  </Window.Body>
</Window>
```

## Formularios

1. Etiqueta cada control con `Label` y `htmlFor`/`id`.
2. Agrupa con `GroupBox` cuando haya más de cuatro controles relacionados.
3. Usa `Button variant="primary"` una sola vez por formulario.
4. Deja el botón Cancelar a la izquierda del botón principal.
5. El texto de ayuda va en `FormDescription`; los errores en `FormMessage`.
6. Mantén el orden de tabulación natural; no uses `tabIndex` positivos.

```tsx
<div className="flex justify-end gap-2">
  <Button>Cancelar</Button>
  <Button variant="primary">Aceptar</Button>
</div>
```

## Barras de herramientas

`Toolbar` mantiene los botones agrupados y accesibles por teclado. Usa
`ToolbarSeparator` para separar grupos y `pressed` para alternancias como
negrita o cursiva. Un botón que solo muestra un icono necesita `aria-label`.

```tsx
<Toolbar aria-label="Formato de texto">
  <ToolbarGroup aria-label="Estilo">
    <ToolbarButton pressed>N</ToolbarButton>
    <ToolbarButton>K</ToolbarButton>
  </ToolbarGroup>
  <ToolbarSeparator />
  <ToolbarGroup aria-label="Archivo">
    <ToolbarButton>Abrir</ToolbarButton>
    <ToolbarButton>Guardar</ToolbarButton>
  </ToolbarGroup>
</Toolbar>
```

## Densidad y espacio

| Contexto | Altura cómoda | Notas |
| --- | --- | --- |
| Escritorio | 21–23 px | Densidad clásica; no añadas padding extra |
| Móvil | 24 px mínimo | Mantén el área táctil aunque el texto siga a 11 px |
| Separación | 4–8 px | Usa las escalas de Tailwind, no valores sueltos |
| Ventana | 3 px de marco | El bisel ya aporta profundidad |

## Color y biseles

- Usa tokens semánticos: `bg-surface`, `bg-surface-sunken`, `text-ink`,
  `text-ink-muted`, `bg-accent`, `text-ink-inverse`.
- `bevel-raised` para elementos elevados; `bevel-sunken` para campos y estados
  pulsados.
- `focus-dotted` para el foco de teclado. Nunca elimines el foco sin sustituto.
- El azul de selección solo para foco o selección real.
- Sin `border-radius`, `blur` ni sombras difusas.

## Accesibilidad

- Usa roles nativos antes que ARIA manual.
- Nombra regiones, ventanas y diálogos con `aria-label`/`aria-labelledby`.
- Los diálogos usan `<dialog>` nativo: Escape, foco atrapado y retorno de foco.
- Prueba la pantalla solo con teclado antes de darla por terminada.
- Respeta `prefers-reduced-motion` en animaciones decorativas.
- Comprueba contraste en `classic`, `gradient` y `high-contrast`.

## Do & Don't

**Do**

- Usa `Window` para agrupar contenido y un solo botón primario.
- Etiqueta cada control con `Label` y `htmlFor/id`.
- Mantén el foco punteado visible en todos los temas.
- Prefiere controles nativos cuando el patrón ya existe.
- Reutiliza `Icon` para el set pixel-art original.

**Don't**

- No mezcles radios modernos, blur o sombras difusas.
- No uses más de un botón primario por formulario.
- No anides ventanas dentro de ventanas sin necesidad.
- No sustituyas texto por iconos sin nombre accesible.
- No uses el azul de selección como color decorativo.

## Checklist rápido

Antes de cerrar una pantalla:

- [ ] ¿Hay una jerarquía clara y una sola ventana principal?
- [ ] ¿Todos los controles tienen etiqueta y nombre accesible?
- [ ] ¿El foco es visible y el recorrido con Tab tiene sentido?
- [ ] ¿Se puede cerrar un diálogo con Escape y el foco vuelve?
- [ ] ¿La densidad es 21–23 px en escritorio y 24 px en móvil?
- [ ] ¿Solo hay un botón primario por formulario?
- [ ] ¿Funciona en `classic`, `gradient` y `high-contrast`?
- [ ] ¿No hay colores, radios ni sombras fuera de tokens?
