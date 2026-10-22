import { createBlankDocument, createBlock } from "./model";
import type { Locale } from "../../i18n/messages";
import { translateTemplate } from "./templates.en";
import type {
  BuilderBlock,
  BuilderBlockType,
  BuilderDocument,
  BuilderProps,
  BuilderTemplate,
} from "./types";

function block(
  type: BuilderBlockType,
  props: BuilderProps = {},
  children: BuilderBlock[] = [],
): BuilderBlock {
  return createBlock(type, props, children);
}

function base(
  title: string,
  theme: BuilderDocument["theme"],
  background: BuilderDocument["background"],
  blocks: BuilderBlock[],
): BuilderDocument {
  return {
    version: 1,
    title,
    theme,
    background,
    blocks,
  };
}

const escritorio = () =>
  base("Escritorio retro", "classic", "desktop", [
    block(
      "window",
      {
        title: "Mi PC",
        status: "4 objetos · 1,44 MB libres",
        active: true,
      },
      [
        block("heading", {
          text: "Bienvenido a DeskUI",
          level: "h1",
          align: "left",
        }),
        block("text", {
          text: "Esta página está compuesta con bloques de DeskUI. Puedes editar cada bloque desde el panel de propiedades y reordenarlo en el árbol de capas.",
        }),
        block("divider"),
        block("heading", {
          text: "Accesos rápidos",
          level: "h2",
          align: "left",
        }),
        block("columns", { columns: "2" }, [
          block(
            "card",
            {
              title: "Mis documentos",
              description: "Carpetas y archivos recientes.",
            },
            [
              block("list", {
                items: "Cartas\nFotografías\nProyectos\nPresupuestos",
                style: "bulleted",
              }),
              block("button", {
                label: "Abrir carpeta",
                variant: "default",
                align: "left",
              }),
            ],
          ),
          block(
            "card",
            {
              title: "Accesos directos",
              description: "Lo que necesitas a un doble clic.",
            },
            [
              block("badge", { text: "Nuevo", variant: "info" }),
              block("text", {
                text: "Bloc de notas, Calculadora, Buscaminas y el Explorador de archivos.",
                muted: true,
              }),
              block("button", {
                label: "Ver accesos",
                variant: "primary",
                align: "left",
              }),
            ],
          ),
        ]),
        block("progress", {
          label: "Instalando componentes...",
          value: 60,
        }),
      ],
    ),
    block("alert", {
      variant: "info",
      title: "Consejo del escritorio",
      description:
        "Arrastra bloques desde la paleta o reordénalos en Capas. El botón Exportar genera JSX, JSON y el comando del CLI.",
    }),
  ]);

const formulario = () =>
  base("Formulario de alta", "classic", "surface", [
    block("heading", {
      text: "Solicitud de alta",
      level: "h1",
      align: "center",
    }),
    block("text", {
      text: "Rellena los datos para crear tu cuenta en la red local. Los campos marcados como obligatorios se validan en el navegador.",
      align: "center",
      muted: true,
    }),
    block("group-box", { legend: "Datos personales" }, [
      block("columns", { columns: "2" }, [
        block("input", {
          label: "Nombre de usuario",
          placeholder: "usuario95",
          inputType: "text",
          required: true,
        }),
        block("input", {
          label: "Correo electrónico",
          placeholder: "usuario@ejemplo.com",
          inputType: "email",
          required: true,
        }),
      ]),
      block("textarea", {
        label: "Comentarios",
        placeholder: "Cuéntanos para qué usarás la cuenta...",
        rows: 3,
      }),
      block("checkbox", {
        label: "Acepto los términos de uso",
        checked: false,
      }),
    ]),
    block("columns", { columns: "2" }, [
      block("button", {
        label: "Cancelar",
        variant: "default",
        align: "right",
      }),
      block("button", {
        label: "Enviar solicitud",
        variant: "primary",
        align: "left",
      }),
    ]),
    block("alert", {
      variant: "warning",
      title: "Antes de enviar",
      description:
        "Comprueba el correo electrónico: recibirás un mensaje de confirmación con un enlace válido durante 24 horas.",
    }),
    block("status-bar", {
      left: "Formulario listo.",
      right: "Paso 1 de 1",
    }),
  ]);

const tienda = () =>
  base("Tienda retro", "classic", "surface", [
    block("hero", {
      eyebrow: "Ofertas de la semana",
      title: "Tecnología de 1995, entrega inmediata",
      description:
        "Disquetes, módems y accesorios para revivir la era dorada del escritorio. Envío gratuito en pedidos superiores a 30 €.",
      buttonLabel: "Ver catálogo",
      buttonVariant: "primary",
      align: "left",
    }),
    block("heading", {
      text: "Productos destacados",
      level: "h2",
      align: "left",
    }),
    block("columns", { columns: "3" }, [
      block(
        "card",
        {
          title: "Disquete 3,5\"",
          description: "1,44 MB · caja de 10 unidades.",
        },
        [
          block("badge", { text: "Oferta", variant: "success" }),
          block("text", { text: "3,50 €", muted: false }),
          block("button", {
            label: "Añadir",
            variant: "primary",
            align: "left",
          }),
        ],
      ),
      block(
        "card",
        {
          title: "CD-ROM 4×",
          description: "Lector interno IDE con bandeja.",
        },
        [
          block("badge", { text: "Nuevo", variant: "info" }),
          block("text", { text: "49,00 €", muted: false }),
          block("button", {
            label: "Añadir",
            variant: "primary",
            align: "left",
          }),
        ],
      ),
      block(
        "card",
        {
          title: "Módem 56K",
          description: "Fax y datos, compatible con V.90.",
        },
        [
          block("badge", { text: "Últimas unidades", variant: "warning" }),
          block("text", { text: "29,90 €", muted: false }),
          block("button", {
            label: "Añadir",
            variant: "primary",
            align: "left",
          }),
        ],
      ),
    ]),
    block("alert", {
      variant: "success",
      title: "Envío gratuito",
      description:
        "Los pedidos superiores a 30 € no pagan gastos de envío. Devoluciones durante 30 días.",
    }),
    block("status-bar", {
      left: "Catálogo actualizado.",
      right: "3 productos",
    }),
  ]);

