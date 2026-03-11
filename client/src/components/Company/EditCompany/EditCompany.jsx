import React, { useState, useEffect } from 'react';
import { useFetcher } from '../../../hooks/useFetcher';
import { useParams, useNavigate } from 'react-router-dom';
import '../CompanyRegistration/company-registration.css';

const EditCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetcher } = useFetcher();

  const [formData, setFormData] = useState({
    name: '', industry: '', location: '', description: '',
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Load existing data
  useEffect(() => {
    const fetchCompany = async () => {
      const response = await fetcher(`/api/companies/${id}`);
      if (response.success) {
        // Prevent editing if it's already approved
        if (response.data.data.isApproved) {
          navigate('/my-submissions');
        } else {
          setFormData({
            name: response.data.data.name,
            industry: response.data.data.industry,
            location: response.data.data.location,
            description: response.data.data.description,
          });
        }
      }
      setLoading(false);
    };
    fetchCompany();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: 'info', text: 'Updating your submission...' });

    const response = await fetcher(`/api/companies/my-submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(formData),
    });

    if (response.success) {
      navigate('/my-submissions', { state: { message: 'Submission updated successfully!' } });
    } else {
      setMessage({ type: 'error', text: response.error });
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="registration-container">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Edit Pending Submission</h2>

        {message.text && (
          <div className={`alert ${message.type}`}>{message.text}</div>
        )}

        <div className="form-group">
          <label>Company Name</label>
          <input name="name" value={formData.name} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Industry</label>
          <input name="industry" value={formData.industry} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input name="location" value={formData.location} onChange={handleInputChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} />
        </div>

        <button type="submit" className="submit-btn">Save Changes</button>
      </form>
    </div>
  );
};

export default EditCompany;
