import React from 'react';
import './modal.css';

type Props = {
  children: React.ReactNode;
  onClose?: () => void;
  closeOnBackdrop?: boolean;
}

export default function Modal({children, onClose, closeOnBackdrop = true}: Props) {
  return (
    <div className="udv-modal-overlay" onClick={() => closeOnBackdrop && onClose && onClose()}>
      <div className="udv-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal={true}>
        {children}
      </div>
    </div>
  )
}

