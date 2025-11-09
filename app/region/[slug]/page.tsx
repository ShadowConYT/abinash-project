import { prisma } from "@/app/lib/prisma";
import MaterialCard from "@/app/components/MaterialCard";
import { notFound } from "next/navigation";

const mapSlugToRegion = (slug: string) => {
  switch (slug) {
    case "north":
      return "NORTH";
    case "east":
      return "EAST";
    case "west":
      return "WEST";
    case "south":
      return "SOUTH";
    default:
      return null;
  }
};

export default async function RegionPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params; // ✅ unwrap params

  const region = mapSlugToRegion(slug);
  if (!region) return notFound();

  const materials = await prisma.material.findMany({
    where: { region },
    orderBy: [{ category: "asc" }, { name: "asc" }],
    take: 200,
  });

  return (
    <main className="mx-auto max-w-6xl p-6">
      <h1 className="text-2xl font-bold mb-2">
        Materials — {slug.toUpperCase()}
      </h1>
      <p className="text-gray-600 mb-6">
        Browse all materials available in {slug.toUpperCase()}.
      </p>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {materials.map((m: any) => (
          <MaterialCard
            key={m.id}
            slug={m.slug}
            name={m.name}
            category={m.category}
            manufacturer={m.manufacturer}
            pricePaise={m.price}
            unit={m.unit}
            imageUrl={m.imageUrl}
            inStock={m.inStock}
            minDeliveryDays={m.minDeliveryDays}
            maxDeliveryDays={m.maxDeliveryDays}
          />
        ))}
      </div>
    </main>
  );
}
