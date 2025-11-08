export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-16 bg-white border-b border-gray-200" />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-pulse">
          <div className="h-9 bg-gray-200 rounded w-32 mb-3" />
          <div className="h-6 bg-gray-200 rounded w-64" />
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-3" />
                  <div className="h-10 bg-gray-200 rounded w-16" />
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
          <div className="grid md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-24 mb-4" />
          <div className="h-32 bg-gray-100 rounded-lg" />
        </div>
      </main>
    </div>
  )
}

