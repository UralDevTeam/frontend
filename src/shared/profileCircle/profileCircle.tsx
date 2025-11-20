import {NavLink} from "react-router";

type Props = {
  size: number,
  isAdmin?: boolean,
  toSelf: boolean,
  userId?: string,
}

export default function ProfileCircle({size, isAdmin = false, toSelf = true, userId}: Props) {
  return (
    <NavLink to={toSelf ? `/me` : `/profile/view/${userId}`}>
      <img src={"/man.png"} alt="me" width={size} height={size} style={{borderRadius: "100%"}}/>
    </NavLink>
  )
}
