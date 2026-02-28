import { notFound } from "next/navigation";
import ProductDetail from "../../../components/feature/product/components/ProductDetail";

// Mock product data with multiple images
const products = [
  {
    id: 1,
    name: "Artisan Welcome Hamper",
    description:
      "A curated selection of premium local artisan goods, thoughtfully arranged for a warm welcome.",
    category: "Signature Hamper Collection",
    images: [
      "/product/product-1.jpeg",
      "/product/banner-1.jpeg",
      "/product/product-2.jpeg",
    ],
  },
  {
    id: 2,
    name: "Heritage Gift Collection",
    description:
      "Timeless pieces celebrating craftsmanship and tradition, perfect for meaningful moments.",
    category: "Artisan Gift Curation",
    images: [
      "/product/product-2.jpeg",
      "/product/product-3.jpeg",
      "/product/banner-1.jpeg",
    ],
  },
  {
    id: 3,
    name: "Gentle Beginnings Set",
    description:
      "Soft, organic essentials for the newest member of the family, wrapped with love.",
    category: "Premium Baby Essential",
    images: [
      "/product/product-3.jpeg",
      "/product/product-1.jpeg",
      "/product/product-4.jpeg",
    ],
  },
  {
    id: 4,
    name: "Executive Appreciation",
    description:
      "Sophisticated branded gifts that reflect excellence and professional gratitude.",
    category: "Corporate Gift",
    images: [
      "/product/product-4.jpeg",
      "/product/banner-1.jpeg",
      "/product/product-2.jpeg",
    ],
  },
  {
    id: 5,
    name: "Celebration Hamper",
    description:
      "Luxurious treats and delights curated to mark special occasions with elegance.",
    category: "Signature Hamper Collection",
    images: [
      "/product/product-1.jpeg",
      "/product/product-3.jpeg",
      "/product/banner-1.jpeg",
    ],
  },
  {
    id: 6,
    name: "Handcrafted Treasures",
    description:
      "Unique artisan pieces selected for their beauty, quality, and story.",
    category: "Artisan Gift Curation",
    images: [
      "/product/product-2.jpeg",
      "/product/product-4.jpeg",
      "/product/product-1.jpeg",
    ],
  },
  {
    id: 7,
    name: "Nursery Essentials Bundle",
    description:
      "Premium quality baby items in soft, natural materials for gentle care.",
    category: "Premium Baby Essential",
    images: [
      "/product/product-3.jpeg",
      "/product/banner-1.jpeg",
      "/product/product-2.jpeg",
    ],
  },
  {
    id: 8,
    name: "Corporate Recognition Set",
    description:
      "Elegant branded merchandise designed to honor achievement and partnership.",
    category: "Corporate Gift",
    images: [
      "/product/product-4.jpeg",
      "/product/product-1.jpeg",
      "/product/product-3.jpeg",
    ],
  },
  {
    id: 9,
    name: "Seasonal Delights Hamper",
    description:
      "A carefully composed collection celebrating the finest seasonal offerings.",
    category: "Signature Hamper Collection",
    images: [
      "/product/product-1.jpeg",
      "/product/product-2.jpeg",
      "/product/banner-1.jpeg",
    ],
  },
  {
    id: 10,
    name: "Artisan Home Collection",
    description:
      "Beautiful handmade pieces to elevate everyday living with intention.",
    category: "Artisan Gift Curation",
    images: [
      "/product/product-2.jpeg",
      "/product/product-3.jpeg",
      "/product/product-4.jpeg",
    ],
  },
  {
    id: 11,
    name: "New Parent Care Package",
    description:
      "Thoughtful essentials for both baby and parents during precious early days.",
    category: "Premium Baby Essential",
    images: [
      "/product/product-3.jpeg",
      "/product/banner-1.jpeg",
      "/product/product-1.jpeg",
    ],
  },
  {
    id: 12,
    name: "Leadership Excellence Gift",
    description:
      "Distinguished gifts that convey respect and appreciation for leadership.",
    category: "Corporate Gift",
    images: [
      "/product/product-4.jpeg",
      "/product/product-2.jpeg",
      "/product/product-3.jpeg",
    ],
  },
];

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const productId = parseInt(id);
  const product = products.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  return <ProductDetail product={product} />;
}

// Generate static params for all products
export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}
