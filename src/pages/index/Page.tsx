import Header from "../../entries/header/header";
import UserMainProperties from "../../entries/userInfo/userMainProperties";
import UserBasicInfoCard from "../../entries/userInfo/userBasicInfoCard";
import {UserDTO} from "../../entries/user";
import {userFromDto} from "../../entries/user/userFromDto";
import UserPersonalInfoCard from "../../entries/userInfo/userPersonalInfoCard";

export default function Page() {

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

    const user = userFromDto(userDTO);

    return (
        <main className="main">
            <Header/>
            <div className="simple-shadow-card" style={{padding: '20px'}}>
                <UserMainProperties user={user}/>
                <div style={{display: "flex", gap: "20px"}}>
                    <UserBasicInfoCard user={user}/>
                    <UserPersonalInfoCard user={user} isEdit={true}/>
                </div>
            </div>
        </main>
    )
}

