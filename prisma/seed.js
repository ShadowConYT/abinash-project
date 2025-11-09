import { prisma } from "../app/lib/prisma.js";

function randBetween(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

const REGIONS = ["NORTH", "SOUTH", "EAST", "WEST"];

const MANUFACTURERS = [
  "UltraTech",
  "ACC",
  "Ambuja",
  "JSW",
  "Tata Steel",
  "Shree Cement",
  "Birla",
  "Asian Paints",
  "Nerolac",
  "Berger",
  "Kajaria",
  "Somany",
  "Saint-Gobain",
  "Jindal",
  "Aparna",
  "Supreme",
  "Astral",
  "Finolex",
  "Havells",
  "L&T",
];

const placeholder = (slug) =>
  `https://via.placeholder.com/600x400?text=${slug}`;

const BASE_MATERIALS = [
  ["OPC/PPC Cement", "Cement & Concrete", 300, 480, "per 50 kg bag"],
  ["Ready-Mix Concrete (RMC)", "Cement & Concrete", 4500, 7000, "per m³"],
  ["TMT Steel", "Metals", 59, 72, "per kg"],
  ["Structural Steel Sections", "Metals", 60, 75, "per kg"],
  ["Clay Bricks", "Bricks & Blocks", 6, 10, "per brick"],
  ["Fly Ash Bricks", "Bricks & Blocks", 5, 8, "per brick"],
  ["AAC Blocks", "Bricks & Blocks", 2000, 4000, "per m³"],
  ["PVC Pipes", "Plastics & Polymers", 25, 150, "per metre"],
  ["UPVC Doors/Windows", "Plastics & Polymers", 500, 1200, "per sq ft"],
  ["Float Glass", "Glass & Ceramics", 35, 85, "per sq ft"],
  ["Premium Glass", "Glass & Ceramics", 1400, 1400, "per m²"],
  ["Vitrified Tiles", "Glass & Ceramics", 40, 120, "per sq ft"],
  ["Distemper Paint", "Paints & Finishes", 30, 60, "per litre"],
  ["Emulsion Paint", "Paints & Finishes", 180, 450, "per litre"],
  ["Plaster of Paris (POP)", "Miscellaneous", 280, 350, "per 25 kg bag"],
  ["Gypsum Boards", "Miscellaneous", 350, 550, "per sheet"],
  ["Bitumen", "Miscellaneous", 45, 65, "per kg"],
];

const EXTRA_MATERIALS = [
  ["Granite", "Stone & Natural", 70, 300, "per sq ft"],
  ["Marble", "Stone & Natural", 100, 400, "per sq ft"],
  ["Sandstone", "Stone & Natural", 40, 120, "per sq ft"],
  ["Laterite Stone", "Stone & Natural", 25, 45, "per block"],

  ["Teak Wood", "Timber", 1800, 6000, "per cubic ft"],
  ["Sal Wood", "Timber", 1500, 3000, "per cubic ft"],
  ["Bamboo", "Timber", 30, 120, "per pole"],
  ["Plywood", "Timber", 50, 120, "per sq ft"],
  ["Veneer Sheet", "Timber", 80, 200, "per sq ft"],

  ["Glass Wool", "Insulation", 120, 250, "per sq ft"],
  ["Mineral Wool", "Insulation", 150, 300, "per sq ft"],
  ["EPS Panels", "Insulation", 100, 180, "per sq ft"],
  ["XPS Foam Board", "Insulation", 150, 280, "per sq ft"],

  ["APP Membrane", "Waterproofing", 1200, 2000, "per roll"],
  ["Liquid Waterproofing Chemical", "Waterproofing", 250, 450, "per litre"],

  ["Solar Panel", "Solar & Electrical", 20, 35, "per watt"],
  ["Solar Inverter", "Solar & Electrical", 10000, 20000, "per unit"],
  ["MCB Panel", "Solar & Electrical", 800, 1500, "per unit"],

  ["Tile Adhesive", "Adhesives & Chemicals", 350, 500, "per bag"],
  ["Silicone Sealant", "Adhesives & Chemicals", 150, 300, "per tube"],

  ["Ceramic Tiles", "Glass & Ceramics", 30, 80, "per sq ft"],
  ["Sanitaryware", "Glass & Ceramics", 1000, 6000, "per piece"],

  ["Concrete Blocks", "Bricks & Blocks", 20, 60, "per block"],
  ["Hollow Blocks", "Bricks & Blocks", 25, 80, "per block"],

  ["HDPE Pipe", "Plastics & Polymers", 40, 160, "per metre"],
  ["CPVC Pipe", "Plastics & Polymers", 50, 200, "per metre"],

  ["Zinc Sheet", "Metals", 200, 350, "per sq ft"],
  ["Copper Sheet", "Metals", 600, 900, "per sq ft"],
  ["Aluminium Window Frame", "Metals", 300, 800, "per sq ft"],

  ["Epoxy Resin", "Adhesives & Chemicals", 400, 800, "per kg"],
  ["Curing Compound", "Adhesives & Chemicals", 100, 180, "per litre"],

  ["Laminate Flooring", "Flooring", 80, 250, "per sq ft"],
  ["Wooden Flooring", "Flooring", 100, 350, "per sq ft"],

  ["Electrical Cable", "Electrical", 20, 70, "per metre"],
  ["LED Light Panel", "Electrical", 300, 900, "per piece"],

  ["GI Roofing Sheet", "Roofing", 350, 600, "per sq ft"],
  ["Polycarbonate Roofing Sheet", "Roofing", 500, 1000, "per sq ft"],

  ["Bituminous Membrane", "Waterproofing", 1200, 2500, "per roll"],

  ["River Sand", "Aggregates", 40, 80, "per kg"],
  ["Coarse Aggregate", "Aggregates", 800, 1200, "per ton"],
];

async function main() {
  await prisma.order.deleteMany();
  await prisma.material.deleteMany();

  const ALL = [...BASE_MATERIALS, ...EXTRA_MATERIALS];

  for (const [name, category, min, max, unit] of ALL) {
    const manufacturer =
      MANUFACTURERS[Math.floor(Math.random() * MANUFACTURERS.length)];

    for (const region of REGIONS) {
      const slugBase = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const slug = `${slugBase}-${region.toLowerCase()}`;
      const pricePaise = randBetween(min, max) * 100;

      await prisma.material.create({
        data: {
          name,
          slug,
          description: name,
          category,
          manufacturer,
          price: pricePaise,
          unit,
          region,
          imageUrl: placeholder(slug),
          inStock: Math.random() > 0.1,
          stockQty: randBetween(30, 500),
          minDeliveryDays: randBetween(1, 3),
          maxDeliveryDays: randBetween(5, 10),
        },
      });
    }
  }

  console.log("✅ Seed completed!");
}

main().finally(() => prisma.$disconnect());
