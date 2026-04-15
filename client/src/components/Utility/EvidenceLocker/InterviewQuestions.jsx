import Card from 'react-bootstrap/Card';
import { useEffect, useState } from 'react';
import './interview-questions.css';

const InterviewQuestions = ({ companyId, variant }) => {
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch(`/api/interviews/company/${companyId}/questions`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setQuestions(data.questions || []);
            } catch (error) {
                console.error('Error fetching interview questions:', error);
            }
        };
        fetchQuestions();
    }, [companyId]);

  return (
    <div className="interview-questions">
      {companyId ? (
        <Card
          bg={variant.toLowerCase()}
          key={variant}
          text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
          style={{ width: '18rem' }}
          className="mb-2"
        >
          <Card.Header className="card-header">Interview Questions</Card.Header>
          <Card.Body>
            <Card.Title> Interview Questions </Card.Title>
            <Card.Text as="div">
              {questions.length > 0 ? (
                questions.map((question, index) => (
                  <div key={index}>{question}</div>
                ))
              ) : (
                <p>No questions available for this company.</p>
              )}
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <p>No questions available.</p>
      )}
    </div>
  );
};

export default InterviewQuestions;
