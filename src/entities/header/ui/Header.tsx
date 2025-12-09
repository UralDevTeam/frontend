import {NavLink, useNavigate} from "react-router";
import {useEffect, useRef, useState} from "react";
import LightLogo from "../../../shared/logo/Light";
import ProfileCircle from "../../../shared/profileCircle/profileCircle";
import {authStore} from "../../../features/auth/model";
import "./Header.css"

const navItems = [
    {to: "/teams", label: "оргструктура"},
    {to: "/employees", label: "сотрудники"},
    {to: "/about", label: "о\u00A0системе"},
];


export default function Header() {
    const navigate = useNavigate();
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const logoutRef = useRef<HTMLDivElement | null>(null);

    const handleLogoutClick = () => setIsLogoutConfirmOpen(true);

    const handleConfirmLogout = () => {
        authStore.logout();
        setIsLogoutConfirmOpen(false);
        navigate('/login', {replace: true});
    };

    const handleCancelLogout = () => setIsLogoutConfirmOpen(false);

    useEffect(() => {
        if (!isLogoutConfirmOpen) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (logoutRef.current && !logoutRef.current.contains(event.target as Node)) {
                setIsLogoutConfirmOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isLogoutConfirmOpen]);

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
                    <ProfileCircle size={43} toSelf={true}/>
                </NavLink>
                <div className="logout" ref={logoutRef}>
                    <button type="button" className="logout__button" onClick={handleLogoutClick}>
                        <img src={"/icons/ExitButton.svg"} alt="Exit Button"/>
                    </button>
                    {isLogoutConfirmOpen && (
                        <div className="logout__confirm">
                            <span className="logout__confirm-text">Вы точно хотите выйти?</span>
                            <div className="logout__confirm-actions">
                                <button type="button" className="logout__confirm-button" onClick={handleConfirmLogout}>
                                    Да
                                </button>
                                <button type="button" className="logout__confirm-button logout__confirm-button--secondary" onClick={handleCancelLogout}>
                                    Нет
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

