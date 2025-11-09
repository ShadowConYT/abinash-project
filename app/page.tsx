import Link from "next/link";

const regions = [
  { key: "NORTH", label: "North India", slug: "north" },
  { key: "EAST", label: "East India", slug: "east" },
  { key: "WEST", label: "West India", slug: "west" },
  { key: "SOUTH", label: "South India", slug: "south" },
];

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">Choose a Region</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {regions.map((r) => (
            <Link
              key={r.key}
              href={`/region/${r.slug}`}
              className="rounded-2xl border p-6 hover:shadow-md transition"
            >
              <div className="text-xl font-semibold">{r.label}</div>
              <div className="text-sm text-gray-500 mt-1">
                View materials available in {r.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
