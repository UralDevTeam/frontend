import Header from "../../entries/header/header";
import {UserDTO} from "../../entries/user";
import {userFromDto} from "../../entries/user/userFromDto";
import "./profile.css"
import {useState} from "react";
import {Navigate, Route, Routes} from 'react-router';
import UserProfileView from '../userProfile/UserProfileView';
import UserProfileEdit from '../userProfile/UserProfileEdit';
import Employees from "../employees/Employees";
import Teams from "../teams/Teams";
import About from "./About";

export const userDTO: UserDTO = {
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
  aboutMe: "Катаюсь на сноуборде, люблю кофе. Учусь дополнительно в высшей школе моды. Катаюсь на сноуборде, люблю кофе. Учусь дополнительно в высшей школе моды. Катаюсь на сноуборде, люблю кофе. Учусь дополнительно в высшей школе моды. Катаюсь на сноуборде, люблю кофе. Учусь дополнительно в высшей школе моды. "
}

export function Page() {

  const user = useState(userFromDto(userDTO))[0];

  return (
    <>
      <Header/>
      <main className="main">
        <Routes>
          <Route path="/" element={(
            <Navigate to="/profile/view" replace={true}/>
          )}/>

          <Route path="/profile/view" element={<UserProfileView user={user}/>}/>
          <Route path="/profile/edit" element={<UserProfileEdit initialUser={user}/>}/>
          <Route path="/employees" element={<Employees />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </>
  )
}
