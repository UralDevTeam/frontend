import Header from "../../entries/header/header";
import SimpleShadowCard from "../../shared/cards/simpleShadowCard";
import ProfileCircle from "../../shared/profileCircle/profileCircle";

export default function Page() {
    return (
        <main className="main">
            <Header/>
            <SimpleShadowCard>
                <ProfileCircle size={106}/>
            </SimpleShadowCard>
        </main>
    )
}