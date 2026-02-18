import React, { useState } from 'react';
import { useFetcher } from '../../hooks/useFetcher';
import CompanyImageUpload from '../CompanyImageUpload/CompanyImageUpload';
import './company-registration.css';

const CompanyRegistration = () => {
  const { fetcher } = useFetcher();
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    description: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: 'info', text: 'Submitting to the Jury...' });

    // 1. Create FormData for multipart/form-data (required for images)
    const data = new FormData();
    data.append('name', formData.name);
    data.append('industry', formData.industry);
    data.append('location', formData.location);
    data.append('description', formData.description);
    if (imageFile) {
      data.append('image', imageFile);
    }

    // 2. Use the fetcher
    const response = await fetcher('/api/companies', {
      method: 'POST',
      body: data
    });

    if (response.success) {
      setMessage({ type: 'success', text: 'Company registered successfully!' });
      // Reset form
      setFormData({ name: '', industry: '', location: '', description: '' });
    } else {
      setMessage({ type: 'error', text: response.error });
    }
  };

  return (
    <div className="registration-container">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Register Company</h2>

        {message.text && (
          <div className={`alert ${message.type}`}>{message.text}</div>
        )}

        <CompanyImageUpload onImageSelect={(file) => setImageFile(file)} />

        <div className="form-group">
          <label>Company Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Industry</label>
          <input
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" className="submit-btn">Register Company</button>
      </form>
    </div>
  );
};

export default CompanyRegistration;
