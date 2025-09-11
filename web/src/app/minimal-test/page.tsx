export default function MinimalTest() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Minimal CSS Test</h1>
      <div className="bg-red-500 text-white p-4 rounded-lg mb-4">
        Red background with white text and rounded corners
      </div>
      <div className="bg-primary text-primary-foreground p-4 rounded-lg mb-4">
        Primary background test
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        Test Button
      </button>
    </div>
  );
}
