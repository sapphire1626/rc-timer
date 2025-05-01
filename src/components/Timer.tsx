// src/components/Timer.tsx
import { useEffect, useRef, useState } from "react";

function ClockDigits({ time }: { time: number }) {
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");
  return (
    <div className="font-mono mb-6">
      {minutes}:{seconds}
    </div>
  )
}

const GAME_CLOCK_INITIAL = 120;
const SHOT_CLOCK_INITIAL = 20;
const POSESSION_CNANGE_INITIAL = 10;

function ShotClock({ clock, setClock }: { clock: number, setClock: any }) {
  return (
    <div className="text-center p-2 border-2 border-gray-600">
      <div className="text-left text-xl">
        Shot Clock
      </div>
      <div className="text-4xl">
        <ClockDigits time={clock} />
      </div>
      <div className="flex gap-2">
        <button onClick={() => setClock(clock + 10)} className="flex-1 p-2 bg-gray-600 hover:bg-gray-700 rounded">
          + 10 sec
        </button>
        <button onClick={() => setClock(Math.max(0, clock - 10))} className="flex-1 p-2 bg-gray-600 hover:bg-gray-700 rounded">
          - 10 sec
        </button>
        <button onClick={() => setClock(SHOT_CLOCK_INITIAL)} className="flex-1 p-2 bg-gray-600 hover:bg-gray-700 rounded">
          Reset
        </button>
      </div>
    </div>
  );
}

export const Timer = () => {
  const [gameClock, setGameClock] = useState(GAME_CLOCK_INITIAL);
  const [activeGameClock, setActiveGameClock] = useState(false);
  const [subClock, setSubClock] = useState(SHOT_CLOCK_INITIAL);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (activeGameClock) {
      intervalRef.current = window.setInterval(() => {
        setGameClock((prev) => {
          if (prev <= 1) {
            setActiveGameClock(false);
            clearInterval(intervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
        setSubClock((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        })
      }, 1000);

    } else {
      clearInterval(intervalRef.current!);
    }

    return () => clearInterval(intervalRef.current!);
  }, [activeGameClock]);

  const reset = () => {
    setActiveGameClock(false);
    setGameClock(GAME_CLOCK_INITIAL);
    setSubClock(SHOT_CLOCK_INITIAL);
  };

  return (
    <div className="text-center w-full py-10">
      <div className="w-[40%] flex flex-col mx-auto">
        <div className="text-left">
          Game Clock
        </div>
        <div className="text-2xl">
          <ClockDigits time={gameClock} />
        </div>
      </div>
      <div className="w-[70%] mx-auto my-2">
        <ShotClock clock={subClock} setClock={setSubClock} />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => setActiveGameClock(true)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white font-semibold"
        >
          ▶️
        </button>
        <button
          onClick={() => setActiveGameClock(false)}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 rounded text-white font-semibold"
        >
          ⏸️
        </button>
        <button
          onClick={reset}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white font-semibold"
        >
          RST
        </button>
      </div>
    </div>
  );
};
