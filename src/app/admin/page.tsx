import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { Header } from '@/components/Header'
import { Card } from '@/components/ui/Card'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await getSession()
  
  if (!session) {
    redirect('/login')
  }
  
  if (session.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  // 获取统计数据
  const statsResponse = await fetch('/api/admin/stats', {
    headers: {
      Cookie: `session=${session}`,
    },
    cache: 'no-store',
  }).catch(() => null)
  
  const statsData = statsResponse?.ok ? await statsResponse.json() : null

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={{ username: session.username, email: session.email, role: session.role }} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            👑 管理员面板
          </h1>
          <p className="text-gray-600 mt-2">系统管理和数据统计</p>
        </div>

        {/* 统计卡片 */}
        {statsData?.stats && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">总用户数</p>
                  <p className="text-3xl font-bold text-primary-600 mt-1">
                    {statsData.stats.totalUsers}
                  </p>
                </div>
                <div className="text-4xl">👥</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                今日新增: {statsData.stats.todayUsers}
              </p>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">活跃用户</p>
                  <p className="text-3xl font-bold text-green-600 mt-1">
                    {statsData.stats.activeUsers}
                  </p>
                </div>
                <div className="text-4xl">✅</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                禁用: {statsData.stats.inactiveUsers}
              </p>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">管理员数</p>
                  <p className="text-3xl font-bold text-orange-600 mt-1">
                    {statsData.stats.adminUsers}
                  </p>
                </div>
                <div className="text-4xl">👑</div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">总记录数</p>
                  <p className="text-3xl font-bold text-purple-600 mt-1">
                    {statsData.stats.totalRecords}
                  </p>
                </div>
                <div className="text-4xl">📊</div>
              </div>
            </Card>
          </div>
        )}

        {/* 快速操作 */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Link href="/admin/users">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer border-2 border-orange-200">
              <div className="flex items-center gap-4">
                <div className="text-5xl">👥</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">用户管理</h3>
                  <p className="text-sm text-gray-600">查看、编辑和管理所有用户</p>
                </div>
              </div>
            </Card>
          </Link>

          <Card className="border-2 border-gray-200 opacity-50">
            <div className="flex items-center gap-4">
              <div className="text-5xl">📈</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">数据分析</h3>
                <p className="text-sm text-gray-600">即将推出...</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 最近注册用户 */}
        {statsData?.recentUsers && statsData.recentUsers.length > 0 && (
          <Card title="最近注册用户">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">用户名</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">邮箱</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">角色</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">注册时间</th>
                  </tr>
                </thead>
                <tbody>
                  {statsData.recentUsers.map((user: any) => (
                    <tr key={user.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 text-sm">{user.username}</td>
                      <td className="py-3 px-4 text-sm">{user.email}</td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          user.role === 'ADMIN' 
                            ? 'bg-orange-100 text-orange-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'ADMIN' ? '👑 管理员' : '用户'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(user.createdAt).toLocaleString('zh-CN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <Link href="/admin/users" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                查看所有用户 →
              </Link>
            </div>
          </Card>
        )}
      </main>
    </div>
  )
}

