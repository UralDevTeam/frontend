import {NavLink} from "react-router";

type Props = {
  size: number,
  isAdmin?: boolean,
  toSelf: boolean,
  userId?: string,
}

export default function ProfileCircle({size, isAdmin = false, toSelf = true, userId}: Props) {

  const starSize = size / 4;

  return (
    <NavLink to={toSelf ? `/me` : `/profile/view/${userId}`}>
      {isAdmin &&
        <img src={"/icons/Star.svg"} width={starSize} height={starSize} alt={"is admin"}
             style={{position: "absolute", transform: `translate(0, ${size - starSize}px)`}}
        />}
      <img src={"/man.png"} alt="me" width={size} height={size} style={{borderRadius: "100%"}}/>
    </NavLink>
  )
}
