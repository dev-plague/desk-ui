import { useMemo, useState } from "react";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  Icon,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Wizard,
  useToast,
} from "@deskui/ui";

import { PageHeader } from "../../components/docs/doc-ui";
import { FolderIcon, NoteIcon } from "../../components/icons";
import { useI18n } from "../../i18n/provider";
import {
  formatShowcaseCopy,
  useShowcaseCopy,
  type StoreCategoryId,
  type StoreProductId,
  type StoreStockId,
} from "../../i18n/showcase-copy";

type Product = {
  id: StoreProductId;
  name: string;
  description: string;
  price: number;
  category: StoreCategoryId;
  stock: StoreStockId;
  icon: "window" | "folder" | "note" | "palette";
};

const PRODUCT_META: ReadonlyArray<Omit<Product, "name" | "description">> = [
  {
    id: "floppy",
    price: 7.5,
    category: "hardware",
    stock: "inStock",
    icon: "folder",
  },
  {
    id: "cdrom",
    price: 12.9,
    category: "hardware",
    stock: "lowStock",
    icon: "window",
  },
  {
    id: "mouse",
    price: 18,
    category: "hardware",
    stock: "inStock",
    icon: "note",
  },
  {
    id: "encyclopedia",
    price: 29.95,
    category: "software",
    stock: "inStock",
    icon: "palette",
  },
  {
    id: "office",
    price: 89,
    category: "software",
    stock: "inStock",
    icon: "window",
  },
  {
    id: "cdCase",
    price: 5.25,
    category: "accessories",
    stock: "inStock",
    icon: "folder",
  },
];

function ProductIcon({ icon }: { icon: Product["icon"] }) {
  return <Icon name={icon} className="h-6 w-6" />;
}

