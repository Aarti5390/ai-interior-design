import { useState } from 'react';
import { createDesign } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function DesignStudio() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [roomType, setRoomType] = useState('Living Room');
  const [style, setStyle] = useState('Modern');
  const [promptText, setPromptText] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('roomType', roomType);
    formData.append('style', style);
    formData.append('promptText', promptText);
    if (imageFile) formData.append('image', imageFile);

    try {
      const res = await createDesign(formData);
      navigate(`/design/${res.data._id}`);
    } catch (err) {
      alert('AI generation failed: ' + (err.response?.data?.error || 'Server error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="studio-container">
      <h1 className="dashboard-title">✨ Create New Design</h1>
      <form onSubmit={handleSubmit} className="studio-form">
        <div className="form-group">
          <input type="text" placeholder="Project Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-row">
          <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
            <option>Living Room</option><option>Bedroom</option><option>Kitchen</option><option>Office</option>
          </select>
          <select value={style} onChange={(e) => setStyle(e.target.value)}>
            <option>Modern</option><option>Bohemian</option><option>Industrial</option><option>Scandinavian</option><option>Minimalist</option>
          </select>
        </div>
        <div className="form-group">
          <textarea placeholder="Describe your dream room (e.g. 'with large windows, plants, and wooden floor')" value={promptText} onChange={(e) => setPromptText(e.target.value)} rows="3"></textarea>
        </div>
        <div className="file-upload">
          <label>Upload Room Photo (optional)</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          {preview && <img src={preview} alt="Preview" className="image-preview" />}
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Generating AI Design...' : 'Generate AI Makeover'}
        </button>
      </form>
    </div>
  );
}