import {ReactNode} from "react";

export default function SimpleShadowCard({children}:{children: ReactNode}) {
    return (
        <div className="card">
            {children}
        </div>
    )
}