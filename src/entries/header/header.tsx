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
                    {/*Todo links */}
                    <NavLink to={"/"}><p>оргструктура</p></NavLink>
                    <NavLink to={"/"}><p>сотрудники</p></NavLink>
                    <NavLink to={"/"}><p>о нас</p></NavLink>
                </nav>
            </div>
            <div className={"right_part"}>
                <ProfileCircle/>
                <img src={"/icons/ExitButton.svg"} alt="Exit Button"/>
            </div>
        </header>
    )
}