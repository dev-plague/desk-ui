import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  BlueScreen,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Checkbox,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Dialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Desktop,
  DesktopIcon,
  DesktopIcons,
  FileExplorer,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  GroupBox,
  Icon,
  Input,
  Label,
  ListBox,
  MenuBar,
  MenuBarItem,
  MenuBarMenu,
  MenuBarSeparator,
  MenuBarShortcut,
  Minesweeper,
  Notepad,
  Pagination,
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
  PanelTitle,
  ProgressBar,
  PropertiesDialog,
  RadioGroup,
  RadioGroupItem,
  ScrollArea,
  Screensaver,
  Select,
  Separator,
  Slider,
  StartMenu,
  StartMenuContent,
  StartMenuItem,
  StartMenuSeparator,
  StartMenuShortcut,
  StartMenuSidebar,
  StartMenuSub,
  StartMenuSubContent,
  StartMenuSubTrigger,
  StartMenuTrigger,
  StatusBar,
  StatusBarField,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Taskbar,
  TaskbarDivider,
  TaskbarItem,
  TaskbarStart,
  TaskbarTray,
  Terminal,
  Textarea,
  TitleBar,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TreeItem,
  TreeView,
  useToast,
  Window,
  WindowManager,
  Wizard,
  type WindowManagerHandle,
  type WindowManagerSnapshot,
} from "@deskui/ui";

import type { PropRow } from "../components/docs/doc-ui";
import {
  formatCopy,
  useComponentCopy,
} from "../i18n/component-copy";
import { COMPONENT_DOCS_EN } from "../i18n/component-docs.en";
import type { Locale } from "../i18n/provider";
import { BrandMark, FolderIcon, InfoIcon, NoteIcon, WarningIcon } from "../components/icons";

export interface ComponentDoc {
  slug: string;
  title: string;
  description: string;
  install: string;
  preview: ReactNode;
  code: string;
  props: PropRow[];
  notes: string[];
}

function ButtonPreview() {
  const copy = useComponentCopy("button");
  const [bold, setBold] = useState(true);

  return (
    <>
      <Button>{copy.cancel}</Button>
      <Button variant="primary">{copy.accept}</Button>
      <Button disabled>{copy.disabled}</Button>
      <Button variant="icon" size="icon" aria-label={copy.openFolder}>
        <FolderIcon />
      </Button>
      <Button
        size="sm"
        aria-pressed={bold}
        onClick={() => setBold((value) => !value)}
        className="min-w-0 px-2 font-bold"
      >
        N
      </Button>
    </>
  );
}

function InputPreview() {
  const copy = useComponentCopy("input");
  return (
    <div className="grid w-full max-w-md gap-3">
      <div className="grid gap-1">
        <Label htmlFor="doc-usuario">{copy.username}</Label>
        <Input id="doc-usuario" defaultValue="usuario95" />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="doc-dominio">{copy.domain}</Label>
        <Input id="doc-dominio" value="TRABAJO" readOnly />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="doc-deshabilitado">{copy.comment}</Label>
        <Input id="doc-deshabilitado" placeholder={copy.disabled} disabled />
      </div>
    </div>
  );
}

function LabelPreview() {
  const copy = useComponentCopy("label");
  return (
    <div className="grid w-full max-w-sm gap-1">
      <Label htmlFor="doc-label-input">{copy.group}</Label>
      <Input id="doc-label-input" placeholder={copy.placeholder} />
      <span className="text-[11px] leading-[13px] text-ink-muted">
        {copy.hint}
      </span>
    </div>
  );
}

function GroupBoxPreview() {
  const copy = useComponentCopy("groupBox");
  return (
    <GroupBox legend={copy.legend} className="w-full max-w-md">
      <div className="grid gap-2">
        <Checkbox defaultChecked>{copy.shortcut}</Checkbox>
        <Checkbox>{copy.signIn}</Checkbox>
        <p className="text-[11px] leading-[15px] text-ink-muted">
          {copy.hint}
        </p>
      </div>
    </GroupBox>
  );
}

function CheckboxPreview() {
  const copy = useComponentCopy("checkbox");
  const [remember, setRemember] = useState(true);

  return (
    <div className="grid gap-3">
      <Checkbox
        checked={remember}
        onChange={(event) => setRemember(event.target.checked)}
      >
        {copy.remember}
      </Checkbox>
      <Checkbox defaultChecked>{copy.hidden}</Checkbox>
      <Checkbox disabled>{copy.notAvailable}</Checkbox>
    </div>
  );
}

function TextareaPreview() {
  const copy = useComponentCopy("textarea");
  return (
    <div className="grid w-full max-w-md gap-1">
      <Label htmlFor="doc-notas">{copy.notes}</Label>
      <Textarea
        id="doc-notas"
        rows={4}
        placeholder={copy.placeholder}
      />
    </div>
  );
}

function WindowPreview() {
  const copy = useComponentCopy("window");
  return (
    <Window active={false} className="w-full max-w-sm">
      <Window.TitleBar title={copy.untitled} icon={<NoteIcon />} />
      <Window.Body className="bevel-field m-2 bg-surface-sunken p-2 font-mono text-[11px] leading-[15px]">
        <p>{copy.hello}</p>
        <p className="mt-2 text-ink-muted">
          {copy.inactive}
        </p>
      </Window.Body>
    </Window>
  );
}

function DialogPreview() {
  const copy = useComponentCopy("dialog");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>{copy.open}</Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={copy.title}
        icon={<WarningIcon />}
        footer={
          <>
            <Button size="sm" onClick={() => setOpen(false)}>
              {copy.cancel}
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => setOpen(false)}
            >
              {copy.accept}
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-3">
          <WarningIcon className="h-8 w-8" />
          <p className="text-[12px] leading-[16px]">
            {copy.question}
          </p>
        </div>
      </Dialog>
    </>
  );
}

function RadioGroupPreview() {
  const copy = useComponentCopy("radioGroup");
  const [plan, setPlan] = useState("basico");

  return (
    <RadioGroup aria-label={copy.plan} value={plan} onValueChange={setPlan}>
      <RadioGroupItem value="basico">{copy.basic}</RadioGroupItem>
      <RadioGroupItem value="pro">{copy.pro}</RadioGroupItem>
      <RadioGroupItem value="servidor" disabled>
        {copy.server}
      </RadioGroupItem>
    </RadioGroup>
  );
}

function SelectPreview() {
  const copy = useComponentCopy("select");
  return (
    <div className="grid w-full max-w-xs gap-1">
      <Label htmlFor="doc-select">{copy.domain}</Label>
      <Select id="doc-select" defaultValue="trabajo">
        <option value="trabajo">{copy.work}</option>
        <option value="casa">{copy.home}</option>
        <option value="invitado">{copy.guest}</option>
      </Select>
    </div>
  );
}

function SwitchPreview() {
  const copy = useComponentCopy("switch");
  const [safe, setSafe] = useState(true);

  return (
    <div className="grid gap-3">
      <Switch checked={safe} onCheckedChange={setSafe}>
        {copy.safe}
      </Switch>
      <Switch>{copy.updates}</Switch>
      <Switch disabled>{copy.notAvailable}</Switch>
    </div>
  );
}

function SliderPreview() {
  const copy = useComponentCopy("slider");
  const [volume, setVolume] = useState(60);

  return (
    <div className="grid w-full max-w-sm gap-1">
      <Label htmlFor="doc-volume">{copy.volume}</Label>
      <Slider
        id="doc-volume"
        min={0}
        max={100}
        value={volume}
        onChange={(event) => setVolume(Number(event.target.value))}
      />
      <span className="text-[11px] leading-[13px] text-ink-muted">
        {volume} %
      </span>
    </div>
  );
}

function FormPreview() {
  const copy = useComponentCopy("form");
  const [submitted, setSubmitted] = useState(false);
  const schema = z.object({
    usuario: z.string().min(3, copy.minChars),
    recordar: z.boolean(),
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { usuario: "", recordar: true },
  });

  return (
    <Form {...form}>
      <form
        noValidate
        className="grid w-full max-w-md gap-3"
        onSubmit={form.handleSubmit(() => setSubmitted(true))}
      >
        <FormField
          control={form.control}
          name="usuario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{copy.user}</FormLabel>
              <FormControl>
                <Input placeholder={copy.placeholder} {...field} />
              </FormControl>
              <FormDescription>{copy.minCharsHelp}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recordar"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Checkbox checked={field.value} onChange={field.onChange}>
                  {copy.remember}
                </Checkbox>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button type="submit" variant="primary">
            {copy.submit}
          </Button>
          {submitted ? (
            <span
              role="status"
              className="flex items-center gap-1 text-[11px] leading-[13px] text-ink"
            >
              <span aria-hidden="true" className="h-2 w-2 bg-success" />
              {copy.valid}
            </span>
          ) : null}
        </div>
      </form>
    </Form>
  );
}

function TabsPreview() {
  const copy = useComponentCopy("tabs");
  return (
    <Tabs defaultValue="general" className="w-full max-w-md">
      <TabsList aria-label={copy.props}>
        <TabsTrigger value="general">{copy.general}</TabsTrigger>
        <TabsTrigger value="apariencia">{copy.appearance}</TabsTrigger>
        <TabsTrigger value="avanzado">{copy.advanced}</TabsTrigger>
      </TabsList>
      <TabsContent value="general" className="grid gap-2">
        <Label htmlFor="tab-nombre">{copy.name}</Label>
        <Input id="tab-nombre" defaultValue="PC-01" />
      </TabsContent>
      <TabsContent value="apariencia">
        <Checkbox defaultChecked>{copy.showIcons}</Checkbox>
      </TabsContent>
      <TabsContent value="avanzado">
        <p className="text-[11px] leading-[15px]">
          {copy.adminOnly}
        </p>
      </TabsContent>
    </Tabs>
  );
}

