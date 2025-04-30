import { useState } from "react";

function UpDownButton({ className, diff, value, setValue }: { className: string, diff: number, value: number, setValue: any }) {
    const sign = diff > 0 ? "+" : "";
    return (
        <button onClick={
            () => setValue(Math.max(0,value + diff))
        } className={className}>
            {sign} {diff}
        </button>
    )
}

export function ScoreBoard({ color }: { color: string }) {
    const [score, setScore] = useState(0);

    const buttoClassName = `rounded flex-1 bg-${color}-300 hover:bg-${color}-500`
    return (
        <div className={`bg-${color}-200`}>
            <div className={`text-4xl text-center p-8`}>
                {score}
            </div>
            <div className="flex h-20 gap-2 p-1">
                <UpDownButton diff={2} value={score} setValue={setScore} className={buttoClassName} />
                <UpDownButton diff={3} value={score} setValue={setScore} className={buttoClassName} />
                <UpDownButton diff={7} value={score} setValue={setScore} className={buttoClassName} />
            </div>
            <div className="flex h-10 gap-2 p-1">
                <UpDownButton diff={-2} value={score} setValue={setScore} className={buttoClassName} />
                <UpDownButton diff={-3} value={score} setValue={setScore} className={buttoClassName} />
                <UpDownButton diff={-7} value={score} setValue={setScore} className={buttoClassName} />
            </div>
        </div>
    )
}

export default function ScoreArea() {
    return (
        <div className="w-full flex text-gray-800 gap-2">
            <div className="flex-1 bg-red-500 rounded-lg p-2">
                <div className="bg-red-500 p-1 text-2xl">
                    Offense
                </div>
                <ScoreBoard color="red" />
            </div>
            <div className="flex-1 bg-blue-500 rounded-lg p-2">
                <div className="bg-blue-500 p-1 text-2xl">
                    Defense
                </div>
                <ScoreBoard color="blue" />
            </div>
        </div>
    )
}