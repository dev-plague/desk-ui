import type { Locale } from "../../i18n/messages";
import type {
  BuilderBlock,
  BuilderDocument,
  BuilderTemplate,
} from "./types";

interface TemplateTranslation {
  label: string;
  description: string;
  highlights: readonly string[];
}

export const TEMPLATE_TRANSLATIONS_EN: Record<string, TemplateTranslation> = {
  blank: {
    label: "Blank page",
    description: "Start from scratch with an empty canvas.",
    highlights: ["Clean canvas", "All tools"],
  },
  escritorio: {
    label: "Desktop",
    description:
      "Main window with cards, a shortcut list and a progress bar.",
    highlights: ["Window", "Cards", "Progress"],
  },
  formulario: {
    label: "Form",
    description:
      "Sign-up form with fields, visual validation and a confirmation alert.",
    highlights: ["Inputs", "Group box", "Alert"],
  },
  tienda: {
    label: "Store",
    description:
      "Campaign hero and three product cards with badges and prices.",
    highlights: ["Hero", "Products", "Badges"],
  },
  "red-social": {
    label: "Social network",
    description:
      "Social window with a composer, feed and messaging alert.",
    highlights: ["Window", "Feed", "Columns"],
  },
  "pagina-personal": {
    label: "Personal page",
    description:
      "Portfolio with introduction, biography, projects and availability.",
    highlights: ["Hero", "Biography", "Projects"],
  },
};

