import {User} from "../user";
import UserPersonalInfoCard from "./userPersonalInfoCard";
import {NavLink} from "react-router";

const UserPersonalInfoController = ({user, isEdit}: { user: User, isEdit: boolean }) => {

  const handleUndo = () => {
    console.log(user);
    // setUser(userFromDto(userDTO));
    // setEdit(false)
  }

  const handleSave = () => {
    // setEdit(false)
  }

  return (
    <div style={{display: "flex", justifyContent: "space-between", flexDirection: "column", width: "max-content"}}>
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
      <UserPersonalInfoCard user={user} isEdit={isEdit}/>
      {isEdit && <NavLink to={"/profile/view"} style={{display: "flex", gap: 18, height: 48}}>
        <button className="undo-edit-button" onClick={handleUndo}>
          отменить
        </button>
        <button className="edit-mode-button" onClick={() => {
          handleSave();
        }}>
          сохранить
          <img src={"/icons/Edit.svg"} alt="Иконка редактирования"/>
        </button>
      </NavLink>
      }
    </div>
  )
}
export default UserPersonalInfoController;