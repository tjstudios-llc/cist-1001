import { useState } from 'react';

const demoProjects = [
  { id: 1, name: 'Docs site', publishUrl: 'https://docs.example.com', customDomain: 'docs.dev' },
  { id: 2, name: 'Realtime IDE', publishUrl: 'https://ide.example.com', customDomain: 'ide.dev' }
];

export default function Projects() {
  const [projects] = useState(demoProjects);
  return (
    <div>
      <h2 className="section-title">Projects</h2>
      <p>Jump into your codebases, publish static builds, and wire custom domains per workspace.</p>
      <div className="card-grid" style={{ marginTop: 18 }}>
        {projects.map((project) => (
          <div className="card" key={project.id}>
            <h3>{project.name}</h3>
            <p>Publish URL: {project.publishUrl || 'not set'}</p>
            <p>Custom domain: {project.customDomain || 'not set'}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="button">Open code</button>
              <button className="button secondary">Configure domain</button>
            </div>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: 20 }}>
        <h3>Create new project</h3>
        <p>Connect a GitHub repo, set publishing targets, and expose the codebase in the in-browser IDE.</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input placeholder="Project name" />
          <button className="button">Create</button>
        </div>
      </div>
    </div>
  );
}
