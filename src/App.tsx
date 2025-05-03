
import { Timer } from './components/Timer';
import ScoreBoard from './components/ScoreBoard';
import Logo from "./components/Logo";
import { useState } from 'react';

function App() {
  const [isRedOffense, setIsRedOffense] = useState(true);
  return (
    <div className="
    min-h-screen flex flex-col items-center 
    justify-center bg-gray-900 text-white
     font-sans p-4">
      <div className="w-120">
        <Logo />
        <Timer setIsRedOffense={setIsRedOffense} />
        <ScoreBoard isRedOffense={isRedOffense} setIsRedOffense={setIsRedOffense} />
      </div>
    </div>
  );
}

export default App;
