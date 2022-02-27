import { useEffect, useState } from "react";
import { Wheel } from "react-custom-roulette";

type WheelItem = {
  option: string;
  style: {
    backgroundColor: string;
    textColor: string;
  };
};

const WheelSpinner: React.FC = () => {
  const data = [
    {
      option: "MATH",
      style: { backgroundColor: "#2E7C87", textColor: "black" },
    },
    {
      option: "SCIENCE",
      style: { backgroundColor: "#EE4521", textColor: "black" },
    },
    {
      option: "HISTORY",
      style: { backgroundColor: "#54332B", textColor: "white" },
    },
    {
      option: "TEST",
      style: { backgroundColor: "#873BA5", textColor: "black" },
    },
  ];
  const [wheelOptions, setWheelOptions] = useState<WheelItem[]>([
    {
      option: "MATH",
      style: { backgroundColor: "#2E7C87", textColor: "black" },
    },
    {
      option: "SCIENCE",
      style: { backgroundColor: "#EE4521", textColor: "black" },
    },
    {
      option: "HISTORY",
      style: { backgroundColor: "#54332B", textColor: "white" },
    },
  ]);
  const [startSpinning, setStartSpinning] = useState<boolean>(false);
  const [winningPrize, setWinningPrize] = useState<number>(0);

  const handleStartSpin = () => {
    const winner = getRandomInt(wheelOptions.length);
    setWinningPrize(winner);
    setStartSpinning(true);
  };

  const addWheelItem = (wheelItem: string) => {
    const newItemIndex = data.findIndex((item) => item.option === wheelItem);
    if (newItemIndex > -1) {
      const newItem = data[newItemIndex];
      const tempWheelOptions = [...wheelOptions];
      tempWheelOptions.push(newItem);
      setWheelOptions(tempWheelOptions);
    } else {
      console.log(`ERROR, [ITEM]: ${wheelItem} is not a valid wheelItem`);
    }
  };

  const finishSpinning = () => {
    setStartSpinning(false);
  };

  const addSubject = (subject: string) => {
    const wheelOptionIndex = data.findIndex(
      (option) => option.option === subject
    );
    if (wheelOptionIndex > -1) {
      const tempWheelOptions = [...wheelOptions];
      tempWheelOptions.push(data[wheelOptionIndex]);
      setWheelOptions(tempWheelOptions);
    } else {
      console.log(`ERROR, [SUBJECT]: ${subject} is not a valid option`);
    }
  };

  const removeSubject = (subject: string) => {
    const tempWheelOptions = [...wheelOptions];
    const wheelOptionIndex = tempWheelOptions.findIndex(
      (option) => option.option === subject
    );
    if (wheelOptionIndex > -1) {
      console.log(wheelOptionIndex);
      tempWheelOptions.splice(wheelOptionIndex, 1);
      console.log(tempWheelOptions);
      setWheelOptions(tempWheelOptions);
    } else {
      console.log(`ERROR, [SUBJECT]: ${subject} is not on the wheel`);
    }
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

      <div className="flex space-x-4 mt-4">
        <button onClick={handleStartSpin} className={btnClass}>
          Spin
        </button>
        <button onClick={() => addWheelItem("TEST")} className={btnClass}>
          Add Item
        </button>
        {wheelOptions.map((item) => (
          <div
            key={item.option}
            className="flex items-center space-x-2 border border-white rounded-lg p-2"
          >
            <button onClick={() => addSubject(item.option)}>+</button>
            <span>{item.option}</span>
            <button onClick={() => removeSubject(item.option)}>-</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WheelSpinner;

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};
