import Card from 'react-bootstrap/Card';
import { useEffect, useState } from 'react';
import { useFetcher } from '../../../hooks/useFetcher';
import './interview-questions.css';

const InterviewQuestions = ({ companyId, variant }) => {
  const [questions, setQuestions] = useState([]);
  const { fetcher } = useFetcher();

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!companyId) return;

      const response = await fetcher(
        `/api/interviews/company/${companyId}/questions`
      );

      if (response.success) {
        setQuestions(response.data.questions || []);
      } else {
        console.error('Error fetching interview questions:', response.error);
      }
    };
    fetchQuestions();
  }, [companyId, fetcher]);

  return (
    <div className="interview-questions">
      <div className="interview-questions-section-header">
        <div className="section-header">
          <h4 className="fw-bold m-0">Interview Questions</h4>
        </div>
      </div>
      <div className="questions-container d-flex flex-wrap justify-content-start gap-3">
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
                <Card.Header className="card-header">
                  Question {index + 1}
                </Card.Header>
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
    </div>
  );
};

export default InterviewQuestions;
