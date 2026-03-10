import React, { useEffect, useState } from 'react';
import './toast.css';

const Toast = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 1. Start the fade-out animation slightly before removing it
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2700);

    // 2. Actually unmount/close the component after 3 seconds
    const removeTimer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  return (
    <div className={`toast-container ${isVisible ? 'toast-enter' : 'toast-exit'}`}>
      <div className="toast-icon">✓</div>
      <div className="toast-message">{message}</div>
    </div>
  );
};

export default Toast;
