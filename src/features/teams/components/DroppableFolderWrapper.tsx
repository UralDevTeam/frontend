import React, {useState} from 'react';

interface DroppableFolderWrapperProps {
  folderId: string;
  folderName: string;
  children: React.ReactNode;
  onDrop?: (folderId: string, folderName: string) => void;
  disabled?: boolean;
  isExpanded?: boolean;
  onExpand?: (folderId: string) => void;
  isDragActive?: boolean;
}

export const DroppableFolderWrapper: React.FC<DroppableFolderWrapperProps> = (
  {
    folderId,
    folderName,
    children,
    onDrop,
    disabled = false,
    isExpanded = false,
    onExpand,
    isDragActive = false
  }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [hoverTimer, setHoverTimer] = useState<number | null>(null);

  const clearHoverTimer = () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      setHoverTimer(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (disabled) return;

    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);

    if (isDragActive && !isExpanded && !hoverTimer && onExpand) {
      const timerId = window.setTimeout(() => {
        onExpand(folderId);
        setHoverTimer(null);
      }, 400);

      setHoverTimer(timerId);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    clearHoverTimer();
  };

  const handleDrop = (e: React.DragEvent) => {
    if (disabled) return;

    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    clearHoverTimer();

    try {
      const data = JSON.parse(e.dataTransfer.getData("application/json"));
      if (data.type === 'user') {
        if (onDrop) {
          onDrop(folderId, folderName);
        }
      }
    } catch (error) {
      // Fallback для текстовых данных
      const userId = e.dataTransfer.getData("text/plain");
      if (userId && onDrop) {
        onDrop(folderId, folderName);
      }
    }
  };

  return (
    <div
      className={`droppable-wrapper ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-folder-id={folderId}
      data-droppable-type="folder"
    >
      {children}
    </div>
  );
};