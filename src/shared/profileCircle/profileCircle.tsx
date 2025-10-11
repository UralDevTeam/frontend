import {NavLink} from "react-router";

export default function ProfileCircle() {
    return (
        <NavLink to={"/me"}>
            <img src={"man.png"} alt="me" width={42} height={42} style={{borderRadius: "100%"}}/>
        </NavLink>
    )
}