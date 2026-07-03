import { ButtonLink, Card, Badge, AllergenBanner } from '@flames/ui';
import { ORDER_STATUS_LABELS } from '@flames/shared';
import { api, type Order } from '@/lib/api';

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let order: Order | null = null;
  try {
    order = await api<Order>(`/orders/${id}`);
  } catch {
    order = null;
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Order not found.</p>
        <ButtonLink href="/" className="mt-4">
          Home
        </ButtonLink>
      </div>
    );
  }

  const allAllergens = [...new Set(order.items.flatMap((i) => i.allergens))];
  const statusLabel =
    ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] || order.status;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-3xl">
          ✓
        </div>
        <h1 className="font-heading text-3xl font-bold">Order confirmed</h1>
        <p className="mt-2 text-muted-foreground">Thank you for ordering from Flames Longton</p>
      </div>

      <Card className="mt-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Order number</p>
            <p className="font-mono text-lg font-bold">{order.orderNumber}</p>
          </div>
          <Badge variant="primary">{statusLabel}</Badge>
        </div>
        <p className="mt-4 text-2xl font-bold text-primary">{order.displayTotal}</p>
        <p className="text-sm text-muted-foreground capitalize">
          {order.type} · {order.paymentMethod} · {order.paymentStatus}
        </p>
      </Card>

      <Card className="mt-4">
        <p className="font-semibold">Your items</p>
        <ul className="mt-3 space-y-2">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between text-sm">
              <span>
                {item.quantity}× {item.name}
              </span>
              <span>{item.displayPrice}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-4">
        <AllergenBanner allergens={allAllergens} title="Allergen summary for your order" />
      </div>

      <ButtonLink href="/menu" fullWidth variant="outline" className="mt-8">
        Order again
      </ButtonLink>
    </div>
  );
}
