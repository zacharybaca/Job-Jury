import './avatar.css';

const Avatar = ({ src, alt, size }) => {
  return <img className={`avatar avatar-${size}`} src={src} alt={alt} />;
};

export default Avatar;
