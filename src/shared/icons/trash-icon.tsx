import React from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import type { IconBaseProps } from "react-icons";

type IconProps = IconBaseProps;

const TrashIcon: React.FC<IconProps> = (props) => {
    return React.createElement(FaRegTrashAlt as React.ComponentType<IconBaseProps>, props);
};

export default TrashIcon;
