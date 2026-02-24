import React, { useState } from 'react';
import { useFetcher } from '../../../hooks/useFetcher.js';
import './review-form.css';

const ReviewForm = ({ companyId, onReviewAdded }) => {
  const { fetcher } = useFetcher();
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const response = await fetcher('/api/reviews', {
      method: 'POST',
      body: JSON.stringify({
        companyId,
        rating,
        body,
        jobTitle,
      }),
    });

    setIsSubmitting(false);

    if (response.success) {
      setBody('');
      setJobTitle('');
      setRating(5);
      // Callback to refresh the company data in the parent component
      if (onReviewAdded) onReviewAdded(response.data.data);
    } else {
      alert(response.error || 'Failed to submit review.');
    }
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Submit Your Verdict</h3>

      <div className="form-row">
        <div className="form-group">
          <label>Job Title</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Software Engineer"
            required
          />
        </div>

        <div className="form-group">
          <label>Rating (1-5)</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
          >
            {[5, 4, 3, 2, 1].map((num) => (
              <option key={num} value={num}>
                {num} Stars
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Your Review</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What is it really like to work here?"
          required
        />
      </div>

      <button
        type="submit"
        className="submit-review-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Post Review'}
      </button>
    </form>
  );
};

export default ReviewForm;
