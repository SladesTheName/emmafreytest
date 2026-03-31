import { prisma } from '@/lib/prisma'
import { StatsCard } from '@/components/admin/StatsCard'
import { formatPrice } from '@/lib/utils'
import { DollarSign, Users, ShoppingBag, TrendingUp } from 'lucide-react'

async function getDashboardData() {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [revenue30d, totalSubscribers, recentSales, recentSubscribers, totalSales] =
    await Promise.all([
      prisma.purchase.aggregate({
        where: { createdAt: { gte: thirtyDaysAgo } },
        _sum: { amount: true },
      }),
      prisma.subscriber.count(),
      prisma.purchase.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { product: { select: { name: true } } },
      }),
      prisma.subscriber.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.purchase.count(),
    ])

  return { revenue30d, totalSubscribers, recentSales, recentSubscribers, totalSales }
}

export default async function AdminDashboardPage() {
  const { revenue30d, totalSubscribers, recentSales, recentSubscribers, totalSales } =
    await getDashboardData()

  const revenue = revenue30d._sum.amount ?? 0

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-dark">Dashboard</h1>
        <p className="text-brand-muted text-sm mt-1">Overview of your storefront performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="30-Day Revenue"
          value={formatPrice(revenue)}
          subtitle="Last 30 days"
          icon={<DollarSign className="w-5 h-5" />}
        />
        <StatsCard
          title="Subscribers"
          value={totalSubscribers}
          subtitle="Total email list"
          icon={<Users className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Sales"
          value={totalSales}
          subtitle="All time"
          icon={<ShoppingBag className="w-5 h-5" />}
        />
        <StatsCard
          title="Avg Order"
          value={totalSales > 0 ? formatPrice(revenue / totalSales) : '$0'}
          subtitle="Last 30 days"
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-brand-border">
          <h2 className="font-semibold text-dark mb-4">Recent Sales</h2>
          {recentSales.length === 0 ? (
            <p className="text-brand-muted text-sm text-center py-8">No sales yet</p>
          ) : (
            <div className="space-y-3">
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between py-2 border-b border-brand-border last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-dark truncate">{sale.customerEmail}</p>
                    <p className="text-xs text-brand-muted truncate">{sale.product.name}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-sm font-mono font-semibold text-dark">{formatPrice(sale.amount)}</p>
                    <p className="text-xs text-brand-muted">
                      {new Date(sale.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Subscribers */}
        <div className="bg-white rounded-2xl p-5 card-shadow border border-brand-border">
          <h2 className="font-semibold text-dark mb-4">Recent Subscribers</h2>
          {recentSubscribers.length === 0 ? (
            <p className="text-brand-muted text-sm text-center py-8">No subscribers yet</p>
          ) : (
            <div className="space-y-3">
              {recentSubscribers.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between py-2 border-b border-brand-border last:border-0">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-dark truncate">{sub.email}</p>
                    {sub.name && <p className="text-xs text-brand-muted">{sub.name}</p>}
                  </div>
                  <div className="text-right flex-shrink-0 ml-3">
                    <p className="text-xs text-brand-muted">{sub.source ?? 'newsletter'}</p>
                    <p className="text-xs text-brand-muted">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
