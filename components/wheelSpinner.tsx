import { useEffect, useState } from "react";
import { Wheel } from "react-custom-roulette";

const WheelSpinner: React.FC = () => {
  const data = [
    { option: "math" },
    { option: "science" },
    { option: "history" },
  ];
  const [wheelOptions, setWheelOptions] = useState([
    { option: "MATH" },
    { option: "SCIENCE" },
    { option: "HISTORY" },
  ]);
  const [startSpinning, setStartSpinning] = useState<boolean>(false);
  const [winningPrize, setWinningPrize] = useState<number>(0);

  const handleStartSpin = () => {
    const winner = getRandomInt(wheelOptions.length);
    setWinningPrize(winner);
    setStartSpinning(true);
  };

  const addWheelItem = (wheelItem: string) => {
    const tempWheelOptions = [...wheelOptions];
    tempWheelOptions.push({ option: wheelItem });
    setWheelOptions(tempWheelOptions);
  };

  const finishSpinning = () => {
    setStartSpinning(false);
  };

  const btnClass =
    "outline-none border border-white p-2 rounded-lg hover:bg-gray-500";

  return (
    <div className="flex flex-col items-center py-12 px-8">
      <div className="border border-white p-24">
        <Wheel
          mustStartSpinning={startSpinning}
          prizeNumber={winningPrize}
          data={wheelOptions}
          onStopSpinning={finishSpinning}
        />
      </div>

      <div className="flex space-x-4">
        <button onClick={handleStartSpin} className={btnClass}>
          Spin
        </button>
        <button onClick={() => addWheelItem("Test")} className={btnClass}>
          Add Item
        </button>
      </div>
    </div>
  );
};

export default WheelSpinner;

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};
