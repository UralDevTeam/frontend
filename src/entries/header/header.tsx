import {NavLink} from "react-router";
import LightLogo from "../../shared/logo/Light";
import ProfileCircle from "../../shared/profileCircle/profileCircle";
import "./Header.css"

const navItems = [
  {to: "/teams", label: "оргструктура"},
  {to: "/employees", label: "сотрудники"},
  {to: "/about", label: "о\u00A0системе"},
];


export default function Header() {
  return (
    <header>
      <div className={"left_part"}>
        <LightLogo/>
        <nav>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({isActive}) => `header-link${isActive ? " header-link--active" : ""}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className={"right_part"}>
        <NavLink to={"/me"}>
          <ProfileCircle size={42} toSelf={true} />
        </NavLink>
        {/*<img src={"/icons/ExitButton.svg"} alt="Exit Button"/>*/}
      </div>
    </header>
  )
}
