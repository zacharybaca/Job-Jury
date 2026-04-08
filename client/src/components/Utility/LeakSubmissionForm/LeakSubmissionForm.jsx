import React, { useState } from 'react';
import { Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import './leak-submission-form.css';

const LeakSubmissionForm = ({ companyId, companyName }) => {
  const [formData, setFormData] = useState({
    role: '',
    difficulty: 3,
    outcome: 'Pending',
  });

  const [questions, setQuestions] = useState([{ text: '', type: 'Technical' }]);
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: 'Technical' }]);
  };

  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'info', message: 'Submitting evidence...' });

    const submissionData = {
      ...formData,
      company: companyId,
      questions: questions.filter(q => q.text.trim() !== ''),
    };

    try {
      const response = await fetch('/api/interviews/submit-leak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Submission failed.');
      }

      setStatus({ type: 'success', message: 'Interview leak successfully logged in the repository.' });

      // Optional: Reset form after success
      setFormData({ role: '', difficulty: 3, outcome: 'Pending' });
      setQuestions([{ text: '', type: 'Technical' }]);
    } catch (err) {
      setStatus({ type: 'danger', message: err.message || 'Submission failed.' });
    }
  };

  return (
    <Card className="leak-form-card shadow-sm border-0">
      <Card.Body className="p-4">
        <h3 className="fw-bold mb-4 text-dark text-center">Log Interview Evidence: {companyName}</h3>

        {status.message && (
          <Alert variant={status.type} className="mb-4">
            {status.message}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          {/* Main Info Row */}
          <Row>
            <Col xs={12} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Target Role</Form.Label>
                <Form.Control
                  type="text"
                  name="role"
                  placeholder="e.g. Full Stack Engineer"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="input-fields"
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={6} md={3}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Difficulty (1-5)</Form.Label>
                <Form.Select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  className="input-fields"
                >
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={6} md={3}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Outcome</Form.Label>
                <Form.Select
                  name="outcome"
                  value={formData.outcome}
                  onChange={handleInputChange}
                  className="input-fields"
                >
                  <option value="Offer">Offer</option>
                  <option value="Rejection">Rejection</option>
                  <option value="Pending">Pending</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <hr className="my-4" />

          <h5 className="fw-bold mb-3">Interview Questions</h5>

          {questions.map((q, index) => (
            <div key={index} className="question-entry p-3 rounded-3 mb-3 bg-light border">
              <Row className="align-items-end">
                <Col xs={12} md={7} className="mb-3 mb-md-0">
                  <Form.Group>
                    <Form.Label className="small fw-bold text-muted">Question Text</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={q.text}
                      onChange={(e) => handleQuestionChange(index, 'text', e.target.value)}
                      placeholder="What was asked?"
                      className="input-fields"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={8} md={3}>
                  <Form.Group>
                    <Form.Label className="small fw-bold text-muted">Type</Form.Label>
                    <Form.Select
                      value={q.type}
                      onChange={(e) => handleQuestionChange(index, 'type', e.target.value)}
                      className="input-fields"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Behavioral">Behavioral</option>
                      <option value="Systems Design">Systems Design</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={4} md={2}>
                  {questions.length > 1 && (
                    <Button
                      variant="outline-danger"
                      className="w-100"
                      onClick={() => removeQuestion(index)}
                    >
                      Remove
                    </Button>
                  )}
                </Col>
              </Row>
            </div>
          ))}

          <div className="text-center text-md-start">
            <Button
              variant="outline-secondary"
              className="mb-4"
              onClick={addQuestion}
            >
              + Add Another Question
            </Button>
          </div>

          <Button
            type="submit"
            className="btn-emerald w-100 py-3 fw-bold shadow-sm"
          >
            Submit Evidence to Repository
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default LeakSubmissionForm;
