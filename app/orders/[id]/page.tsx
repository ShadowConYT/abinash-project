import { prisma } from "@/app/lib/prisma.js";
import { notFound } from "next/navigation";

export default async function OrderSuccess(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params; // ✅ unwrap params

  const order = await prisma.order.findUnique({
    where: { id },
    include: { material: true },
  });

  if (!order) return notFound(); // ✅ important

  const m = order.material;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Order Placed 🎉</h1>

      <div className="rounded-xl border p-4 space-y-3">
        <p>
          <strong>Order ID:</strong> {order.id}
        </p>
        <p>
          <strong>Pincode:</strong> {order.pincode}
        </p>
        <p>
          <strong>Delivery Days:</strong> {order.deliveryDays}
        </p>
        <p>
          <strong>Total:</strong> ₹{(order.totalPrice / 100).toFixed(2)}
        </p>

        <h2 className="text-xl font-semibold mt-4">Material</h2>
        <p>{m.name}</p>
      </div>

      <a
        href="/"
        className="inline-block mt-6 rounded-lg border px-4 py-2 hover:bg-gray-50"
      >
        Back to Home
      </a>
    </main>
  );
}
