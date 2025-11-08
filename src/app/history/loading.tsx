export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16 bg-white border-b border-gray-200" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 animate-pulse">
          <div className="h-9 bg-gray-200 rounded w-32 mb-3" />
          <div className="h-6 bg-gray-200 rounded w-96" />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-3 w-32">
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
                  </th>
                  <th className="text-left py-3 px-3 w-32">
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
                  </th>
                  <th className="text-left py-3 px-3">
                    <div className="h-4 bg-gray-200 rounded w-16 animate-pulse" />
                  </th>
                  <th className="text-left py-3 px-3 min-w-[200px]">
                    <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2 animate-pulse">
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                        <div className="h-4 bg-gray-200 rounded w-16" />
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                    </td>
                    <td className="py-3 px-3">
                      <div className="h-4 bg-gray-200 rounded w-48 animate-pulse" />
                    </td>
                    <td className="py-3 px-3">
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