function ScrollAreaPreview() {
  const copy = useComponentCopy("scrollArea");
  return (
    <ScrollArea
      className="bevel-field h-32 w-full max-w-sm bg-surface-sunken"
      aria-label={copy.files}
    >
      <ul className="grid p-2 text-[11px] leading-[15px]">
        {Array.from({ length: 14 }, (_, index) => (
          <li key={index} className="flex justify-between gap-3 px-1 py-[1px]">
            <span>
              {formatCopy(copy.document, {
                n: String(index + 1).padStart(2, "0"),
              })}
            </span>
            <span className="text-ink-muted">{index + 1} KB</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}

function BadgePreview() {
  const copy = useComponentCopy("badge");
  return (
    <div className="flex flex-wrap gap-2">
      <Badge>{copy.new}</Badge>
      <Badge variant="info">{copy.info}</Badge>
      <Badge variant="success">{copy.active}</Badge>
      <Badge variant="warning">{copy.pending}</Badge>
      <Badge variant="danger">{copy.error}</Badge>
    </div>
  );
}

function AlertPreview() {
  const copy = useComponentCopy("alert");
  return (
    <div className="grid w-full gap-2">
      <Alert variant="info" icon={<InfoIcon />}>
        <AlertTitle>{copy.info}</AlertTitle>
        <AlertDescription>
          {copy.infoBody}
        </AlertDescription>
      </Alert>
      <Alert variant="warning" icon={<WarningIcon />}>
        <AlertTitle>{copy.warning}</AlertTitle>
        <AlertDescription>
          {copy.warningBody}
        </AlertDescription>
      </Alert>
    </div>
  );
}

function ToastPreview() {
  const copy = useComponentCopy("toast");
  const { toast } = useToast();

  return (
    <Button
      onClick={() =>
        toast({
          title: copy.title,
          description: copy.body,
          duration: 0,
        })
      }
    >
      {copy.show}
    </Button>
  );
}

function ProgressBarPreview() {
  const copy = useComponentCopy("progressBar");
  return (
    <div className="grid w-full gap-3">
      <div className="grid gap-1">
        <span className="text-[11px] leading-[13px]">{copy.copying}</span>
        <ProgressBar aria-label={copy.files} value={35} />
      </div>
      <div className="grid gap-1">
        <span className="text-[11px] leading-[13px]">{copy.install}</span>
        <ProgressBar aria-label={copy.install} value={70} />
      </div>
    </div>
  );
}

function TooltipPreview() {
  const copy = useComponentCopy("tooltip");
  return (
    <Tooltip delayDuration={100}>
      <TooltipTrigger asChild>
        <Button>{copy.save}</Button>
      </TooltipTrigger>
      <TooltipContent>{copy.hint}</TooltipContent>
    </Tooltip>
  );
}

function MenuBarPreview() {
  const copy = useComponentCopy("menuBar");
  const [lastAction, setLastAction] = useState(copy.none);

  return (
    <div className="grid w-full gap-2">
      <MenuBar aria-label={copy.app}>
        <MenuBarMenu label={copy.file}>
          <MenuBarItem onSelect={() => setLastAction(copy.new)}>
            {copy.new}
            <MenuBarShortcut>Ctrl+N</MenuBarShortcut>
          </MenuBarItem>
          <MenuBarItem onSelect={() => setLastAction(copy.open)}>
            {copy.open}
          </MenuBarItem>
          <MenuBarSeparator />
          <MenuBarItem onSelect={() => setLastAction(copy.exit)}>
            {copy.exit}
          </MenuBarItem>
        </MenuBarMenu>
        <MenuBarMenu label={copy.view}>
          <MenuBarItem onSelect={() => setLastAction(copy.refresh)}>
            {copy.refresh}
          </MenuBarItem>
        </MenuBarMenu>
      </MenuBar>
      <span className="text-[11px] leading-[13px] text-ink-muted">
        {formatCopy(copy.lastAction, { action: lastAction })}
      </span>
    </div>
  );
}

function DropdownMenuPreview() {
  const copy = useComponentCopy("dropdownMenu");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>{copy.options}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>{copy.file}</DropdownMenuLabel>
        <DropdownMenuItem>{copy.rename}</DropdownMenuItem>
        <DropdownMenuItem>{copy.moveTo}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>{copy.delete}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ContextMenuPreview() {
  const copy = useComponentCopy("contextMenu");
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div className="bevel-field flex h-24 w-full max-w-sm items-center justify-center bg-surface-sunken text-[11px] text-ink-muted">
          {copy.rightClick}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>{copy.copy}</ContextMenuItem>
        <ContextMenuItem>{copy.paste}</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>{copy.properties}</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

function BreadcrumbPreview() {
  const copy = useComponentCopy("breadcrumb");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#/">{copy.home}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#/componentes">{copy.components}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Button</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function TreeViewPreview() {
  const copy = useComponentCopy("treeView");
  return (
    <TreeView
      aria-label={copy.explorer}
      defaultExpanded={["c", "docs"]}
      defaultValue="docs"
      className="w-full max-w-sm"
    >
      <TreeItem value="c" label="C:" icon={<FolderIcon />}>
        <TreeItem value="docs" label={copy.documents} icon={<FolderIcon />}>
          <TreeItem value="carta" label={copy.letter} icon={<NoteIcon />} />
          <TreeItem value="notas" label={copy.notes} icon={<NoteIcon />} />
        </TreeItem>
        <TreeItem value="win" label="DESKUI" icon={<FolderIcon />} />
      </TreeItem>
    </TreeView>
  );
}

function PaginationPreview() {
  const [page, setPage] = useState(4);

  return (
    <Pagination page={page} pageCount={12} onPageChange={setPage} />
  );
}

function TablePreview() {
  const copy = useComponentCopy("table");
  const files = [
    { name: "carta.txt", size: "2 KB", type: copy.text },
    { name: "informe.doc", size: "24 KB", type: copy.document },
    { name: "presupuesto.xls", size: "18 KB", type: copy.spreadsheet },
  ];
  const [selected, setSelected] = useState("carta.txt");

  return (
    <Table aria-label={copy.files} className="min-w-[420px]">
      <TableHeader>
        <TableRow>
          <TableHead>{copy.name}</TableHead>
          <TableHead>{copy.size}</TableHead>
          <TableHead>{copy.type}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow
            key={file.name}
            selected={selected === file.name}
            onClick={() => setSelected(file.name)}
            className="cursor-default"
          >
            <TableCell>
              <span className="flex items-center gap-2">
                <NoteIcon />
                {file.name}
              </span>
            </TableCell>
            <TableCell>{file.size}</TableCell>
            <TableCell>{file.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ListBoxPreview() {
  const copy = useComponentCopy("listBox");
  return (
    <div className="grid w-full max-w-sm gap-1">
      <Label htmlFor="doc-listbox">{copy.files}</Label>
      <ListBox id="doc-listbox" size={5} defaultValue="carta">
        <option value="carta">carta.txt</option>
        <option value="informe">informe.doc</option>
        <option value="presupuesto">presupuesto.xls</option>
        <option value="notas">notas.txt</option>
        <option value="logo">logo.bmp</option>
        <option value="readme">{copy.readme}</option>
      </ListBox>
    </div>
  );
}

function StatusBarPreview() {
  const copy = useComponentCopy("statusBar");
  return (
    <StatusBar aria-label={copy.ready} className="w-full">
      <StatusBarField>{copy.ready}</StatusBarField>
      <StatusBarField className="max-w-[38%] flex-none">
        {copy.selected}
      </StatusBarField>
      <StatusBarField className="w-24 flex-none">1,44 MB</StatusBarField>
    </StatusBar>
  );
}

function IconPreview() {
  const names = [
    "window",
    "folder",
    "palette",
    "info",
    "warning",
    "note",
    "speaker",
  ] as const;

  return (
    <div className="flex flex-wrap items-end gap-4">
      {names.map((name) => (
        <div key={name} className="flex flex-col items-center gap-1">
          <Icon name={name} size={32} label={name} />
          <code className="font-mono text-[10px] text-ink-muted">{name}</code>
        </div>
      ))}
    </div>
  );
}

function TitleBarPreview() {
  const copy = useComponentCopy("titleBar");
  const [lastAction, setLastAction] = useState(copy.none);

  return (
    <div className="grid w-full max-w-md gap-3">
      <div className="bevel-window bg-surface p-[3px]">
        <TitleBar
          title={copy.untitled}
          icon={<NoteIcon />}
          onMinimize={() => setLastAction(copy.minimize)}
          onMaximize={() => setLastAction(copy.maximize)}
          onClose={() => setLastAction(copy.close)}
        />
        <div className="bevel-field m-2 bg-surface-sunken p-2 font-mono text-[11px]">
          {copy.hello}
        </div>
      </div>
      <TitleBar
        active={false}
        title={copy.inactive}
        icon={<NoteIcon />}
        showControls
      />
      <span className="text-[11px] leading-[13px] text-ink-muted">
        {formatCopy(copy.lastAction, { action: lastAction })}
      </span>
    </div>
  );
}

function TaskbarPreview() {
  const copy = useComponentCopy("taskbar");
  return (
    <Taskbar aria-label={copy.aria} className="w-full">
      <TaskbarStart icon={<BrandMark />}>{copy.start}</TaskbarStart>
      <TaskbarDivider />
      <TaskbarItem active icon={<NoteIcon />}>
        {copy.document}
      </TaskbarItem>
      <TaskbarTray>12:00</TaskbarTray>
    </Taskbar>
  );
}

function PanelPreview() {
  const copy = useComponentCopy("panel");
  return (
    <div className="grid w-full max-w-md gap-3">
      <Panel aria-label={copy.panelAria}>
        <PanelHeader>
          <PanelTitle>{copy.systemStatus}</PanelTitle>
        </PanelHeader>
        <PanelBody>
          <p className="text-[11px] leading-[15px]">
            {copy.drivers}
          </p>
        </PanelBody>
        <PanelFooter>
          <Button size="sm">{copy.details}</Button>
        </PanelFooter>
      </Panel>
      <Panel variant="sunken" padding="sm" aria-label={copy.sunkenAria}>
        <span className="text-[11px] leading-[15px]">
          {copy.objects}
        </span>
      </Panel>
    </div>
  );
}

function CardPreview() {
  const copy = useComponentCopy("card");
  return (
    <div className="grid w-full max-w-2xl gap-3 sm:grid-cols-2">
      <Card aria-label={copy.floppy}>
        <CardHeader>
          <CardTitle>{copy.floppyTitle}</CardTitle>
          <CardDescription>{copy.removable}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[11px] leading-[15px]">{copy.density}</p>
        </CardContent>
        <CardFooter>
          <Badge variant="success">{copy.inStock}</Badge>
          <Button size="sm" variant="primary">
            {copy.add}
          </Button>
        </CardFooter>
      </Card>
      <Card aria-label={copy.cd}>
        <CardHeader>
          <CardTitle>{copy.cdTitle}</CardTitle>
          <CardDescription>{copy.readOnly}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-[11px] leading-[15px]">{copy.multimedia}</p>
        </CardContent>
        <CardFooter>
          <Badge variant="warning">{copy.lastUnits}</Badge>
          <Button size="sm" variant="primary">
            {copy.add}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function SeparatorPreview() {
  const copy = useComponentCopy("separator");
  return (
    <div className="grid w-full max-w-md gap-2">
      <div className="flex gap-3">
        <div className="flex-1">
          <p className="text-[11px] leading-[15px]">{copy.origin}</p>
          <p className="text-[11px] leading-[15px] text-ink-muted">C:\DATOS</p>
        </div>
        <Separator orientation="vertical" />
        <div className="flex-1">
          <p className="text-[11px] leading-[15px]">{copy.destination}</p>
          <p className="text-[11px] leading-[15px] text-ink-muted">A:\</p>
        </div>
      </div>
      <Separator />
      <p className="text-[11px] leading-[15px] text-ink-muted">
        {copy.hint}
      </p>
    </div>
  );
}

function ToolbarPreview() {
  const copy = useComponentCopy("toolbar");
  const [bold, setBold] = useState(true);
  const [italic, setItalic] = useState(false);

  return (
    <Toolbar aria-label={copy.format} className="w-full">
      <ToolbarGroup aria-label={copy.style}>
        <ToolbarButton
          pressed={bold}
          onClick={() => setBold((value) => !value)}
          aria-label={copy.bold}
        >
          N
        </ToolbarButton>
        <ToolbarButton
          pressed={italic}
          onClick={() => setItalic((value) => !value)}
          aria-label={copy.italic}
        >
          K
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup aria-label={copy.file}>
        <ToolbarButton variant="icon" size="icon" aria-label={copy.openFolder}>
          <FolderIcon />
        </ToolbarButton>
        <ToolbarButton variant="icon" size="icon" aria-label={copy.save}>
          <NoteIcon />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <span className="px-1 text-[11px] leading-[13px] text-ink-muted">
        {bold ? copy.bold : copy.normal}
        {italic ? ` · ${copy.italic}` : ""}
      </span>
    </Toolbar>
  );
}

function DesktopPreview() {
  const copy = useComponentCopy("desktop");
  const [selected, setSelected] = useState("mi-pc");
  const [lastOpened, setLastOpened] = useState(copy.none);

  const icons = [
    { id: "mi-pc", label: copy.myComputer, name: "window" as const },
    { id: "documentos", label: copy.documents, name: "folder" as const },
    { id: "papelera", label: copy.trash, name: "warning" as const },
  ];

  return (
    <div className="grid w-full gap-2">
      <Desktop
        aria-label={copy.aria}
        className="bevel-field h-64 w-full"
      >
        <DesktopIcons>
          {icons.map((item) => (
            <DesktopIcon
              key={item.id}
              label={item.label}
              icon={<Icon name={item.name} size={32} />}
              selected={selected === item.id}
              onSelect={() => setSelected(item.id)}
              onOpen={() => setLastOpened(item.label)}
            />
          ))}
          <DesktopIcon
            label={copy.notes}
            icon={<Icon name="note" size={32} />}
            selected={selected === "notas"}
            onSelect={() => setSelected("notas")}
            onOpen={() => setLastOpened(copy.notes)}
            draggable
            defaultPosition={{ x: 180, y: 16 }}
          />
        </DesktopIcons>
        <p
          aria-live="polite"
          className="pointer-events-none absolute inset-x-2 bottom-1 text-[10px] leading-[13px] text-ink-inverse [text-shadow:1px_1px_0_#000]"
        >
          {formatCopy(copy.open, { name: lastOpened })}
        </p>
      </Desktop>
      <p className="text-[11px] leading-[15px] text-ink-muted">
        {copy.hint}
      </p>
    </div>
  );
}

function createWindowManagerDemoWindows(
  copy: ReturnType<typeof useComponentCopy<"windowManager">>,
) {
  return [
    {
      id: "notas",
      title: copy.untitled,
      icon: <NoteIcon />,
      content: (
        <div className="grid gap-1 p-2">
          <Label htmlFor="wm-notas">{copy.notes}</Label>
          <Textarea id="wm-notas" rows={4} defaultValue={copy.hello} />
        </div>
      ),
      defaultPosition: { x: 16, y: 16 },
      defaultSize: { width: 280, height: 180 },
      minSize: { width: 240, height: 150 },
    },
    {
      id: "ayuda",
      title: copy.help,
      icon: <InfoIcon />,
      content: (
        <div className="p-2 text-[11px] leading-[15px]">
          <p>{copy.dragHint}</p>
          <p className="mt-1">{copy.resizeHint}</p>
        </div>
      ),
      defaultPosition: { x: 170, y: 92 },
      defaultSize: { width: 260, height: 150 },
      minSize: { width: 220, height: 130 },
    },
  ];
}

function WindowManagerPreview() {
  const copy = useComponentCopy("windowManager");
  const manager = useRef<WindowManagerHandle>(null);
  const [snapshot, setSnapshot] = useState<WindowManagerSnapshot[]>([]);

  return (
    <div className="w-full max-w-2xl">
      <WindowManager
        ref={manager}
        aria-label={copy.desktopAria}
        windows={createWindowManagerDemoWindows(copy)}
        onStateChange={setSnapshot}
        className="bevel-field h-72"
      />
      <Taskbar aria-label={copy.taskbarAria} className="mt-1">
        <TaskbarStart icon={<BrandMark />}>{copy.start}</TaskbarStart>
        <TaskbarDivider />
        {snapshot
          .filter((item) => item.open)
          .map((item) => (
            <TaskbarItem
              key={item.id}
              active={item.focused}
              icon={item.icon}
              onClick={() => {
                if (item.minimized) {
                  manager.current?.restore(item.id);
                } else if (item.focused) {
                  manager.current?.minimize(item.id);
                } else {
                  manager.current?.focus(item.id);
                }
              }}
            >
              {item.title}
            </TaskbarItem>
          ))}
        <TaskbarTray>12:00</TaskbarTray>
      </Taskbar>
    </div>
  );
}

function StartMenuPreview() {
  const copy = useComponentCopy("startMenu");
  const [lastAction, setLastAction] = useState(copy.none);

  function choose(action: string) {
    setLastAction(action);
  }

  return (
    <div className="grid w-full max-w-sm gap-2">
      <StartMenu>
        <StartMenuTrigger asChild>
          <Button className="w-fit">{copy.start}</Button>
        </StartMenuTrigger>
        <StartMenuContent>
          <div className="flex">
            <StartMenuSidebar>DeskUI</StartMenuSidebar>
            <div className="min-w-[210px] py-1">
              <StartMenuItem onSelect={() => choose(copy.programs)}>
                <FolderIcon />
                {copy.programs}
              </StartMenuItem>
              <StartMenuSub>
                <StartMenuSubTrigger>
                  <FolderIcon />
                  {copy.accessories}
                </StartMenuSubTrigger>
                <StartMenuSubContent>
                  <StartMenuItem onSelect={() => choose(copy.notepad)}>
                    <NoteIcon />
                    {copy.notepad}
                  </StartMenuItem>
                  <StartMenuItem onSelect={() => choose(copy.calculator)}>
                    <Icon name="palette" />
                    {copy.calculator}
                  </StartMenuItem>
                </StartMenuSubContent>
              </StartMenuSub>
              <StartMenuSeparator />
              <StartMenuItem onSelect={() => choose(copy.shutdown)}>
                <WarningIcon />
                {copy.shutdown}
                <StartMenuShortcut>Alt+F4</StartMenuShortcut>
              </StartMenuItem>
            </div>
          </div>
        </StartMenuContent>
      </StartMenu>
      <p className="text-[11px] leading-[15px] text-ink-muted">
        {formatCopy(copy.lastAction, { action: lastAction })}
      </p>
    </div>
  );
}

function createFileExplorerDemo(
  copy: ReturnType<typeof useComponentCopy<"fileExplorer">>,
) {
  return {
  id: "root",
  name: "C:",
  kind: "folder" as const,
  children: [
    {
      id: "windows",
      name: "DESKUI",
      kind: "folder" as const,
      children: [
        {
          id: "system",
          name: "SYSTEM",
          kind: "folder" as const,
          children: [
            {
              id: "kernel",
              name: "KERNEL32.DLL",
              kind: "file" as const,
              size: "412 KB",
              type: copy.application,
              modified: "21/10/1995 09:00",
            },
          ],
        },
        {
          id: "notepad",
          name: "NOTEPAD.EXE",
          kind: "file" as const,
          size: "34 KB",
          type: copy.application,
          modified: "21/10/1995 09:00",
        },
      ],
    },
    {
      id: "documentos",
      name: "DOCUMENTOS",
      kind: "folder" as const,
      children: [
        {
          id: "carta",
          name: "CARTA.TXT",
          kind: "file" as const,
          size: "1 KB",
          type: copy.text,
          modified: "21/10/1995 09:10",
        },
        {
          id: "presupuesto",
          name: "PRESUPUESTO.XLS",
          kind: "file" as const,
          size: "18 KB",
          type: copy.spreadsheet,
          modified: "21/10/1995 09:20",
        },
      ],
    },
    {
      id: "autoexec",
      name: "AUTOEXEC.BAT",
      kind: "file" as const,
      size: "256 B",
      type: copy.batch,
      modified: "21/10/1995 09:00",
    },
  ],
};
}

function FileExplorerPreview() {
  const copy = useComponentCopy("fileExplorer");
  return (
    <div className="w-full max-w-2xl">
      <FileExplorer root={createFileExplorerDemo(copy)} className="h-80" />
    </div>
  );
}

function WizardPreview() {
  const copy = useComponentCopy("wizard");
  const [name, setName] = useState("");
  const [result, setResult] = useState(copy.pending);

  return (
    <div className="grid w-full max-w-xl gap-2">
      <Wizard
        steps={[
          {
            id: "welcome",
            title: copy.welcome,
            description: copy.welcomeDescription,
            content: (
              <p className="text-[11px] leading-[15px]">
                {copy.welcomeBody}
              </p>
            ),
          },
          {
            id: "name",
            title: copy.name,
            description: copy.nameDescription,
            content: (
              <div className="grid gap-1">
                <Label htmlFor="wizard-name">{copy.computer}</Label>
                <Input
                  id="wizard-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="PC-01"
                />
              </div>
            ),
          },
          {
            id: "finish",
            title: copy.finish,
            content: (
              <p className="text-[11px] leading-[15px]">
                {formatCopy(copy.finishBody, { name: name || "PC-01" })}
              </p>
            ),
          },
        ]}
        canGoNext={(step) => step.id !== "name" || name.trim().length > 0}
        onComplete={() =>
          setResult(formatCopy(copy.installed, { name: name || "PC-01" }))
        }
        onCancel={() => setResult(copy.cancelled)}
      />
      <p className="text-[11px] leading-[15px] text-ink-muted">{result}</p>
    </div>
  );
}

function PropertiesDialogPreview() {
  const copy = useComponentCopy("propertiesDialog");
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState(false);

  return (
    <div className="grid justify-items-start gap-2">
      <Button onClick={() => setOpen(true)}>{copy.open}</Button>
      <PropertiesDialog
        open={open}
        onOpenChange={setOpen}
        title={copy.title}
        icon={<InfoIcon />}
        tabs={[
          {
            id: "general",
            label: copy.general,
            content: (
              <div className="grid gap-2">
                <p className="text-[11px] leading-[15px]">
                  DeskUI · 1.0.0
                </p>
                <div className="grid gap-1">
                  <Label htmlFor="prop-nombre">{copy.computer}</Label>
                  <Input id="prop-nombre" defaultValue="PC-01" />
                </div>
              </div>
            ),
          },
          {
            id: "system",
            label: copy.system,
            content: (
              <ul className="grid gap-1 text-[11px] leading-[15px]">
                <li>{copy.processor}</li>
                <li>{copy.memory}</li>
                <li>{copy.disk}</li>
              </ul>
            ),
          },
        ]}
        onApply={() => setApplied(true)}
      />
      <p className="text-[11px] leading-[15px] text-ink-muted">
        {applied ? copy.applied : copy.notApplied}
      </p>
    </div>
  );
}

function NotepadPreview() {
  const copy = useComponentCopy("notepad");
  return (
    <Window active={false} className="w-full max-w-lg">
      <Window.TitleBar title={copy.untitled} icon={<NoteIcon />} />
      <Window.Body padded={false}>
        <Notepad
          className="h-64"
          defaultValue={copy.content}
        />
      </Window.Body>
    </Window>
  );
}

function TerminalPreview() {
  const copy = useComponentCopy("terminal");
  return (
    <Terminal
      className="bevel-field h-64 w-full max-w-lg"
      initialLines={[
        { text: copy.banner, kind: "output" },
        { text: copy.copyright, kind: "output" },
        { text: "", kind: "output" },
        { text: copy.command, kind: "input" },
        { text: copy.version, kind: "output" },
      ]}
    />
  );
}

function BlueScreenPreview() {
  const copy = useComponentCopy("blueScreen");
  const [restarted, setRestarted] = useState(false);

  return (
    <div className="grid w-full max-w-xl gap-2">
      <BlueScreen
        className="min-h-48"
        onRestart={() => setRestarted(true)}
      />
      <p className="text-[11px] leading-[15px] text-ink-muted">
        {restarted ? copy.restarting : copy.stopped}
      </p>
    </div>
  );
}

function ScreensaverPreview() {
  const copy = useComponentCopy("screensaver");
  const [visible, setVisible] = useState(true);

  return (
    <div className="grid w-full max-w-xl justify-items-start gap-2">
      {visible ? (
        <Screensaver
          className="h-56 w-full"
          onDismiss={() => setVisible(false)}
        />
      ) : (
        <Button onClick={() => setVisible(true)}>
          {copy.show}
        </Button>
      )}
      <p className="text-[11px] leading-[15px] text-ink-muted">
        {copy.hint}
      </p>
    </div>
  );
}

function MinesweeperPreview() {
  const copy = useComponentCopy("minesweeper");
  return (
    <div className="grid w-full justify-items-center gap-2">
      <Minesweeper />
      <p className="text-[11px] leading-[15px] text-ink-muted">
        {copy.hint}
      </p>
    </div>
  );
}

const panelCode = `<Panel>
  <PanelHeader>
    <PanelTitle>Estado del sistema</PanelTitle>
  </PanelHeader>
  <PanelBody>
    Todos los controladores están cargados.
  </PanelBody>
  <PanelFooter>
    <Button size="sm">Detalles</Button>
  </PanelFooter>
</Panel>`;

const cardCode = `<Card>
  <CardHeader>
    <CardTitle>Disquete 3,5</CardTitle>
    <CardDescription>Almacenamiento extraíble</CardDescription>
  </CardHeader>
  <CardContent>1,44 MB · Alta densidad</CardContent>
  <CardFooter>
    <Badge variant="success">En stock</Badge>
    <Button size="sm" variant="primary">Añadir</Button>
  </CardFooter>
</Card>`;

const separatorCode = `<div className="flex gap-3">
  <span>Origen</span>
  <Separator orientation="vertical" />
  <span>Destino</span>
</div>
<Separator />`;

const toolbarCode = `<Toolbar aria-label="Formato de texto">
  <ToolbarGroup aria-label="Estilo">
    <ToolbarButton pressed={bold} onClick={toggleBold}>
      N
    </ToolbarButton>
    <ToolbarButton pressed={italic} onClick={toggleItalic}>
      K
    </ToolbarButton>
  </ToolbarGroup>
  <ToolbarSeparator />
  <ToolbarButton variant="icon" size="icon" aria-label="Abrir carpeta">
    <FolderIcon />
  </ToolbarButton>
</Toolbar>`;

const desktopCode = `<Desktop aria-label="Escritorio">
  <DesktopIcons>
    <DesktopIcon
      label="Mi PC"
      icon={<Icon name="window" size={32} />}
      selected={selected === "mi-pc"}
      onSelect={() => setSelected("mi-pc")}
      onOpen={() => abrir("mi-pc")}
    />
    <DesktopIcon
      label="Notas"
      icon={<Icon name="note" size={32} />}
      draggable
      defaultPosition={{ x: 190, y: 24 }}
      onSelect={() => setSelected("notas")}
      onOpen={() => abrir("notas")}
    />
  </DesktopIcons>
</Desktop>`;

const startMenuCode = `<StartMenu>
  <StartMenuTrigger asChild>
    <TaskbarStart icon={<BrandMark />}>Inicio</TaskbarStart>
  </StartMenuTrigger>
  <StartMenuContent>
    <div className="flex">
      <StartMenuSidebar>DeskUI</StartMenuSidebar>
      <div className="min-w-[210px] py-1">
        <StartMenuItem onSelect={abrirProgramas}>
          <FolderIcon /> Programas
        </StartMenuItem>
        <StartMenuSub>
          <StartMenuSubTrigger>Accesorios</StartMenuSubTrigger>
          <StartMenuSubContent>
            <StartMenuItem onSelect={abrirBloc}>Bloc de notas</StartMenuItem>
          </StartMenuSubContent>
        </StartMenuSub>
        <StartMenuSeparator />
        <StartMenuItem onSelect={apagar}>Apagar el sistema...</StartMenuItem>
      </div>
    </div>
  </StartMenuContent>
</StartMenu>`;

const windowManagerCode = `const manager = useRef<WindowManagerHandle>(null);

const windows = [
  {
    id: "notas",
    title: "Bloc de notas",
    icon: <NoteIcon />,
    content: <Editor />,
    defaultPosition: { x: 16, y: 16 },
    defaultSize: { width: 280, height: 180 },
  },
];

<WindowManager
  ref={manager}
  aria-label="Escritorio"
  windows={windows}
  onStateChange={setSnapshot}
/>

<Taskbar>
  {snapshot.filter((item) => item.open).map((item) => (
    <TaskbarItem
      key={item.id}
      active={item.focused}
      onClick={() => {
        if (item.minimized) manager.current?.restore(item.id);
        else if (item.focused) manager.current?.minimize(item.id);
        else manager.current?.focus(item.id);
      }}
    >
      {item.title}
    </TaskbarItem>
  ))}
</Taskbar>`;

const fileExplorerCode = `const root = {
  id: "root",
  name: "C:",
  kind: "folder",
  children: [
    { id: "docs", name: "DOCUMENTOS", kind: "folder", children: [...] },
    { id: "readme", name: "LEEME.TXT", kind: "file", size: "2 KB" },
  ],
};

<FileExplorer root={root} className="h-80" />`;

const wizardCode = `<Wizard
  steps={[
    { id: "welcome", title: "Bienvenida", content: <p>Empieza aquí.</p> },
    { id: "name", title: "Nombre", content: <Input ... /> },
    { id: "finish", title: "Finalizar", content: <p>Listo.</p> },
  ]}
  canGoNext={(step) => step.id !== "name" || name.length > 0}
  onComplete={() => guardar()}
  onCancel={() => cerrar()}
/>`;

const propertiesCode = `const [open, setOpen] = useState(false);

<PropertiesDialog
  open={open}
  onOpenChange={setOpen}
  title="Propiedades de Mi PC"
  tabs={[
    { id: "general", label: "General", content: <General /> },
    { id: "system", label: "Sistema", content: <Sistema /> },
  ]}
  onApply={() => aplicar()}
/>`;

const notepadCode = `<Notepad
  fileName="carta.txt"
  defaultValue="Hola, mundo."
  onSave={(value) => guardar(value)}
  onNew={() => nuevo()}
/>`;

const terminalCode = `<Terminal
  prompt="C:\\\\>"
  commands={{
    saludo: () => "Hola desde la terminal",
  }}
  onCommand={(command) => registrar(command)}
/>`;

const blueScreenCode = `<BlueScreen
  title="DeskUI"
  message="Se ha producido un error fatal..."
  code="ERROR 0E : 016F : BFF9B3D4"
  onRestart={() => reiniciar()}
/>`;

const screensaverCode = `<Screensaver
  title="DeskUI"
  hint="Mueve el ratón o pulsa una tecla"
  onDismiss={() => cerrar()}
/>`;

const minesweeperCode = `<Minesweeper rows={9} cols={9} mines={10} seed={1} />
<Minesweeper layout={["..*", "...", "..."]} />`;

const buttonCode = `<Button>Cancelar</Button>
<Button variant="primary">Aceptar</Button>
<Button disabled>Deshabilitado</Button>

<Button variant="icon" size="icon" aria-label="Abrir carpeta">
  <FolderIcon />
</Button>

<Button aria-pressed={pressed} onClick={() => setPressed(!pressed)}>
  Negrita
</Button>`;

const inputCode = `<Label htmlFor="usuario">Nombre de usuario</Label>
<Input id="usuario" defaultValue="usuario95" />

<Label htmlFor="dominio">Dominio</Label>
<Input id="dominio" value="TRABAJO" readOnly />`;

const labelCode = `<Label htmlFor="grupo">Grupo de trabajo</Label>
<Input id="grupo" placeholder="TRABAJO" />`;

const groupBoxCode = `<GroupBox legend="Opciones de instalación">
  <Checkbox defaultChecked>Crear acceso directo</Checkbox>
  <Checkbox>Iniciar sesión</Checkbox>
</GroupBox>`;

const checkboxCode = `<Checkbox defaultChecked>Recordar contraseña</Checkbox>
<Checkbox>Mostrar archivos ocultos</Checkbox>
<Checkbox disabled>No disponible</Checkbox>`;

const textareaCode = `<Label htmlFor="notas">Notas</Label>
<Textarea id="notas" rows={4} placeholder="Escribe aquí..." />`;

const windowCode = `<Window active={false}>
  <Window.TitleBar title="Sin título - Bloc de notas" icon={<NoteIcon />} />
  <Window.Body>
    <p>Hola, mundo.</p>
  </Window.Body>
</Window>`;

const dialogCode = `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Abrir mensaje</Button>

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Mensaje"
  icon={<WarningIcon />}
  footer={
    <>
      <Button size="sm" onClick={() => setOpen(false)}>Cancelar</Button>
      <Button size="sm" variant="primary" onClick={() => setOpen(false)}>
        Aceptar
      </Button>
    </>
  }
>
  <p>¿Desea continuar?</p>
</Dialog>`;

const radioGroupCode = `<RadioGroup defaultValue="basico" aria-label="Plan">
  <RadioGroupItem value="basico">Básico — 10 MB</RadioGroupItem>
  <RadioGroupItem value="pro">Pro — 50 MB</RadioGroupItem>
  <RadioGroupItem value="servidor" disabled>
    Servidor — requiere licencia
  </RadioGroupItem>
</RadioGroup>`;

const selectCode = `<Label htmlFor="dominio">Dominio</Label>
<Select id="dominio" defaultValue="trabajo">
  <option value="trabajo">TRABAJO</option>
  <option value="casa">CASA</option>
</Select>`;

const switchCode = `<Switch defaultChecked>Modo seguro</Switch>
<Switch>Comprobar actualizaciones</Switch>
<Switch disabled>No disponible</Switch>`;

const sliderCode = `<Label htmlFor="volumen">Volumen</Label>
<Slider
  id="volumen"
  min={0}
  max={100}
  defaultValue={60}
  onChange={(event) => setVolume(Number(event.target.value))}
/>`;

const formCode = `const schema = z.object({
  usuario: z.string().min(3, "Mínimo 3 caracteres"),
  recordar: z.boolean(),
});

const form = useForm({
  resolver: zodResolver(schema),
  defaultValues: { usuario: "", recordar: true },
});

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
    <FormField
      control={form.control}
      name="usuario"
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
    <Button type="submit" variant="primary">Entrar</Button>
  </form>
</Form>`;

const tabsCode = `<Tabs defaultValue="general">
  <TabsList aria-label="Propiedades">
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="apariencia">Apariencia</TabsTrigger>
  </TabsList>
  <TabsContent value="general">
    <Label htmlFor="nombre">Nombre</Label>
    <Input id="nombre" defaultValue="PC-01" />
  </TabsContent>
  <TabsContent value="apariencia">
    <Checkbox defaultChecked>Mostrar iconos</Checkbox>
  </TabsContent>
</Tabs>`;

const scrollAreaCode = `<ScrollArea className="bevel-field h-32 bg-surface-sunken">
  <ul className="p-2">
    <li>Documento 01.txt</li>
    <li>Documento 02.txt</li>
    <li>Documento 03.txt</li>
  </ul>
</ScrollArea>`;

const badgeCode = `<Badge>Nuevo</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="success">Activo</Badge>
<Badge variant="warning">Pendiente</Badge>
<Badge variant="danger">Error</Badge>`;

const alertCode = `<Alert variant="warning" icon={<WarningIcon />}>
  <AlertTitle>Advertencia</AlertTitle>
  <AlertDescription>El archivo ya existe.</AlertDescription>
</Alert>`;

const toastCode = `const { toast } = useToast();

<Button
  onClick={() =>
    toast({
      title: "Copia completada",
      description: "12 archivos copiados.",
    })
  }
>
  Mostrar notificación
</Button>`;

const progressCode = `<ProgressBar aria-label="Copia de archivos" value={35} />
<ProgressBar aria-label="Instalación" value={70} />`;

const tooltipCode = `<Tooltip>
  <TooltipTrigger asChild>
    <Button>Guardar</Button>
  </TooltipTrigger>
  <TooltipContent>Guardar cambios (Ctrl+S)</TooltipContent>
</Tooltip>`;

const menuBarCode = `<MenuBar aria-label="Aplicación">
  <MenuBarMenu label="Archivo">
    <MenuBarItem onSelect={nuevo}>
      Nuevo
      <MenuBarShortcut>Ctrl+N</MenuBarShortcut>
    </MenuBarItem>
    <MenuBarSeparator />
    <MenuBarItem onSelect={salir}>Salir</MenuBarItem>
  </MenuBarMenu>
</MenuBar>`;

const dropdownCode = `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Opciones</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Renombrar</DropdownMenuItem>
    <DropdownMenuItem>Mover a...</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Eliminar</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`;

const contextCode = `<ContextMenu>
  <ContextMenuTrigger asChild>
    <div>Haz clic derecho aquí</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Copiar</ContextMenuItem>
    <ContextMenuItem>Pegar</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Propiedades</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`;

const breadcrumbCode = `<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/componentes">Componentes</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Button</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`;

const treeCode = `<TreeView aria-label="Explorador" defaultExpanded={["c"]}>
  <TreeItem value="c" label="C:" icon={<FolderIcon />}>
    <TreeItem value="docs" label="Documentos" icon={<FolderIcon />}>
      <TreeItem value="carta" label="carta.txt" icon={<NoteIcon />} />
    </TreeItem>
  </TreeItem>
</TreeView>`;

const paginationCode = `<Pagination page={page} pageCount={12} onPageChange={setPage} />`;

const tableCode = `<Table aria-label="Archivos">
  <TableHeader>
    <TableRow>
      <TableHead>Nombre</TableHead>
      <TableHead>Tamaño</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow selected>
      <TableCell>carta.txt</TableCell>
      <TableCell>2 KB</TableCell>
    </TableRow>
  </TableBody>
</Table>`;

const listBoxCode = `<Label htmlFor="archivos">Archivos</Label>
<ListBox id="archivos" size={5} defaultValue="carta">
  <option value="carta">carta.txt</option>
  <option value="informe">informe.doc</option>
  <option value="notas">notas.txt</option>
</ListBox>`;

const statusBarCode = `<StatusBar aria-label="Estado">
  <StatusBarField>Listo</StatusBarField>
  <StatusBarField>3 objetos seleccionados</StatusBarField>
  <StatusBarField>1,44 MB</StatusBarField>
</StatusBar>`;

const iconCode = `<Icon name="folder" label="Carpeta" />
<Icon name="warning" size={32} label="Advertencia" />
<Icon name="info" />`;

const titleBarCode = `<TitleBar
  title="Sin título - Bloc de notas"
  icon={<NoteIcon />}
  onClose={cerrar}
/>`;

const taskbarCode = `<Taskbar aria-label="Barra de tareas">
  <TaskbarStart icon={<BrandMark />}>Inicio</TaskbarStart>
  <TaskbarDivider />
  <TaskbarItem active icon={<NoteIcon />}>
    Documento
  </TaskbarItem>
  <TaskbarTray>12:00</TaskbarTray>
</Taskbar>`;

export const COMPONENT_DOCS: ComponentDoc[] = [
  {
    slug: "button",
    title: "Button",
    description:
      "Botón biselado clásico con variantes, estado pulsado y foco punteado. El botón primario usa el anillo negro grueso del botón predeterminado.",
    install: "npx deskui add button",
    preview: <ButtonPreview />,
    code: buttonCode,
    props: [
      {
        prop: "variant",
        type: '"default" | "primary" | "icon"',
        default: '"default"',
        description: "Bisel estándar, anillo grueso o botón cuadrado.",
      },
      {
        prop: "size",
        type: '"sm" | "md" | "lg" | "icon"',
        default: '"md"',
        description: "Alturas 21/23/27 px; 24 px en móvil.",
      },
      {
        prop: "asChild",
        type: "boolean",
        default: "false",
        description: "Renderiza el hijo (por ejemplo un enlace) con el estilo.",
      },
      {
        prop: "aria-pressed",
        type: "boolean",
        default: "—",
        description: "Activa el estado hundido de toggle.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Texto grabado y sin interacción.",
      },
    ],
    notes: [
      "El tipo por defecto es button para no enviar formularios sin querer.",
      "Un botón solo icono necesita aria-label.",
      "El estado active se resuelve con CSS nativo; no hay estado React extra.",
    ],
  },
  {
    slug: "input",
    title: "Input",
    description:
      "Campo de texto hundido con borde de 2 px, selección azul y foco punteado interior. Mantiene todos los atributos nativos de <input>.",
    install: "npx deskui add input",
    preview: <InputPreview />,
    code: inputCode,
    props: [
      {
        prop: "type",
        type: "string",
        default: '"text"',
        description: "Cualquier tipo nativo de input.",
      },
      {
        prop: "readOnly",
        type: "boolean",
        default: "false",
        description: "Fondo gris y texto normal, sin edición.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Fondo gris y texto grabado.",
      },
      {
        prop: "placeholder",
        type: "string",
        default: "—",
        description: "Texto de ayuda con color secundario.",
      },
      {
        prop: "aria-invalid",
        type: "boolean",
        default: "—",
        description: "Reservado para la variante de error de la siguiente fase.",
      },
    ],
    notes: [
      "Asocia siempre una etiqueta con Label y htmlFor/id.",
      "El foco es un rectángulo punteado, no un anillo moderno.",
      "En móvil la altura sube a 24 px para facilitar el toque.",
    ],
  },
  {
    slug: "label",
    title: "Label",
    description:
      "Etiqueta de formulario compacta que conserva la tipografía y la densidad de la interfaz clásica.",
    install: "npx deskui add label",
    preview: <LabelPreview />,
    code: labelCode,
    props: [
      {
        prop: "htmlFor",
        type: "string",
        default: "—",
        description: "Id del control asociado.",
      },
      {
        prop: "className",
        type: "string",
        default: "—",
        description: "Clases adicionales fusionadas.",
      },
    ],
    notes: [
      "No envuelve al control por defecto; usa htmlFor/id.",
      "Puede envolver un Checkbox cuando el texto forma parte del control.",
    ],
  },
  {
    slug: "group-box",
    title: "GroupBox",
    description:
      "Fieldset clásico con la leyenda sobre el borde superior. El fondo de la leyenda enmascara la línea y crea la muesca tradicional.",
    install: "npx deskui add group-box",
    preview: <GroupBoxPreview />,
    code: groupBoxCode,
    props: [
      {
        prop: "legend",
        type: "ReactNode",
        default: "—",
        description: "Título visible y nombre accesible del fieldset.",
      },
      {
        prop: "className",
        type: "string",
        default: "—",
        description: "Clases adicionales para el fieldset.",
      },
    ],
    notes: [
      "Usa fieldset/legend: el grupo tiene nombre accesible y semántica de formulario.",
      "La leyenda enmascara la línea superior sin dejar el texto sobre el borde.",
      "Puede anidarse en Window.Body o usarse para agrupar controles de un formulario.",
    ],
  },
  {
    slug: "checkbox",
    title: "Checkbox",
    description:
      "Checkbox nativo de 13×13 px con check pixelado. El input real sigue siendo accesible por teclado y formularios.",
    install: "npx deskui add checkbox",
    preview: <CheckboxPreview />,
    code: checkboxCode,
    props: [
      {
        prop: "checked / defaultChecked",
        type: "boolean",
        default: "—",
        description: "Estado controlado o no controlado.",
      },
      {
        prop: "onChange",
        type: "ChangeEventHandler",
        default: "—",
        description: "Manejador nativo del input.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Caja gris y texto grabado.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "—",
        description: "Texto visible; también sirve como nombre accesible.",
      },
    ],
    notes: [
      "El input nativo está superpuesto y conserva teclado, formularios y lectores de pantalla.",
      "La barra espaciadora alterna el estado cuando el input tiene foco.",
      "El área táctil mínima es 24 px en móvil.",
    ],
  },
  {
    slug: "textarea",
    title: "Textarea",
    description:
      "Área de texto hundida y redimensionable en vertical, con la misma tipografía y foco que Input.",
    install: "npx deskui add textarea",
    preview: <TextareaPreview />,
    code: textareaCode,
    props: [
      {
        prop: "rows",
        type: "number",
        default: "—",
        description: "Número inicial de filas.",
      },
      {
        prop: "readOnly",
        type: "boolean",
        default: "false",
        description: "Fondo gris, sin edición.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Fondo gris y texto grabado.",
      },
    ],
    notes: [
      "El alto mínimo es 60 px y el redimensionado es vertical.",
      "Comparte tokens de foco y bisel con Input.",
    ],
  },
  {
    slug: "window",
    title: "Window",
    description:
      "Ventana componible con TitleBar, Body y StatusBar. Los controles sin manejador se dibujan inertes, nunca como botones rotos.",
    install: "npx deskui add window",
    preview: <WindowPreview />,
    code: windowCode,
    props: [
      {
        prop: "active",
        type: "boolean",
        default: "true",
        description: "Barra de título azul o gris.",
      },
      {
        prop: "Window.TitleBar title",
        type: "ReactNode",
        default: "—",
        description: "Título visible; children tiene prioridad.",
      },
      {
        prop: "Window.TitleBar maximized",
        type: "boolean",
        default: "false",
        description: "Cambia el glifo de maximizar por restaurar.",
      },
      {
        prop: "Window.TitleBar onClose",
        type: "() => void",
        default: "—",
        description: "Si falta, el control se renderiza inerte.",
      },
      {
        prop: "Window.Body padded",
        type: "boolean",
        default: "true",
        description: "Aplica el margen clásico de 8 px.",
      },
    ],
    notes: [
      "El elemento raíz es section; usa role=dialog para diálogos.",
      "Los controles tienen aria-label y foco punteado.",
      "El WindowManager añade arrastre y resize sobre esta base.",
    ],
  },
  {
    slug: "dialog",
    title: "Dialog",
    description:
      "Diálogo modal construido sobre <dialog> nativo: foco atrapado, Escape, backdrop y retorno de foco sin dependencias externas.",
    install: "npx deskui add dialog",
    preview: <DialogPreview />,
    code: dialogCode,
    props: [
      {
        prop: "open",
        type: "boolean",
        default: "—",
        description: "Controla la apertura del modal.",
      },
      {
        prop: "onOpenChange",
        type: "(open: boolean) => void",
        default: "—",
        description: "Se llama al cerrar con Escape o con el control.",
      },
      {
        prop: "title",
        type: "ReactNode",
        default: "—",
        description: "Título de la barra y nombre accesible.",
      },
      {
        prop: "icon",
        type: "ReactNode",
        default: "—",
        description: "Icono de 16×16 en la barra de título.",
      },
      {
        prop: "footer",
        type: "ReactNode",
        default: "—",
        description: "Acciones alineadas a la derecha.",
      },
      {
        prop: "showClose",
        type: "boolean",
        default: "true",
        description: "Muestra el control de cierre.",
      },
      {
        prop: "dismissOnBackdrop",
        type: "boolean",
        default: "false",
        description: "Cierra al pulsar el fondo; por defecto no.",
      },
    ],
    notes: [
      "Escape cierra el diálogo de forma nativa.",
      "El foco se restaura al elemento que abrió el modal.",
      "El fondo no cierra por defecto para respetar el comportamiento clásico.",
    ],
  },
  {
    slug: "radio-group",
    title: "RadioGroup",
    description:
      "Grupo de radios nativos con el círculo biselado clásico de 12 px y un punto de 4 px. Mantiene las flechas del teclado y el comportamiento de formulario.",
    install: "npx deskui add radio-group",
    preview: <RadioGroupPreview />,
    code: radioGroupCode,
    props: [
      {
        prop: "value / defaultValue",
        type: "string",
        default: "—",
        description: "Valor seleccionado, controlado o no controlado.",
      },
      {
        prop: "onValueChange",
        type: "(value: string) => void",
        default: "—",
        description: "Se llama al seleccionar una opción.",
      },
      {
        prop: "name",
        type: "string",
        default: "useId()",
        description: "Nombre nativo compartido por los radios.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Deshabilita todos los items.",
      },
      {
        prop: "RadioGroupItem value",
        type: "string",
        default: "—",
        description: "Valor de la opción; children es su etiqueta.",
      },
    ],
    notes: [
      "Usa radios nativos: las flechas, el foco y los formularios funcionan sin lógica extra.",
      "El grupo necesita un nombre accesible con aria-label o aria-labelledby.",
      "El área táctil mínima es de 24 px en móvil.",
    ],
  },
  {
    slug: "select",
    title: "Select",
    description:
      "Select nativo con campo hundido y botón de flecha elevado. Conserva el comportamiento nativo y evita una dependencia de Radix para un control básico.",
    install: "npx deskui add select",
    preview: <SelectPreview />,
    code: selectCode,
    props: [
      {
        prop: "value / defaultValue",
        type: "string",
        default: "—",
        description: "Valor seleccionado.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Campo gris y sin interacción.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "—",
        description: "Opciones nativas <option>.",
      },
    ],
    notes: [
      "Al estar basado en <select>, el teclado y los lectores de pantalla funcionan de forma nativa.",
      "No está pensado para multiple; usa ListBox para selección múltiple.",
      "El botón de flecha es visual; el select completo sigue siendo el control interactivo.",
    ],
  },
  {
    slug: "switch",
    title: "Switch",
    description:
      "Interruptor retro con pista hundida y perilla elevada. Es un botón nativo con role=switch, por lo que Space y Enter funcionan.",
    install: "npx deskui add switch",
    preview: <SwitchPreview />,
    code: switchCode,
    props: [
      {
        prop: "checked / defaultChecked",
        type: "boolean",
        default: "false",
        description: "Estado controlado o no controlado.",
      },
      {
        prop: "onCheckedChange",
        type: "(checked: boolean) => void",
        default: "—",
        description: "Se llama al alternar.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Deshabilita el control.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "—",
        description: "Texto visible y nombre accesible.",
      },
    ],
    notes: [
      "El control tiene role=switch y aria-checked.",
      "No usa transición: el estado cambia de forma instantánea.",
      "Para formularios clásicos, Checkbox sigue siendo la opción más fiel.",
    ],
  },
  {
    slug: "slider",
    title: "Slider",
    description:
      "Slider nativo con pista hundida de 4 px y thumb rectangular de 11×21 px, como en los paneles de control de la época.",
    install: "npx deskui add slider",
    preview: <SliderPreview />,
    code: sliderCode,
    props: [
      {
        prop: "min / max / step",
        type: "number",
        default: "0 / 100 / 1",
        description: "Rango nativo del input.",
      },
      {
        prop: "value / defaultValue",
        type: "number",
        default: "—",
        description: "Valor del control.",
      },
      {
        prop: "onChange",
        type: "ChangeEventHandler",
        default: "—",
        description: "Manejador nativo.",
      },
      {
        prop: "disabled",
        type: "boolean",
        default: "false",
        description: "Deshabilita el control.",
      },
    ],
    notes: [
      "Usa input[type=range], por lo que las flechas del teclado funcionan de forma nativa.",
      "La pista y el thumb se estilan en tokens.css para WebKit y Firefox.",
      "El thumb mide 11×21 px en escritorio y mantiene la densidad clásica.",
    ],
  },
  {
    slug: "form",
    title: "Form",
    description:
      "Integración con React Hook Form y Zod. FormField conecta el control, FormControl propaga id/ARIA y FormMessage muestra errores accesibles.",
    install: "npx deskui add form",
    preview: <FormPreview />,
    code: formCode,
    props: [
      {
        prop: "Form",
        type: "FormProviderProps",
        default: "—",
        description: "Provider de React Hook Form.",
      },
      {
        prop: "FormField control / name / render",
        type: "ControllerProps",
        default: "—",
        description: "Conecta un campo con su control.",
      },
      {
        prop: "FormItem",
        type: "HTMLDivElement",
        default: "—",
        description: "Agrupa label, control, descripción y mensaje.",
      },
      {
        prop: "FormControl",
        type: "SlotProps",
        default: "—",
        description: "Inyecta id y ARIA en el input hijo.",
      },
      {
        prop: "FormMessage",
        type: "HTMLParagraphElement",
        default: "—",
        description: "Muestra el error de Zod con role=alert.",
      },
    ],
    notes: [
      "FormControl usa Radix Slot para propagar id, aria-invalid y aria-describedby.",
      "FormLabel asocia la etiqueta con el control automáticamente.",
      "El componente no impone un esquema: puedes usar Zod, Yup o validación nativa.",
    ],
  },
  {
    slug: "tabs",
    title: "Tabs",
    description:
      "Pestañas de propiedades sobre Radix Tabs. La pestaña activa se fusiona con el panel y el teclado navega con las flechas.",
    install: "npx deskui add tabs",
    preview: <TabsPreview />,
    code: tabsCode,
    props: [
      {
        prop: "defaultValue / value",
        type: "string",
        default: "—",
        description: "Pestaña activa, no controlada o controlada.",
      },
      {
        prop: "onValueChange",
        type: "(value: string) => void",
        default: "—",
        description: "Se llama al cambiar de pestaña.",
      },
      {
        prop: "TabsTrigger value",
        type: "string",
        default: "—",
        description: "Identificador de la pestaña.",
      },
      {
        prop: "TabsContent value",
        type: "string",
        default: "—",
        description: "Panel asociado a la pestaña.",
      },
    ],
    notes: [
      "Radix aporta roles, aria-selected, flechas, Home y End.",
      "La pestaña activa elimina su borde inferior para unirse al panel.",
      "El panel es focusable cuando Radix lo requiere.",
    ],
  },
  {
    slug: "scroll-area",
    title: "ScrollArea",
    description:
      "Contenedor con scroll nativo y barra clásica de 16 px con flechas, pista tramada y thumb cuadrado. El viewport es focusable para que el teclado pueda desplazar el contenido.",
    install: "npx deskui add scroll-area",
    preview: <ScrollAreaPreview />,
    code: scrollAreaCode,
    props: [
      {
        prop: "orientation",
        type: '"vertical" | "horizontal" | "both"',
        default: '"vertical"',
        description: "Ejes con scroll.",
      },
      {
        prop: "viewportClassName",
        type: "string",
        default: "—",
        description: "Clases para el viewport interno.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "—",
        description: "Contenido desplazable.",
      },
    ],
    notes: [
      "El viewport tiene tabIndex=0 para navegación por teclado.",
      "Flechas, pista y thumb son propios: mantienen la geometría de 16 px en todos los navegadores.",
      "Flechas y pista avanzan como en la interfaz clásica; el thumb se arrastra con puntero.",
      "Añade una altura o un max-height al contenedor para limitar el área.",
    ],
  },
  {
    slug: "badge",
    title: "Badge",
    description:
      "Etiqueta biselada compacta con un punto de estado semántico. El texto siempre usa el color de tinta para mantener contraste.",
    install: "npx deskui add badge",
    preview: <BadgePreview />,
    code: badgeCode,
    props: [
      {
        prop: "variant",
        type: '"default" | "info" | "success" | "warning" | "danger"',
        default: '"default"',
        description: "Color del punto de estado.",
      },
      {
        prop: "children",
        type: "ReactNode",
        default: "—",
        description: "Texto de la etiqueta.",
      },
    ],
    notes: [
      "El texto es siempre legible; el color semántico va en un punto decorativo.",
      "No usa border-radius, en línea con el resto del sistema.",
    ],
  },
  {
    slug: "alert",
    title: "Alert",
    description:
      "Aviso con marco de ventana y una franja semántica. Compón el contenido con AlertTitle y AlertDescription.",
    install: "npx deskui add alert",
    preview: <AlertPreview />,
    code: alertCode,
    props: [
      {
        prop: "variant",
        type: '"info" | "success" | "warning" | "danger"',
        default: '"info"',
        description: "Color de la franja lateral.",
      },
      {
        prop: "icon",
        type: "ReactNode",
        default: "—",
        description: "Icono opcional a la izquierda.",
      },
      {
        prop: "AlertTitle / AlertDescription",
        type: "ReactNode",
        default: "—",
        description: "Título y cuerpo del aviso.",
      },
    ],
    notes: [
      "El contenedor tiene role=alert; úsalo para mensajes que deban anunciarse.",
      "El texto se mantiene sobre la superficie para conservar el contraste.",
    ],
  },
  {
    slug: "toast",
    title: "Toast",
    description:
      "Notificaciones de bandeja con un proveedor global, cierre manual y auto-cierre configurable.",
    install: "npx deskui add toast",
    preview: <ToastPreview />,
    code: toastCode,
    props: [
      {
        prop: "ToastProvider",
        type: "ReactNode",
        default: "—",
        description: "Envuelve la aplicación y renderiza el viewport.",
      },
      {
        prop: "useToast().toast",
        type: "(options) => string",
        default: "—",
        description: "Añade una notificación y devuelve su id.",
      },
      {
        prop: "ToastProvider duration",
        type: "number",
        default: "5000",
        description: "Duración por notificación; 0 la mantiene abierta.",
      },
    ],
    notes: [
      "El viewport usa aria-live=polite y cada toast role=status.",
      "El botón de cierre tiene nombre accesible.",
      "En la documentación el provider envuelve toda la aplicación.",
    ],
  },
  {
    slug: "progress-bar",
    title: "ProgressBar",
    description:
      "Barra de progreso hundida con bloques azules separados por un píxel, como en los instaladores clásicos.",
    install: "npx deskui add progress-bar",
    preview: <ProgressBarPreview />,
    code: progressCode,
    props: [
      {
        prop: "value",
        type: "number",
        default: "0",
        description: "Valor actual, limitado entre 0 y max.",
      },
      {
        prop: "max",
        type: "number",
        default: "100",
        description: "Valor máximo.",
      },
      {
        prop: "segmented",
        type: "boolean",
        default: "true",
        description: "Muestra bloques separados o una barra sólida.",
      },
    ],
    notes: [
      "Expone role=progressbar y aria-valuenow/min/max.",
      "El patrón de bloques se define en tokens.css.",
    ],
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    description:
      "Tooltip amarillo clásico sobre Radix Tooltip. Aparece con hover o foco y se cierra con Escape.",
    install: "npx deskui add tooltip",
    preview: <TooltipPreview />,
    code: tooltipCode,
    props: [
      {
        prop: "Tooltip delayDuration",
        type: "number",
        default: "300",
        description: "Retraso antes de mostrar.",
      },
      {
        prop: "TooltipTrigger asChild",
        type: "boolean",
        default: "false",
        description: "Usa el hijo como disparador.",
      },
      {
        prop: "TooltipContent sideOffset",
        type: "number",
        default: "6",
        description: "Separación respecto al disparador.",
      },
    ],
    notes: [
      "Radix gestiona el rol tooltip, el foco y Escape.",
      "El color de fondo es --w95-tooltip y se adapta a los temas.",
    ],
  },
  {
    slug: "menu-bar",
    title: "MenuBar",
    description:
      "Barra de menús de ventana sobre Radix Menubar. Soporta teclado, submenús y atajos visuales.",
    install: "npx deskui add menu-bar",
    preview: <MenuBarPreview />,
    code: menuBarCode,
    props: [
      {
        prop: "MenuBar",
        type: "MenubarRootProps",
        default: "—",
        description: "Contenedor role=menubar.",
      },
      {
        prop: "MenuBarMenu label",
        type: "ReactNode",
        default: "—",
        description: "Título del menú y contenido desplegable.",
      },
      {
        prop: "MenuBarItem onSelect",
        type: "(event) => void",
        default: "—",
        description: "Acción de una entrada.",
      },
      {
        prop: "MenuBarShortcut",
        type: "ReactNode",
        default: "—",
        description: "Atajo alineado a la derecha.",
      },
    ],
    notes: [
      "Radix aporta navegación con flechas, Home/End, Escape y submenús.",
      "Las entradas resaltadas usan azul de selección y texto blanco.",
    ],
  },
  {
    slug: "dropdown-menu",
    title: "DropdownMenu",
    description:
      "Menú desplegable clásico sobre Radix DropdownMenu, con etiquetas, atajos, separadores y acciones deshabilitadas.",
    install: "npx deskui add dropdown-menu",
    preview: <DropdownMenuPreview />,
    code: dropdownCode,
    props: [
      {
        prop: "DropdownMenuTrigger asChild",
        type: "boolean",
        default: "false",
        description: "Usa el hijo como disparador.",
      },
      {
        prop: "DropdownMenuContent align",
        type: '"start" | "center" | "end"',
        default: '"center"',
        description: "Alineación del panel.",
      },
      {
        prop: "DropdownMenuItem onSelect",
        type: "(event) => void",
        default: "—",
        description: "Acción de la entrada.",
      },
    ],
    notes: [
      "Radix gestiona teclado, foco y portal.",
      "El panel usa el bisel elevado y las entradas el azul de selección.",
    ],
  },
  {
    slug: "context-menu",
    title: "ContextMenu",
    description:
      "Menú contextual sobre Radix. Se abre con clic derecho y comparte el lenguaje visual de MenuBar y DropdownMenu.",
    install: "npx deskui add context-menu",
    preview: <ContextMenuPreview />,
    code: contextCode,
    props: [
      {
        prop: "ContextMenuTrigger asChild",
        type: "boolean",
        default: "false",
        description: "Área que abre el menú con clic derecho.",
      },
      {
        prop: "ContextMenuContent",
        type: "ContextMenuContentProps",
        default: "—",
        description: "Panel flotante.",
      },
      {
        prop: "ContextMenuItem onSelect",
        type: "(event) => void",
        default: "—",
        description: "Acción de la entrada.",
      },
    ],
    notes: [
      "Radix gestiona la posición, el foco y el cierre con Escape.",
      "El menú se renderiza en un portal para no recortarse.",
    ],
  },
  {
    slug: "breadcrumb",
    title: "Breadcrumb",
    description:
      "Migas de pan con enlaces, página actual y separadores clásicos. Útil para la navegación de la documentación o el explorador.",
    install: "npx deskui add breadcrumb",
    preview: <BreadcrumbPreview />,
    code: breadcrumbCode,
    props: [
      {
        prop: "Breadcrumb",
        type: "HTMLElement",
        default: "—",
        description: "Navegación con aria-label=breadcrumb.",
      },
      {
        prop: "BreadcrumbLink href",
        type: "string",
        default: "—",
        description: "Enlace de un nivel anterior.",
      },
      {
        prop: "BreadcrumbPage",
        type: "ReactNode",
        default: "—",
        description: "Nivel actual con aria-current=page.",
      },
    ],
    notes: [
      "El separador es decorativo y está oculto para lectores de pantalla.",
      "Usa BreadcrumbPage para el último nivel, no un enlace.",
    ],
  },
  {
    slug: "tree-view",
    title: "TreeView",
    description:
      "Árbol de explorador con selección, expansión y navegación por teclado. Ideal para réplicas del explorador clásico.",
    install: "npx deskui add tree-view",
    preview: <TreeViewPreview />,
    code: treeCode,
    props: [
      {
        prop: "TreeView value / defaultValue",
        type: "string",
        default: "—",
        description: "Elemento seleccionado.",
      },
      {
        prop: "TreeView expanded / defaultExpanded",
        type: "string[]",
        default: "[]",
        description: "Ramas abiertas.",
      },
      {
        prop: "TreeItem value",
        type: "string",
        default: "—",
        description: "Identificador de la fila.",
      },
      {
        prop: "TreeItem label / icon",
        type: "ReactNode",
        default: "—",
        description: "Texto e icono de la fila.",
      },
    ],
    notes: [
      "La fila tiene role=treeitem, aria-level, aria-selected y aria-expanded.",
      "ArrowRight/ArrowLeft expanden y colapsan; ArrowUp/ArrowDown mueven el foco.",
      "Enter o Space seleccionan la fila.",
    ],
  },
  {
    slug: "pagination",
    title: "Pagination",
    description:
      "Paginación clásica con botones Anterior/Siguiente, páginas y elipsis. La página actual queda hundida.",
    install: "npx deskui add pagination",
    preview: <PaginationPreview />,
    code: paginationCode,
    props: [
      {
        prop: "page",
        type: "number",
        default: "—",
        description: "Página actual.",
      },
      {
        prop: "pageCount",
        type: "number",
        default: "—",
        description: "Total de páginas.",
      },
      {
        prop: "onPageChange",
        type: "(page: number) => void",
        default: "—",
        description: "Cambio de página.",
      },
      {
        prop: "siblingCount",
        type: "number",
        default: "1",
        description: "Páginas visibles a cada lado de la actual.",
      },
    ],
    notes: [
      "La página actual tiene aria-current=page.",
      "Los botones anterior/siguiente se deshabilitan en los extremos.",
    ],
  },
  {
    slug: "table",
    title: "Table",
    description:
      "Tabla clásica con cabecera elevada y fija, cuerpo blanco, filas compactas y selección azul.",
    install: "npx deskui add table",
    preview: <TablePreview />,
    code: tableCode,
    props: [
      {
        prop: "containerClassName",
        type: "string",
        default: "—",
        description: "Clases del contenedor con bisel y scroll.",
      },
      {
        prop: "TableHead",
        type: "th",
        default: "—",
        description: "Cabecera elevada y sticky.",
      },
      {
        prop: "TableRow selected",
        type: "boolean",
        default: "false",
        description: "Fila seleccionada en azul.",
      },
      {
        prop: "TableFooter",
        type: "tfoot",
        default: "—",
        description: "Fila de totales con separador.",
      },
    ],
    notes: [
      "La tabla vive en un contenedor con bisel y overflow para conservar la cabecera fija.",
      "Las filas seleccionadas invierten el color con el azul de selección.",
      "El cuerpo usa fondo blanco y filas de 14-15 px para mantener la densidad clásica.",
    ],
  },
  {
    slug: "list-box",
    title: "ListBox",
    description:
      "List box nativa con varias filas visibles, bisel hundido y selección simple o múltiple.",
    install: "npx deskui add list-box",
    preview: <ListBoxPreview />,
    code: listBoxCode,
    props: [
      {
        prop: "size",
        type: "number",
        default: "4",
        description: "Número de filas visibles.",
      },
      {
        prop: "multiple",
        type: "boolean",
        default: "false",
        description: "Permite Ctrl/Shift para selección múltiple.",
      },
      {
        prop: "value / defaultValue",
        type: "string | string[]",
        default: "—",
        description: "Selección controlada o no controlada.",
      },
    ],
    notes: [
      "Usa un select nativo con size; conserva teclado, formularios y lectores de pantalla.",
      "El foco se marca con el rectángulo punteado clásico.",
      "La scrollbar utiliza el estilo de 16 px del sistema.",
    ],
  },
  {
    slug: "status-bar",
    title: "StatusBar",
    description:
      "Barra de estado con campos segmentados y el bisel de estado clásico.",
    install: "npx deskui add status-bar",
    preview: <StatusBarPreview />,
    code: statusBarCode,
    props: [
      {
        prop: "StatusBar",
        type: "HTMLDivElement",
        default: "—",
        description: "Contenedor flex con separación de 1 px.",
      },
      {
        prop: "StatusBarField",
        type: "HTMLDivElement",
        default: "—",
        description: "Campo hundido con truncado.",
      },
    ],
    notes: [
      "Los campos usan bevel-status y flex-1; puedes fijar su ancho con className.",
      "Window.StatusBar reutiliza este componente internamente.",
    ],
  },
  {
    slug: "icon",
    title: "Icon",
    description:
      "Set original de iconos pixel-art 16×16, escalables a 32×32, con nombres accesibles opcionales.",
    install: "npx deskui add icon",
    preview: <IconPreview />,
    code: iconCode,
    props: [
      {
        prop: "name",
        type: '"window" | "folder" | "palette" | "info" | "warning" | "note" | "speaker"',
        default: "—",
        description: "Icono del set.",
      },
      {
        prop: "size",
        type: "16 | 32",
        default: "16",
        description: "Tamaño visual en píxeles.",
      },
      {
        prop: "label",
        type: "string",
        default: "—",
        description: "Si existe, el icono se anuncia como imagen.",
      },
    ],
    notes: [
      "Los iconos son pixel art original, no assets propietarios de terceros.",
      "Sin label son decorativos (aria-hidden); con label exponen role=img.",
      "Puedes cambiar el color con currentColor en los iconos monocromos, pero el set base usa la paleta clásica.",
    ],
  },
  {
    slug: "title-bar",
    title: "TitleBar",
    description:
      "Barra de título reutilizable fuera de Window, con icono, controles y estados activo/inactivo.",
    install: "npx deskui add title-bar",
    preview: <TitleBarPreview />,
    code: titleBarCode,
    props: [
      {
        prop: "active",
        type: "boolean",
        default: "true",
        description: "Azul activa o gris inactiva.",
      },
      {
        prop: "title / icon",
        type: "ReactNode",
        default: "—",
        description: "Texto e icono de 16×16.",
      },
      {
        prop: "maximized",
        type: "boolean",
        default: "false",
        description: "Muestra el glifo Restaurar.",
      },
      {
        prop: "onClose / onMinimize / onMaximize",
        type: "() => void",
        default: "—",
        description: "Si falta el manejador, el control es inerte.",
      },
    ],
    notes: [
      "Window.TitleBar envuelve este componente e inyecta el estado activo.",
      "Los controles tienen aria-label y foco punteado.",
      "Los controles sin handler se renderizan como decoración inerte.",
    ],
  },
  {
    slug: "taskbar",
    title: "Taskbar",
    description:
      "Barra de tareas con botón Inicio, botones de tarea, separador y bandeja del sistema.",
    install: "npx deskui add taskbar",
    preview: <TaskbarPreview />,
    code: taskbarCode,
    props: [
      {
        prop: "Taskbar",
        type: "HTMLElement",
        default: "—",
        description: "Barra base de 28 px (32 en móvil).",
      },
      {
        prop: "TaskbarStart",
        type: "Button",
        default: "—",
        description: "Botón Inicio con icono.",
      },
      {
        prop: "TaskbarItem active",
        type: "boolean",
        default: "false",
        description: "Botón de tarea hundido cuando está activo.",
      },
      {
        prop: "TaskbarTray",
        type: "HTMLDivElement",
        default: "—",
        description: "Campo hundido para reloj e iconos.",
      },
    ],
    notes: [
      "Es una barra presentacional: el menú Inicio y el Window Manager se construyen encima.",
      "TaskbarStart/TaskbarItem usan Button, por lo que heredan foco y estados.",
      "La altura sube a 32 px en móvil para mantener áreas táctiles.",
    ],
  },
  {
    slug: "panel",
    title: "Panel",
    description:
      "Contenedor clásico con bisel configurable y estructura opcional de cabecera, cuerpo y pie.",
    install: "npx deskui add panel",
    preview: <PanelPreview />,
    code: panelCode,
    props: [
      {
        prop: "variant",
        type: '"raised" | "sunken" | "window" | "flat"',
        default: '"raised"',
        description: "Receta de bisel o borde plano.",
      },
      {
        prop: "padding",
        type: '"none" | "sm" | "md" | "lg"',
        default: '"md"',
        description: "Relleno interior del panel.",
      },
      {
        prop: "PanelHeader / PanelTitle",
        type: "div / h2",
        default: "—",
        description: "Cabecera con borde inferior y título de 12 px.",
      },
      {
        prop: "PanelBody / PanelFooter",
        type: "div",
        default: "—",
        description: "Cuerpo flexible y pie alineado a la derecha.",
      },
    ],
    notes: [
      "Panel es presentacional: elige el elemento semántico que envuelva o añade role/aria-label.",
      "La variante window añade el marco de 3 px de Window sin su barra de título.",
      "Usa padding none cuando el contenido necesite controlar sus propios márgenes.",
    ],
  },
  {
    slug: "card",
    title: "Card",
    description:
      "Tarjeta elevada para catálogos y showcases, con cabecera, título, descripción, contenido y pie.",
    install: "npx deskui add card",
    preview: <CardPreview />,
    code: cardCode,
    props: [
      {
        prop: "Card",
        type: "HTMLElement",
        default: "—",
        description: "Artículo con bisel elevado y layout en columna.",
      },
      {
        prop: "CardTitle",
        type: "h3",
        default: "—",
        description: "Título de la tarjeta; ajusta el nivel con el contexto.",
      },
      {
        prop: "CardDescription",
        type: "p",
        default: "—",
        description: "Texto secundario bajo el título.",
      },
      {
        prop: "CardFooter",
        type: "div",
        default: "—",
        description: "Acciones o metadatos alineados a la derecha.",
      },
    ],
    notes: [
      "Card renderiza un article; añade aria-label o aria-labelledby cuando haya varias tarjetas.",
      "El título es h3 por defecto: mantén una jerarquía de encabezados coherente en la página.",
      "La tarjeta no es interactiva por sí misma; si lo es, envuelve el título en un enlace o botón.",
    ],
  },
  {
    slug: "separator",
    title: "Separator",
    description:
      "Línea horizontal o vertical con la ranura clásica de sombra y luz, sin imágenes ni bordes redondeados.",
    install: "npx deskui add separator",
    preview: <SeparatorPreview />,
    code: separatorCode,
    props: [
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Dirección de la línea.",
      },
      {
        prop: "decorative",
        type: "boolean",
        default: "false",
        description: "Oculta el separador a lectores de pantalla.",
      },
    ],
    notes: [
      "Por defecto expone role=separator y aria-orientation.",
      "Marca decorative cuando la separación sea solo visual para evitar ruido en el lector.",
      "En vertical necesita altura definida por el contenedor (self-stretch).",
    ],
  },
  {
    slug: "toolbar",
    title: "Toolbar",
    description:
      "Barra de herramientas con grupos, separadores, botones de alternancia y navegación por flechas.",
    install: "npx deskui add toolbar",
    preview: <ToolbarPreview />,
    code: toolbarCode,
    props: [
      {
        prop: "orientation",
        type: '"horizontal" | "vertical"',
        default: '"horizontal"',
        description: "Dirección de la barra y de las flechas.",
      },
      {
        prop: "ToolbarButton pressed",
        type: "boolean",
        default: "—",
        description: "Añade aria-pressed y el estado hundido.",
      },
      {
        prop: "ToolbarGroup",
        type: "div",
        default: "—",
        description: "Grupo con role=group y nombre opcional.",
      },
      {
        prop: "ToolbarSeparator",
        type: "Separator",
        default: "—",
        description: "Separador vertical decorativo.",
      },
    ],
    notes: [
      "Toolbar expone role=toolbar; añade siempre aria-label.",
      "Las flechas recorren los botones, Home/End van al primero/último y Tab sigue funcionando.",
      "Los botones que solo muestran un icono necesitan aria-label.",
      "ToolbarButton tamaño sm mantiene 22 px en escritorio y 24 px en móvil.",
    ],
  },
  {
    slug: "desktop",
    title: "Desktop",
    description:
      "Lienzo de escritorio con iconos seleccionables, apertura por doble clic o Enter y arrastre opcional.",
    install: "npx deskui add desktop",
    preview: <DesktopPreview />,
    code: desktopCode,
    props: [
      {
        prop: "Desktop",
        type: "HTMLDivElement",
        default: "—",
        description: "Región de escritorio con fondo y recorte.",
      },
      {
        prop: "DesktopIcons",
        type: "HTMLDivElement",
        default: "—",
        description: "Capa que coloca los iconos en columna.",
      },
      {
        prop: "DesktopIcon label / icon",
        type: "string / ReactNode",
        default: "—",
        description: "Nombre accesible e icono de 32 px.",
      },
      {
        prop: "selected / onSelect / onOpen",
        type: "boolean / () => void",
        default: "false / —",
        description: "Selección, apertura por doble clic o Enter.",
      },
      {
        prop: "draggable / defaultPosition",
        type: "boolean / { x, y }",
        default: "false / —",
        description: "Activa el arrastre y la posición absoluta.",
      },
    ],
    notes: [
      "Desktop expone role=region; pásale un aria-label descriptivo.",
      "Enter abre el icono y Space lo selecciona; con draggable, Ctrl+flechas lo mueven 8 px.",
      "El arrastre se limita a los límites del Desktop y no abre el icono si hubo movimiento.",
      "Puedes usar DesktopIcons para una columna estática y colocar iconos absolutos en la misma capa.",
    ],
  },
  {
    slug: "start-menu",
    title: "StartMenu",
    description:
      "Menú Inicio con barra lateral, atajos y submenús en cascada sobre Radix DropdownMenu.",
    install: "npx deskui add start-menu",
    preview: <StartMenuPreview />,
    code: startMenuCode,
    props: [
      {
        prop: "StartMenu / Trigger / Content",
        type: "Radix DropdownMenu",
        default: "—",
        description: "Raíz controlada o no controlada, disparador y panel.",
      },
      {
        prop: "StartMenuItem",
        type: "menuitem",
        default: "—",
        description: "Acción del menú con icono, atajo y estado disabled.",
      },
      {
        prop: "StartMenuSub / SubTrigger / SubContent",
        type: "Radix Sub",
        default: "—",
        description: "Submenú en cascada con apertura por teclado.",
      },
      {
        prop: "StartMenuSidebar",
        type: "div",
        default: '"DeskUI"',
        description: "Franja vertical decorativa con el nombre del sistema.",
      },
    ],
    notes: [
      "Usa StartMenuTrigger asChild sobre el botón Inicio de la Taskbar.",
      "Radix aporta role=menu, flechas, typeahead, Escape y cierre al hacer clic fuera.",
      "La barra lateral es decorativa y queda oculta para lectores de pantalla.",
      "Los submenús se abren con ArrowRight y se recorren con ArrowDown.",
    ],
  },
  {
    slug: "window-manager",
    title: "WindowManager",
    description:
      "Gestor de ventanas con arrastre, resize, foco, z-index, minimizar, maximizar/restaurar y cerrar.",
    install: "npx deskui add window-manager",
    preview: <WindowManagerPreview />,
    code: windowManagerCode,
    props: [
      {
        prop: "windows",
        type: "WindowManagerWindow[]",
        default: "—",
        description: "id, title, icon, content, posición, tamaño y mínimos.",
      },
      {
        prop: "onStateChange",
        type: "(snapshot) => void",
        default: "—",
        description: "Estado visible para taskbar: abierto, minimizado, foco.",
      },
      {
        prop: "ref",
        type: "WindowManagerHandle",
        default: "—",
        description: "focus, minimize, restore, close, open y toggleMaximize.",
      },
      {
        prop: "onWindowClose",
        type: "(id: string) => void",
        default: "—",
        description: "Notificación al cerrar desde la barra de título.",
      },
    ],
    notes: [
      "Arrastra desde la barra de título; los ocho bordes permiten redimensionar.",
      "Doble clic en la barra de título maximiza o restaura.",
      "Con la barra enfocada, las flechas mueven 8 px y Shift+flechas redimensionan.",
      "El z-index se deriva del orden de foco; las ventanas minimizadas salen del layout y del árbol accesible.",
      "Para una taskbar, combina onStateChange con el ref: minimizar, restaurar y enfocar.",
    ],
  },
  {
    slug: "file-explorer",
    title: "FileExplorer",
    description:
      "Explorador de archivos con árbol de carpetas, historial, selección y vistas de iconos, lista y detalles.",
    install: "npx deskui add file-explorer",
    preview: <FileExplorerPreview />,
    code: fileExplorerCode,
    props: [
      {
        prop: "root",
        type: "FileExplorerItem",
        default: "—",
        description: "Árbol de carpetas y archivos con id, nombre y metadatos.",
      },
      {
        prop: "view / defaultView",
        type: '"icons" | "list" | "details"',
        default: '"icons"',
        description: "Vista controlada o inicial.",
      },
      {
        prop: "onSelect / onOpen",
        type: "(item) => void",
        default: "—",
        description: "Selección y apertura de archivos o carpetas.",
      },
      {
        prop: "onFolderChange",
        type: "(folder) => void",
        default: "—",
        description: "Navegación por el árbol, historial o doble clic.",
      },
    ],
    notes: [
      "El árbol de carpetas usa TreeView y conserva las flechas, Home/End y Enter.",
      "Doble clic o Enter abre carpetas; los archivos disparan onOpen.",
      "Las vistas de iconos, lista y detalles comparten la misma selección.",
      "Atrás/Adelante mantienen un historial propio; Arriba sube al padre.",
    ],
  },
  {
    slug: "wizard",
    title: "Wizard",
    description:
      "Asistente por pasos con indicador de progreso, validación opcional, Atrás/Siguiente, Finalizar y Cancelar.",
    install: "npx deskui add wizard",
    preview: <WizardPreview />,
    code: wizardCode,
    props: [
      {
        prop: "steps",
        type: "WizardStep[]",
        default: "—",
        description: "id, título, descripción y contenido de cada paso.",
      },
      {
        prop: "step / defaultStep",
        type: "number",
        default: "0",
        description: "Paso controlado o inicial.",
      },
      {
        prop: "canGoNext",
        type: "(step, index) => boolean",
        default: "true",
        description: "Bloquea Siguiente para validar el paso actual.",
      },
      {
        prop: "onComplete / onCancel",
        type: "() => void",
        default: "—",
        description: "Acciones de finalización y cancelación.",
      },
    ],
    notes: [
      "El paso activo se marca con aria-current=step y el contenido se anuncia con aria-live.",
      "Atrás se deshabilita en el primer paso; Finalizar sustituye a Siguiente en el último.",
      "Usa canGoNext para validar formularios sin acoplar el Wizard a una librería.",
      "El componente es contenido: colócalo dentro de Window o de un Dialog.",
    ],
  },
  {
    slug: "properties-dialog",
    title: "PropertiesDialog",
    description:
      "Diálogo de propiedades con pestañas, botones Aplicar/Cancelar/Aceptar y foco atrapado del Dialog nativo.",
    install: "npx deskui add properties-dialog",
    preview: <PropertiesDialogPreview />,
    code: propertiesCode,
    props: [
      {
        prop: "open / onOpenChange",
        type: "boolean / (open) => void",
        default: "—",
        description: "Controla el diálogo modal.",
      },
      {
        prop: "tabs",
        type: "PropertiesTab[]",
        default: "—",
        description: "id, etiqueta y contenido de cada pestaña.",
      },
      {
        prop: "onApply / onOk / onCancel",
        type: "() => void",
        default: "—",
        description: "Acciones de los botones inferiores.",
      },
      {
        prop: "defaultTab / tab",
        type: "string",
        default: "primera pestaña",
        description: "Pestaña inicial o controlada.",
      },
    ],
    notes: [
      "Usa Dialog con <dialog> nativo: Escape, backdrop y foco atrapado.",
      "Aplicar se deshabilita si no se pasa onApply.",
      "Aceptar aplica, confirma y cierra; Cancelar cierra sin aplicar.",
      "Las pestañas usan Radix Tabs y conservan la navegación por flechas.",
    ],
  },
  {
    slug: "notepad",
    title: "Notepad",
    description:
      "Editor de texto tipo Bloc de notas con menú Archivo/Edición/Formato, ajuste de línea, atajos y estado.",
    install: "npx deskui add notepad",
    preview: <NotepadPreview />,
    code: notepadCode,
    props: [
      {
        prop: "value / defaultValue",
        type: "string",
        default: '""',
        description: "Contenido controlado o inicial.",
      },
      {
        prop: "fileName",
        type: "string",
        default: '"Sin título"',
        description: "Nombre mostrado en la barra de estado.",
      },
      {
        prop: "onSave / onNew / onOpen",
        type: "(value?) => void",
        default: "—",
        description: "Acciones del menú y atajos Ctrl+S/N/O.",
      },
      {
        prop: "showMenuBar",
        type: "boolean",
        default: "true",
        description: "Permite usar solo el editor dentro de otra ventana.",
      },
    ],
    notes: [
      "Es contenido de ventana: no incluye la barra de título.",
      "Ctrl+S guarda, Ctrl+N crea un documento vacío y Ctrl+O abre.",
      "El ajuste de línea se alterna desde el menú Formato y se refleja en el estado.",
      "El editor usa una fuente monoespaciada y conserva selección y scroll nativos.",
    ],
  },
  {
    slug: "terminal",
    title: "Terminal",
    description:
      "Terminal MS-DOS con comandos internos, comandos personalizados, historial y anuncio accesible de la salida.",
    install: "npx deskui add terminal",
    preview: <TerminalPreview />,
    code: terminalCode,
    props: [
      {
        prop: "prompt",
        type: "string",
        default: '"C:\\\\>"',
        description: "Texto del indicador de entrada.",
      },
      {
        prop: "commands",
        type: "Record<string, TerminalCommand>",
        default: "—",
        description: "Comandos personalizados que reciben args y clear.",
      },
      {
        prop: "initialLines / onCommand",
        type: "TerminalLine[] / (input) => void",
        default: "—",
        description: "Salida inicial y observador de comandos.",
      },
      {
        prop: "autoFocus",
        type: "boolean",
        default: "false",
        description: "Enfoca la entrada al montar.",
      },
    ],
    notes: [
      "Incluye help, ver, cls, dir y echo; los comandos personalizados tienen prioridad.",
      "La salida usa role=log y aria-live=polite.",
      "El foco se mantiene en la entrada después de cada comando.",
      "Los colores salen de tokens de terminal, con overrides para alto contraste.",
    ],
  },
  {
    slug: "blue-screen",
    title: "BlueScreen",
    description:
      "Pantalla azul de error clásica con mensaje, código, pista y acción de reinicio.",
    install: "npx deskui add blue-screen",
    preview: <BlueScreenPreview />,
    code: blueScreenCode,
    props: [
      {
        prop: "title / message",
        type: "string / ReactNode",
        default: "DeskUI / error fatal",
        description: "Encabezado y cuerpo del error.",
      },
      {
        prop: "code",
        type: "string",
        default: "ERROR 0E : 016F : BFF9B3D4",
        description: "Código mostrado en el marco.",
      },
      {
        prop: "hint",
        type: "string",
        default: "Pulsa cualquier tecla...",
        description: "Indicación para continuar.",
      },
      {
        prop: "onRestart / restartLabel",
        type: "() => void / string",
        default: "— / Reiniciar",
        description: "Acción opcional de reinicio.",
      },
    ],
    notes: [
      "Expone role=alert para anunciar el error de inmediato.",
      "Usa tokens de acento e inverso; el alto contraste mantiene la legibilidad.",
      "Sin onRestart no se muestra ningún botón inerte.",
      "Es un bloque presentacional: el consumidor decide si ocupa toda la pantalla.",
    ],
  },
  {
    slug: "screensaver",
    title: "Screensaver",
    description:
      "Salvapantallas con campo de estrellas animado, cierre por clic o teclado y respeto de reduced motion.",
    install: "npx deskui add screensaver",
    preview: <ScreensaverPreview />,
    code: screensaverCode,
    props: [
      {
        prop: "title / hint",
        type: "string",
        default: "DeskUI / mueve el ratón...",
        description: "Texto central e instrucción de salida.",
      },
      {
        prop: "starCount",
        type: "number",
        default: "48",
        description: "Número de estrellas dibujadas.",
      },
      {
        prop: "onDismiss",
        type: "() => void",
        default: "—",
        description: "Se llama al hacer clic, Escape, Enter o Space.",
      },
    ],
    notes: [
      "La animación se desactiva con prefers-reduced-motion.",
      "El bloque es focusable y se anuncia como botón de salida.",
      "No captura el puntero ni bloquea la página; el consumidor decide cuándo mostrarlo.",
      "Los colores usan los tokens de tinta e inverso del tema activo.",
    ],
  },
  {
    slug: "minesweeper",
    title: "Minesweeper",
    description:
      "Buscaminas jugable con minas, banderas, temporizador, contador, reinicio y tablero determinista opcional.",
    install: "npx deskui add minesweeper",
    preview: <MinesweeperPreview />,
    code: minesweeperCode,
    props: [
      {
        prop: "rows / cols / mines",
        type: "number",
        default: "9 / 9 / 10",
        description: "Dimensiones y número de minas del tablero.",
      },
      {
        prop: "layout",
        type: "string[]",
        default: "—",
        description: "Mapa determinista con * (mina) y . (seguro).",
      },
      {
        prop: "seed",
        type: "number",
        default: "1",
        description: "Semilla del generador para partidas reproducibles.",
      },
      {
        prop: "onWin / onLose",
        type: "(elapsed?) => void",
        default: "—",
        description: "Resultado de la partida.",
      },
    ],
    notes: [
      "Clic descubre, clic derecho o F marca bandera; el teclado recorre las celdas.",
      "Cada celda expone fila, columna y estado en su nombre accesible.",
      "El temporizador empieza al descubrir la primera celda y se detiene al terminar.",
      "Usa layout para demos y tests deterministas; el reinicio cambia la semilla.",
    ],
  },
];

/**
 * Devuelve la ficha en el idioma pedido. El español vive en este archivo y el
 * inglés en un overlay para mantener una sola fuente de estructura.
 */
export function findComponentDoc(slug: string, locale: Locale = "es") {
  const doc = COMPONENT_DOCS.find((entry) => entry.slug === slug);
  if (!doc || locale === "es") {
    return doc;
  }

  const translation = COMPONENT_DOCS_EN[slug as keyof typeof COMPONENT_DOCS_EN];
  if (!translation) {
    return doc;
  }

  return {
    ...doc,
    description: translation.description,
    code: translation.code,
    props: doc.props.map((row, index) => ({
      ...row,
      description: translation.props[index] ?? row.description,
    })),
    notes: translation.notes,
  };
}
