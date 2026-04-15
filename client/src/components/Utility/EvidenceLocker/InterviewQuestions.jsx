

const InterviewQuestions = ({ questions }) => {

  return (
    <div className="interview-questions">
      {questions && questions.length > 0 ? (
        <ul>
          {questions.map((question, index) => (
            <li key={index}>{question}</li>
          ))}
        </ul>
      ) : (
        <p>No questions available.</p>
      )}
    </div>
  );
};

export default InterviewQuestions;
