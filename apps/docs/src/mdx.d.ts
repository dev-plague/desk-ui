declare module "*.mdx" {
  import type { ComponentType } from "react";

  const MdxComponent: ComponentType<Record<string, unknown>>;
  export default MdxComponent;
}
