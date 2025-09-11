export default function CSSDebugPage() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-8">CSS Debug Test</h1>
      
      {/* Direct CSS test */}
      <div 
        className="mb-8"
        style={{
          backgroundColor: 'red',
          color: 'white', 
          padding: '20px',
          fontSize: '24px',
          border: '3px solid blue'
        }}
      >
        Direct CSS Test - Should be RED background with WHITE text
      </div>
      
      {/* Basic Tailwind test */}
      <div className="bg-red-500 text-white p-4 text-xl border-2 border-blue-500 mb-8">
        Basic Tailwind Test - Should be RED background, WHITE text, with BLUE border
      </div>
      
      {/* Custom CSS variables test */}
      <div className="bg-primary text-primary-foreground p-4 rounded-lg mb-8">
        Primary Color Test - Should use CSS custom properties
      </div>
      
      {/* Mixed test */}
      <div 
        className="mb-8 p-4 bg-blue-500 text-white text-xl border-2 border-red-500"
        style={{ backgroundColor: 'orange' }}
      >
        Mixed CSS + Tailwind Test (should be ORANGE from inline style, overriding blue)
      </div>
      
      {/* Utility classes test */}
      <div className="flex gap-4 mb-8">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
          Blue Button
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          Green Button
        </button>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
          Purple Button
        </button>
      </div>
      
      <div className="text-gray-600 text-sm">
        If you see properly styled elements above, CSS is working correctly.
        If elements look unstyled (no colors, no spacing), CSS is not loading.
      </div>
    </div>
  );
}
