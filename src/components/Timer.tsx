// src/components/Timer.tsx
import { useEffect, useRef, useState } from "react";
import { FaPlay, FaPause, FaRedo, FaArrowRight, FaArrowLeft } from "react-icons/fa";

function ClockDigits({ time }: { time: number }) {
  const minutes = String(Math.floor(time / 60)).padStart(2, "0");
  const seconds = String(time % 60).padStart(2, "0");
  return (
    <div className="font-mono">
      {minutes}:{seconds}
    </div>
  )
}

enum SubClockState {
  ShotClock = "Shot Clock",
  PossessionChange = "Possession Change",
  SettingTime = "Setting Time",
}

let GAME_CLOCK_INITIAL = 120;
const SHOT_CLOCK_INITIAL = 20;
const POSESSION_CNANGE_INITIAL = 10;
const SETTING_TIME_INITIAL = 60;

function playTimeupSound() {
  const audio = new Audio("/audio/timeup.mp3");
  let count = 0;
  const maxLoop = 1;
  audio.addEventListener("ended", () => {
    count++;
    if (count < maxLoop) {
      audio.currentTime = 0; // 再生位置を先頭に戻す
      audio.play();
    }
  });
  audio.play();
}

function playClockStartSound() {
  const audio = new Audio("/audio/start3.mp3");
  audio.play();
}

function getClockInitial(subClockState: SubClockState) {
  switch (subClockState) {
    case SubClockState.ShotClock:
      return SHOT_CLOCK_INITIAL;
    case SubClockState.PossessionChange:
      return POSESSION_CNANGE_INITIAL;
    case SubClockState.SettingTime:
      return SETTING_TIME_INITIAL;
    default:
      return SHOT_CLOCK_INITIAL;
  }
}

function getNextClock(subCLockState: SubClockState) {
  switch (subCLockState) {
    case SubClockState.ShotClock:
      return SubClockState.PossessionChange;
    case SubClockState.PossessionChange:
      return SubClockState.ShotClock;
    case SubClockState.SettingTime:
      return SubClockState.ShotClock;
  }
}

function getDigitColor(time: number, active: boolean) {
  if (time == 0) {
    return "text-red-500";
  }
  if (!active) {
    return "text-yellow-300";
  }
  return "text-white"
}


function ShotClock({ clock, setClock, active, reset }: { clock: number, setClock: any, active: boolean, reset: any }) {
  return (
    <div className={`text-center p-2 border-2 ${clock == 0 ? "border-red-800" : "border-gray-600"}`}>
      <div className="text-left text-xl m-1">
        Shot Clock
      </div>
      <div className={`text-4xl my-4 ${getDigitColor(clock, active)}`}>
        <ClockDigits time={clock} />
      </div>
      <div className="flex gap-2">
        <button onClick={() => setClock(clock + 10)} className="flex-1 p-2 bg-gray-500 hover:bg-gray-600 active:bg-gray-700 rounded">
          + 10 sec
        </button>
        <button onClick={() => setClock(Math.max(0, clock - 10))} className="flex-1 p-2 bg-gray-500 hover:bg-gray-600 active:bg-gray-700 rounded">
          - 10 sec
        </button>
        <button onClick={() => reset()} className="flex-1 p-2 bg-gray-500 hover:bg-gray-600 active:bg-gray-700 rounded">
          Reset
        </button>
      </div>
    </div>
  );
}

function PosessionChange({ clock, active }: { clock: number, active: boolean }) {
  return (
    <div className={`text-center p-2 border-2 border-gray-600  ${clock == 0 ? "border-red-800" : "border-gray-600"}`}>
      <div className="text-left text-xl m-1">
        Possession Change
      </div>
      <div className={`text-4xl my-4 ${getDigitColor(clock, active)}`}>
        <ClockDigits time={clock} />
      </div>
    </div>
  );
}

function SettingTime({ clock, active }: { clock: number, active: boolean }) {
  return (
    <div className={`text-center p-2 border-2 border-gray-600  ${clock == 0 ? "border-red-800" : "border-gray-600"}`}>
      <div className="text-left text-xl m-1">
        Setting Time
      </div>
      <div className={`text-4xl my-4 ${getDigitColor(clock, active)}`}>
        <ClockDigits time={clock} />
      </div>
    </div>
  );
}

