import {NavLink} from "react-router";
import LightLogo from "../../shared/logo/Light";
import ProfileCircle from "../../shared/profileCircle/profileCircle";
import "./Header.css"

export default function Header() {
    return (
        <header>
            <div className={"left_part"}>
                <h1 style={{display: "none"}}>UDV|GROUP</h1>
                <LightLogo/>
                <nav>
                    <NavLink to={"/"}><p>оргструктура</p></NavLink>
                    <NavLink to={"/"}><p>сотрудники</p></NavLink>
                    <NavLink to={"/"}><p>о нас</p></NavLink>
                    <NavLink to={"/profile/view"}><p>мой профиль</p></NavLink>
                    <NavLink to={"/profile/edit"}><p>редактировать профиль</p></NavLink>
                </nav>
            </div>
            <div className={"right_part"}>
                <ProfileCircle size={42}/>
                <img src={"/icons/ExitButton.svg"} alt="Exit Button"/>
            </div>
        </header>
    )
}