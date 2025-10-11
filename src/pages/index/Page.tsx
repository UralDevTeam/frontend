import Header from "../../entries/header/header";
import SimpleShadowCard from "../../shared/cards/simpleShadowCard";
import ProfileCircle from "../../shared/profileCircle/profileCircle";
import {WorkerStatuses} from "../../shared/statuses/workerStatuses";
import WorkerStatus from "../../shared/statuses/workerStatus";

export default function Page() {

    const user = {
        name: "Иванова Анастасия Сергеевна",
        state: "Работает"
    }

    return (
        <main className="main">
            <Header/>
            <SimpleShadowCard>
                <div>
                    <ProfileCircle size={106}/>
                    <div>
                        <h3>{user.name}</h3>
                        <div>
                            <WorkerStatus status={WorkerStatuses.work}/>
                        </div>
                    </div>
                </div>

            </SimpleShadowCard>
        </main>
    )
}