const TEMPLATE_TEXT_EN: Record<string, string> = {
  "Página sin título": "Untitled page",
  "Escritorio retro": "Retro desktop",
  "Mi PC": "My Computer",
  "4 objetos · 1,44 MB libres": "4 objects · 1.44 MB free",
  "Bienvenido a DeskUI": "Welcome to DeskUI",
  "Esta página está compuesta con bloques de DeskUI. Puedes editar cada bloque desde el panel de propiedades y reordenarlo en el árbol de capas.":
    "This page is built with DeskUI blocks. You can edit each block from the properties panel and reorder it in the layer tree.",
  "Accesos rápidos": "Quick access",
  "Mis documentos": "My documents",
  "Carpetas y archivos recientes.": "Recent folders and files.",
  "Cartas\nFotografías\nProyectos\nPresupuestos":
    "Letters\nPhotos\nProjects\nBudgets",
  "Abrir carpeta": "Open folder",
  "Accesos directos": "Shortcuts",
  "Lo que necesitas a un doble clic.": "What you need in a double-click.",
  Nuevo: "New",
  "Bloc de notas, Calculadora, Buscaminas y el Explorador de archivos.":
    "Notepad, Calculator, Minesweeper and File Explorer.",
  "Ver accesos": "View shortcuts",
  "Instalando componentes...": "Installing components...",
  "Consejo del escritorio": "Desktop tip",
  "Arrastra bloques desde la paleta o reordénalos en Capas. El botón Exportar genera JSX, JSON y el comando del CLI.":
    "Drag blocks from the palette or reorder them in Layers. The Export button generates JSX, JSON and the CLI command.",
  "Formulario de alta": "Sign-up form",
  "Solicitud de alta": "Sign-up request",
  "Rellena los datos para crear tu cuenta en la red local. Los campos marcados como obligatorios se validan en el navegador.":
    "Fill in the details to create your account on the local network. Required fields are validated in the browser.",
  "Datos personales": "Personal details",
  "Nombre de usuario": "User name",
  usuario95: "user95",
  "Correo electrónico": "Email address",
  "usuario@ejemplo.com": "user@example.com",
  Comentarios: "Comments",
  "Cuéntanos para qué usarás la cuenta...":
    "Tell us what you will use the account for...",
  "Acepto los términos de uso": "I accept the terms of use",
  Cancelar: "Cancel",
  "Enviar solicitud": "Send request",
  "Antes de enviar": "Before submitting",
  "Comprueba el correo electrónico: recibirás un mensaje de confirmación con un enlace válido durante 24 horas.":
    "Check the email address: you will receive a confirmation message with a link valid for 24 hours.",
  "Formulario listo.": "Form ready.",
  "Paso 1 de 1": "Step 1 of 1",
  "Tienda retro": "Retro store",
  "Ofertas de la semana": "Weekly deals",
  "Tecnología de 1995, entrega inmediata": "1995 technology, immediate delivery",
  "Disquetes, módems y accesorios para revivir la era dorada del escritorio. Envío gratuito en pedidos superiores a 30 €.":
    "Floppies, modems and accessories to relive the golden age of the desktop. Free shipping on orders over €30.",
  "Ver catálogo": "View catalog",
  "Productos destacados": "Featured products",
  'Disquete 3,5"': "3.5-inch floppy",
  "1,44 MB · caja de 10 unidades.": "1.44 MB · box of 10.",
  Oferta: "Sale",
  "3,50 €": "€3.50",
  Añadir: "Add",
  "CD-ROM 4×": "4× CD-ROM",
  "Lector interno IDE con bandeja.": "Internal IDE tray-loading drive.",
  "49,00 €": "€49.00",
  "Módem 56K": "56K modem",
  "Fax y datos, compatible con V.90.": "Fax and data, V.90 compatible.",
  "Últimas unidades": "Last units",
  "29,90 €": "€29.90",
  "Envío gratuito": "Free shipping",
  "Los pedidos superiores a 30 € no pagan gastos de envío. Devoluciones durante 30 días.":
    "Orders over €30 pay no shipping. 30-day returns.",
  "Catálogo actualizado.": "Catalog updated.",
  "3 productos": "3 products",
  "Red social retro": "Retro social network",
  "En línea · 3 notificaciones": "Online · 3 notifications",
  "Actividad reciente": "Recent activity",
  "Nuevo estado": "New status",
  "Comparte lo que estás haciendo.": "Share what you are doing.",
  "¿Qué estás pensando?": "What's on your mind?",
  "Hola, mundo...": "Hello, world...",
  Publicar: "Post",
  "Últimas publicaciones": "Latest posts",
  "Lo que comparte tu red.": "What your network shares.",
  "Ada: Acabo de instalar DeskUI en un 486. ¡Vuela!":
    "Ada: I just installed DeskUI on a 486. It flies!",
  "Linus: Nuevo artículo sobre redes locales y módems.":
    "Linus: New article about local networks and modems.",
  "3 comentarios": "3 comments",
  Mensajería: "Messaging",
  "Tienes un mensaje nuevo de Ada. Abre la ventana de mensajería para responder.":
    "You have a new message from Ada. Open the messaging window to reply.",
  "Página personal": "Personal page",
  "Portafolio personal": "Personal portfolio",
  "Hola, soy Ada": "Hi, I'm Ada",
  "Diseño interfaces retro con estándares modernos: tokens, accesibilidad y componentes que puedes copiar y adaptar.":
    "I design retro interfaces with modern standards: tokens, accessibility and components you can copy and adapt.",
  Contactar: "Contact",
  "Sobre mí y proyectos": "About me and projects",
  "Sobre mí": "About me",
  "Diseño y desarrollo de interfaces.": "Interface design and development.",
  "Llevo más de una década construyendo productos digitales. Me interesa la intersección entre la nostalgia visual y la usabilidad actual.":
    "I have spent over a decade building digital products. I am interested in the intersection of visual nostalgia and current usability.",
  "Diseño de sistemas\nAccesibilidad\nFrontend\nDocumentación":
    "Design systems\nAccessibility\nFrontend\nDocumentation",
  Proyectos: "Projects",
  "Una selección de trabajos recientes.": "A selection of recent work.",
  Destacado: "Featured",
  "DeskUI: una librería de componentes React con estética de escritorio clásico.":
    "DeskUI: a React component library with a classic desktop look.",
  "Ver proyectos": "View projects",
  "Disponible para nuevos proyectos": "Available for new projects",
  "Respondo en menos de 48 horas. Cuéntame qué tienes en mente y buscamos la mejor forma de colaborar.":
    "I reply within 48 hours. Tell me what you have in mind and we will find the best way to collaborate.",
  "Última actualización: 2026": "Last updated: 2026",
  "Hecho con DeskUI": "Made with DeskUI",
};

function translateBlock(block: BuilderBlock): BuilderBlock {
  const props = Object.fromEntries(
    Object.entries(block.props).map(([key, value]) => [
      key,
      typeof value === "string" ? (TEMPLATE_TEXT_EN[value] ?? value) : value,
    ]),
  );

  return {
    ...block,
    props,
    children: block.children?.map(translateBlock),
  };
}

function translateDocument(document: BuilderDocument): BuilderDocument {
  return {
    ...document,
    title: TEMPLATE_TEXT_EN[document.title] ?? document.title,
    blocks: document.blocks.map(translateBlock),
  };
}

export function translateTemplate<T extends BuilderTemplate>(
  template: T,
  locale: Locale,
): T {
  if (locale === "es") {
    return template;
  }
  const translation = TEMPLATE_TRANSLATIONS_EN[template.id];
  return {
    ...template,
    ...translation,
    create: () => translateDocument(template.create()),
  };
}
