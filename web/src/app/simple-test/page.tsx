export default function SimpleTailwindTest() {
  return (
    <div>
      <h1 style={{ color: 'red', fontSize: '32px', marginBottom: '20px' }}>
        Simple Test Page
      </h1>
      
      <p style={{ marginBottom: '20px' }}>
        This text uses inline styles and should be visible.
      </p>
      
      <div className="bg-red-500 text-white p-4 mb-4">
        This should be RED background with WHITE text (Tailwind)
      </div>
      
      <div className="bg-blue-600 text-white p-4 mb-4">
        This should be BLUE background with WHITE text (Tailwind)
      </div>
      
      <div className="bg-green-500 text-white p-4 mb-4 rounded-lg">
        This should be GREEN background with WHITE text and rounded corners
      </div>
      
      <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded">
        Purple Button (should change on hover)
      </button>
      
      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        If boxes above have no colors, Tailwind CSS is not working.
        If boxes have colors, Tailwind CSS is working correctly.
      </div>
    </div>
  );
}
