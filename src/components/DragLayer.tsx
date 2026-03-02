// src/components/DragLayer.tsx
import React from 'react';
import { useDragLayer, type XYCoord } from 'react-dnd';

function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
) {
  if (!initialOffset || !currentOffset) {
    return { display: 'none' };
  }

  // 🔑 THE MATH: Use the actual coordinates where the drag started
  // to prevent the "jump" to the top-left or center.
  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;

  return {
    transform,
    WebkitTransform: transform,
  };
}

export const DragLayer: React.FC = () => {
  const { isDragging, itemType, initialSourceOffset, currentSourceOffset, item } =
    useDragLayer((monitor) => ({
      item: monitor.getItem(),
      itemType: monitor.getItemType(),
      // 🔑 Get the exact starting position of the icon
      initialSourceOffset: monitor.getInitialSourceClientOffset(),
      // 🔑 Get the current position of the icon
      currentSourceOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    }));

  if (!isDragging || itemType !== 'BOOKMARK_ICON') {
    return null;
  }

  const draggedBookmark = item as any;

  return (
    <div className="fixed pointer-events-none inset-0 z-50">
      {/* 🔑 Pass the source offsets instead of mouse offsets */}
      <div style={getItemStyles(initialSourceOffset, currentSourceOffset)}>
        <div 
          className="flex items-center justify-center bg-white rounded-xl shadow-2xl border-2 border-blue-500"
          style={{ 
            width: '56px', // Matches your w-14
            height: '56px',
            opacity: 0.9,
          }}
        >
          <img
            src={draggedBookmark.iconUrl}
            alt=""
            className="w-10 h-10 object-contain"
          />
        </div>
      </div>
    </div>
  );
};