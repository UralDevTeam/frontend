import React from "react";

const FolderColor = new Map<number, string>([
  [0, "#763186"],
  [1, "#763186"],
  [2, "#DBF4A7"],
  [3, "#C6DCFF"],
]);

export default function FolderIcon({depth}: { depth: number }) {
  const fill = FolderColor.get(depth) ?? "#FFF6B5";
  return (
    <svg width="26" height="21" viewBox="0 0 26 21" fill={fill} xmlns="http://www.w3.org/2000/svg"
         className="teams-tree-icon">
      <path
        d="M2.6 21C1.885 21 1.27313 20.7432 0.7644 20.2296C0.255667 19.7159 0.000866667 19.0977 0 18.375V2.625C0 1.90312 0.2548 1.28537 0.7644 0.77175C1.274 0.258125 1.88587 0.000875 2.6 0H10.4L13 2.625H23.4C24.115 2.625 24.7273 2.88225 25.2369 3.39675C25.7465 3.91125 26.0009 4.529 26 5.25V18.375C26 19.0969 25.7456 19.7151 25.2369 20.2296C24.7282 20.7441 24.1159 21.0009 23.4 21H2.6Z"
      />
    </svg>

  )
}