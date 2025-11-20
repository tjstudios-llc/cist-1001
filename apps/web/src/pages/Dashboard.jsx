export default function Dashboard() {
  return (
    <div>
      <h2 className="section-title">Welcome back</h2>
      <p>Use this dashboard to jump into your codebases, manage deploys, and wire up authentication for your own apps.</p>
      <div className="card-grid" style={{ marginTop: 18 }}>
        <div className="card">
          <h3>Workspace consoles</h3>
          <p>Open terminals with git, package managers, and SSH ready to connect to running sandboxes.</p>
          <button className="button">Launch IDE</button>
        </div>
        <div className="card">
          <h3>Database</h3>
          <p>View connection details for the shared SQLite dev database. Swap in Postgres for production.</p>
          <button className="button secondary">View credentials</button>
        </div>
        <div className="card">
          <h3>Auth providers</h3>
          <p>Offer GitHub OAuth plus local username/password for collaborators and downstream apps.</p>
          <button className="button">Configure</button>
        </div>
      </div>
    </div>
  );
}
