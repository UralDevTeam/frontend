import React from "react";
import { LuCopy } from "react-icons/lu";
import type { IconBaseProps } from "react-icons";

type IconProps = IconBaseProps;

const CopyIcon: React.FC<IconProps> = (props) => {
    return React.createElement(LuCopy as React.ComponentType<IconBaseProps>, props);
};

export default CopyIcon;
