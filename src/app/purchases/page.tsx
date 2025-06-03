import { formatDistance } from "date-fns";
import { prisma } from "../../lib/prisma";

async function getPurchases() {
  // Get the test user
  const testUser = await prisma.user.findUnique({
    where: {
      email: "test@test.com"
    }
  });

  if (!testUser) {
    throw new Error("Test user not found");
  }

  // Get purchases for test user directly from database
  const purchases = await prisma.purchaseOrder.findMany({
    where: {
      userId: testUser.id
    },
    include: {
      lineItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return purchases;
}

export default async function PurchasesPage() {
  const purchases = await getPurchases();

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Purchase History</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {purchases.map((purchase: any) => (
              <tr key={purchase.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {purchase.orderNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDistance(new Date(purchase.createdAt), new Date(), { addSuffix: true })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${purchase.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                    purchase.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'}`}>
                    {purchase.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <ul className="list-disc list-inside">
                    {purchase.lineItems.map((item: any) => (
                      <li key={item.id}>
                        {item.product.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${purchase.totalAmount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 