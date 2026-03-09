import React, { useState } from 'react';
import { useFetcher } from '../../../hooks/useFetcher.js';
import './review-form.css';

const ReviewForm = ({ companyId, onReviewAdded }) => {
  const { fetcher } = useFetcher();
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(true);

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
        isAnonymous, // CRITICAL: Added this to the payload
      }),
    });

    setIsSubmitting(false);

    if (response.success) {
      setBody('');
      setJobTitle('');
      setRating(5);
      setIsAnonymous(true); // Reset to default
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

      {/* Logic for Anonymity Toggle */}
      <div className="form-group-checkbox">
        <input
          type="checkbox"
          id="isAnonymous"
          checked={isAnonymous}
          onChange={(e) => setIsAnonymous(e.target.checked)}
        />
        <label htmlFor="isAnonymous">
          Post anonymously?
          <span className="checkbox-hint">
            {isAnonymous
              ? ' (Your name will be hidden)'
              : ' (Your name will be visible)'}
          </span>
        </label>
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
