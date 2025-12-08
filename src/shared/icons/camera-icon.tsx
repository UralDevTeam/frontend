import React from "react";
import { MdOutlineCameraAlt } from "react-icons/md";
import type { IconBaseProps } from "react-icons";

type IconProps = IconBaseProps;

const CameraIcon: React.FC<IconProps> = (props) => {
    return React.createElement(MdOutlineCameraAlt as React.ComponentType<IconBaseProps>, props);
};

export default CameraIcon;
