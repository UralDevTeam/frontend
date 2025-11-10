import {NavLink} from "react-router";
import LightLogo from "../../shared/logo/Light";
import ProfileCircle from "../../shared/profileCircle/profileCircle";
import "./Header.css"

export default function Header() {
    return (
        <header>
            <div className={"left_part"}>
                <LightLogo/>
                <nav>
                    <NavLink to={"/teams"}><p>оргструктура</p></NavLink>
                    <NavLink to={"/employees"}><p>сотрудники</p></NavLink>
                    <NavLink to={"/about"}><p>о&nbsp;системе</p></NavLink>
                </nav>
            </div>
            <div className={"right_part"}>
                <NavLink to={"/me"}>
                    <ProfileCircle size={42}/>
                </NavLink>
                <img src={"/icons/ExitButton.svg"} alt="Exit Button"/>
            </div>
        </header>
    )
}
