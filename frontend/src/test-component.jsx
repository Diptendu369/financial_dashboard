export default function TestComponent() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      <div style={{ padding: "20px" }}>
        <h1 style={{ color: "#333", fontSize: "24px" }}>Test Component</h1>
        <p style={{ color: "#666", fontSize: "16px" }}>If you can see this, the basic rendering works.</p>
        <div style={{ 
          width: "80px", 
          height: "80px", 
          backgroundColor: "#8B5CF6", 
          borderRadius: "50%",
          marginTop: "20px"
        }}>
          Test Circle
        </div>
      </div>
    </div>
  );
}
