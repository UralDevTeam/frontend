import {observer} from "mobx-react-lite";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {NavLink} from "react-router";
import {userStore} from "../../entities/user";
import {apiClient} from "../lib/api-client";
import "./profileCircle.css";
import CameraIcon from "../icons/camera-icon";

type AvatarVariant = "small" | "large";

type Props = {
    size: number,
    isAdmin?: boolean,
    toSelf: boolean,
    userId?: string,
    editable?: boolean,
    addStar?: boolean,
    variant?: AvatarVariant,
    disableNavigation?: boolean,
};

const ProfileCircle = ({
                           size,
                           isAdmin = false,
                           toSelf = true,
                           userId,
                           editable = false,
                           variant,
                           disableNavigation = false,
                           addStar = false,
                       }: Props) => {

    const [avatarUrl, setAvatarUrl] = useState<string>("/defaultPhoto.png");
    const [isUploading, setIsUploading] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const objectUrlRef = useRef<string | null>(null);

    const currentUserId = userStore.user?.id;

    const resolvedUserId = useMemo(() => {
        if (userId) return userId;
        if (toSelf) return currentUserId;
        return undefined;
    }, [currentUserId, toSelf, userId]);

    const starSize = size / 4;

    const avatarVariant: AvatarVariant = variant ?? (size <= 32 ? "small" : "large");

    useEffect(() => {
        let isMounted = true;

        const fetchAvatar = async () => {
            if (!resolvedUserId) {
                setAvatarUrl("/defaultPhoto.png");
                return;
            }

            try {
                const response = await apiClient.fetch(
                    `/api/users/${encodeURIComponent(resolvedUserId)}/avatar/${avatarVariant}`,
                    {method: "GET", cache: "no-store"}
                );

                if (!response.ok) throw new Error("Avatar not found");

                const blob = await response.blob();
                const objectUrl = URL.createObjectURL(blob);

                if (!isMounted) return;

                if (objectUrlRef.current) {
                    URL.revokeObjectURL(objectUrlRef.current);
                }

                objectUrlRef.current = objectUrl;
                setAvatarUrl(objectUrl);
            } catch (error) {
                if (!isMounted) return;
                setAvatarUrl("/defaultPhoto.png");
            }
        };

        fetchAvatar();

        return () => {
            isMounted = false;
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
                objectUrlRef.current = null;
            }
        };
    }, [avatarVariant, refreshKey, resolvedUserId]);

    const triggerFileSelect = () => {
        if (!editable) return;
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !resolvedUserId) return;

        setIsUploading(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await apiClient.fetch(
                `/api/users/${encodeURIComponent(resolvedUserId)}/avatar`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!response.ok) {
                throw new Error("Не удалось загрузить аватар");
            }

            const localUrl = URL.createObjectURL(file);
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current);
            }
            objectUrlRef.current = localUrl;
            setAvatarUrl(localUrl);
            setRefreshKey((prev) => prev + 1);
        } catch (error) {
            console.error(error);
        } finally {
            setIsUploading(false);
            event.target.value = "";
        }
    };

    const content = (
        <div
            className={`profile-circle${editable ? " profile-circle--editable" : ""}`}
            style={{width: size, height: size}}
            onClick={triggerFileSelect}
        >
            {isAdmin && !editable && addStar && (
                <img
                    src={"/icons/Star.svg"}
                    width={starSize}
                    height={starSize}
                    alt={"is admin"}
                    className="profile-circle__admin"
                />
            )}
            <img
                src={avatarUrl}
                alt="avatar"
                width={size}
                height={size}
                className="profile-circle__image"
            />
            {editable && (
                <div className="profile-circle__overlay">
                    <CameraIcon className="camera-icon"/>
                </div>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="profile-circle__input"
                onChange={handleFileChange}
                disabled={isUploading}
            />
        </div>
    );

    if (editable || disableNavigation) {
        return content;
    }

    const profileHref = toSelf ? "/me" : resolvedUserId ? `/profile/view/${resolvedUserId}` : "/profile/view";

    return (
        <NavLink to={profileHref}>
            {content}
        </NavLink>
    );
}

export default observer(ProfileCircle);
