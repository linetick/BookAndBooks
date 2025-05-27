const Modal = ({ isOpen, onClose, children, className = "", closeOnOverlayClick = true }) => {
  if (!isOpen) return null;
  return (
    <div className={`book-reader-modal ${className}`} onClick={closeOnOverlayClick ? onClose : undefined}>
      <div onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
