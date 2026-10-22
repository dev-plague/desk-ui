import { useI18n } from "./provider";

/**
 * Textos de los showcases. El español es la fuente de verdad de la forma y el
 * inglés debe declarar exactamente las mismas claves.
 */
const es = {
  store: {
    eyebrow: "Showcase",
    title: "Tienda retro",
    description:
      "Catálogo con filtros, carrito y checkout por pasos construido solo con componentes de DeskUI.",
    cartButton: "Carrito ({count})",
    searchLabel: "Buscar",
    searchPlaceholder: "Nombre o descripción...",
    categoryLabel: "Categoría",
    allCategories: "Todas",
    categories: {
      hardware: "Hardware",
      software: "Software",
      accessories: "Accesorios",
    },
    productCountOne: "{count} producto",
    productCountMany: "{count} productos",
    itemCountOne: "{count} artículo en el carrito",
    itemCountMany: "{count} artículos en el carrito",
    catalog: "Catálogo",
    add: "Añadir",
    noResults: "No hay productos que coincidan con los filtros.",
    cartTitle: "Carrito de la compra",
    checkoutTitle: "Tramitar pedido",
    continueShopping: "Seguir comprando",
    checkoutButton: "Tramitar pedido",
    emptyCart: "El carrito está vacío.",
    cartTableAria: "Productos del carrito",
    product: "Producto",
    quantity: "Cantidad",
    price: "Precio",
    remove: "Quitar",
    total: "Total: {total}",
    orderPlaced: "Pedido realizado",
    orderPlacedDescription: "Total: {total}. Gracias por comprar.",
    shippingStep: "Envío",
    shippingDescription: "¿Dónde enviamos el pedido?",
    nameLabel: "Nombre",
    namePlaceholder: "María Pérez",
    addressLabel: "Dirección",
    addressPlaceholder: "Calle Mayor 8",
    paymentStep: "Pago",
    paymentMethodAria: "Método de pago",
    creditCard: "Tarjeta de crédito",
    cashOnDelivery: "Contra reembolso",
    bankTransfer: "Transferencia bancaria",
    confirmStep: "Confirmar",
    orderTotal: "Total del pedido: {total}",
    deliveryEstimate: "Recibirás el pedido en 3–5 días laborables.",
    stock: {
      inStock: "En stock",
      lowStock: "Últimas unidades",
    },
    products: {
      floppy: {
        name: "Disquete 3,5",
        description: "1,44 MB de alta densidad. Caja de 10 unidades.",
      },
      cdrom: {
        name: "CD-ROM 650 MB",
        description: "Solo lectura, 12×. Ideal para enciclopedias.",
      },
      mouse: {
        name: "Ratón serial",
        description: "Dos botones, bola mecánica y conector DB-9.",
      },
      encyclopedia: {
        name: "Enciclopedia 95",
        description: "Multimedia en CD-ROM con artículos y mapas.",
      },
      office: {
        name: "Suite de oficina",
        description: "Procesador de textos, hoja de cálculo y agenda.",
      },
      cdCase: {
        name: "Funda para CD",
        description: "Plástico transparente, pack de 25 unidades.",
      },
    },
  },
  social: {
    eyebrow: "Showcase",
    title: "Red social retro",
    description:
      "Feed, perfil, publicaciones, comentarios, me gusta y contactos construidos con los componentes de la librería.",
    profileSr: "Perfil",
    profileCardAria: "Perfil de usuario",
    yourProfile: "Tu perfil",
    handle: "@usuario95",
    postsLabel: "Publicaciones",
    friends: "Amigos",
    following: "Siguiendo",
    editProfile: "Editar perfil",
    profileToastTitle: "Perfil",
    profileToastDescription: "La edición de perfil es una demo.",
    contactsAria: "Contactos",
    contactsTitle: "Contactos",
    statuses: {
      online: "En línea",
      away: "Ausente",
      busy: "Ocupado",
    },
    notificationsAria: "Notificaciones",
    notificationsTitle: "Notificaciones",
    notifications: [
      "Ana comentó tu publicación.",
      "Luis te envió una solicitud.",
      "Marta reaccionó a tu mensaje.",
    ],
    messagesAria: "Mensajes",
    messagesTitle: "Mensajes",
    openMessaging: "Abrir mensajería",
    newPostAria: "Crear publicación",
    newPostTitle: "Nueva publicación",
    draftLabel: "Escribe una publicación",
    draftPlaceholder: "¿Qué está pasando en tu escritorio?",
    characterCount: "{count} caracteres",
    publish: "Publicar",
    publishedToastTitle: "Publicación creada",
    publishedToastDescription: "Tu mensaje ya aparece en el feed.",
    postAria: "Publicación de {author}",
    like: "Me gusta ({count})",
    comments: "Comentarios ({count})",
    noComments: "Sin comentarios todavía.",
    commentLabel: "Escribe un comentario",
    commentPlaceholder: "Escribe un comentario...",
    send: "Enviar",
    messagingTitle: "Mensajería",
    close: "Cerrar",
    conversationWith: "Conversación con Ana Retro",
    conversationAria: "Conversación con Ana Retro",
    messageLabel: "Escribe un mensaje",
    messagePlaceholder: "Escribe un mensaje...",
    you: "Tú",
    justNow: "Ahora",
    seedPosts: {
      storm: {
        time: "Hace 5 minutos",
        content:
          "Acabo de instalar el nuevo tema Storm y el escritorio parece otro. ¿Alguien más ha probado los seis temas?",
      },
      floppy: {
        time: "Hace 22 minutos",
        content:
          "Recordatorio: el disquete no es un pisapapeles. Etiquetad siempre la unidad A: antes de formatear.",
      },
      wishlist: {
        time: "Hace 1 hora",
        content:
          "Mi lista de deseos: un CD-ROM de 12×, una tarjeta de sonido y una impresora que no suene como un tractor.",
      },
    },
    seedComments: {
      contrast: "El de alto contraste es mi favorito para trabajar.",
      printer: "La impresora es opcional; el sonido no.",
    },
    seedMessages: {
      storm: {
        from: "Ana Retro",
        text: "¿Probaste el nuevo tema Storm?",
      },
      reply: {
        from: "Tú",
        text: "Sí, queda genial en el escritorio.",
      },
    },
  },
};

