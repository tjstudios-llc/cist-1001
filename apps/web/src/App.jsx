import { NavLink, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Projects from './pages/Projects.jsx';
import AuthIntegration from './pages/AuthIntegration.jsx';
import Sidebar from './components/Sidebar.jsx';

export default function App() {
  return (
    <div className="layout">
      <Sidebar>
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/">
          Dashboard
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/projects">
          Projects
        </NavLink>
        <NavLink className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="/auth">
          Login integration
        </NavLink>
      </Sidebar>
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/auth" element={<AuthIntegration />} />
        </Routes>
      </main>
    </div>
  );
}
