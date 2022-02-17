import { useEffect, useState } from "react";
import { Wheel } from "react-custom-roulette";

const WheelSpinner: React.FC = () => {
  const data = [
    { option: "math" },
    { option: "science" },
    { option: "history" },
  ];
  const [startSpinning, setStartSpinning] = useState<boolean>(false);
  const [winningPrize, setWinningPrize] = useState<number>(0);

  const handleStartSpin = () => {
    const winner = getRandomInt(data.length);
    setWinningPrize(winner);
    setStartSpinning(true);
  };

  return (
    <div className="border border-white p-24">
      <Wheel
        mustStartSpinning={startSpinning}
        prizeNumber={winningPrize}
        data={data}
      />
      <button onClick={handleStartSpin}>Spin</button>
    </div>
  );
};

export default WheelSpinner;

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};
