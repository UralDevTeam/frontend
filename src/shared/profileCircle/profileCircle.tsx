import {NavLink} from "react-router";

export default function ProfileCircle({size}: { size: number }) {
    return (
        <NavLink to={"/me"}>
            <img src={"man.png"} alt="me" width={size} height={size} style={{borderRadius: "100%"}}/>
        </NavLink>
    )
}