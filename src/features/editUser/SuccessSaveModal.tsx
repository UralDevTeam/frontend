import React from "react";
import Modal from "../../shared/modal/Modal";

export default function SuccessSaveModal({onClose}: { onClose: () => void }) {
    return (
        <Modal onClose={onClose} closeOnBackdrop={false}>
            <div className="modal-body">Ваши данные успешно изменены в личном кабинете</div>
            <div className="modal-actions">
                <button className="edit-mode-button" onClick={onClose}>Хорошо</button>
            </div>
        </Modal>
    )
}