export type ShowcaseCopy = typeof es;

export type StoreCopy = ShowcaseCopy["store"];
export type SocialCopy = ShowcaseCopy["social"];
export type StoreProductId = keyof StoreCopy["products"];
export type StoreCategoryId = keyof StoreCopy["categories"];
export type StoreStockId = keyof StoreCopy["stock"];
export type SocialContactStatus = keyof SocialCopy["statuses"];
export type SeedPostKey = keyof SocialCopy["seedPosts"];
export type SeedCommentKey = keyof SocialCopy["seedComments"];
export type SeedMessageKey = keyof SocialCopy["seedMessages"];

const en: ShowcaseCopy = {
  store: {
    eyebrow: "Showcase",
    title: "Retro store",
    description:
      "Catalog with filters, cart and step-by-step checkout built entirely with DeskUI components.",
    cartButton: "Cart ({count})",
    searchLabel: "Search",
    searchPlaceholder: "Name or description...",
    categoryLabel: "Category",
    allCategories: "All",
    categories: {
      hardware: "Hardware",
      software: "Software",
      accessories: "Accessories",
    },
    productCountOne: "{count} product",
    productCountMany: "{count} products",
    itemCountOne: "{count} item in the cart",
    itemCountMany: "{count} items in the cart",
    catalog: "Catalog",
    add: "Add",
    noResults: "No products match the filters.",
    cartTitle: "Shopping cart",
    checkoutTitle: "Checkout",
    continueShopping: "Continue shopping",
    checkoutButton: "Checkout",
    emptyCart: "Your cart is empty.",
    cartTableAria: "Cart products",
    product: "Product",
    quantity: "Quantity",
    price: "Price",
    remove: "Remove",
    total: "Total: {total}",
    orderPlaced: "Order placed",
    orderPlacedDescription: "Total: {total}. Thanks for shopping.",
    shippingStep: "Shipping",
    shippingDescription: "Where should we send the order?",
    nameLabel: "Name",
    namePlaceholder: "Mary Smith",
    addressLabel: "Address",
    addressPlaceholder: "8 Main Street",
    paymentStep: "Payment",
    paymentMethodAria: "Payment method",
    creditCard: "Credit card",
    cashOnDelivery: "Cash on delivery",
    bankTransfer: "Bank transfer",
    confirmStep: "Confirm",
    orderTotal: "Order total: {total}",
    deliveryEstimate: "You will receive your order in 3–5 business days.",
    stock: {
      inStock: "In stock",
      lowStock: "Low stock",
    },
    products: {
      floppy: {
        name: "3.5-inch floppy disk",
        description: "1.44 MB high density. Box of 10.",
      },
      cdrom: {
        name: "CD-ROM 650 MB",
        description: "Read-only, 12×. Ideal for encyclopedias.",
      },
      mouse: {
        name: "Serial mouse",
        description: "Two buttons, mechanical ball and DB-9 connector.",
      },
      encyclopedia: {
        name: "Encyclopedia 95",
        description: "Multimedia CD-ROM with articles and maps.",
      },
      office: {
        name: "Office suite",
        description: "Word processor, spreadsheet and calendar.",
      },
      cdCase: {
        name: "CD sleeve",
        description: "Clear plastic, pack of 25.",
      },
    },
  },
  social: {
    eyebrow: "Showcase",
    title: "Retro social network",
    description:
      "Feed, profile, posts, comments, likes and contacts built with the library components.",
    profileSr: "Profile",
    profileCardAria: "User profile",
    yourProfile: "Your profile",
    handle: "@user95",
    postsLabel: "Posts",
    friends: "Friends",
    following: "Following",
    editProfile: "Edit profile",
    profileToastTitle: "Profile",
    profileToastDescription: "Profile editing is a demo.",
    contactsAria: "Contacts",
    contactsTitle: "Contacts",
    statuses: {
      online: "Online",
      away: "Away",
      busy: "Busy",
    },
    notificationsAria: "Notifications",
    notificationsTitle: "Notifications",
    notifications: [
      "Ana commented on your post.",
      "Luis sent you a request.",
      "Marta reacted to your message.",
    ],
    messagesAria: "Messages",
    messagesTitle: "Messages",
    openMessaging: "Open messages",
    newPostAria: "Create post",
    newPostTitle: "New post",
    draftLabel: "Write a post",
    draftPlaceholder: "What's happening on your desktop?",
    characterCount: "{count} characters",
    publish: "Publish",
    publishedToastTitle: "Post created",
    publishedToastDescription: "Your message is now in the feed.",
    postAria: "Post by {author}",
    like: "Like ({count})",
    comments: "Comments ({count})",
    noComments: "No comments yet.",
    commentLabel: "Write a comment",
    commentPlaceholder: "Write a comment...",
    send: "Send",
    messagingTitle: "Messages",
    close: "Close",
    conversationWith: "Conversation with Ana Retro",
    conversationAria: "Conversation with Ana Retro",
    messageLabel: "Write a message",
    messagePlaceholder: "Write a message...",
    you: "You",
    justNow: "Just now",
    seedPosts: {
      storm: {
        time: "5 minutes ago",
        content:
          "I just installed the new Storm theme and the desktop looks completely different. Has anyone else tried all six themes?",
      },
      floppy: {
        time: "22 minutes ago",
        content:
          "Reminder: a floppy disk is not a paperweight. Always label drive A: before formatting.",
      },
      wishlist: {
        time: "1 hour ago",
        content:
          "My wish list: a 12× CD-ROM, a sound card and a printer that doesn't sound like a tractor.",
      },
    },
    seedComments: {
      contrast: "The high-contrast one is my favorite for working.",
      printer: "The printer is optional; sound is not.",
    },
    seedMessages: {
      storm: {
        from: "Ana Retro",
        text: "Did you try the new Storm theme?",
      },
      reply: {
        from: "You",
        text: "Yes, it looks great on the desktop.",
      },
    },
  },
};

export const SHOWCASE_COPY = { es, en };

export type ShowcaseKind = keyof ShowcaseCopy;

export function useShowcaseCopy<K extends ShowcaseKind>(
  kind: K,
): ShowcaseCopy[K] {
  const { locale } = useI18n();
  return SHOWCASE_COPY[locale][kind];
}

export function formatShowcaseCopy(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match,
  );
}
