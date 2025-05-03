import { useState } from "react";
import { BiTransfer } from "react-icons/bi";
import { FaShieldAlt } from "react-icons/fa";
import { GiBroadsword } from "react-icons/gi";

function UpDownButton({ color, diff, value, setValue, disabled }: { color: string, diff: number, value: number, setValue: any, disabled: boolean }) {
    const sign = diff > 0 ? "+" : "";
    const className = color === "red" ?
        "rounded flex-1 bg-red-300 hover:bg-red-400 active:bg-red-500 disabled:bg-gray-400" :
        "rounded flex-1 bg-blue-300 hover:bg-blue-400 active:bg-blue-500 disabled:bg-gray-400";
    return (
        <button onClick={
            () => setValue(Math.max(0, value + diff))
        } className={className} disabled={disabled}>
            {sign} {diff}
        </button>
    )
}

export function ScoreBoard({ color, role }: { color: string, role: Role }) {
    const [score, setScore] = useState(0);

    const bgColor = color === "red" ? "bg-red-200" : "bg-blue-200";
    return (
        <div className={bgColor}>
            <div className={`text-4xl text-center p-8`}>
                {score}
            </div>
            <div className="flex h-20 gap-2 p-1">
                <UpDownButton diff={2} value={score} setValue={setScore} color={color} disabled={role == Role.Defense} />
                <UpDownButton diff={3} value={score} setValue={setScore} color={color} disabled={role == Role.Defense} />
                <UpDownButton diff={7} value={score} setValue={setScore} color={color} disabled={role == Role.Defense} />
            </div>
            <div className="flex h-10 gap-2 p-1">
                <UpDownButton diff={-2} value={score} setValue={setScore} color={color} disabled={role == Role.Defense} />
                <UpDownButton diff={-3} value={score} setValue={setScore} color={color} disabled={role == Role.Defense} />
                <UpDownButton diff={-7} value={score} setValue={setScore} color={color} disabled={role == Role.Defense} />
            </div>
        </div>
    )
}

enum Role {
    Offense,
    Defense,
}

function RoleContent({ role }: { role: Role }) {
    switch (role) {
        case Role.Offense:
            return (<GiBroadsword className="text-4xl" />);
        case Role.Defense:
            return (<FaShieldAlt className="text-4xl" />);
        default:
            return (<div></div>);
    }
}

export default function ScoreArea({ isRedOffense, setIsRedOffense }: { isRedOffense: boolean, setIsRedOffense: React.Dispatch<React.SetStateAction<boolean>> }) {

    return (
        <div className="w-full flex text-gray-800 gap-2">
            <div className="flex-1 bg-red-500 rounded-lg p-2">
                <div className="bg-red-500 p-1 text-2xl">
                    <RoleContent role={isRedOffense ? Role.Offense : Role.Defense} />
                </div>
                <ScoreBoard color="red" role={isRedOffense ? Role.Offense : Role.Defense} />
            </div>

            <div className="items-center flex flex-col justify-center text-white">
                <button onClick={() => {
                    setIsRedOffense(!isRedOffense);
                }} className="text-2xl text-center bg-gray-500 rounded-lg p-2 hover:bg-gray-600 active:bg-gray-700">
                    <BiTransfer className="text-3xl" />
                </button>
            </div>

            <div className="flex-1 bg-blue-500 rounded-lg p-2">
                <div className="bg-blue-500 p-1 text-2xl">
                    <RoleContent role={isRedOffense ? Role.Defense : Role.Offense} />
                </div>
                <ScoreBoard color="blue" role={isRedOffense ? Role.Defense : Role.Offense} />
            </div>
        </div>
    )
}