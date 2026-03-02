import React, { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { AboutModal } from './components/AboutModal';

const App: React.FC = () => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-white selection:bg-blue-100">
      {/* Pass the opener function down */}
      <HomeScreen onOpenAbout={() => setIsAboutOpen(true)} />

      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />
    </div>
  );
};

export default App;