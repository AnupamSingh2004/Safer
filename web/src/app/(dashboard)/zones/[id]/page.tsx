export default function ZoneDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Zone Details: {params.id}
      </h1>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <p className="text-gray-600 dark:text-gray-400">
          Placeholder for upcoming implementation
        </p>
      </div>
    </div>
  );
}
