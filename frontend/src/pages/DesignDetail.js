import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDesignById } from '../services/api';
import { ReactCompareSlider } from 'react-compare-slider';

export default function DesignDetail() {
  const { id } = useParams();
  const [design, setDesign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDesign = async () => {
      try {
        const res = await getDesignById(id);
        setDesign(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDesign();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!design) return <div className="loading">Design not found</div>;

  const originalUrl = design.originalImageUrl ? `http://localhost:5000${design.originalImageUrl}` : null;
  const generatedUrl = `http://localhost:5000${design.generatedImageUrl}`;

  return (
    <div className="detail-container">
      <h1 className="detail-title">{design.title || 'Design'}</h1>
      <p className="detail-subtitle">{design.roomType} • {design.style}</p>
      <div className="image-slider">
        <h3 className="slider-label">Before / After</h3>
        {originalUrl ? (
          <ReactCompareSlider
            itemOne={<img src={originalUrl} alt="Original" style={{ width: '100%', borderRadius: '12px' }} />}
            itemTwo={<img src={generatedUrl} alt="Generated" style={{ width: '100%', borderRadius: '12px' }} />}
          />
        ) : (
          <img src={generatedUrl} alt="Generated" style={{ width: '100%', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
        )}
      </div>
      {design.designTips && (
        <div className="tips-box">
          <h3>✨ AI Design Tips</h3>
          <p>{design.designTips}</p>
        </div>
      )}
    </div>
  );
}