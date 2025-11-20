export default function Sidebar({ children }) {
  return (
    <aside className="sidebar">
      <h1>Cloud IDE</h1>
      <p>Workspace tools</p>
      <div className="nav-section">{children}</div>
      <div className="nav-section">
        <div className="section-title">Quick actions</div>
        <div className="card" style={{ background: '#1e293b', color: '#e2e8f0' }}>
          <div style={{ fontWeight: 600, marginBottom: 8 }}>Provision sandbox</div>
          <p style={{ margin: '0 0 12px', color: '#cbd5e1' }}>Spin up a new container with Git, SSH, and package installs enabled.</p>
          <button className="button secondary">Launch</button>
        </div>
      </div>
    </aside>
  );
}
