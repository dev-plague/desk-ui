import { copyFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** npm solo incluye LICENSE si vive dentro del paquete; lo copiamos en build. */
const cliRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

await copyFile(
  path.resolve(cliRoot, "../../LICENSE"),
  path.join(cliRoot, "LICENSE"),
);

console.log("LICENSE copiada desde la raíz del monorepo.");
