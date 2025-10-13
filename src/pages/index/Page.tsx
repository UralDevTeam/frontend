import Header from "../../entries/header/header";
import UserMainProperties from "../../entries/userInfo/userMainProperties";
import UserBasicInfoCard from "../../entries/userInfo/userBasicInfoCard";
import { UserDTO} from "../../entries/user";
import {userFromDto} from "../../entries/user/userFromDto";

export default function Page() {

    const userDTO: UserDTO = {
        id: "udv-001234",
        fio: "Иванова Анастасия Сергеевна",
        birthday: "04/03/2005",
        team: ["Security", "Продуктовый офис", "ITM"],
        role: "Дизайнер",
        grade: "Middle+",
        experience: 777,
        status: "work",
    }

    const user = userFromDto(userDTO);

    return (
        <main className="main">
            <Header/>
            <div className="simple-shadow-card" style={{padding: '20px'}}>
                <UserMainProperties user={user} />
                <UserBasicInfoCard user={user} />
            </div>
        </main>
    )
}

