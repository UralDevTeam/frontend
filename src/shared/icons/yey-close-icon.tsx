import React from "react";
import { GoEyeClosed } from "react-icons/go";
import type { IconBaseProps } from "react-icons";

type IconProps = IconBaseProps;

const EyeCloseIcon: React.FC<IconProps> = (props) => {
    return React.createElement(GoEyeClosed as React.ComponentType<IconBaseProps>, props);
};

export default EyeCloseIcon;
