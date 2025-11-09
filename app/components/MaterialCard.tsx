import Link from "next/link";
import Badge from "./Badge";

type Props = {
  slug: string;
  name: string;
  category: string;
  manufacturer: string;
  pricePaise: number;
  unit: string;
  imageUrl?: string | null;
  inStock: boolean;
  minDeliveryDays: number;
  maxDeliveryDays: number;
};

const rupees = (p: number) => `₹${(p / 100).toFixed(2)}`;

export default function MaterialCard(props: Props) {
  const {
    slug,
    name,
    category,
    manufacturer,
    pricePaise,
    unit,
    imageUrl,
    inStock,
    minDeliveryDays,
    maxDeliveryDays,
  } = props;

  return (
    <Link
      href={`/material/${slug}`}
      className="group overflow-hidden rounded-2xl border hover:shadow-md transition"
    >
      <div className="aspect-[3/2] w-full overflow-hidden bg-gray-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            imageUrl ??
            `https://via.placeholder.com/600x400?text=${encodeURIComponent(
              name
            )}`
          }
          alt={name}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold leading-snug">{name}</h3>
          <Badge>{inStock ? "In stock" : "Out of stock"}</Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <Badge>{category}</Badge>
          <span>•</span>
          <span>
            by <span className="font-medium text-gray-800">{manufacturer}</span>
          </span>
        </div>

        <div className="text-sm text-gray-600">
          Delivery {minDeliveryDays}–{maxDeliveryDays} days
        </div>

        <div className="pt-2 text-base">
          <span className="font-semibold">{rupees(pricePaise)}</span>
          <span className="text-gray-600"> / {unit}</span>
        </div>
      </div>
    </Link>
  );
}
