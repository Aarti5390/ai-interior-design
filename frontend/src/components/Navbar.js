import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  if (!user) return null;
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-links">
          <Link to="/dashboard">🏠 Dashboard</Link>
          <Link to="/studio">✨ New Design</Link>
        </div>
        <div className="user-info">
          <span>Hi, {user.name}</span>
          <button onClick={logout} className="logout-btn">🚪</button>
        </div>
      </div>
    </nav>
  );
}