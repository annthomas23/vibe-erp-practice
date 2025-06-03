import { prisma } from "@/lib/db";
import Link from "next/link";

async function getProducts() {
  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'desc'
    }
  });
  return products;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link 
          href="/" 
          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          ← Back to Home
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
            {product.description && (
              <p className="text-gray-600 mb-4">{product.description}</p>
            )}
            <p className="text-lg font-bold text-blue-600">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Added {new Date(product.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No products available yet.
        </p>
      )}
    </div>
  );
} 