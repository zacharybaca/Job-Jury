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
        questions.length > 0 ? (
          questions.map((question, index) => (
            <Card
              bg={variant.toLowerCase()}
              key={index}
              text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
              style={{ width: '18rem' }}
              className="mb-2 question-card"
            >
              <Card.Header className="card-header">Question {index + 1}</Card.Header>
              <Card.Body>
                <Card.Text as="div">
                  <div>{question}</div>
                </Card.Text>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No questions available for this company.</p>
        )
      ) : (
        <p>No questions available.</p>
      )}
    </div>
  );
};

export default InterviewQuestions;
