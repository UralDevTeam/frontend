import React from "react";
import { LuCopy } from "react-icons/lu";
import type { IconBaseProps } from "react-icons";

type CopyIconProps = IconBaseProps;

const CopyIcon: React.FC<CopyIconProps> = (props) => {
    return React.createElement(LuCopy as React.ComponentType<IconBaseProps>, props);
};

export default CopyIcon;
