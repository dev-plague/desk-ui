export interface RegistryFile {
  path: string;
  target?: string;
  type: string;
  content: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title?: string;
  description?: string;
  dependencies?: string[];
  registryDependencies?: string[];
  files?: RegistryFile[];
}

export interface RegistryIndex {
  name?: string;
  items?: RegistryItem[];
}

export interface ComponentsConfig {
  $schema?: string;
  style?: string;
  rsc?: boolean;
  tsx?: boolean;
  srcDir?: boolean;
  registry?: string;
  tailwind?: {
    css?: string;
    config?: string;
    baseColor?: string;
    cssVariables?: boolean;
    prefix?: string;
  };
  aliases?: {
    components?: string;
    utils?: string;
    ui?: string;
    lib?: string;
    hooks?: string;
  };
  iconLibrary?: string;
}

export interface ResolvedItem {
  item: RegistryItem;
  explicit: boolean;
}
