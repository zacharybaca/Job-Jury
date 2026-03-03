import Button from 'react-bootstrap/Button';
import './save-button.css';

const SaveButton = ({ onSave, title, classTitle }) => {
  return (
    <div className="d-flex gap-2 mb-2">
      <Button
        type="button"
        onClick={onSave}
        variant="primary"
        size="lg"
        className={classTitle}
      >
        {title}
      </Button>
    </div>
  );
};

export default SaveButton;
