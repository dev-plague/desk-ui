import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

async function open(page: Page, route: string) {
  await page.goto(`/#${route}`);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
}

test("cambia entre español e inglés y conserva el idioma en la URL", async ({
  page,
}) => {
  await open(page, "/");
  await expect(page.getByRole("button", { name: "Empezar" })).toBeVisible();

  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.getByRole("button", { name: "Get started" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page).toHaveURL(/lang=en/);

  await page.getByRole("button", { name: "ES", exact: true }).click();
  await expect(page.getByRole("button", { name: "Empezar" })).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page).not.toHaveURL(/lang=en/);
});

test("el buscador se abre con Ctrl+K y navega al componente elegido", async ({
  page,
}) => {
  await open(page, "/");

  await page.keyboard.press("Control+k");
  const dialog = page.getByRole("dialog", { name: "Buscar componentes" });
  await expect(dialog).toBeVisible();

  const input = page.getByRole("combobox", {
    name: "Nombre, categoría o descripción",
  });
  await expect(input).toBeFocused();
  await input.fill("tabla");

  await expect(
    page.getByRole("option", { name: /^Table/ }),
  ).toBeVisible();
  await page.keyboard.press("Enter");

  await expect(page).toHaveURL(/#\/componentes\/table$/);
  await expect(page.getByRole("heading", { level: 1, name: "Table" })).toBeVisible();
});

test("el buscador permite recorrer resultados con el teclado", async ({
  page,
}) => {
  await open(page, "/");
  await page.keyboard.press("Control+k");

  const input = page.getByRole("combobox", {
    name: "Nombre, categoría o descripción",
  });
  await input.fill("menu");

  const options = page.getByRole("option");
  await expect(options.first()).toBeVisible();

  await page.keyboard.press("ArrowDown");
  await expect(options.nth(1)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowUp");
  await expect(options.first()).toHaveAttribute("aria-selected", "true");

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Buscar componentes" })).toBeHidden();
});

test("la Toolbar mueve el foco con flechas, Home y End", async ({ page }) => {
  await open(page, "/componentes/toolbar");

  const toolbar = page.getByRole("toolbar", { name: "Formato de texto" });
  const bold = toolbar.getByRole("button", { name: "Negrita" });
  const italic = toolbar.getByRole("button", { name: "Cursiva" });

  await expect(bold).toHaveAttribute("aria-pressed", "true");
  await bold.focus();
  await expect(bold).toBeFocused();

  await page.keyboard.press("ArrowRight");
  await expect(italic).toBeFocused();

  await page.keyboard.press("End");
  await expect(
    toolbar.getByRole("button", { name: "Guardar" }),
  ).toBeFocused();

  await page.keyboard.press("Home");
  await expect(bold).toBeFocused();
});

test("el Dialog atrapa el foco, cierra con Escape y lo restaura", async ({
  page,
}) => {
  await open(page, "/componentes/dialog");

  const trigger = page.getByRole("button", { name: "Abrir mensaje" });
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Mensaje" });
  await expect(dialog).toBeVisible();

  for (let index = 0; index < 8; index += 1) {
    await page.keyboard.press("Tab");
    const inside = await page.evaluate(() => {
      const active = document.activeElement;
      return Boolean(active?.closest("dialog"));
    });
    expect(inside).toBe(true);
  }

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("el tema se conserva al recargar y en la URL", async ({ page }) => {
  await open(page, "/temas");

  await page.getByRole("button", { name: "Alto contraste" }).click();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    "high-contrast",
  );
  await expect(page).toHaveURL(/theme=high-contrast/);

  await page.reload();
  await expect(page.locator("html")).toHaveAttribute(
    "data-theme",
    "high-contrast",
  );

  await page.getByRole("button", { name: "Clásico" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "classic");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "classic");
});

test("cada ruta actualiza título, descripción y canonical", async ({ page }) => {
  await open(page, "/componentes/table");

  await expect(page).toHaveTitle("Table — DeskUI");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /Tabla clásica/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /#\/componentes\/table$/,
  );

  await page.goto("/#/ruta-inexistente");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );
});

test("las guías MDX cargan contenido y mantienen la navegación", async ({
  page,
}) => {
  await open(page, "/guia");
  await expect(
    page.getByRole("heading", { level: 2, name: "Jerarquía antes que decoración" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Formularios" }),
  ).toBeVisible();

  await open(page, "/cambios");
  await expect(
    page.getByRole("heading", { level: 2, name: /Versión 0\.2\.0/ }),
  ).toBeVisible();

  await open(page, "/migracion");
  await expect(
    page.getByRole("heading", { level: 2, name: "Cómo migrar entre versiones" }),
  ).toBeVisible();

  await open(page, "/contribuir");
  await expect(
    page.getByRole("heading", { level: 2, name: "Preparación" }),
  ).toBeVisible();
});

test("el escritorio selecciona, abre y mueve iconos", async ({ page }) => {
  await open(page, "/componentes/desktop");

  const icon = page.getByRole("button", { name: "Mi PC" });
  await icon.click();
  await icon.dblclick();
  await expect(page.getByText("Abierto: Mi PC")).toBeVisible();

  const notes = page.getByRole("button", { name: "Notas" });
  const before = await notes.evaluate((element) =>
    Number.parseFloat((element as HTMLElement).style.left),
  );
  await notes.focus();
  await page.keyboard.press("Control+ArrowRight");
  const after = await notes.evaluate((element) =>
    Number.parseFloat((element as HTMLElement).style.left),
  );
  expect(after).toBe(before + 8);
});

test("el menú Inicio del shell y el StartMenu de la página funcionan", async ({
  page,
}) => {
  await open(page, "/");

  const taskbar = page.getByRole("contentinfo");
  await taskbar.getByRole("button", { name: "Inicio" }).click();
  const shellMenu = page.getByRole("menu");
  await expect(shellMenu).toBeVisible();
  await expect(
    shellMenu.getByRole("menuitem", { name: "Componentes" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(shellMenu).toBeHidden();

  await open(page, "/componentes/start-menu");
  await page
    .getByRole("main")
    .locator('button[aria-haspopup="menu"]')
    .filter({ hasText: "Inicio" })
    .click();
  const menu = page.getByRole("menu");
  const accessories = menu.getByRole("menuitem", { name: /Accesorios/ });
  await accessories.focus();
  await page.keyboard.press("ArrowRight");
  await page.getByRole("menuitem", { name: "Bloc de notas" }).click();
  await expect(page.getByText("Última acción: Bloc de notas")).toBeVisible();
});

test("el WindowManager maximiza, minimiza y restaura desde la taskbar", async ({
  page,
}) => {
  await open(page, "/componentes/window-manager");

  const window = page.getByRole("region", {
    name: "Sin título - Bloc de notas",
  });
  await expect(window).toBeVisible();

  await window.getByRole("button", { name: "Maximizar" }).click();
  await expect(window).toHaveAttribute("style", /width: 100%/);
  await expect(
    window.getByRole("button", { name: "Restaurar" }),
  ).toBeVisible();
  await window.getByRole("button", { name: "Restaurar" }).click();

  const titleBar = window.getByRole("group", {
    name: "Mover ventana Sin título - Bloc de notas",
  });
  await titleBar.dblclick();
  await expect(
    window.getByRole("button", { name: "Restaurar" }),
  ).toBeVisible();
  await titleBar.dblclick();

  const taskButton = page
    .getByRole("button", { name: "Sin título - Bloc de notas" })
    .last();
  await taskButton.click();
  await expect(window).toBeHidden();

  await taskButton.click();
  await expect(window).toBeVisible();
});

test("el explorador lista los componentes alfabéticamente y tiene scroll", async ({
  page,
}) => {
  await open(page, "/componentes");

  const nav = page.getByRole("navigation", { name: "Documentación" });
  await expect(nav).toContainText("A–Z · 47");

  const labels = await nav.getByRole("button").allInnerTexts();
  const expected = ["Alert", "Badge", "Breadcrumb", "Button", "Card"];
  const indexes = expected.map((label) => labels.indexOf(label));
  expect(indexes.every((index) => index >= 0)).toBe(true);
  expect([...indexes].sort((a, b) => a - b)).toEqual(indexes);

  const metrics = await nav.evaluate((element) => ({
    scrollHeight: element.scrollHeight,
    clientHeight: element.clientHeight,
    overflowY: getComputedStyle(element).overflowY,
  }));
  expect(metrics.overflowY).toBe("auto");
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
});

test("la tienda añade productos y completa el checkout", async ({ page }) => {
  await open(page, "/showcase/tienda");

  await page.getByRole("button", { name: "Añadir" }).first().click();
  await page.getByRole("button", { name: "Carrito (1)" }).click();

  const cart = page.getByRole("dialog", { name: "Carrito de la compra" });
  await expect(cart).toBeVisible();
  await cart.getByRole("button", { name: "Tramitar pedido" }).click();

  await expect(
    page.getByRole("dialog", { name: "Tramitar pedido" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Siguiente" }).click();
  await page.getByRole("button", { name: "Siguiente" }).click();
  await page.getByRole("button", { name: "Finalizar" }).click();

  await expect(page.getByText("Pedido realizado")).toBeVisible();
});

test("la red social publica y comenta en el feed", async ({ page }) => {
  await open(page, "/showcase/red-social");

  const draft = page.getByLabel("Escribe una publicación");
  await draft.fill("Hola desde el feed retro");
  await page.getByRole("button", { name: "Publicar" }).click();

  await expect(page.getByText("Hola desde el feed retro")).toBeVisible();
  await expect(page.getByText("Publicación creada")).toBeVisible();

  await page.getByRole("button", { name: /Comentarios/ }).first().click();
  const comment = page.getByLabel("Escribe un comentario").first();
  await comment.fill("Buen aporte");
  await page.getByRole("button", { name: "Enviar" }).first().click();
  await expect(page.getByText("Buen aporte")).toBeVisible();

  await page.getByRole("button", { name: "Abrir mensajería" }).click();
  const messages = page.getByRole("dialog", { name: "Mensajería" });
  await expect(messages).toBeVisible();
  await messages.getByLabel("Escribe un mensaje").fill("Hola desde el chat");
  await messages.getByRole("button", { name: "Enviar" }).click();
  await expect(messages.getByText("Hola desde el chat")).toBeVisible();
});

test("el constructor añade, edita, duplica, reordena y elimina bloques", async ({
  page,
}) => {
  await open(page, "/constructor");

  const palette = page.getByRole("complementary", {
    name: "Paleta de bloques",
  });
  await palette.getByRole("button", { name: "Título" }).click();

  const canvas = page.getByRole("region", { name: "Lienzo de la página" });
  const block = canvas.getByRole("group", { name: /^Título:/ });
  await expect(block).toBeVisible();
  await expect(block).toContainText("Escribe un título");

  const inspector = page.getByRole("complementary", { name: "Inspector" });
  await inspector.getByLabel("Texto", { exact: true }).fill("Hola desde Playwright");
  await expect(block).toContainText("Hola desde Playwright");

  await inspector.getByRole("button", { name: "Duplicar" }).click();
  await expect(canvas.getByRole("group", { name: /^Título:/ })).toHaveCount(2);

  await inspector.getByRole("tab", { name: "Capas" }).click();
  const tree = page.getByRole("tree", { name: "Capas de la página" });
  const items = tree.getByRole("treeitem");
  await expect(items).toHaveCount(2);

  await page.getByRole("button", { name: "Subir" }).first().click();
  await expect(items.first()).toHaveAttribute("aria-selected", "true");

  await page.getByRole("button", { name: "Eliminar" }).first().click();
  await expect(canvas.getByRole("group", { name: /^Título:/ })).toHaveCount(1);
});

test("el constructor aplica plantillas, cambia el tema y el tamaño de preview", async ({
  page,
}) => {
  await open(page, "/constructor");

  await page.getByRole("button", { name: "Plantillas", exact: true }).click();
  const templates = page.getByRole("dialog", { name: "Plantillas" });
  await expect(templates).toBeVisible();
  await templates
    .getByRole("button", { name: "Usar plantilla Página personal" })
    .click();

  const canvas = page.getByRole("region", { name: "Lienzo de la página" });
  await expect(
    canvas.getByRole("heading", { name: "Hola, soy Ada" }),
  ).toBeVisible();
  await expect(page.getByText("Plantilla aplicada")).toBeVisible();

  await page.getByLabel("Tema", { exact: true }).selectOption("gradient");
  await expect(page.locator("[data-builder-page]")).toHaveAttribute(
    "data-theme",
    "gradient",
  );

  await page.getByRole("button", { name: "Móvil" }).click();
  await expect(page.locator("[data-builder-page]")).toHaveAttribute(
    "data-device",
    "mobile",
  );
  await expect
    .poll(() =>
      page
        .locator("[data-builder-page]")
        .evaluate((element) => getComputedStyle(element).maxWidth),
    )
    .toBe("390px");

  await page.getByRole("button", { name: "Tablet" }).click();
  await expect(page.locator("[data-builder-page]")).toHaveAttribute(
    "data-device",
    "tablet",
  );
});

test("el constructor exporta JSX, JSON y comandos del CLI", async ({ page }) => {
  await open(page, "/constructor");

  await page.getByRole("button", { name: "Plantillas", exact: true }).click();
  const templates = page.getByRole("dialog", { name: "Plantillas" });
  await templates.getByRole("button", { name: "Usar plantilla Tienda" }).click();

  await page.getByRole("button", { name: "Exportar" }).click();
  const dialog = page.getByRole("dialog", { name: "Exportar página" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("tab", { name: "JSX" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(dialog.locator("pre")).toContainText(
    'import { Button } from "@/components/ui/button";',
  );
  await expect(dialog.locator("pre")).toContainText("PaginaGenerada");

  await dialog.getByRole("tab", { name: "JSON" }).click();
  await expect(dialog.locator("pre")).toContainText('"version": 1');
  await expect(dialog.locator("pre")).toContainText('"theme": "classic"');

  await dialog.getByRole("tab", { name: "Comandos" }).click();
  await expect(dialog.locator("pre")).toContainText("npx deskui init");
  await expect(dialog.locator("pre")).toContainText("npx deskui add");
  await expect(dialog.locator("pre")).toContainText("card");
});

test("el constructor persiste en localStorage e importa JSON", async ({
  page,
}) => {
  await open(page, "/constructor");

  const palette = page.getByRole("complementary", {
    name: "Paleta de bloques",
  });
  await palette.getByRole("button", { name: "Párrafo" }).click();

  const inspector = page.getByRole("complementary", { name: "Inspector" });
  await inspector.getByLabel("Texto", { exact: true }).fill("Persistencia");
  await expect(
    page.getByRole("region", { name: "Lienzo de la página" }),
  ).toContainText("Persistencia");

  await expect
    .poll(() =>
      page.evaluate(() =>
        window.localStorage.getItem("deskui-builder-document-v1"),
      ),
    )
    .not.toBeNull();

  await page.reload();
  await expect(
    page.getByRole("region", { name: "Lienzo de la página" }),
  ).toContainText("Persistencia");

  await page.getByRole("button", { name: "Importar" }).click();
  const dialog = page.getByRole("dialog", { name: "Importar JSON" });
  const json = JSON.stringify({
    version: 1,
    title: "Importada",
    theme: "rose",
    background: "sunken",
    blocks: [
      {
        id: "imp-1",
        type: "heading",
        props: { text: "Desde JSON", level: "h1", align: "center" },
      },
    ],
  });
  await dialog.getByLabel("JSON de la página").fill(json);
  await dialog.getByRole("button", { name: "Importar" }).click();

  const canvas = page.getByRole("region", { name: "Lienzo de la página" });
  await expect(canvas).toContainText("Desde JSON");
  await expect(page.locator("[data-builder-page]")).toHaveAttribute(
    "data-theme",
    "rose",
  );

  await page.getByRole("button", { name: "Importar" }).click();
  const invalid = page.getByRole("dialog", { name: "Importar JSON" });
  await invalid.getByLabel("JSON de la página").fill("{ no es json");
  await invalid.getByRole("button", { name: "Importar" }).click();
  await expect(invalid.getByText("No se pudo importar")).toBeVisible();
});

test("el constructor permite arrastrar desde la paleta y reordenar capas", async ({
  page,
}) => {
  await open(page, "/constructor");

  await page.evaluate(() => {
    const source = document.querySelector(
      '[aria-label="Paleta de bloques"] button',
    );
    const target = document.querySelector("[data-builder-page]");
    if (!source || !target) {
      throw new Error("No se encontró la paleta o el lienzo.");
    }
    const dataTransfer = new DataTransfer();
    source.dispatchEvent(
      new DragEvent("dragstart", { bubbles: true, dataTransfer }),
    );
    target.dispatchEvent(
      new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        dataTransfer,
      }),
    );
    target.dispatchEvent(
      new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer }),
    );
  });

  const canvas = page.getByRole("region", { name: "Lienzo de la página" });
  await expect(canvas.getByRole("group", { name: /^Título:/ })).toHaveCount(1);

  const palette = page.getByRole("complementary", {
    name: "Paleta de bloques",
  });
  await palette.getByRole("button", { name: "Párrafo" }).click();
  await expect(canvas.getByRole("group", { name: /^Párrafo:/ })).toHaveCount(1);

  await page.getByRole("tab", { name: "Capas" }).click();
  const items = page
    .getByRole("tree", { name: "Capas de la página" })
    .getByRole("treeitem");
  await expect(items).toHaveCount(2);
  await expect(items.first()).toContainText("Título");

  await page.evaluate(() => {
    const rows = [
      ...document.querySelectorAll<HTMLElement>(
        '[role="treeitem"][data-layer-id]',
      ),
    ];
    const source = rows[0];
    const target = rows[1];
    if (!source || !target) {
      throw new Error("No se encontraron las capas.");
    }
    const rect = target.getBoundingClientRect();
    const dataTransfer = new DataTransfer();
    source.dispatchEvent(
      new DragEvent("dragstart", { bubbles: true, dataTransfer }),
    );
    target.dispatchEvent(
      new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        dataTransfer,
        clientY: rect.bottom - 1,
      }),
    );
    target.dispatchEvent(
      new DragEvent("drop", {
        bubbles: true,
        cancelable: true,
        dataTransfer,
        clientY: rect.bottom - 1,
      }),
    );
  });

  await expect(items.first()).toContainText("Párrafo");
});

test("axe no detecta violaciones en el constructor con una plantilla", async ({
  page,
}) => {
  await open(page, "/constructor");

  await page.getByRole("button", { name: "Plantillas", exact: true }).click();
  const templates = page.getByRole("dialog", { name: "Plantillas" });
  await templates
    .getByRole("button", { name: "Usar plantilla Escritorio" })
    .click();
  await expect(
    page.getByRole("region", { name: "Lienzo de la página" }),
  ).toContainText("Bienvenido a DeskUI");

  const canvasResults = await new AxeBuilder({ page }).analyze();
  expect(
    canvasResults.violations,
    canvasResults.violations.map((item) => item.id).join(", "),
  ).toEqual([]);

  await page.getByRole("tab", { name: "Capas" }).click();
  const layersResults = await new AxeBuilder({ page }).analyze();
  expect(
    layersResults.violations,
    layersResults.violations.map((item) => item.id).join(", "),
  ).toEqual([]);
});

const AXE_ROUTES = [
  "/",
  "/componentes",
  "/componentes/card",
  "/componentes/panel",
  "/componentes/table",
  "/componentes/dialog",
  "/componentes/toolbar",
  "/componentes/desktop",
  "/componentes/start-menu",
  "/componentes/window-manager",
  "/componentes/file-explorer",
  "/componentes/wizard",
  "/componentes/properties-dialog",
  "/componentes/notepad",
  "/componentes/terminal",
  "/componentes/blue-screen",
  "/componentes/screensaver",
  "/componentes/minesweeper",
  "/showcase/tienda",
  "/showcase/red-social",
  "/constructor",
  "/temas",
  "/guia",
  "/cambios",
  "/migracion",
  "/contribuir",
  "/acerca",
];

test("axe no detecta violaciones en las rutas principales", async ({
  page,
}) => {
  for (const route of AXE_ROUTES) {
    await open(page, route);
    const results = await new AxeBuilder({ page }).analyze();
    expect(
      results.violations,
      `${route}: ${results.violations.map((item) => item.id).join(", ")}`,
    ).toEqual([]);
  }
});

test("axe no detecta violaciones con alto contraste", async ({ page }) => {
  await page.goto("/?theme=high-contrast#/componentes/toolbar");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations,
    results.violations.map((item) => item.id).join(", "),
  ).toEqual([]);
});

test.describe("regresión visual", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
  });

  test("inicio en escritorio", async ({ page }) => {
    await open(page, "/");
    await expect(page).toHaveScreenshot("inicio-escritorio.png", {
      fullPage: true,
      mask: [page.locator(".tabular-nums")],
    });
  });

  test("catálogo en escritorio", async ({ page }) => {
    await open(page, "/componentes");
    await expect(page).toHaveScreenshot("catalogo-escritorio.png", {
      fullPage: true,
      mask: [page.locator(".tabular-nums")],
    });
  });

  test("componente en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page, "/componentes/card");
    await expect(page).toHaveScreenshot("card-movil.png", {
      fullPage: true,
      mask: [page.locator(".tabular-nums")],
    });
  });

  test("laboratorio en escritorio", async ({ page }) => {
    await open(page, "/laboratorio");
    await expect(page).toHaveScreenshot("laboratorio-escritorio.png", {
      fullPage: true,
      mask: [page.locator(".tabular-nums")],
    });
  });

  test("tema alto contraste", async ({ page }) => {
    await page.goto("/?theme=high-contrast#/temas");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page).toHaveScreenshot("temas-alto-contraste.png", {
      fullPage: true,
      mask: [page.locator(".tabular-nums")],
    });
  });

  test("constructor en escritorio", async ({ page }) => {
    await open(page, "/constructor");
    await expect(page).toHaveScreenshot("constructor-escritorio.png", {
      fullPage: true,
      mask: [page.locator(".tabular-nums"), page.locator('span[role="status"]')],
    });
  });
});
