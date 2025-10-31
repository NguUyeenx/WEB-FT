import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@shoestore.com' },
    update: {},
    create: {
      email: 'admin@shoestore.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create test user
  const userPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Test User',
      role: 'USER',
    },
  });
  console.log('✅ Test user created:', user.email);

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'running' },
      update: {},
      create: {
        name: 'Running',
        slug: 'running',
        description: 'Performance running shoes for all distances',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'basketball' },
      update: {},
      create: {
        name: 'Basketball',
        slug: 'basketball',
        description: 'High-performance basketball shoes',
        imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'casual' },
      update: {},
      create: {
        name: 'Casual',
        slug: 'casual',
        description: 'Everyday comfort and style',
        imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'training' },
      update: {},
      create: {
        name: 'Training',
        slug: 'training',
        description: 'Versatile training shoes',
        imageUrl: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb',
      },
    }),
  ]);
  console.log('✅ Categories created:', categories.length);

  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'nike' },
      update: {},
      create: {
        name: 'Nike',
        slug: 'nike',
        description: 'Just Do It',
        logoUrl: 'https://via.placeholder.com/200x80/000000/FFFFFF?text=NIKE',
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'adidas' },
      update: {},
      create: {
        name: 'Adidas',
        slug: 'adidas',
        description: 'Impossible is Nothing',
        logoUrl: 'https://via.placeholder.com/200x80/000000/FFFFFF?text=ADIDAS',
      },
    }),
    prisma.brand.upsert({
      where: { slug: 'new-balance' },
      update: {},
      create: {
        name: 'New Balance',
        slug: 'new-balance',
        description: 'Fearlessly Independent',
        logoUrl: 'https://via.placeholder.com/200x80/000000/FFFFFF?text=NEW+BALANCE',
      },
    }),
  ]);
  console.log('✅ Brands created:', brands.length);

  // Create products with variants
  const productsData = [
    {
      name: 'Air Max 270 React',
      slug: 'air-max-270-react',
      description: 'The Nike Air Max 270 React combines two iconic cushioning technologies to create a soft, smooth ride that is stable and responsive.',
      basePrice: 150,
      categoryId: categories[0].id,
      brandId: brands[0].id,
      gender: 'UNISEX',
      material: 'Mesh, Synthetic',
      featured: true,
      variants: [
        { color: 'Black', size: '8', sku: 'NKE-AM270R-BLK-8' },
        { color: 'Black', size: '9', sku: 'NKE-AM270R-BLK-9' },
        { color: 'Black', size: '10', sku: 'NKE-AM270R-BLK-10' },
        { color: 'White', size: '8', sku: 'NKE-AM270R-WHT-8' },
        { color: 'White', size: '9', sku: 'NKE-AM270R-WHT-9' },
        { color: 'White', size: '10', sku: 'NKE-AM270R-WHT-10' },
      ],
    },
    {
      name: 'ZoomX Vaporfly Next%',
      slug: 'zoomx-vaporfly-next',
      description: 'Designed to help you run your fastest mile, 5K, 10K, or marathon, the Nike ZoomX Vaporfly NEXT% delivers the sort of obsessive design expected at the highest levels of racing.',
      basePrice: 250,
      categoryId: categories[0].id,
      brandId: brands[0].id,
      gender: 'UNISEX',
      material: 'Flyknit, Carbon Fiber',
      featured: true,
      variants: [
        { color: 'Pink', size: '8', sku: 'NKE-VFLY-PNK-8' },
        { color: 'Pink', size: '9', sku: 'NKE-VFLY-PNK-9' },
        { color: 'Green', size: '8', sku: 'NKE-VFLY-GRN-8' },
        { color: 'Green', size: '9', sku: 'NKE-VFLY-GRN-9' },
      ],
    },
    {
      name: 'LeBron 18',
      slug: 'lebron-18',
      description: 'Built for basketball\'s fastest, strongest and most versatile player, the LeBron 18 provides lightweight support with Air Max cushioning underfoot.',
      basePrice: 200,
      categoryId: categories[1].id,
      brandId: brands[0].id,
      gender: 'UNISEX',
      material: 'KnitPosite, Max Air',
      featured: true,
      variants: [
        { color: 'Black', size: '9', sku: 'NKE-LB18-BLK-9' },
        { color: 'Black', size: '10', sku: 'NKE-LB18-BLK-10' },
        { color: 'Purple', size: '9', sku: 'NKE-LB18-PRP-9' },
        { color: 'Purple', size: '10', sku: 'NKE-LB18-PRP-10' },
      ],
    },
    {
      name: 'Air Force 1 \'07',
      slug: 'air-force-1-07',
      description: 'The radiance lives on in the Nike Air Force 1 \'07, the b-ball OG that puts a fresh spin on what you know best: durable leather, bold colors and the perfect amount of flash.',
      basePrice: 90,
      categoryId: categories[2].id,
      brandId: brands[0].id,
      gender: 'UNISEX',
      material: 'Leather',
      featured: false,
      variants: [
        { color: 'White', size: '7', sku: 'NKE-AF1-WHT-7' },
        { color: 'White', size: '8', sku: 'NKE-AF1-WHT-8' },
        { color: 'White', size: '9', sku: 'NKE-AF1-WHT-9' },
        { color: 'Black', size: '8', sku: 'NKE-AF1-BLK-8' },
        { color: 'Black', size: '9', sku: 'NKE-AF1-BLK-9' },
      ],
    },
    {
      name: 'Ultraboost 21',
      slug: 'ultraboost-21',
      description: 'The adidas Ultraboost 21 running shoes deliver incredible energy return with a responsive BOOST midsole and a supportive Linear Energy Push system.',
      basePrice: 180,
      categoryId: categories[0].id,
      brandId: brands[1].id,
      gender: 'UNISEX',
      material: 'Primeknit, Boost',
      featured: true,
      variants: [
        { color: 'Core Black', size: '8', sku: 'ADI-UB21-BLK-8' },
        { color: 'Core Black', size: '9', sku: 'ADI-UB21-BLK-9' },
        { color: 'Cloud White', size: '8', sku: 'ADI-UB21-WHT-8' },
        { color: 'Cloud White', size: '9', sku: 'ADI-UB21-WHT-9' },
      ],
    },
    {
      name: 'Yeezy Boost 350 V2',
      slug: 'yeezy-boost-350-v2',
      description: 'The adidas Yeezy Boost 350 V2 features a re-engineered Primeknit upper and innovative Boost cushioning technology.',
      basePrice: 220,
      categoryId: categories[2].id,
      brandId: brands[1].id,
      gender: 'UNISEX',
      material: 'Primeknit, Boost',
      featured: true,
      variants: [
        { color: 'Zebra', size: '8', sku: 'ADI-YZY-ZBR-8' },
        { color: 'Zebra', size: '9', sku: 'ADI-YZY-ZBR-9' },
        { color: 'Beluga', size: '8', sku: 'ADI-YZY-BLG-8' },
        { color: 'Beluga', size: '9', sku: 'ADI-YZY-BLG-9' },
      ],
    },
    {
      name: 'Superstar',
      slug: 'superstar',
      description: 'An icon on the court and the streets, the adidas Superstar shoes have been going strong since 1970.',
      basePrice: 85,
      categoryId: categories[2].id,
      brandId: brands[1].id,
      gender: 'UNISEX',
      material: 'Leather',
      featured: false,
      variants: [
        { color: 'White/Black', size: '7', sku: 'ADI-SS-WB-7' },
        { color: 'White/Black', size: '8', sku: 'ADI-SS-WB-8' },
        { color: 'White/Black', size: '9', sku: 'ADI-SS-WB-9' },
      ],
    },
    {
      name: 'Fresh Foam 1080v11',
      slug: 'fresh-foam-1080v11',
      description: 'The New Balance Fresh Foam 1080v11 provides ultimate comfort with ultra-cushioned Fresh Foam X technology.',
      basePrice: 150,
      categoryId: categories[0].id,
      brandId: brands[2].id,
      gender: 'UNISEX',
      material: 'Hypoknit, Fresh Foam',
      featured: true,
      variants: [
        { color: 'Navy', size: '8', sku: 'NB-FF1080-NVY-8' },
        { color: 'Navy', size: '9', sku: 'NB-FF1080-NVY-9' },
        { color: 'Grey', size: '8', sku: 'NB-FF1080-GRY-8' },
        { color: 'Grey', size: '9', sku: 'NB-FF1080-GRY-9' },
      ],
    },
    {
      name: '990v5',
      slug: '990v5',
      description: 'The New Balance 990v5 continues the legacy of premium quality and Made in USA craftsmanship.',
      basePrice: 175,
      categoryId: categories[2].id,
      brandId: brands[2].id,
      gender: 'UNISEX',
      material: 'Pigskin, Mesh',
      featured: false,
      variants: [
        { color: 'Grey', size: '8', sku: 'NB-990V5-GRY-8' },
        { color: 'Grey', size: '9', sku: 'NB-990V5-GRY-9' },
        { color: 'Navy', size: '8', sku: 'NB-990V5-NVY-8' },
        { color: 'Navy', size: '9', sku: 'NB-990V5-NVY-9' },
      ],
    },
    {
      name: 'Minimus TR',
      slug: 'minimus-tr',
      description: 'Built for functional fitness, the New Balance Minimus TR is designed for training versatility.',
      basePrice: 90,
      categoryId: categories[3].id,
      brandId: brands[2].id,
      gender: 'UNISEX',
      material: 'Synthetic, Mesh',
      featured: false,
      variants: [
        { color: 'Black', size: '8', sku: 'NB-MNTR-BLK-8' },
        { color: 'Black', size: '9', sku: 'NB-MNTR-BLK-9' },
        { color: 'White', size: '8', sku: 'NB-MNTR-WHT-8' },
        { color: 'White', size: '9', sku: 'NB-MNTR-WHT-9' },
      ],
    },
  ];

  for (const productData of productsData) {
    const { variants, ...productInfo } = productData;
    
    const product = await prisma.product.upsert({
      where: { slug: productInfo.slug },
      update: {},
      create: {
        ...productInfo,
        gender: productInfo.gender as any,
        images: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
              alt: `${productInfo.name} - Main`,
              order: 0,
            },
            {
              url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800',
              alt: `${productInfo.name} - Side`,
              order: 1,
            },
          ],
        },
      },
    });

    // Create variants with inventory
    for (const variantData of variants) {
      const variant = await prisma.variant.upsert({
        where: { sku: variantData.sku },
        update: {},
        create: {
          productId: product.id,
          color: variantData.color,
          size: variantData.size,
          sku: variantData.sku,
          priceAdjustment: 0,
        },
      });

      // Create inventory for each variant
      await prisma.inventory.upsert({
        where: { variantId: variant.id },
        update: {},
        create: {
          variantId: variant.id,
          quantity: Math.floor(Math.random() * 50) + 20, // 20-70 items
          reserved: 0,
          lowStockThreshold: 10,
        },
      });
    }

    console.log(`✅ Created product: ${product.name}`);
  }

  // Create banners
  await prisma.banner.createMany({
    data: [
      {
        title: 'Summer Sale',
        subtitle: 'Up to 50% off on selected items',
        imageUrl: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200',
        ctaText: 'Shop Now',
        ctaLink: '/products',
        isActive: true,
        order: 1,
      },
      {
        title: 'New Arrivals',
        subtitle: 'Check out the latest styles',
        imageUrl: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200',
        ctaText: 'Discover',
        ctaLink: '/products?sort=newest',
        isActive: true,
        order: 2,
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Banners created');

  // Create coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        type: 'PERCENTAGE',
        value: 10,
        minPurchase: 50,
        usageLimit: 100,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      },
      {
        code: 'SAVE20',
        type: 'FIXED',
        value: 20,
        minPurchase: 100,
        maxDiscount: 50,
        usageLimit: 50,
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    ],
    skipDuplicates: true,
  });
  console.log('✅ Coupons created');

  console.log('✅ Seeding completed!');
  console.log('\n📝 Test accounts:');
  console.log('Admin: admin@shoestore.com / admin123');
  console.log('User: user@example.com / password123');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
