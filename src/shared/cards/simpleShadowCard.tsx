import {ReactNode} from "react";
import "./simpleShadowCard.css"

export default function SimpleShadowCard({children}:{children: ReactNode}) {
    return (
        <div className="simple-shadow-card">
            {children}
        </div>
    )
}