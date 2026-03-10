import React, { useEffect, useState } from 'react';
import './toast.css';

// Added 'type' prop (defaults to 'success')
const Toast = ({ message, type = 'success', onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => setIsVisible(false), 2700);
    const removeTimer = setTimeout(() => onClose(), 3000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  // Determine styles based on type
  const isError = type === 'error';
  const icon = isError ? '!' : '✓';
  const containerClass = isError ? 'toast-error' : 'toast-success';

  return (
    <div className={`toast-container ${containerClass} ${isVisible ? 'toast-enter' : 'toast-exit'}`}>
      <div className="toast-icon">{icon}</div>
      <div className="toast-message">{message}</div>
    </div>
  );
};

export default Toast;
