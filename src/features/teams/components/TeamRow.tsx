import React from "react";
import FolderIcon from "./FolderIcon";

type Props = {
  item: any;
  agg: any;
  expanded: Record<string, boolean>;
  toggle: (id: string) => void;
  matched?: boolean;
};


export default function TeamRow({item, agg, expanded, toggle, matched}: Props) {
  const paddingLeft = 24 * (item.depth + 0.5);

  return (
    <div className="teams-row" style={{paddingLeft, background: matched ? '#E5F6F3' : undefined}}>
      <div className="teams-row-left">
        {(item.hasChildren || item.hasUsers) ? (
          <button className="teams-tree-toggler" onClick={() => toggle(item.id)} aria-label="toggle">
            <img src={expanded[item.id] ? "/icons/folder_state_open.svg" : "/icons/folder_state_close.svg"}
                 alt="toggle open folder"/>
          </button>
        ) : (
          <span className="teams-tree-empty"/>
        )}

        <FolderIcon depth={item.depth}/>
        <span className="teams-tree-name">{item.name}</span>
      </div>

      <div className="teams-row-right">
        <span className="teams-metric">{agg.employees}</span>
        <span className="teams-metric">{agg.groups}</span>
        <span className="teams-metric">{agg.departments}</span>
        <span className="teams-metric">{agg.legalEntities}</span>
        <span className="teams-metric">{agg.domains}</span>
      </div>
    </div>
  );
}
