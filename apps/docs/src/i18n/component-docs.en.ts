import type { ComponentDocSlug } from "./component-slugs";

export interface ComponentDocTranslation {
  description: string;
  props: string[];
  notes: string[];
  code: string;
}

export const COMPONENT_DOCS_EN: Record<ComponentDocSlug, ComponentDocTranslation> = {
  button: {
    description:
      "Classic beveled button with variants, pressed state, and dotted focus. The primary button uses the thick black ring of the default button.",
    props: [
      "Standard bevel, thick ring, or square icon button.",
      "Heights of 21/23/27 px; 24 px on mobile.",
      "Renders the child (for example, a link) with the button style.",
      "Enables the sunken toggle state.",
      "Engraved text and no interaction.",
    ],
    notes: [
      "The default type is button so forms are not submitted accidentally.",
      "An icon-only button needs an aria-label.",
      "The active state is handled by native CSS; there is no extra React state.",
    ],
    code: `<Button>Cancel</Button>
<Button variant="primary">OK</Button>
<Button disabled>Disabled</Button>

<Button variant="icon" size="icon" aria-label="Open folder">
  <FolderIcon />
</Button>

<Button aria-pressed={pressed} onClick={() => setPressed(!pressed)}>
  Bold
</Button>`,
  },
  input: {
    description:
      "Sunken text field with a 2 px border, blue selection, and inner dotted focus. It keeps all native <input> attributes.",
    props: [
      "Any native input type.",
      "Gray background and normal text, not editable.",
      "Gray background and engraved text.",
      "Helper text in the secondary color.",
      "Reserved for the error variant in the next phase.",
    ],
    notes: [
      "Always associate a label using Label and htmlFor/id.",
      "Focus is a dotted rectangle, not a modern ring.",
      "On mobile the height increases to 24 px for easier tapping.",
    ],
    code: `<Label htmlFor="usuario">User name</Label>
<Input id="usuario" defaultValue="usuario95" />

<Label htmlFor="dominio">Domain</Label>
<Input id="dominio" value="WORK" readOnly />`,
  },
  label: {
    description:
      "Compact form label that preserves the typography and density of the classic interface.",
    props: ["Id of the associated control.", "Additional merged classes."],
    notes: [
      "It does not wrap the control by default; use htmlFor/id.",
      "It can wrap a Checkbox when the text is part of the control.",
    ],
    code: `<Label htmlFor="grupo">Workgroup</Label>
<Input id="grupo" placeholder="WORK" />`,
  },
  "group-box": {
    description:
      "Classic fieldset with the legend over the top border. The legend background masks the line and creates the traditional notch.",
    props: [
      "Visible title and accessible name of the fieldset.",
      "Additional classes for the fieldset.",
    ],
    notes: [
      "Uses fieldset/legend: the group has an accessible name and form semantics.",
      "The legend masks the top line without leaving the text on the border.",
      "It can be nested in Window.Body or used to group form controls.",
    ],
    code: `<GroupBox legend="Installation options">
  <Checkbox defaultChecked>Create shortcut</Checkbox>
  <Checkbox>Sign in</Checkbox>
</GroupBox>`,
  },
  checkbox: {
    description:
      "Native 13×13 px checkbox with a pixelated check. The real input remains accessible to the keyboard and forms.",
    props: [
      "Controlled or uncontrolled state.",
      "Native input handler.",
      "Gray box and engraved text.",
      "Visible text; it also serves as the accessible name.",
    ],
    notes: [
      "The native input is overlaid and preserves keyboard, forms, and screen readers.",
      "The space bar toggles the state when the input has focus.",
      "The minimum touch target is 24 px on mobile.",
    ],
    code: `<Checkbox defaultChecked>Remember password</Checkbox>
<Checkbox>Show hidden files</Checkbox>
<Checkbox disabled>Not available</Checkbox>`,
  },
  textarea: {
    description:
      "Sunken text area, vertically resizable, with the same typography and focus as Input.",
    props: [
      "Initial number of rows.",
      "Gray background, not editable.",
      "Gray background and engraved text.",
    ],
    notes: [
      "The minimum height is 60 px and resizing is vertical.",
      "It shares focus and bevel tokens with Input.",
    ],
    code: `<Label htmlFor="notas">Notes</Label>
<Textarea id="notas" rows={4} placeholder="Write here..." />`,
  },
  window: {
    description:
      "Composable window with TitleBar, Body, and StatusBar. Controls without a handler are drawn inert, never as broken buttons.",
    props: [
      "Blue or gray title bar.",
      "Visible title; children take priority.",
      "Changes the maximize glyph to restore.",
      "If missing, the control is rendered inert.",
      "Applies the classic 8 px margin.",
    ],
    notes: [
      "The root element is section; use role=dialog for dialogs.",
      "Controls have aria-label and dotted focus.",
      "WindowManager adds dragging and resizing on top of this base.",
    ],
    code: `<Window active={false}>
  <Window.TitleBar title="Untitled - Notepad" icon={<NoteIcon />} />
  <Window.Body>
    <p>Hello, world.</p>
  </Window.Body>
</Window>`,
  },
  dialog: {
    description:
      "Modal dialog built on native <dialog>: trapped focus, Escape, backdrop, and focus return with no external dependencies.",
    props: [
      "Controls whether the modal is open.",
      "Called when closing with Escape or the close control.",
      "Title bar text and accessible name.",
      "16×16 icon in the title bar.",
      "Actions aligned to the right.",
      "Shows the close control.",
      "Closes when the backdrop is pressed; not by default.",
    ],
    notes: [
      "Escape closes the dialog natively.",
      "Focus is restored to the element that opened the modal.",
      "The backdrop does not close by default to honor classic behavior.",
    ],
    code: `const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open message</Button>

<Dialog
  open={open}
  onOpenChange={setOpen}
  title="Message"
  icon={<WarningIcon />}
  footer={
    <>
      <Button size="sm" onClick={() => setOpen(false)}>Cancel</Button>
      <Button size="sm" variant="primary" onClick={() => setOpen(false)}>
        OK
      </Button>
    </>
  }
>
  <p>Do you want to continue?</p>
</Dialog>`,
  },
  "radio-group": {
    description:
      "Group of native radios with the classic 12 px beveled circle and a 4 px dot. It keeps keyboard arrows and form behavior.",
    props: [
      "Selected value, controlled or uncontrolled.",
      "Called when an option is selected.",
      "Native name shared by the radios.",
      "Disables all items.",
      "Option value; children is its label.",
    ],
    notes: [
      "Uses native radios: arrows, focus, and forms work without extra logic.",
      "The group needs an accessible name via aria-label or aria-labelledby.",
      "The minimum touch target is 24 px on mobile.",
    ],
    code: `<RadioGroup defaultValue="basico" aria-label="Plan">
  <RadioGroupItem value="basico">Basic — 10 MB</RadioGroupItem>
  <RadioGroupItem value="pro">Pro — 50 MB</RadioGroupItem>
  <RadioGroupItem value="servidor" disabled>
    Server — license required
  </RadioGroupItem>
</RadioGroup>`,
  },
  select: {
    description:
      "Native select with a sunken field and raised arrow button. It preserves native behavior and avoids a Radix dependency for a basic control.",
    props: [
      "Selected value.",
      "Gray field and no interaction.",
      "Native <option> elements.",
    ],
    notes: [
      "Because it is based on <select>, the keyboard and screen readers work natively.",
      "It is not intended for multiple; use ListBox for multiple selection.",
      "The arrow button is visual; the entire select remains the interactive control.",
    ],
    code: `<Label htmlFor="dominio">Domain</Label>
<Select id="dominio" defaultValue="trabajo">
  <option value="trabajo">WORK</option>
  <option value="casa">HOME</option>
</Select>`,
  },
  switch: {
    description:
      "Retro switch with a sunken track and raised knob. It is a native button with role=switch, so Space and Enter work.",
    props: [
      "Controlled or uncontrolled state.",
      "Called when toggled.",
      "Disables the control.",
      "Visible text and accessible name.",
    ],
    notes: [
      "The control has role=switch and aria-checked.",
      "It does not use a transition: the state changes instantly.",
      "For classic forms, Checkbox is still the most faithful option.",
    ],
    code: `<Switch defaultChecked>Safe mode</Switch>
<Switch>Check for updates</Switch>
<Switch disabled>Not available</Switch>`,
  },
  slider: {
    description:
      "Native slider with a sunken 4 px track and an 11×21 px rectangular thumb, as in the control panels of the era.",
    props: [
      "Native input range.",
      "Control value.",
      "Native handler.",
      "Disables the control.",
    ],
    notes: [
      "Uses input[type=range], so keyboard arrows work natively.",
      "The track and thumb are styled in tokens.css for WebKit and Firefox.",
      "The thumb is 11×21 px on desktop and keeps the classic density.",
    ],
    code: `<Label htmlFor="volumen">Volume</Label>
<Slider
  id="volumen"
  min={0}
  max={100}
  defaultValue={60}
  onChange={(event) => setVolume(Number(event.target.value))}
/>`,
  },
  form: {
    description:
      "React Hook Form and Zod integration. FormField connects the control, FormControl propagates id/ARIA, and FormMessage shows accessible errors.",
    props: [
      "React Hook Form provider.",
      "Connects a field with its control.",
      "Groups label, control, description, and message.",
      "Injects id and ARIA into the child input.",
      "Shows the Zod error with role=alert.",
    ],
    notes: [
      "FormControl uses Radix Slot to propagate id, aria-invalid, and aria-describedby.",
      "FormLabel associates the label with the control automatically.",
      "The component does not impose a schema: you can use Zod, Yup, or native validation.",
    ],
    code: `const schema = z.object({
  usuario: z.string().min(3, "At least 3 characters"),
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
          <FormLabel>User</FormLabel>
          <FormControl>
            <Input placeholder="usuario95" {...field} />
          </FormControl>
          <FormDescription>At least 3 characters.</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit" variant="primary">Sign in</Button>
  </form>
</Form>`,
  },
  tabs: {
    description:
      "Property tabs built on Radix Tabs. The active tab merges with the panel and the keyboard navigates with arrows.",
    props: [
      "Active tab, uncontrolled or controlled.",
      "Called when changing tabs.",
      "Tab identifier.",
      "Panel associated with the tab.",
    ],
    notes: [
      "Radix provides roles, aria-selected, arrows, Home, and End.",
      "The active tab removes its bottom border to join the panel.",
      "The panel is focusable when Radix requires it.",
    ],
    code: `<Tabs defaultValue="general">
  <TabsList aria-label="Properties">
    <TabsTrigger value="general">General</TabsTrigger>
    <TabsTrigger value="apariencia">Appearance</TabsTrigger>
  </TabsList>
  <TabsContent value="general">
    <Label htmlFor="nombre">Name</Label>
    <Input id="nombre" defaultValue="PC-01" />
  </TabsContent>
  <TabsContent value="apariencia">
    <Checkbox defaultChecked>Show desktop icons</Checkbox>
  </TabsContent>
</Tabs>`,
  },
  "scroll-area": {
    description:
      "Container with native scrolling and a classic 16 px scrollbar with arrows, a hatched track, and a square thumb. The viewport is focusable so the keyboard can scroll the content.",
    props: [
      "Axes with scrolling.",
      "Classes for the inner viewport.",
      "Scrollable content.",
    ],
    notes: [
      "The viewport has tabIndex=0 for keyboard navigation.",
      "Arrows, track, and thumb are custom: they keep the 16 px geometry in all browsers.",
      "Arrows and track advance as in the classic interface; the thumb is dragged with the pointer.",
      "Add a height or max-height to the container to limit the area.",
    ],
    code: `<ScrollArea className="bevel-field h-32 bg-surface-sunken">
  <ul className="p-2">
    <li>Document 01.txt</li>
    <li>Document 02.txt</li>
    <li>Document 03.txt</li>
  </ul>
</ScrollArea>`,
  },
  badge: {
    description:
      "Compact beveled label with a semantic status dot. The text always uses the ink color to maintain contrast.",
    props: ["Status dot color.", "Label text."],
    notes: [
      "The text is always readable; the semantic color goes in a decorative dot.",
      "It does not use border-radius, in line with the rest of the system.",
    ],
    code: `<Badge>New</Badge>
<Badge variant="info">Info</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Error</Badge>`,
  },
  alert: {
    description:
      "Notice with a window frame and a semantic stripe. Compose the content with AlertTitle and AlertDescription.",
    props: [
      "Side stripe color.",
      "Optional icon on the left.",
      "Notice title and body.",
    ],
    notes: [
      "The container has role=alert; use it for messages that should be announced.",
      "The text stays on the surface to preserve contrast.",
    ],
    code: `<Alert variant="warning" icon={<WarningIcon />}>
  <AlertTitle>Warning</AlertTitle>
  <AlertDescription>The file already exists.</AlertDescription>
</Alert>`,
  },
  toast: {
    description:
      "Tray notifications with a global provider, manual dismissal, and configurable auto-close.",
    props: [
      "Wraps the application and renders the viewport.",
      "Adds a notification and returns its id.",
      "Duration per notification; 0 keeps it open.",
    ],
    notes: [
      "The viewport uses aria-live=polite and each toast uses role=status.",
      "The close button has an accessible name.",
      "In the documentation the provider wraps the entire application.",
    ],
    code: `const { toast } = useToast();

<Button
  onClick={() =>
    toast({
      title: "Copy complete",
      description: "12 files copied.",
    })
  }
>
  Show notification
</Button>`,
  },
  "progress-bar": {
    description:
      "Sunken progress bar with blue blocks separated by one pixel, as in classic installers.",
    props: [
      "Current value, clamped between 0 and max.",
      "Maximum value.",
      "Shows separated blocks or a solid bar.",
    ],
    notes: [
      "Exposes role=progressbar and aria-valuenow/min/max.",
      "The block pattern is defined in tokens.css.",
    ],
    code: `<ProgressBar aria-label="Copying files" value={35} />
<ProgressBar aria-label="Installation" value={70} />`,
  },
  tooltip: {
    description:
      "Classic yellow tooltip built on Radix Tooltip. It appears on hover or focus and closes with Escape.",
    props: [
      "Delay before showing.",
      "Uses the child as the trigger.",
      "Distance from the trigger.",
    ],
    notes: [
      "Radix manages the tooltip role, focus, and Escape.",
      "The background color is --w95-tooltip and adapts to themes.",
    ],
    code: `<Tooltip>
  <TooltipTrigger asChild>
    <Button>Save</Button>
  </TooltipTrigger>
  <TooltipContent>Save changes (Ctrl+S)</TooltipContent>
</Tooltip>`,
  },
  "menu-bar": {
    description:
      "Window menu bar built on Radix Menubar. It supports the keyboard, submenus, and visual shortcuts.",
    props: [
      "Container with role=menubar.",
      "Menu title and dropdown content.",
      "Action of an entry.",
      "Shortcut aligned to the right.",
    ],
    notes: [
      "Radix provides arrow navigation, Home/End, Escape, and submenus.",
      "Highlighted entries use selection blue and white text.",
    ],
    code: `<MenuBar aria-label="Application">
  <MenuBarMenu label="File">
    <MenuBarItem onSelect={nuevo}>
      New
      <MenuBarShortcut>Ctrl+N</MenuBarShortcut>
    </MenuBarItem>
    <MenuBarSeparator />
    <MenuBarItem onSelect={salir}>Exit</MenuBarItem>
  </MenuBarMenu>
</MenuBar>`,
  },
  "dropdown-menu": {
    description:
      "Classic dropdown menu built on Radix DropdownMenu, with labels, shortcuts, separators, and disabled actions.",
    props: [
      "Uses the child as the trigger.",
      "Panel alignment.",
      "Entry action.",
    ],
    notes: [
      "Radix manages keyboard, focus, and portal.",
      "The panel uses the raised bevel and entries use selection blue.",
    ],
    code: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>Rename</DropdownMenuItem>
    <DropdownMenuItem>Move to...</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
  },
  "context-menu": {
    description:
      "Context menu built on Radix. It opens with a right-click and shares the visual language of MenuBar and DropdownMenu.",
    props: [
      "Area that opens the menu on right-click.",
      "Floating panel.",
      "Entry action.",
    ],
    notes: [
      "Radix manages position, focus, and closing with Escape.",
      "The menu is rendered in a portal so it is not clipped.",
    ],
    code: `<ContextMenu>
  <ContextMenuTrigger asChild>
    <div>Right-click here</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Copy</ContextMenuItem>
    <ContextMenuItem>Paste</ContextMenuItem>
    <ContextMenuSeparator />
    <ContextMenuItem>Properties</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`,
  },
  breadcrumb: {
    description:
      "Breadcrumbs with links, current page, and classic separators. Useful for documentation or explorer navigation.",
    props: [
      "Navigation with aria-label=breadcrumb.",
      "Link to a previous level.",
      "Current level with aria-current=page.",
    ],
    notes: [
      "The separator is decorative and hidden from screen readers.",
      "Use BreadcrumbPage for the last level, not a link.",
    ],
    code: `<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="/componentes">Components</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Button</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
  },
  "tree-view": {
    description:
      "Explorer tree with selection, expansion, and keyboard navigation. Ideal for replicas of the classic explorer.",
    props: [
      "Selected item.",
      "Expanded branches.",
      "Row identifier.",
      "Row text and icon.",
    ],
    notes: [
      "The row has role=treeitem, aria-level, aria-selected, and aria-expanded.",
      "ArrowRight/ArrowLeft expand and collapse; ArrowUp/ArrowDown move focus.",
      "Enter or Space selects the row.",
    ],
    code: `<TreeView aria-label="Explorer" defaultExpanded={["c"]}>
  <TreeItem value="c" label="C:" icon={<FolderIcon />}>
    <TreeItem value="docs" label="Documents" icon={<FolderIcon />}>
      <TreeItem value="carta" label="letter.txt" icon={<NoteIcon />} />
    </TreeItem>
  </TreeItem>
</TreeView>`,
  },
  pagination: {
    description:
      "Classic pagination with Previous/Next buttons, pages, and ellipsis. The current page stays sunken.",
    props: [
      "Current page.",
      "Total number of pages.",
      "Page change.",
      "Visible pages on each side of the current page.",
    ],
    notes: [
      "The current page has aria-current=page.",
      "The previous/next buttons are disabled at the ends.",
    ],
    code: `<Pagination page={page} pageCount={12} onPageChange={setPage} />`,
  },
  table: {
    description:
      "Classic table with a raised, sticky header, white body, compact rows, and blue selection.",
    props: [
      "Classes for the container with bevel and scroll.",
      "Raised, sticky header.",
      "Selected row in blue.",
      "Totals row with a separator.",
    ],
    notes: [
      "The table lives in a container with a bevel and overflow to keep the header fixed.",
      "Selected rows invert the color with selection blue.",
      "The body uses a white background and 14-15 px rows to keep the classic density.",
    ],
    code: `<Table aria-label="Files">
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Size</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow selected>
      <TableCell>letter.txt</TableCell>
      <TableCell>2 KB</TableCell>
    </TableRow>
  </TableBody>
</Table>`,
  },
  "list-box": {
    description:
      "Native list box with several visible rows, sunken bevel, and single or multiple selection.",
    props: [
      "Number of visible rows.",
      "Allows Ctrl/Shift for multiple selection.",
      "Controlled or uncontrolled selection.",
    ],
    notes: [
      "Uses a native select with size; it preserves keyboard, forms, and screen readers.",
      "Focus is marked with the classic dotted rectangle.",
      "The scrollbar uses the system's 16 px style.",
    ],
    code: `<Label htmlFor="archivos">Files</Label>
<ListBox id="archivos" size={5} defaultValue="carta">
  <option value="carta">letter.txt</option>
  <option value="informe">report.doc</option>
  <option value="notas">notes.txt</option>
</ListBox>`,
  },
  "status-bar": {
    description:
      "Status bar with segmented fields and the classic status bevel.",
    props: [
      "Flex container with 1 px separation.",
      "Sunken field with truncation.",
    ],
    notes: [
      "Fields use bevel-status and flex-1; you can set their width with className.",
      "Window.StatusBar reuses this component internally.",
    ],
    code: `<StatusBar aria-label="Status">
  <StatusBarField>Ready</StatusBarField>
  <StatusBarField>3 objects selected</StatusBarField>
  <StatusBarField>1.44 MB</StatusBarField>
</StatusBar>`,
  },
  icon: {
    description:
      "Original set of 16×16 pixel-art icons, scalable to 32×32, with optional accessible names.",
    props: [
      "Icon from the set.",
      "Visual size in pixels.",
      "If present, the icon is announced as an image.",
    ],
    notes: [
      "The icons are original pixel art, not third-party proprietary assets.",
      "Without label they are decorative (aria-hidden); with label they expose role=img.",
      "You can change the color with currentColor on monochrome icons, but the base set uses the classic palette.",
    ],
    code: `<Icon name="folder" label="Folder" />
<Icon name="warning" size={32} label="Warning" />
<Icon name="info" />`,
  },
  "title-bar": {
    description:
      "Reusable title bar outside Window, with icon, controls, and active/inactive states.",
    props: [
      "Active blue or inactive gray.",
      "16×16 text and icon.",
      "Shows the Restore glyph.",
      "If the handler is missing, the control is inert.",
    ],
    notes: [
      "Window.TitleBar wraps this component and injects the active state.",
      "Controls have aria-label and dotted focus.",
      "Controls without a handler are rendered as inert decoration.",
    ],
    code: `<TitleBar
  title="Untitled - Notepad"
  icon={<NoteIcon />}
  onClose={cerrar}
/>`,
  },
  taskbar: {
    description:
      "Taskbar with Start button, task buttons, divider, and system tray.",
    props: [
      "Base bar of 28 px (32 on mobile).",
      "Start button with icon.",
      "Task button sunken when active.",
      "Sunken field for the clock and icons.",
    ],
    notes: [
      "It is a presentational bar: the Start menu and Window Manager are built on top.",
      "TaskbarStart/TaskbarItem use Button, so they inherit focus and states.",
      "The height increases to 32 px on mobile to preserve touch targets.",
    ],
    code: `<Taskbar aria-label="Taskbar">
  <TaskbarStart icon={<BrandMark />}>Start</TaskbarStart>
  <TaskbarDivider />
  <TaskbarItem active icon={<NoteIcon />}>
    Document
  </TaskbarItem>
  <TaskbarTray>12:00</TaskbarTray>
</Taskbar>`,
  },
  panel: {
    description:
      "Classic container with configurable bevel and optional header, body, and footer structure.",
    props: [
      "Bevel recipe or flat border.",
      "Inner panel padding.",
      "Header with bottom border and 12 px title.",
      "Flexible body and right-aligned footer.",
    ],
    notes: [
      "Panel is presentational: choose the semantic element that wraps it or add role/aria-label.",
      "The window variant adds Window's 3 px frame without its title bar.",
      "Use padding none when the content needs to control its own margins.",
    ],
    code: `<Panel>
  <PanelHeader>
    <PanelTitle>System status</PanelTitle>
  </PanelHeader>
  <PanelBody>
    All drivers are loaded.
  </PanelBody>
  <PanelFooter>
    <Button size="sm">Details</Button>
  </PanelFooter>
</Panel>`,
  },
  card: {
    description:
      "Raised card for catalogs and showcases, with header, title, description, content, and footer.",
    props: [
      "Article with raised bevel and column layout.",
      "Card title; adjust the level with the context.",
      "Secondary text below the title.",
      "Actions or metadata aligned to the right.",
    ],
    notes: [
      "Card renders an article; add aria-label or aria-labelledby when there are several cards.",
      "The title is h3 by default: keep a coherent heading hierarchy on the page.",
      "The card is not interactive by itself; if it is, wrap the title in a link or button.",
    ],
    code: `<Card>
  <CardHeader>
    <CardTitle>3.5-inch floppy</CardTitle>
    <CardDescription>Removable storage</CardDescription>
  </CardHeader>
  <CardContent>1.44 MB · High density</CardContent>
  <CardFooter>
    <Badge variant="success">In stock</Badge>
    <Button size="sm" variant="primary">Add</Button>
  </CardFooter>
</Card>`,
  },
  separator: {
    description:
      "Horizontal or vertical line with the classic shadow-and-highlight groove, with no images or rounded borders.",
    props: [
      "Line direction.",
      "Hides the separator from screen readers.",
    ],
    notes: [
      "By default it exposes role=separator and aria-orientation.",
      "Mark decorative when the separation is only visual to avoid reader noise.",
      "When vertical it needs a height defined by the container (self-stretch).",
    ],
    code: `<div className="flex gap-3">
  <span>Source</span>
  <Separator orientation="vertical" />
  <span>Destination</span>
</div>
<Separator />`,
  },
  toolbar: {
    description:
      "Toolbar with groups, separators, toggle buttons, and arrow-key navigation.",
    props: [
      "Direction of the bar and arrows.",
      "Adds aria-pressed and the sunken state.",
      "Group with role=group and optional name.",
      "Decorative vertical separator.",
    ],
    notes: [
      "Toolbar exposes role=toolbar; always add an aria-label.",
      "Arrows move through the buttons, Home/End go to the first/last, and Tab still works.",
      "Buttons that show only an icon need an aria-label.",
      "ToolbarButton size sm stays 22 px on desktop and 24 px on mobile.",
    ],
    code: `<Toolbar aria-label="Text formatting">
  <ToolbarGroup aria-label="Style">
    <ToolbarButton pressed={bold} onClick={toggleBold}>
      N
    </ToolbarButton>
    <ToolbarButton pressed={italic} onClick={toggleItalic}>
      K
    </ToolbarButton>
  </ToolbarGroup>
  <ToolbarSeparator />
  <ToolbarButton variant="icon" size="icon" aria-label="Open folder">
    <FolderIcon />
  </ToolbarButton>
</Toolbar>`,
  },
  desktop: {
    description:
      "Desktop canvas with selectable icons, opening by double-click or Enter, and optional dragging.",
    props: [
      "Desktop region with background and clipping.",
      "Layer that places icons in a column.",
      "Accessible name and 32 px icon.",
      "Selection, opening by double-click or Enter.",
      "Enables dragging and absolute positioning.",
    ],
    notes: [
      "Desktop exposes role=region; give it a descriptive aria-label.",
      "Enter opens the icon and Space selects it; with draggable, Ctrl+arrows move it 8 px.",
      "Dragging is limited to the Desktop bounds and does not open the icon if there was movement.",
      "You can use DesktopIcons for a static column and place absolute icons in the same layer.",
    ],
    code: `<Desktop aria-label="Desktop">
  <DesktopIcons>
    <DesktopIcon
      label="My Computer"
      icon={<Icon name="window" size={32} />}
      selected={selected === "mi-pc"}
      onSelect={() => setSelected("mi-pc")}
      onOpen={() => abrir("mi-pc")}
    />
    <DesktopIcon
      label="Notes"
      icon={<Icon name="note" size={32} />}
      draggable
      defaultPosition={{ x: 190, y: 24 }}
      onSelect={() => setSelected("notas")}
      onOpen={() => abrir("notas")}
    />
  </DesktopIcons>
</Desktop>`,
  },
  "start-menu": {
    description:
      "Start menu with sidebar, shortcuts, and cascading submenus built on Radix DropdownMenu.",
    props: [
      "Controlled or uncontrolled root, trigger, and panel.",
      "Menu action with icon, shortcut, and disabled state.",
      "Cascading submenu with keyboard opening.",
      "Decorative vertical strip with the system name.",
    ],
    notes: [
      "Use StartMenuTrigger asChild on the Taskbar Start button.",
      "Radix provides role=menu, arrows, typeahead, Escape, and close on outside click.",
      "The sidebar is decorative and hidden from screen readers.",
      "Submenus open with ArrowRight and are traversed with ArrowDown.",
    ],
    code: `<StartMenu>
  <StartMenuTrigger asChild>
    <TaskbarStart icon={<BrandMark />}>Start</TaskbarStart>
  </StartMenuTrigger>
  <StartMenuContent>
    <div className="flex">
      <StartMenuSidebar>DeskUI</StartMenuSidebar>
      <div className="min-w-[210px] py-1">
        <StartMenuItem onSelect={abrirProgramas}>
          <FolderIcon /> Programs
        </StartMenuItem>
        <StartMenuSub>
          <StartMenuSubTrigger>Accessories</StartMenuSubTrigger>
          <StartMenuSubContent>
            <StartMenuItem onSelect={abrirBloc}>Notepad</StartMenuItem>
          </StartMenuSubContent>
        </StartMenuSub>
        <StartMenuSeparator />
        <StartMenuItem onSelect={apagar}>Shut down...</StartMenuItem>
      </div>
    </div>
  </StartMenuContent>
</StartMenu>`,
  },
  "window-manager": {
    description:
      "Window manager with dragging, resizing, focus, z-index, minimize, maximize/restore, and close.",
    props: [
      "id, title, icon, content, position, size, and minimums.",
      "State visible to the taskbar: open, minimized, focused.",
      "focus, minimize, restore, close, open, and toggleMaximize.",
      "Notification when closing from the title bar.",
    ],
    notes: [
      "Drag from the title bar; the eight edges allow resizing.",
      "Double-clicking the title bar maximizes or restores.",
      "With the bar focused, arrows move 8 px and Shift+arrows resize.",
      "z-index is derived from focus order; minimized windows leave the layout and the accessible tree.",
      "For a taskbar, combine onStateChange with the ref: minimize, restore, and focus.",
    ],
    code: `const manager = useRef<WindowManagerHandle>(null);

const windows = [
  {
    id: "notas",
    title: "Notepad",
    icon: <NoteIcon />,
    content: <Editor />,
    defaultPosition: { x: 16, y: 16 },
    defaultSize: { width: 280, height: 180 },
  },
];

<WindowManager
  ref={manager}
  aria-label="Desktop"
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
</Taskbar>`,
  },
  "file-explorer": {
    description:
      "File explorer with a folder tree, history, selection, and icon, list, and details views.",
    props: [
      "Folder and file tree with id, name, and metadata.",
      "Controlled or initial view.",
      "Selection and opening of files or folders.",
      "Navigation through the tree, history, or double-click.",
    ],
    notes: [
      "The folder tree uses TreeView and preserves arrows, Home/End, and Enter.",
      "Double-click or Enter opens folders; files trigger onOpen.",
      "Icon, list, and details views share the same selection.",
      "Back/Forward keep their own history; Up goes to the parent.",
    ],
    code: `const root = {
  id: "root",
  name: "C:",
  kind: "folder",
  children: [
    { id: "docs", name: "DOCUMENTS", kind: "folder", children: [...] },
    { id: "readme", name: "README.TXT", kind: "file", size: "2 KB" },
  ],
};

<FileExplorer root={root} className="h-80" />`,
  },
  wizard: {
    description:
      "Step-by-step wizard with a progress indicator, optional validation, Back/Next, Finish, and Cancel.",
    props: [
      "id, title, description, and content of each step.",
      "Controlled or initial step.",
      "Blocks Next to validate the current step.",
      "Completion and cancellation actions.",
    ],
    notes: [
      "The active step is marked with aria-current=step and the content is announced with aria-live.",
      "Back is disabled on the first step; Finish replaces Next on the last.",
      "Use canGoNext to validate forms without coupling Wizard to a library.",
      "The component is content: place it inside Window or a Dialog.",
    ],
    code: `<Wizard
  steps={[
    { id: "welcome", title: "Welcome", content: <p>Start here.</p> },
    { id: "name", title: "Name", content: <Input ... /> },
    { id: "finish", title: "Finish", content: <p>Done.</p> },
  ]}
  canGoNext={(step) => step.id !== "name" || name.length > 0}
  onComplete={() => guardar()}
  onCancel={() => cerrar()}
/>`,
  },
  "properties-dialog": {
    description:
      "Properties dialog with tabs, Apply/Cancel/OK buttons, and the trapped focus of the native Dialog.",
    props: [
      "Controls the modal dialog.",
      "id, label, and content of each tab.",
      "Actions of the bottom buttons.",
      "Initial or controlled tab.",
    ],
    notes: [
      "Uses Dialog with native <dialog>: Escape, backdrop, and trapped focus.",
      "Apply is disabled if onApply is not passed.",
      "OK applies, confirms, and closes; Cancel closes without applying.",
      "Tabs use Radix Tabs and preserve arrow-key navigation.",
    ],
    code: `const [open, setOpen] = useState(false);

<PropertiesDialog
  open={open}
  onOpenChange={setOpen}
  title="My Computer Properties"
  tabs={[
    { id: "general", label: "General", content: <General /> },
    { id: "system", label: "System", content: <Sistema /> },
  ]}
  onApply={() => aplicar()}
/>`,
  },
  notepad: {
    description:
      "Notepad-style text editor with File/Edit/Format menus, word wrap, shortcuts, and status.",
    props: [
      "Controlled or initial content.",
      "Name shown in the status bar.",
      "Menu and Ctrl+S/N/O shortcut actions.",
      "Allows using only the editor inside another window.",
    ],
    notes: [
      "It is window content: it does not include the title bar.",
      "Ctrl+S saves, Ctrl+N creates an empty document, and Ctrl+O opens.",
      "Word wrap is toggled from the Format menu and reflected in the status.",
      "The editor uses a monospaced font and preserves native selection and scrolling.",
    ],
    code: `<Notepad
  fileName="letter.txt"
  defaultValue="Hello, world."
  onSave={(value) => guardar(value)}
  onNew={() => nuevo()}
/>`,
  },
  terminal: {
    description:
      "MS-DOS terminal with built-in commands, custom commands, history, and accessible output announcements.",
    props: [
      "Input prompt text.",
      "Custom commands that receive args and clear.",
      "Initial output and command observer.",
      "Focuses the input on mount.",
    ],
    notes: [
      "Includes help, ver, cls, dir, and echo; custom commands take priority.",
      "The output uses role=log and aria-live=polite.",
      "Focus stays in the input after each command.",
      "Colors come from terminal tokens, with high-contrast overrides.",
    ],
    code: `<Terminal
  prompt="C:\\>"
  commands={{
    saludo: () => "Hello from the terminal",
  }}
  onCommand={(command) => registrar(command)}
/>`,
  },
  "blue-screen": {
    description:
      "Classic blue error screen with message, code, hint, and restart action.",
    props: [
      "Error header and body.",
      "Code shown in the frame.",
      "Instruction to continue.",
      "Optional restart action.",
    ],
    notes: [
      "Exposes role=alert to announce the error immediately.",
      "Uses accent and inverse tokens; high contrast keeps it legible.",
      "Without onRestart no inert button is shown.",
      "It is a presentational block: the consumer decides whether it fills the screen.",
    ],
    code: `<BlueScreen
  title="DeskUI"
  message="A fatal error has occurred..."
  code="ERROR 0E : 016F : BFF9B3D4"
  onRestart={() => reiniciar()}
/>`,
  },
  screensaver: {
    description:
      "Screensaver with an animated starfield, dismissal by click or keyboard, and respect for reduced motion.",
    props: [
      "Central text and exit instruction.",
      "Number of stars drawn.",
      "Called on click, Escape, Enter, or Space.",
    ],
    notes: [
      "The animation is disabled with prefers-reduced-motion.",
      "The block is focusable and announced as an exit button.",
      "It does not capture the pointer or block the page; the consumer decides when to show it.",
      "Colors use the ink and inverse tokens of the active theme.",
    ],
    code: `<Screensaver
  title="DeskUI"
  hint="Move the mouse or press a key"
  onDismiss={() => cerrar()}
/>`,
  },
  minesweeper: {
    description:
      "Playable Minesweeper with mines, flags, timer, counter, restart, and optional deterministic board.",
    props: [
      "Board dimensions and number of mines.",
      "Deterministic map with * (mine) and . (safe).",
      "Generator seed for reproducible games.",
      "Game result.",
    ],
    notes: [
      "Click reveals, right-click or F flags; the keyboard moves through the cells.",
      "Each cell exposes its row, column, and state in its accessible name.",
      "The timer starts when the first cell is revealed and stops when the game ends.",
      "Use layout for deterministic demos and tests; restart changes the seed.",
    ],
    code: `<Minesweeper rows={9} cols={9} mines={10} seed={1} />
<Minesweeper layout={["..*", "...", "..."]} />`,
  },
};
