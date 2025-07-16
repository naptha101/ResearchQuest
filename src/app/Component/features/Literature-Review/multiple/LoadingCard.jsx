import { AlertCircle, CheckCircle } from "lucide-react"


const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }
  
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 w-full h-full"></div>
    </div>
  )
}

export const LoadingCard = ({ icon: Icon, title, subtitle, isLoading, hasError, children }) => {
  return (
    <div className="bg-white col-span-2 rounded-xl shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl group">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-lg transition-colors ${isLoading ? 'bg-blue-100 animate-pulse' : hasError ? 'bg-red-100' : 'bg-green-100'}`}>
            {isLoading ? (
              <LoadingSpinner size="sm" className="text-blue-600" />
            ) : hasError ? (
              <AlertCircle className="w-5 h-5 text-red-600" />
            ) : (
              <CheckCircle  className="w-5 h-5 text-green-600" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{subtitle}</p>
          </div>
        </div>
        
        <div className="min-h-[100px] transition-all duration-300">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-500 text-sm animate-pulse">Generating {title.toLowerCase()}...</p>
            </div>
          ) : hasError ? (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
              <p className="text-red-600 text-sm font-medium">Failed to generate {title.toLowerCase()}</p>
              <p className="text-gray-500 text-xs mt-1">Please try again later</p>
            </div>
          ) : (
            <div className="prose max-w-none transition-opacity duration-300">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}