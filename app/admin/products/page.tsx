import { prisma } from '@/lib/prisma'
import { ProductsManager } from './ProductsManager'

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { sortOrder: 'asc' },
  })

  return <ProductsManager initialProducts={products} />
}
