import {User} from "../user";
import {NavLink} from "react-router";
import React, {useState} from "react";
import Modal from "../../shared/modal/Modal";
import UserPersonalInfoCard from "./UserPersonalInfoCard/UserPersonalInfoCard";


function SuccessSaveModal({onClose}: { onClose: () => void }) {
  return (
    <Modal onClose={onClose} closeOnBackdrop={false}>
            <div className="modal-body">Ваши данные успешно изменены в личном кабинете</div>
      <div className="modal-actions">
        <button className="edit-mode-button" onClick={onClose}>Хорошо</button>
      </div>
    </Modal>
  )
}

const UserPersonalInfoCardController = ({user, isEdit}: { user: User, isEdit: boolean }) => {

  const [showSuccess, setShowSuccess] = useState(false);

  const handleUndo = () => {
    console.log(user);
    // setUser(userFromDto(userDTO));
    // setEdit(false)
  }

  const handleSave = () => {
    setShowSuccess(true);
  }

  return (
    <div style={{display: "flex", justifyContent: "space-between", flexDirection: "column", width: "max-content"}}>
      {showSuccess && <SuccessSaveModal onClose={() => setShowSuccess(false)}/>}
      <div style={{display: "flex", justifyContent: "space-between", flexDirection: "row"}}>
        <p className="user-profile-section-title">Личное</p>
        {!isEdit && <NavLink to={"/profile/edit"}>
          <button className="edit-mode-button">
            редактировать
            <img src={"/icons/Edit.svg"} alt="Иконка редактирования"/>
          </button>
        </NavLink>
        }
      </div>
      <UserPersonalInfoCard user={user} isEdit={isEdit} onChange={handleSave}/>
      {isEdit && <div style={{display: "flex", gap: 18, height: 48}}>
        <NavLink to={"/profile/view"}>
          <button className="undo-edit-button" onClick={handleUndo}>
            отменить
          </button>
        </NavLink>
        <button className="edit-mode-button" onClick={() => {
          handleSave();
        }}>
          сохранить
          <img src={"/icons/Edit.svg"} alt="Иконка редактирования"/>
        </button>
      </div>
      }

    </div>
  )
}
export default UserPersonalInfoCardController;
