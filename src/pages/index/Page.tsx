import Header from "../../entries/header/header";
import {WorkerStatuses} from "../../shared/statuses/workerStatuses";
import UserMainProperties from "../../entries/userInfo/userMainProperties";

export default function Page() {

    const user = {
        name: "Иванова Анастасия Сергеевна",
        status: WorkerStatuses.work,
        position: "Дизайнер",
        team: "Security/ Продуктовый офис/ ITM"
    }

    return (
        <main className="main">
            <Header/>
            <div className="simple-shadow-card" style={{padding:'20px'}}>
                <UserMainProperties {...user} />
                <div style={{height: 600}}></div>
            </div>
        </main>
    )
}

