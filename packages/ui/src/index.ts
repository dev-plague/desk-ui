export {
  Alert,
  AlertDescription,
  AlertTitle,
  type AlertProps,
} from "./components/alert";
export { Badge, badgeVariants, type BadgeProps } from "./components/badge";
export {
  BlueScreen,
  type BlueScreenProps,
} from "./components/blue-screen";
export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./components/breadcrumb";
export { Button, buttonVariants, type ButtonProps } from "./components/button";
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardContentProps,
  type CardDescriptionProps,
  type CardFooterProps,
  type CardHeaderProps,
  type CardProps,
  type CardTitleProps,
} from "./components/card";
export {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "./components/context-menu";
export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "./components/dropdown-menu";
export {
  Checkbox,
  type CheckboxProps,
} from "./components/checkbox";
export { Dialog, type DialogProps } from "./components/dialog";
export {
  Desktop,
  DesktopIcon,
  DesktopIcons,
  type DesktopIconProps,
  type DesktopIconsProps,
  type DesktopProps,
} from "./components/desktop";
export {
  FileExplorer,
  type FileExplorerItem,
  type FileExplorerProps,
  type FileExplorerView,
} from "./components/file-explorer";
export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
  type FormControlProps,
  type FormDescriptionProps,
  type FormItemProps,
  type FormLabelProps,
  type FormMessageProps,
} from "./components/form";
export { GroupBox, type GroupBoxProps } from "./components/group-box";
export { Input, type InputProps } from "./components/input";
export { Icon, type IconName, type IconProps } from "./components/icon";
export { Label, type LabelProps } from "./components/label";
export { ListBox, type ListBoxProps } from "./components/list-box";
export {
  MenuBar,
  MenuBarItem,
  MenuBarLabel,
  MenuBarMenu,
  MenuBarSeparator,
  MenuBarShortcut,
} from "./components/menu-bar";
export {
  Minesweeper,
  type MinesweeperProps,
} from "./components/minesweeper";
export {
  Notepad,
  type NotepadProps,
} from "./components/notepad";
export { Pagination, type PaginationProps } from "./components/pagination";
export {
  Panel,
  PanelBody,
  PanelFooter,
  PanelHeader,
  PanelTitle,
  panelVariants,
  type PanelBodyProps,
  type PanelFooterProps,
  type PanelHeaderProps,
  type PanelProps,
  type PanelTitleProps,
} from "./components/panel";
export { ProgressBar, type ProgressBarProps } from "./components/progress-bar";
export {
  PropertiesDialog,
  type PropertiesDialogProps,
  type PropertiesTab,
} from "./components/properties-dialog";
export {
  RadioGroup,
  RadioGroupItem,
  type RadioGroupItemProps,
  type RadioGroupProps,
} from "./components/radio-group";
export { ScrollArea, type ScrollAreaProps } from "./components/scroll-area";
export {
  Screensaver,
  type ScreensaverProps,
} from "./components/screensaver";
export { Select, type SelectProps } from "./components/select";
export {
  Separator,
  type SeparatorProps,
} from "./components/separator";
export {
  StartMenu,
  StartMenuContent,
  StartMenuGroup,
  StartMenuItem,
  StartMenuLabel,
  StartMenuSeparator,
  StartMenuShortcut,
  StartMenuSidebar,
  StartMenuSub,
  StartMenuSubContent,
  StartMenuSubTrigger,
  StartMenuTrigger,
} from "./components/start-menu";
export { StatusBar, StatusBarField, type StatusBarFieldProps, type StatusBarProps } from "./components/status-bar";
export { Slider, type SliderProps } from "./components/slider";
export { Switch, type SwitchProps } from "./components/switch";
export {
  Terminal,
  type TerminalCommand,
  type TerminalCommandContext,
  type TerminalLine,
  type TerminalLineKind,
  type TerminalProps,
} from "./components/terminal";
export {
  Toast,
  ToastProvider,
  useToast,
  type ToastOptions,
  type ToastProps,
} from "./components/toast";
export {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./components/tooltip";
export { TreeItem, TreeView, type TreeItemProps, type TreeViewProps } from "./components/tree-view";
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  type TableProps,
  type TableRowProps,
} from "./components/table";
export {
  Taskbar,
  TaskbarDivider,
  TaskbarItem,
  TaskbarStart,
  TaskbarTray,
  type TaskbarButtonProps,
  type TaskbarItemProps,
  type TaskbarProps,
} from "./components/taskbar";
export {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/tabs";
export {
  TitleBar,
  type TitleBarProps,
} from "./components/title-bar";
export {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSeparator,
  type ToolbarButtonProps,
  type ToolbarGroupProps,
  type ToolbarProps,
  type ToolbarSeparatorProps,
} from "./components/toolbar";
export {
  Textarea,
  type TextareaProps,
} from "./components/textarea";
export {
  Window,
  WindowBody,
  WindowRoot,
  WindowStatusBar,
  WindowStatusField,
  WindowTitleBar,
  type WindowBodyProps,
  type WindowProps,
  type WindowStatusBarProps,
  type WindowStatusFieldProps,
  type WindowTitleBarProps,
} from "./components/window";
export {
  WindowManager,
  type WindowManagerHandle,
  type WindowManagerPosition,
  type WindowManagerProps,
  type WindowManagerSize,
  type WindowManagerSnapshot,
  type WindowManagerWindow,
} from "./components/window-manager";
export {
  Wizard,
  type WizardProps,
  type WizardStep,
} from "./components/wizard";
export {
  DeskUILocaleProvider,
  DESKUI_LOCALE_MESSAGES,
  useDeskUILocale,
  type DeskUILocale,
  type DeskUILocaleContextValue,
  type DeskUILocaleProviderProps,
  type DeskUIMessages,
  type DeskUIMessagesOverride,
} from "./lib/i18n";
export { cn } from "./lib/utils";
