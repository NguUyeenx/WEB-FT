import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed data cho schema hiện tại (Product, Variant).
 * - Idempotent đơn giản: nếu đã có Product thì bỏ qua seed để tránh trùng SKU unique.
 */
async function main() {
  const existing = await prisma.product.count();
  if (existing > 0) {
    console.log(`Seed skipped: found ${existing} products`);
    return;
  }

  const colors = ["Black", "White", "Red"];
  const sizes = ["38", "39", "40", "41", "42"];

  for (let i = 1; i <= 12; i++) {
    const product = await prisma.product.create({
      data: {
        name: `Shoe Model ${i}`,
        description: `Comfortable and stylish shoe model ${i}.`,
        price: 79 + i,
      },
    });

    for (const color of colors) {
      for (const size of sizes) {
        const sku = `SKU-${i}-${color}-${size}`
          .toUpperCase()
          .replace(/\s+/g, "");
        await prisma.variant.create({
          data: {
            productId: product.id,
            color,
            size,
            sku,
            stock: Math.floor(Math.random() * 10) + 5,
          },
        });
      }
    }
  }

  console.log("Seed completed: created 12 products with variants.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
