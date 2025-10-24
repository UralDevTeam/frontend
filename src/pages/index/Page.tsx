import Header from "../../entries/header/header";
import UserMainProperties from "../../entries/userInfo/userMainProperties";
import UserBasicInfoCard from "../../entries/userInfo/userBasicInfoCard";
import {UserDTO} from "../../entries/user";
import {userFromDto} from "../../entries/user/userFromDto";
import UserPersonalInfoCard from "../../entries/userInfo/userPersonalInfoCard";
import "./profile.css"
import {useState} from "react";

export function Page() {

  const userDTO: UserDTO = {
    id: "udv-001234",
    fio: "Иванова Анастасия Сергеевна",
    mail: "corporate@mail.ru",
    phone: "+7 (902) 123-45-67",
    mattermost: "ссылочка",

    birthday: "04/03/2005",
    team: ["Security", "Продуктовый офис", "ITM"],
    boss: {
      id: "udv-000000",
      shortName: "Самый К. Б.",
      fullName: "Самый Круой Босс",
    },
    role: "Дизайнер",
    experience: 777,
    status: "work",

    city: "Екатеринбург",
    aboutMe: "Катаюсь на сноуборде, люблю кофе. Учусь дополнительно в высшей школе моды."
  }

  const [user, setUser] = useState(userFromDto(userDTO));
  const [isEdit, setEdit] = useState(false)

  const handleUndo = () => {
    console.log(user);
    setUser(userFromDto(userDTO));
    setEdit(false)
  }

  const handleSave = () => {
    setEdit(false)
  }

  return (
    <>
      <Header/>
      <main className="main">
        <div className="simple-shadow-card user-profile-card">
          <UserMainProperties user={user}/>
          <div className={"user-profile-content"}>
            <div className="user-profile-section">
              <p className="user-profile-section-title">Основное</p>
              <UserBasicInfoCard user={user}/>
            </div>
            <div className="user-profile-section">
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <p className="user-profile-section-title">Личное</p>
                {isEdit ? <div style={{display: "flex", gap: 18, height: 48}}>
                    <button className="undo-edit-button" onClick={handleUndo}>
                      отменить
                    </button>
                    <button className="edit-mode-button" onClick={handleSave}>
                      сохранить
                      <img src={"/icons/Edit.svg"} alt="Иконка редактирования"/>
                    </button>
                  </div>
                  :
                  <button className="edit-mode-button" onClick={() => setEdit(true)}>
                    редактировать
                    <img src={"/icons/Edit.svg"} alt="Иконка редактирования"/>
                  </button>
                }
              </div>
              <UserPersonalInfoCard user={user} isEdit={isEdit}/>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

