import React, {useState} from 'react';

interface DraggableUserWrapperProps {
  userId: string;
  userName: string;
  userRole: string;
  children: React.ReactNode;
  onDragStart?: (userId: string, userName: string) => void;
  onDragEnd?: () => void;
  disabled?: boolean;
}

export const DraggableUserWrapper: React.FC<DraggableUserWrapperProps> = (
  {
    userId,
    userName,
    userRole,
    children,
    onDragStart,
    onDragEnd,
    disabled = false
  }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (disabled) return;

    setIsDragging(true);
    e.dataTransfer.setData("text/plain", userId);
    e.dataTransfer.setData("application/json", JSON.stringify({
      type: 'user',
      userId,
      userName,
      userRole
    }));
    e.dataTransfer.effectAllowed = "move";

    e.dataTransfer.setDragImage(e.currentTarget, 20, 20);

    if (onDragStart) {
      onDragStart(userId, userName);
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    if (onDragEnd) {
      onDragEnd();
    }
  };

  if (disabled) {
    return <>{children}</>;
  }

  return (
    <div
      className={`draggable-wrapper ${isDragging ? 'dragging' : ''}`}
      draggable="true"
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-user-id={userId}
      data-draggable-type="user"
    >
      {children}
    </div>
  );
};