const redSocial = () =>
  base("Red social retro", "classic", "desktop", [
    block(
      "window",
      {
        title: "Red social retro",
        status: "En línea · 3 notificaciones",
        active: true,
      },
      [
        block("heading", {
          text: "Actividad reciente",
          level: "h2",
          align: "left",
        }),
        block("columns", { columns: "2" }, [
          block(
            "card",
            {
              title: "Nuevo estado",
              description: "Comparte lo que estás haciendo.",
            },
            [
              block("textarea", {
                label: "¿Qué estás pensando?",
                placeholder: "Hola, mundo...",
                rows: 2,
              }),
              block("button", {
                label: "Publicar",
                variant: "primary",
                align: "right",
              }),
            ],
          ),
          block(
            "card",
            {
              title: "Últimas publicaciones",
              description: "Lo que comparte tu red.",
            },
            [
              block("text", {
                text: "Ada: Acabo de instalar DeskUI en un 486. ¡Vuela!",
              }),
              block("divider"),
              block("text", {
                text: "Linus: Nuevo artículo sobre redes locales y módems.",
              }),
              block("badge", { text: "3 comentarios", variant: "info" }),
            ],
          ),
        ]),
        block("alert", {
          variant: "info",
          title: "Mensajería",
          description:
            "Tienes un mensaje nuevo de Ada. Abre la ventana de mensajería para responder.",
        }),
      ],
    ),
  ]);

const paginaPersonal = () =>
  base("Página personal", "classic", "surface", [
    block("hero", {
      eyebrow: "Portafolio personal",
      title: "Hola, soy Ada",
      description:
        "Diseño interfaces retro con estándares modernos: tokens, accesibilidad y componentes que puedes copiar y adaptar.",
      buttonLabel: "Contactar",
      buttonVariant: "primary",
      align: "left",
    }),
    block("heading", {
      text: "Sobre mí y proyectos",
      level: "h2",
      align: "left",
    }),
    block("columns", { columns: "2" }, [
      block(
        "card",
        {
          title: "Sobre mí",
          description: "Diseño y desarrollo de interfaces.",
        },
        [
          block("text", {
            text: "Llevo más de una década construyendo productos digitales. Me interesa la intersección entre la nostalgia visual y la usabilidad actual.",
          }),
          block("list", {
            items: "Diseño de sistemas\nAccesibilidad\nFrontend\nDocumentación",
            style: "bulleted",
          }),
        ],
      ),
      block(
        "card",
        {
          title: "Proyectos",
          description: "Una selección de trabajos recientes.",
        },
        [
          block("badge", { text: "Destacado", variant: "success" }),
          block("text", {
            text: "DeskUI: una librería de componentes React con estética de escritorio clásico.",
          }),
          block("button", {
            label: "Ver proyectos",
            variant: "default",
            align: "left",
          }),
        ],
      ),
    ]),
    block("alert", {
      variant: "success",
      title: "Disponible para nuevos proyectos",
      description:
        "Respondo en menos de 48 horas. Cuéntame qué tienes en mente y buscamos la mejor forma de colaborar.",
    }),
    block("status-bar", {
      left: "Última actualización: 2026",
      right: "Hecho con DeskUI",
    }),
  ]);

export const BUILDER_TEMPLATES: readonly BuilderTemplate[] = [
  {
    id: "blank",
    label: "Página en blanco",
    description: "Empieza desde cero con un lienzo vacío.",
    highlights: ["Lienzo limpio", "Todas las herramientas"],
    create: createBlankDocument,
  },
  {
    id: "escritorio",
    label: "Escritorio",
    description:
      "Ventana principal con tarjetas, lista de accesos y barra de progreso.",
    highlights: ["Ventana", "Tarjetas", "Progreso"],
    create: escritorio,
  },
  {
    id: "formulario",
    label: "Formulario",
    description:
      "Formulario de alta con campos, validación visual y aviso de confirmación.",
    highlights: ["Inputs", "Group box", "Aviso"],
    create: formulario,
  },
  {
    id: "tienda",
    label: "Tienda",
    description:
      "Hero de campaña y tres tarjetas de producto con etiquetas y precios.",
    highlights: ["Hero", "Productos", "Badges"],
    create: tienda,
  },
  {
    id: "red-social",
    label: "Red social",
    description:
      "Ventana de red social con composer, feed y aviso de mensajería.",
    highlights: ["Ventana", "Feed", "Columnas"],
    create: redSocial,
  },
  {
    id: "pagina-personal",
    label: "Página personal",
    description:
      "Portafolio con presentación, biografía, proyectos y disponibilidad.",
    highlights: ["Hero", "Biografía", "Proyectos"],
    create: paginaPersonal,
  },
];

export function getBuilderTemplates(
  locale: Locale = "es",
): readonly BuilderTemplate[] {
  return BUILDER_TEMPLATES.map((template) =>
    translateTemplate(template, locale),
  );
}

export function findBuilderTemplate(
  id: string,
  locale: Locale = "es",
): BuilderTemplate | undefined {
  const template = BUILDER_TEMPLATES.find((item) => item.id === id);
  return template ? translateTemplate(template, locale) : undefined;
}
