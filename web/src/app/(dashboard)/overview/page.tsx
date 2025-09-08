/**
 * Smart Tourist Safety System - Dashboard Overview
 * Main dashboard overview page with statistics and charts
 */

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Dashboard Overview
        </h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Statistics Cards */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Active Tourists
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            247
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Active Alerts
          </h3>
          <p className="text-2xl font-bold text-orange-600">
            3
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Safety Zones
          </h3>
          <p className="text-2xl font-bold text-green-600">
            12
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Digital IDs
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            189
          </p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Dashboard content will be implemented in upcoming steps...
        </p>
      </div>
    </div>
  );
}
