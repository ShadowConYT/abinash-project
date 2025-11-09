import { prisma } from "@/app/lib/prisma";
import { rupees } from "@/app/lib/format";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import ClientDeliveryPreview from "./ClientDeliveryPreview";

const OrderSchema = z.object({
  materialId: z.string().cuid(),
  quantity: z.coerce.number().int().min(1),
  pincode: z.string().regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

// SERVER ACTION
async function placeOrder(formData: FormData) {
  "use server";

  const parsed = OrderSchema.safeParse({
    materialId: formData.get("materialId"),
    quantity: formData.get("quantity"),
    pincode: formData.get("pincode"),
  });
  if (!parsed.success) throw new Error("Invalid input");

  const { materialId, quantity, pincode } = parsed.data;

  const material = await prisma.material.findUnique({
    where: { id: materialId },
  });
  if (!material) throw new Error("Material not found");

  // Final deliveryDays computed on server within configured range
  const min = Math.min(material.minDeliveryDays, material.maxDeliveryDays);
  const max = Math.max(material.minDeliveryDays, material.maxDeliveryDays);
  const deliveryDays = Math.floor(Math.random() * (max - min + 1)) + min;

  const totalPrice = material.price * quantity;

  const order = await prisma.order.create({
    data: {
      materialId,
      quantity,
      pincode,
      deliveryDays,
      totalPrice,
    },
    select: { id: true },
  });

  redirect(`/orders/${order.id}`);
}

export default async function MaterialPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;

  const material = await prisma.material.findUnique({ where: { slug } });
  if (!material) return notFound();

  return (
    <main className="max-w-5xl mx-auto p-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              material.imageUrl ??
              `https://via.placeholder.com/900x600?text=${encodeURIComponent(
                material.name
              )}`
            }
            alt={material.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{material.name}</h1>
            <div className="text-sm text-gray-600">
              <span className="font-medium">{material.category}</span> • by{" "}
              <span className="font-medium">{material.manufacturer}</span>
            </div>
          </div>

          <div className="text-lg">
            <span className="font-semibold">{rupees(material.price)}</span>
            <span className="text-gray-600"> / {material.unit}</span>
          </div>

          <div className="text-sm text-gray-700">
            Delivery window:{" "}
            <b>
              {material.minDeliveryDays}–{material.maxDeliveryDays} days
            </b>
          </div>

          <div>
            <span className="text-sm">
              Stock:{" "}
              {material.inStock ? (
                <span className="text-emerald-700 font-medium">
                  Available ({material.stockQty})
                </span>
              ) : (
                <span className="text-red-700 font-medium">Out of stock</span>
              )}
            </span>
          </div>

          <form action={placeOrder} className="mt-4 space-y-4">
            <input type="hidden" name="materialId" value={material.id} />

            <div>
              <label className="block text-sm font-medium">Quantity</label>
              <input
                name="quantity"
                type="number"
                min={1}
                defaultValue={1}
                required
                className="mt-1 w-full rounded-lg border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Delivery Pincode
              </label>
              <input
                id="pincode"
                name="pincode"
                inputMode="numeric"
                pattern="\d{6}"
                placeholder="560001"
                required
                className="mt-1 w-full rounded-lg border p-2"
              />
              <ClientDeliveryPreview
                minDays={material.minDeliveryDays}
                maxDays={material.maxDeliveryDays}
                inputId="pincode"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg border p-3 font-semibold hover:bg-gray-50"
              disabled={!material.inStock}
            >
              {material.inStock ? "Place Order" : "Out of stock"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
