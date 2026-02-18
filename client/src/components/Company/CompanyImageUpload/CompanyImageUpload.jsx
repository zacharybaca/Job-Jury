import React, { useState } from 'react';
import './company-image-upload.css';

const CompanyImageUpload = ({ onImageSelect }) => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageSelect(file); // Pass the file back to the parent form
    }
  };

  return (
    <div className="image-upload-container">
      <label className="upload-label">Company Logo</label>
      <div className="upload-box">
        {preview ? (
          <img src={preview} alt="Preview" className="upload-preview" />
        ) : (
          <div className="upload-placeholder">
            <span>Click to upload logo</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden-input"
        />
      </div>
    </div>
  );
};

export default CompanyImageUpload;
