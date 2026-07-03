'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Button,
  Card,
  Checkbox,
  Input,
  Label,
  AllergenBanner,
  PageHeader,
  CheckoutStepper,
  SegmentedControl,
  OrderSummary,
} from '@flames/ui';
import { api, type CartResponse, type CheckoutQuote } from '@/lib/api';
import { getGuestSession } from '@/lib/cart-store';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

const stripeAppearance = {
  theme: 'night' as const,
  variables: {
    colorPrimary: '#E85D04',
    colorBackground: '#1a1a1f',
    colorText: '#f5f0eb',
    colorDanger: '#ef4444',
    borderRadius: '8px',
  },
};

function PaymentStep({ orderId }: { orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [stripeReady, setStripeReady] = useState(false);

  const pay = async () => {
    if (!stripe || !elements) {
      setError('Payment form is still loading. Please wait a moment.');
      return;
    }
    setLoading(true);
    setError('');
    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${window.location.origin}/order/${orderId}` },
      redirect: 'if_required',
    });
    if (submitError) {
      setError(submitError.message || 'Payment failed');
      setLoading(false);
    } else {
      router.push(`/order/${orderId}`);
    }
  };

  return (
    <Card>
      <PaymentElement onReady={() => setStripeReady(true)} />
      {!stripeReady ? (
        <p className="mt-3 text-sm text-muted-foreground">Loading secure card form…</p>
      ) : null}
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
      <Button
        className="mt-4"
        fullWidth
        size="lg"
        loading={loading}
        disabled={!stripeReady}
        onClick={pay}
      >
        Pay now
      </Button>
    </Card>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [orderType, setOrderType] = useState<'delivery' | 'collection'>('delivery');
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: 'Stoke-on-Trent',
    postcode: '',
  });
  const [guestEmail, setGuestEmail] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'cash'>('card');
  const [allergenAck, setAllergenAck] = useState(false);
  const [quote, setQuote] = useState<CheckoutQuote | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api<CartResponse>('/cart', { guestSession: getGuestSession() })
      .then(setCart)
      .catch(() => setCart(null));
  }, []);

  const cartItems =
    cart?.items.map((i) => ({
      productId: i.productId,
      quantity: i.quantity,
      modifierIds: i.modifiers.map((m) => m.id),
    })) || [];

  const fetchQuote = async () => {
    setLoading(true);
    setError('');
    try {
      const q = await api<CheckoutQuote>('/checkout/quote', {
        method: 'POST',
        body: JSON.stringify({
          orderType,
          postcode: orderType === 'delivery' ? address.postcode : undefined,
          items: cartItems,
        }),
      });
      setQuote(q);
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not calculate quote');
    } finally {
      setLoading(false);
    }
  };

  const placeOrder = async () => {
    if (!allergenAck) {
      setError('Please acknowledge allergen information');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await api<{ order: { id: string }; clientSecret: string | null }>(
        '/checkout/orders',
        {
          method: 'POST',
          guestSession: getGuestSession(),
          body: JSON.stringify({
            orderType,
            paymentMethod,
            guestEmail: guestEmail || undefined,
            allergenAcknowledged: true,
            deliveryAddress: orderType === 'delivery' ? address : undefined,
            items: cartItems,
          }),
        },
      );
      setOrderId(result.order.id);
      if (paymentMethod === 'card') {
        if (!result.clientSecret) {
          setError(
            'Card payment could not be started. Check Stripe keys are set and restart the API (pnpm dev).',
          );
          return;
        }
        if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
          setError(
            'Stripe publishable key is missing. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY to apps/web/.env.local and restart the web app.',
          );
          return;
        }
        setClientSecret(result.clientSecret);
        setStep(3);
      } else {
        router.push(`/order/${result.order.id}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  const allAllergens = [...new Set(cart?.items.flatMap((i) => i.allergens) || [])];

  if (!cart?.items.length) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground">Your basket is empty.</p>
      </div>
    );
  }

  const summaryLines = quote
    ? [
        { label: 'Subtotal', value: quote.displaySubtotal ?? cart.displaySubtotal },
        ...(quote.deliveryFeePence > 0
          ? [{ label: 'Delivery', value: quote.displayDeliveryFee }]
          : []),
        { label: 'Total', value: quote.displayTotal, emphasis: true },
      ]
    : [{ label: 'Subtotal', value: cart.displaySubtotal, emphasis: true }];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Checkout" description="Three quick steps — all fees shown before you pay" />
      <CheckoutStepper currentStep={step} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <SegmentedControl
                options={[
                  { value: 'delivery', label: 'Delivery' },
                  { value: 'collection', label: 'Collection' },
                ]}
                value={orderType}
                onChange={setOrderType}
              />

              {orderType === 'delivery' ? (
                <Card className="space-y-4">
                  <div>
                    <Label htmlFor="line1">Address line 1</Label>
                    <Input
                      id="line1"
                      value={address.line1}
                      onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="line2">Address line 2 (optional)</Label>
                    <Input
                      id="line2"
                      value={address.line2}
                      onChange={(e) => setAddress({ ...address, line2: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="postcode">Postcode</Label>
                      <Input
                        id="postcode"
                        placeholder="ST3 5LQ"
                        value={address.postcode}
                        onChange={(e) => setAddress({ ...address, postcode: e.target.value })}
                      />
                    </div>
                  </div>
                </Card>
              ) : null}

              <div>
                <Label htmlFor="email">Email (for confirmation)</Label>
                <Input
                  id="email"
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
              </div>

              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <Button fullWidth size="lg" loading={loading} onClick={fetchQuote}>
                Continue to review
              </Button>
            </div>
          )}

          {step === 2 && quote && (
            <div className="space-y-6 animate-fade-in">
              <AllergenBanner allergens={allAllergens} />

              <Checkbox
                checked={allergenAck}
                onChange={(e) => setAllergenAck(e.target.checked)}
                label="I have reviewed the allergen information"
                description="Required by UK food information regulations (Natasha's Law)"
              />

              <SegmentedControl
                options={[
                  { value: 'card', label: 'Card' },
                  { value: 'cash', label: 'Cash' },
                ]}
                value={paymentMethod}
                onChange={setPaymentMethod}
              />

              {error ? <p className="text-sm text-danger">{error}</p> : null}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button fullWidth size="lg" loading={loading} onClick={placeOrder}>
                  Place order
                </Button>
              </div>
            </div>
          )}

          {step === 3 && clientSecret && orderId && (
            <div className="animate-fade-in">
              <h2 className="mb-4 font-heading text-xl font-bold">Payment</h2>
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: stripeAppearance,
                }}
              >
                <PaymentStep orderId={orderId} />
              </Elements>
            </div>
          )}
        </div>

        <OrderSummary
          lines={summaryLines}
          footer={
            quote
              ? `Est. ready in ~${quote.estimatedMinutes} minutes`
              : 'Delivery fee calculated on next step'
          }
        />
      </div>
    </div>
  );
}
