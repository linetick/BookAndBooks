const Modal = ({ isOpen, onClose, children, className = "" }) => {
  if (!isOpen) return null;
  return (
    <div className={`book-reader-modal ${className}`} onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