export function StoreShowcase() {
  const copy = useShowcaseCopy("store");
  const { locale } = useI18n();
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<StoreCategoryId | "all">("all");
  const [cart, setCart] = useState<Record<string, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-GB", {
        style: "currency",
        currency: "EUR",
      }),
    [locale],
  );

  const allProducts = useMemo(
    () =>
      PRODUCT_META.map((meta) => ({
        ...meta,
        name: copy.products[meta.id].name,
        description: copy.products[meta.id].description,
      })),
    [copy],
  );

  const products = useMemo(() => {
    const term = query.trim().toLocaleLowerCase(locale);
    return allProducts.filter(
      (product) =>
        (category === "all" || product.category === category) &&
        (term === "" ||
          `${product.name} ${product.description}`
            .toLocaleLowerCase(locale)
            .includes(term)),
    );
  }, [allProducts, category, locale, query]);

  const cartItems = allProducts.filter((product) => cart[product.id]);
  const count = Object.values(cart).reduce((total, value) => total + value, 0);
  const total = cartItems.reduce(
    (sum, product) => sum + product.price * (cart[product.id] ?? 0),
    0,
  );

  function add(product: Product) {
    setCart((previous) => ({
      ...previous,
      [product.id]: (previous[product.id] ?? 0) + 1,
    }));
  }

  function remove(product: Product) {
    setCart((previous) => {
      const quantity = (previous[product.id] ?? 0) - 1;
      const next = { ...previous };
      if (quantity <= 0) {
        delete next[product.id];
      } else {
        next[product.id] = quantity;
      }
      return next;
    });
  }

  function finish() {
    setCart({});
    setCheckout(false);
    setCartOpen(false);
    toast({
      title: copy.orderPlaced,
      description: formatShowcaseCopy(copy.orderPlacedDescription, {
        total: priceFormatter.format(total),
      }),
      duration: 0,
    });
  }

  return (
    <div>
      <PageHeader
        eyebrow={copy.eyebrow}
        title={copy.title}
        description={copy.description}
        actions={
          <Button variant="primary" onClick={() => setCartOpen(true)}>
            {formatShowcaseCopy(copy.cartButton, { count })}
          </Button>
        }
      />

      <div className="mb-3 flex flex-wrap items-end gap-2">
        <div className="grid min-w-[180px] flex-1 gap-1">
          <Label htmlFor="store-search">{copy.searchLabel}</Label>
          <Input
            id="store-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={copy.searchPlaceholder}
          />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="store-category">{copy.categoryLabel}</Label>
          <Select
            id="store-category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as StoreCategoryId | "all")
            }
          >
            <option value="all">{copy.allCategories}</option>
            <option value="hardware">{copy.categories.hardware}</option>
            <option value="software">{copy.categories.software}</option>
            <option value="accessories">{copy.categories.accessories}</option>
          </Select>
        </div>
      </div>

      <p aria-live="polite" className="mb-2 text-[11px] leading-[15px] text-ink-muted">
        {formatShowcaseCopy(
          products.length === 1
            ? copy.productCountOne
            : copy.productCountMany,
          { count: products.length },
        )}{" "}
        ·{" "}
        {formatShowcaseCopy(
          count === 1 ? copy.itemCountOne : copy.itemCountMany,
          { count },
        )}
      </p>

      <h2 className="mb-2 text-[13px] font-bold leading-[16px]">
        {copy.catalog}
      </h2>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} aria-label={product.name}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ProductIcon icon={product.icon} />
                <CardTitle>{product.name}</CardTitle>
              </div>
              <CardDescription>{product.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-2">
              <span className="text-[14px] font-bold">
                {priceFormatter.format(product.price)}
              </span>
              <Badge
                variant={product.stock === "inStock" ? "success" : "warning"}
              >
                {copy.stock[product.stock]}
              </Badge>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="primary" onClick={() => add(product)}>
                {copy.add}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="bevel-raised mt-3 bg-surface p-3 text-[11px] leading-[15px]">
          {copy.noResults}
        </div>
      ) : null}

      <Dialog
        open={cartOpen}
        onOpenChange={(open) => {
          setCartOpen(open);
          if (!open) {
            setCheckout(false);
          }
        }}
        title={checkout ? copy.checkoutTitle : copy.cartTitle}
        icon={<FolderIcon />}
        footer={
          checkout ? undefined : (
            <>
              <Button size="sm" onClick={() => setCartOpen(false)}>
                {copy.continueShopping}
              </Button>
              <Button
                size="sm"
                variant="primary"
                disabled={cartItems.length === 0}
                onClick={() => setCheckout(true)}
              >
                {copy.checkoutButton}
              </Button>
            </>
          )
        }
      >
        {checkout ? (
          <Wizard
            steps={[
              {
                id: "address",
                title: copy.shippingStep,
                description: copy.shippingDescription,
                content: (
                  <div className="grid gap-2">
                    <div className="grid gap-1">
                      <Label htmlFor="store-name">{copy.nameLabel}</Label>
                      <Input
                        id="store-name"
                        placeholder={copy.namePlaceholder}
                      />
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor="store-address">
                        {copy.addressLabel}
                      </Label>
                      <Input
                        id="store-address"
                        placeholder={copy.addressPlaceholder}
                      />
                    </div>
                  </div>
                ),
              },
              {
                id: "payment",
                title: copy.paymentStep,
                content: (
                  <RadioGroup
                    aria-label={copy.paymentMethodAria}
                    defaultValue="tarjeta"
                  >
                    <RadioGroupItem value="tarjeta">
                      {copy.creditCard}
                    </RadioGroupItem>
                    <RadioGroupItem value="contra-reembolso">
                      {copy.cashOnDelivery}
                    </RadioGroupItem>
                    <RadioGroupItem value="transferencia">
                      {copy.bankTransfer}
                    </RadioGroupItem>
                  </RadioGroup>
                ),
              },
              {
                id: "confirm",
                title: copy.confirmStep,
                content: (
                  <div className="grid gap-2 text-[11px] leading-[15px]">
                    <p>
                      {formatShowcaseCopy(copy.orderTotal, {
                        total: priceFormatter.format(total),
                      })}
                    </p>
                    <p>{copy.deliveryEstimate}</p>
                  </div>
                ),
              },
            ]}
            onComplete={finish}
            onCancel={() => setCheckout(false)}
          />
        ) : (
          <div className="grid gap-2">
            {cartItems.length === 0 ? (
              <p className="text-[11px] leading-[15px]">{copy.emptyCart}</p>
            ) : (
              <Table aria-label={copy.cartTableAria}>
                <TableHeader>
                  <TableRow>
                    <TableHead>{copy.product}</TableHead>
                    <TableHead>{copy.quantity}</TableHead>
                    <TableHead>{copy.price}</TableHead>
                    <TableHead>{copy.remove}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cartItems.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <NoteIcon />
                          {product.name}
                        </span>
                      </TableCell>
                      <TableCell>{cart[product.id]}</TableCell>
                      <TableCell>
                        {priceFormatter.format(
                          product.price * (cart[product.id] ?? 0),
                        )}
                      </TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => remove(product)}>
                          {copy.remove}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            <p className="text-right text-[12px] font-bold">
              {formatShowcaseCopy(copy.total, {
                total: priceFormatter.format(total),
              })}
            </p>
          </div>
        )}
      </Dialog>
    </div>
  );
}
