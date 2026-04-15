import Card from 'react-bootstrap/Card';

const InterviewQuestions = ({ questions, variant }) => {

  return (
    <div className="interview-questions">
      {questions && questions.length > 0 ? (
        <Card
          bg={variant.toLowerCase()}
          key={variant}
          text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
          style={{ width: '18rem' }}
          className="mb-2"
        >
          <Card.Header>{variant} Interview Questions</Card.Header>
          <Card.Body>
            <Card.Title> Card Title </Card.Title>
            <Card.Text>
              {questions.map((question, index) => (
                <div key={index}>{question}</div>
              ))}
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
