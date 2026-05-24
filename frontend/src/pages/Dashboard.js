import { useEffect, useState } from 'react';
import { getUserDesigns } from '../services/api';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const res = await getUserDesigns();
        setDesigns(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDesigns();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">My Designs</h1>
      {designs.length === 0 ? (
        <div className="empty-state">
          <p>No designs yet.</p>
          <Link to="/studio" className="btn-primary">Create First Design</Link>
        </div>
      ) : (
        <div className="designs-grid">
          {designs.map((design) => (
            <Link key={design._id} to={`/design/${design._id}`} className="design-card">
              {design.generatedImageUrl && (
                <img src={`http://localhost:5000${design.generatedImageUrl}`} alt={design.title} />
              )}
              <div className="design-info">
                <h3>{design.title || 'Untitled'}</h3>
                <p>{design.roomType} • {design.style}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}