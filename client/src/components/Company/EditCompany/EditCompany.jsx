import React, { useState, useEffect } from 'react';
import { useFetcher } from '../../../hooks/useFetcher';
import { useParams, useNavigate } from 'react-router-dom';
import '../CompanyRegistration/company-registration.css';
import '../CompanyImageUpload/CompanyImageUpload';

export const EditCompanySkeleton = () => {
  return (
    <div className="registration-container">
      <div className="registration-form">
        {/* Title Placeholder */}
        <div className="skeleton-title shimmer"></div>

        {/* Generate 3 standard input placeholders (Name, Industry, Location) */}
        {[...Array(3)].map((_, i) => (
          <div key={i} className="form-group">
            <div className="skeleton-label shimmer"></div>
            <div className="skeleton-input shimmer"></div>
          </div>
        ))}

        {/* Description Textarea Placeholder */}
        <div className="form-group">
          <div className="skeleton-label shimmer"></div>
          <div className="skeleton-textarea shimmer"></div>
        </div>

        {/* Submit Button Placeholder */}
        <div
          className="skeleton-button shimmer"
          style={{ marginTop: '30px' }}
        ></div>
      </div>
    </div>
  );
};

const EditCompany = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetcher } = useFetcher();

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    location: '',
    description: '',
  });

  // NEW: State for the image file and the existing image URL
  const [imageFile, setImageFile] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const fetchCompany = async () => {
      const [response] = await Promise.all([
        fetcher(`/api/companies/${id}`),
        delay(800),
      ]);

      if (response.success) {
        if (response.data.data.isApproved) {
          navigate('/my-submissions');
        } else {
          setFormData({
            name: response.data.data.name,
            industry: response.data.data.industry,
            location: response.data.data.location,
            description: response.data.data.description,
          });
          // Set the existing image so the user knows what is currently saved
          setExistingImageUrl(response.data.data.imageUrl);
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

    // NEW: Use FormData instead of JSON to handle the file upload
    const data = new FormData();
    data.append('name', formData.name);
    data.append('industry', formData.industry);
    data.append('location', formData.location);
    data.append('description', formData.description);

    // Only append the image if the user actually selected a new one
    if (imageFile) {
      data.append('image', imageFile);
    }

    const response = await fetcher(`/api/companies/my-submissions/${id}`, {
      method: 'PUT',
      body: data, // Send the FormData object
    });

    if (response.success) {
      navigate('/my-submissions', {
        state: { message: 'Submission updated successfully!' },
      });
    } else {
      setMessage({ type: 'error', text: response.error });
    }
  };

  if (loading) return <EditCompanySkeleton />;

  return (
    <div className="registration-container">
      <form className="registration-form" onSubmit={handleSubmit}>
        <h2 className="form-title">Edit Pending Submission</h2>

        {message.text && (
          <div className={`alert ${message.type}`}>{message.text}</div>
        )}

        {/* Display existing image hint */}
        {existingImageUrl && !imageFile && (
          <div className="current-image-preview">
            <p className="preview-label">Current Company Logo:</p>
            <img
              src={existingImageUrl}
              alt="Current Logo"
              className="preview-thumbnail"
            />
          </div>
        )}

        {/* The Uploader Component */}
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

        <button type="submit" className="submit-btn">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCompany;
