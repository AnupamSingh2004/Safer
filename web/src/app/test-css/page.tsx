export default function TestPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-primary">CSS Test Page</h1>
        
        <div className="grid gap-4">
          <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h2 className="text-2xl font-semibold text-card-foreground mb-4">Card Component</h2>
            <p className="text-muted-foreground">This card should have proper styling with background, border, and text colors.</p>
          </div>
          
          <div className="flex gap-4">
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Primary Button
            </button>
            <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/90 transition-colors">
              Secondary Button
            </button>
            <button className="border border-input bg-background px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">
              Outline Button
            </button>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Test Input</label>
            <input 
              type="text" 
              placeholder="Type something..." 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          If you can see proper colors, borders, and styling above, then Tailwind CSS is working correctly!
        </div>
      </div>
    </div>
  );
}
