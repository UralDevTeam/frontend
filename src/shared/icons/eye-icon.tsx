import React from "react";
import { GoEye } from "react-icons/go";
import type { IconBaseProps } from "react-icons";

type IconProps = IconBaseProps;

const EyeIcon: React.FC<IconProps> = (props) => {
    return React.createElement(GoEye as React.ComponentType<IconBaseProps>, props);
};

export default EyeIcon;
