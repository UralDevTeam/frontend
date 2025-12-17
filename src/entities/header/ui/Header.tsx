import {Link, NavLink, useNavigate} from "react-router";
import {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import LightLogo from "../../../shared/logo/Light";
import ProfileCircle from "../../../shared/profileCircle/profileCircle";
import {authStore} from "../../../features/auth/model";
import {useNotifications} from "../../../features/notifications";
import "./Header.css"

const navItems = [
    {to: "/teams", label: "оргструктура"},
    {to: "/employees", label: "сотрудники"},
    {to: "/about", label: "о\u00A0системе"},
];


const Header = observer(function Header() {
    const navigate = useNavigate();
    const {notifications, history} = useNotifications();
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const logoutRef = useRef<HTMLDivElement | null>(null);
    const historyRef = useRef<HTMLDivElement | null>(null);

    const handleLogoutClick = () => setIsLogoutConfirmOpen(true);

    const handleHistoryToggle = () => {
        setIsHistoryOpen(prev => !prev);
        setIsLogoutConfirmOpen(false);
    };

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

    useEffect(() => {
        if (!isHistoryOpen) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (historyRef.current && !historyRef.current.contains(event.target as Node)) {
                setIsHistoryOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("touchstart", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [isHistoryOpen]);

    const formatTime = (timestamp: number) => {
        return new Date(timestamp).toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
    };

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
                <div className="notifications" ref={historyRef}>
                    <button type="button" className="notifications__button" onClick={handleHistoryToggle}>
                        <img src={"/icons/notification-on.svg"} alt="Уведомления"/>
                        {notifications.length > 0 && <span className="notifications__badge">{notifications.length}</span>}
                    </button>
                    {isHistoryOpen && (
                        <div className="notifications__dropdown">
                            <div className="notifications__dropdown-header">
                                <span>Уведомления</span>
                                <span className="notifications__counter">{history.length}</span>
                            </div>
                            {history.length === 0 ? (
                                <div className="notifications__empty">История уведомлений пуста</div>
                            ) : (
                                <ul className="notifications__list">
                                    {history.map(item => (
                                        <li key={item.id} className={`notifications__item notifications__item--${item.type}`}>
                                            <div className="notifications__item-head">
                                                <span className="notifications__item-type">{item.type}</span>
                                                <span className="notifications__item-time">{formatTime(item.createdAt)}</span>
                                            </div>
                                            <div className="notifications__item-message">{item.message}</div>
                                            {item.link && (
                                                <Link to={item.link.href} className="notifications__item-link" onClick={() => setIsHistoryOpen(false)}>
                                                    {item.link.text}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
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
})

export default Header;

