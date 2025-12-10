import React from "react";
import "./rowInfo.css"

type RowInfoProps = {
    label: string;
    children: React.ReactNode;
    className?: string;
    tooltipContent?: React.ReactNode;
    showTooltipTrigger?: boolean;
};

export default function RowInfo({label, children, className, tooltipContent, showTooltipTrigger = true}: RowInfoProps) {
    const labelContent = tooltipContent && showTooltipTrigger ? (
        <div className="row-info__label-with-tooltip">
            <span>{label}</span>
            <div className="row-info__tooltip-trigger" tabIndex={0}>
                ?
                <div className="row-info__tooltip-content">{tooltipContent}</div>
            </div>
        </div>
    ) : label;

    return (
    <div className={`row-info ${className ?? ""}`}>
      <div className={"label"}>{labelContent}</div>
      <div className={"value"}>{children}</div>
    </div>
  )
}
