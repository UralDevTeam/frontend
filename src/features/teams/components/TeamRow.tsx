import React from "react";

type Props = {
  item: any;
  agg: any;
  expanded: Record<string, boolean>;
  toggle: (id: string) => void;
  matched?: boolean;
};

export default function TeamRow({ item, agg, expanded, toggle, matched }: Props) {
  const paddingLeft = 24 * (item.depth + 0.5);

  return (
    <div className="teams-row" style={{ paddingLeft, background: matched ? '#E5F6F3' : undefined }}>
      <div className="teams-row-left">
        {(item.hasChildren || item.hasUsers) ? (
          <button className="teams-tree-toggler" onClick={() => toggle(item.id)} aria-label="toggle">
            {expanded[item.id] ? "▼" : "▶"}
          </button>
        ) : (
          <span className="teams-tree-empty" />
        )}

        <img src={"/icons/folder.svg"} alt="folder" className="teams-tree-icon" />
        <span className="teams-tree-name">{item.name}</span>
      </div>

      <div className="teams-row-right">
        <span className="teams-metric">{agg.employees} сотрудника</span>
        <span className="teams-metric">{agg.groups} групп</span>
        <span className="teams-metric">{agg.departments} отдела</span>
        <span className="teams-metric">{agg.legalEntities} юр. лиц</span>
        <span className="teams-metric">{agg.domains} домен</span>
      </div>
    </div>
  );
}