export const Timer = ({ setIsRedOffense }: { setIsRedOffense: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [subClockState, setSubClockState] = useState(SubClockState.SettingTime);
  const [gameClock, setGameClock] = useState(GAME_CLOCK_INITIAL);
  const [activeGameClock, setActiveGameClock] = useState(false);
  const [activeSubClock, setActiveSubClock] = useState(false);
  const [subClock, setSubClock] = useState(getClockInitial(subClockState));
  const gameClockIntervalRef = useRef<number | null>(null);
  const subClockIntervalRef = useRef<number | null>(null);

  const handlePlay = () => {
    setActiveSubClock(true);
    if (subClockState == SubClockState.ShotClock && !activeSubClock) {
      playClockStartSound();
      setActiveGameClock(true);
    }
  };

  const handleNextClock = () => {
    setActiveGameClock(false);
    setActiveSubClock(false);
    if (subClockState === SubClockState.PossessionChange) {
      setIsRedOffense((prev) => !prev);
    }
    const nextClock = getNextClock(subClockState);
    setSubClockState(nextClock);
    setSubClock(getClockInitial(nextClock));
  };

  const handlePause = () => {
    setActiveGameClock(false);
    setActiveSubClock(false);
  };

  const handleResetAll = () => {
    setActiveGameClock(false);
    setActiveSubClock(false);
    setGameClock(GAME_CLOCK_INITIAL);
    setSubClockState(SubClockState.SettingTime);
    setSubClock(getClockInitial(SubClockState.SettingTime));
  };

  const handleResetSubClock = () => {
    setSubClock(getClockInitial(subClockState));
    setActiveGameClock(false);
    setActiveSubClock(false);
  }

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      switch (event.key) {
        case "a":
          handlePlay(); // 「a」キーで再生をトリガ
          break;
        case "ArrowRight":
          handleNextClock(); // 右矢印キーで次のクロックをトリガ
          break;
        case "w":
          if (subClockState === SubClockState.ShotClock) {
            setSubClock((prev) => prev + 10);
          }
          break;
        case "e":
          if (subClockState === SubClockState.ShotClock) {
            setSubClock((prev) => Math.max(0, prev - 10));
          }
          break;
        case "r":
          handleResetSubClock();
          break;
        case "s":
          handlePause(); // 「s」キーで一時停止
          break;
        case "d":
          handleResetAll(); // 「d」キーでリセット
          break;
        case "Enter":
          if (activeGameClock || activeSubClock) {
            handlePause();
          } else {
            handlePlay();
          }
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handlePlay, handleNextClock, subClockState]);

  useEffect(() => {
    if (activeGameClock) {
      gameClockIntervalRef.current = window.setInterval(() => {
        setGameClock((prev) => {
          if (prev <= 1) {
            setActiveGameClock(false);
            clearInterval(gameClockIntervalRef.current!);
            playTimeupSound(); // タイマーが0になったら音を鳴らす
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(gameClockIntervalRef.current!);
    }
    return () => clearInterval(gameClockIntervalRef.current!);
  }, [activeGameClock]);

  useEffect(() => {
    if (activeSubClock) {
      subClockIntervalRef.current = window.setInterval(() => {
        setSubClock((prev) => {
          if (prev <= 1) {
            setActiveSubClock(false);
            setActiveGameClock(false);
            clearInterval(subClockIntervalRef.current!);
            playTimeupSound(); // タイマーが0になったら音を鳴らす
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(subClockIntervalRef.current!);
    }
    return () => clearInterval(subClockIntervalRef.current!);
  }, [activeSubClock]);

  const renderSubClock = () => {
    switch (subClockState) {
      case SubClockState.ShotClock:
        return <ShotClock clock={subClock} setClock={setSubClock} active={activeSubClock} reset={handleResetSubClock} />;
      case SubClockState.PossessionChange:
        return <PosessionChange clock={subClock} active={activeSubClock} />;
      case SubClockState.SettingTime:
        return <SettingTime clock={subClock} active={activeSubClock} />;
      default:
        return null;
    }
  };

  const NextClockButton = () => {
    return (
      <button onClick={handleNextClock}
        className="bg-gray-500 text-4xl hover:bg-gray-600 active:bg-gray-700 rounded">
        <FaArrowRight />
      </button>
    );
  }
  return (
    <div className="text-center w-full pb-5 my-3">
      <div className="w-[40%] flex flex-col mx-auto">
        <div className="text-left m-1">
          Game Clock
        </div>
        <div className={`text-2xl my-1 ${getDigitColor(gameClock, activeGameClock)}`}>
          <ClockDigits time={gameClock} />
        </div>
      </div>
      <div className="flex">
        <div className="w-[15%] flex justify-center items-center">
          {/* <button onClick={()=>{}} 
          className="bg-gray-500 text-4xl hover:bg-gray-600 active:bg-gray-700">
            <FaArrowLeft/>
          </button> */}
        </div>
        <div className="w-[70%] my-2 h-40">
          {renderSubClock()}
        </div>
        <div className="w-[15%] flex flex-col justify-center items-center">
          {/* <div className="text-sm">
            {getNextClock(subClockState)}
          </div> */}
          <NextClockButton />
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handlePlay}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded active:bg-green-700 text-white font-semibold"
        >
          <FaPlay className="inline" />
        </button>
        <button
          onClick={handlePause}
          className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 rounded text-white font-semibold"
        >
          <FaPause className="inline" />
        </button>
        <button
          onClick={handleResetAll}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 rounded text-white font-semibold"
        >
          <FaRedo className="inline" />
        </button>
      </div>
      {/* ショートカットキーの説明を横並びに変更 */}
      <div className="text-xs text-gray-400 mt-4">
        <div>ショートカットキー</div>
        <div className="flex items-center justify-center">
          <div className="mx-1">Enter: 再開/ストップ</div>
          <div className="mx-1">A: 再開</div>
          <div className="mx-1">S: ストップ</div>
          <div className="mx-1">D: 全体リセット</div>
          <div className="mx-1">⇒: 次のクロック</div>
        </div>
        <div className="flex items-center justify-center">
          <div className="mx-1">W: ショットクロック +10s</div>
          <div className="mx-1">E: ショットクロック -10s</div>
          <div className="mx-1">R: ショットクロック リセット</div>
        </div>
      </div>
    </div>
  );
};
