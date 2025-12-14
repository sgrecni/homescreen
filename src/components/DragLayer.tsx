// src/components/CustomDragLayer.tsx (Final Visibility Fix)
import React from 'react';
import { useDragLayer } from 'react-dnd';

// Define the shape of the item being dragged
interface DraggedBookmark {
  id: string;
  url: string;
  title: string;
  iconUrl: string;
}

// Define the item type
const ItemTypes = {
  BOOKMARK_ICON: 'BOOKMARK_ICON',
};

// Function to calculate the layer style
function getItemStyles(currentOffset: { x: number; y: number } | null) {
  if (!currentOffset) {
    return {
      display: 'none',
    };
  }

  let { x, y } = currentOffset;
  
  // Icon size is 56px (w-14 h-14). Offset by 28px to center it.
  const transform = `translate(${x - 28}px, ${y - 28}px)`; 
  
  return {
    transform,
    WebkitTransform: transform,
  };
}

export const DragLayer: React.FC = () => {
  const { isDragging, itemType, currentOffset, item } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem() as DraggedBookmark,
      itemType: monitor.getItemType(),
      // We only need currentOffset for rendering position
      currentOffset: monitor.getClientOffset(), 
      isDragging: monitor.isDragging(),
    })
  );

  if (!isDragging) {
    return null;
  }
  
  const renderItem = () => {
    switch (itemType) {
      case ItemTypes.BOOKMARK_ICON:
        const draggedBookmark = item as DraggedBookmark;
        
        return (
          // Use inline styles to GUARANTEE size and visibility.
          <div 
            style={{ 
              width: '56px', // w-14
              height: '56px', // h-14
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'white',
              borderRadius: '0.75rem', // rounded-xl
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-xl
              border: '2px solid #3b82f6', // border-2 border-blue-500
              opacity: 0.9,
            }}
          >
            <img
                src={draggedBookmark.iconUrl}
                alt={`${draggedBookmark.title} icon`}
                className="w-10 h-10 object-contain"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed pointer-events-none top-0 left-0 w-full h-full z-50">
      {/* Pass only currentOffset to getItemStyles */}
      <div style={getItemStyles(currentOffset)}>
        {renderItem()}
      </div>
    </div>
  );
};