import React from 'react';
import ReactDOM from 'react-dom';

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  backgroundColor: 'rgb(34,34,34)',
  transform: 'translate(-50%, -50%)',
  zIndex: 1000,
  height: '90%',
  width: '90%',
  padding: '20px',
  borderRadius: '8px',
  overflowY: 'auto', // Ensure scrolling if content overflows
  color: 'white',
};

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  zIndex: 1000,
};

export default function Modal({ children, onClose }) {
  const modalRoot = document.getElementById('cart-root');

  if (!modalRoot) {
    console.error("Error: 'cart-root' element not found in DOM.");
    return null;
  }

  return ReactDOM.createPortal(
    <>
      <div style={OVERLAY_STYLES} onClick={onClose} />
      <div style={MODAL_STYLES}>
        <button
          className="btn bg-red-500 text-white px-3 py-1 rounded-md"
          style={{ float: 'right' }}
          onClick={onClose}
        >
          X
        </button>
        {children}
      </div>
    </>,
    modalRoot
  );
}
