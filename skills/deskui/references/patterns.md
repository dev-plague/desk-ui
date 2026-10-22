# Patrones de composición con DeskUI

Recetas listas para adaptar. En el monorepo importa desde `@deskui/ui`; en un
consumidor, desde `@/components/ui/<archivo>`.

## 1. Pantalla de ajustes

```tsx
import {
  Button,
  Checkbox,
  GroupBox,
  Input,
  Label,
  Select,
  Window,
} from "@deskui/ui";

export function SettingsScreen() {
  return (
    <Window aria-label="Ajustes">
      <Window.TitleBar title="Ajustes" />
      <Window.Body className="grid gap-3">
        <GroupBox legend="Sistema">
          <div className="grid gap-2">
            <div className="grid gap-1">
              <Label htmlFor="computer">Nombre del equipo</Label>
              <Input id="computer" defaultValue="PC-01" />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="theme">Tema</Label>
              <Select id="theme" defaultValue="classic">
                <option value="classic">Clásico</option>
                <option value="gradient">Gradiente</option>
              </Select>
            </div>
            <Checkbox defaultChecked>Mostrar iconos del escritorio</Checkbox>
          </div>
        </GroupBox>
        <div className="flex justify-end gap-2">
          <Button>Cancelar</Button>
          <Button variant="primary">Aplicar</Button>
        </div>
      </Window.Body>
      <Window.StatusBar>
        <Window.StatusField>Listo</Window.StatusField>
      </Window.StatusBar>
    </Window>
  );
}
```

## 2. Formulario con validación

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@deskui/ui";

const schema = z.object({
  user: z.string().min(3, "Mínimo 3 caracteres"),
});

export function SignInForm() {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { user: "" },
  });

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid max-w-sm gap-3"
        onSubmit={form.handleSubmit(console.log)}
      >
        <FormField
          control={form.control}
          name="user"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Usuario</FormLabel>
              <FormControl>
                <Input placeholder="usuario95" {...field} />
              </FormControl>
              <FormDescription>Mínimo 3 caracteres.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="primary">
          Entrar
        </Button>
      </form>
    </Form>
  );
}
```

## 3. Diálogo modal

```tsx
import { Button, Dialog } from "@deskui/ui";

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Confirmar"
  footer={
    <>
      <Button size="sm" onClick={() => setOpen(false)}>
        Cancelar
      </Button>
      <Button size="sm" variant="primary" onClick={confirm}>
        Aceptar
      </Button>
    </>
  }
>
  <p>¿Deseas continuar con la instalación?</p>
</Dialog>
```

`Dialog` usa `<dialog>` nativo: Escape, foco atrapado y retorno de foco.

## 4. Aplicación de escritorio

```tsx
import {
  Desktop,
  DesktopIcon,
  DesktopIcons,
  Icon,
  Notepad,
  Taskbar,
  TaskbarItem,
  TaskbarStart,
  TaskbarTray,
  WindowManager,
  type WindowManagerHandle,
} from "@deskui/ui";
import { useRef } from "react";

const windows = [
  {
    id: "notes",
    title: "Bloc de notas",
    icon: <Icon name="note" />,
    content: <Notepad />,
    defaultPosition: { x: 16, y: 16 },
    defaultSize: { width: 320, height: 220 },
  },
];

export function DesktopApp() {
  const manager = useRef<WindowManagerHandle>(null);

  return (
    <div className="grid min-h-dvh grid-rows-[1fr_auto]">
      <Desktop aria-label="Escritorio">
        <DesktopIcons>
          <DesktopIcon
            label="Mi PC"
            icon={<Icon name="window" size={32} />}
            onOpen={() => manager.current?.open("notes")}
          />
        </DesktopIcons>
        <WindowManager ref={manager} windows={windows} />
      </Desktop>
      <Taskbar aria-label="Barra de tareas">
        <TaskbarStart>Inicio</TaskbarStart>
        <TaskbarItem active>Bloc de notas</TaskbarItem>
        <TaskbarTray>12:00</TaskbarTray>
      </Taskbar>
    </div>
  );
}
```

## 5. Tabla con selección

```tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@deskui/ui";

<Table aria-label="Archivos">
  <TableHeader>
    <TableRow>
      <TableHead>Nombre</TableHead>
      <TableHead>Tamaño</TableHead>
      <TableHead>Tipo</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {files.map((file) => (
      <TableRow
        key={file.name}
        selected={selected === file.name}
        onClick={() => setSelected(file.name)}
      >
        <TableCell>{file.name}</TableCell>
        <TableCell>{file.size}</TableCell>
        <TableCell>{file.type}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## 6. Barra de herramientas + panel

```tsx
<Panel>
  <PanelHeader>
    <PanelTitle>Documento</PanelTitle>
  </PanelHeader>
  <Toolbar aria-label="Formato">
    <ToolbarButton pressed>N</ToolbarButton>
    <ToolbarButton>K</ToolbarButton>
    <ToolbarSeparator />
    <ToolbarButton>Abrir</ToolbarButton>
  </Toolbar>
  <PanelBody>
    <Textarea rows={8} aria-label="Contenido" />
  </PanelBody>
</Panel>
```

## 7. Feedback

```tsx
<Alert variant="warning" icon={<Icon name="warning" />}>
  <AlertTitle>Advertencia</AlertTitle>
  <AlertDescription>El archivo ya existe.</AlertDescription>
</Alert>

<ProgressBar aria-label="Instalación" value={70} />
```

Para notificaciones usa `ToastProvider` una vez en la raíz y `useToast()`.

## 8. i18n

```tsx
import { DeskUILocaleProvider } from "@deskui/ui";

<DeskUILocaleProvider locale="en">
  <App />
</DeskUILocaleProvider>
```

En un consumidor: `import { DeskUILocaleProvider } from "@/lib/i18n";`.

## 9. Errores de composición frecuentes

| Síntoma | Causa | Solución |
| --- | --- | --- |
| La pantalla parece moderna | `rounded`, `blur`, sombras difusas | Usa `bevel-*` y tokens |
| Demasiado aire | Padding extra | Respeta 21–23 px / 24 px |
| Dos acciones compiten | Dos botones primarios | Deja uno solo |
| No se puede usar con teclado | Falta foco o control no nativo | `focus-dotted`, controles nativos |
| El diálogo no cierra | No se usa `Dialog` o falta `onOpenChange` | Usa el componente nativo |
| Textos en otro idioma | Falta el proveedor o la traducción | `DeskUILocaleProvider` |
