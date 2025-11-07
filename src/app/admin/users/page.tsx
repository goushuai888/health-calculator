'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/Header'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface User {
  id: string
  email: string
  username: string
  role: string
  isActive: boolean
  avatar?: string
  lastLoginAt?: string
  createdAt: string
  _count: {
    bmiRecords: number
    bmrRecords: number
    bodyFatRecords: number
  }
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    role: '',
    isActive: '',
    search: '',
  })
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [pagination.page, filters])

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentUser(data.user)
        
        // 检查是否是管理员
        if (data.user.role !== 'ADMIN') {
          router.push('/dashboard')
        }
      } else if (response.status === 401) {
        // 未登录，静默重定向
        router.push('/login')
      } else {
        // 其他错误
        router.push('/login')
      }
    } catch (error) {
      // 静默处理错误，直接重定向
      router.push('/login')
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      })
      
      if (filters.role) params.append('role', filters.role)
      if (filters.isActive) params.append('isActive', filters.isActive)

      const response = await fetch(`/api/admin/users?${params}`)
      
      if (!response.ok) {
        if (response.status === 403) {
          router.push('/dashboard')
          return
        }
        throw new Error('Failed to fetch users')
      }

      const data = await response.json()
      setUsers(data.users)
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    if (!confirm(`确定要${currentStatus ? '禁用' : '启用'}该用户吗？`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || '操作失败')
        return
      }

      fetchUsers()
    } catch (error) {
      console.error('Error toggling user status:', error)
      alert('操作失败')
    }
  }

  const changeUserRole = async (userId: string, newRole: string) => {
    if (!confirm(`确定要将该用户角色改为 ${newRole === 'ADMIN' ? '管理员' : '普通用户'} 吗？`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || '操作失败')
        return
      }

      fetchUsers()
    } catch (error) {
      console.error('Error changing user role:', error)
      alert('操作失败')
    }
  }

  const deleteUser = async (userId: string, username: string) => {
    if (!confirm(`确定要删除用户 "${username}" 吗？此操作不可恢复！`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || '删除失败')
        return
      }

      alert('用户已删除')
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('删除失败')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  const filteredUsers = users.filter(user => {
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      return (
        user.username.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      )
    }
    return true
  })

  if (!currentUser) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p>加载中...</p>
    </div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={currentUser} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">用户管理</h1>
          <p className="text-gray-600 mt-2">管理系统中的所有用户</p>
        </div>

        {/* 筛选和搜索 */}
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              type="text"
              placeholder="搜索用户名或邮箱..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />

            <Select
              value={filters.role}
              onChange={(e) => setFilters({ ...filters, role: e.target.value })}
              options={[
                { value: '', label: '所有角色' },
                { value: 'USER', label: '普通用户' },
                { value: 'ADMIN', label: '管理员' },
              ]}
            />

            <Select
              value={filters.isActive}
              onChange={(e) => setFilters({ ...filters, isActive: e.target.value })}
              options={[
                { value: '', label: '所有状态' },
                { value: 'true', label: '已启用' },
                { value: 'false', label: '已禁用' },
              ]}
            />

            <Button
              variant="outline"
              onClick={() => setFilters({ role: '', isActive: '', search: '' })}
            >
              重置筛选
            </Button>
          </div>
        </Card>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary-600">{pagination.total}</p>
              <p className="text-sm text-gray-600 mt-1">总用户数</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {users.filter(u => u.isActive).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">已启用</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">
                {users.filter(u => !u.isActive).length}
              </p>
              <p className="text-sm text-gray-600 mt-1">已禁用</p>
            </div>
          </Card>
          <Card>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-600">
                {users.filter(u => u.role === 'ADMIN').length}
              </p>
              <p className="text-sm text-gray-600 mt-1">管理员</p>
            </div>
          </Card>
        </div>

        {/* 用户列表 */}
        <Card>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">加载中...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">没有找到用户</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">用户</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">角色</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">状态</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">记录数</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">最后登录</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">注册时间</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={user.role}
                          onChange={(e) => changeUserRole(user.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                          disabled={user.id === currentUser.id}
                        >
                          <option value="USER">普通用户</option>
                          <option value="ADMIN">管理员 👑</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.isActive ? '✓ 已启用' : '✕ 已禁用'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600">
                          {user._count.bmiRecords + user._count.bmrRecords + user._count.bodyFatRecords} 条
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-xs text-gray-600">
                          {user.lastLoginAt ? formatDate(user.lastLoginAt) : '从未登录'}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-xs text-gray-600">{formatDate(user.createdAt)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => toggleUserStatus(user.id, user.isActive)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                            disabled={user.id === currentUser.id}
                          >
                            {user.isActive ? '禁用' : '启用'}
                          </button>
                          <span className="text-gray-300">|</span>
                          <button
                            onClick={() => deleteUser(user.id, user.username)}
                            className="text-sm text-red-600 hover:text-red-800"
                            disabled={user.id === currentUser.id}
                          >
                            删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 分页 */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                显示 {(pagination.page - 1) * pagination.limit + 1} -{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} 条，
                共 {pagination.total} 条
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                >
                  上一页
                </Button>
                <span className="flex items-center px-3 text-sm text-gray-700">
                  第 {pagination.page} / {pagination.totalPages} 页
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page === pagination.totalPages}
                >
                  下一页
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
