import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { HomeScreen } from './components/HomeScreen'; 

const App: React.FC = () => {
  return (
    // Wrap the entire app with the DndProvider using the HTML5 backend
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen">
        <HomeScreen /> 
      </div>
    </DndProvider>
  );
};

export default App;