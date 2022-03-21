import { useEffect, useState } from "react";
import { Wheel } from "react-custom-roulette";

const data: WheelData = {
  MATH: {
    option: "MATH",
    style: { backgroundColor: "#2E7C87", textColor: "black" },
  },
  SCIENCE: {
    option: "SCIENCE",
    style: { backgroundColor: "#EE4521", textColor: "black" },
  },
  HISTORY: {
    option: "HISTORY",
    style: { backgroundColor: "#54332B", textColor: "white" },
  },
  TEST: {
    option: "TEST",
    style: { backgroundColor: "#873BA5", textColor: "black" },
  },
};

type WheelData = {
  [key: string]: {
    option: string;
    style: {
      backgroundColor: string;
      textColor: string;
    };
  };
};

type SubjectLevels = {
  [key: string]: number;
};

type Props = {
  handleShowQuestion: () => void;
};

const WheelSpinner: React.FC<Props> = ({ handleShowQuestion }) => {
  const [subjectLevels, setSubjectLevels] = useState<SubjectLevels>({
    MATH: 1,
    SCIENCE: 1,
    HISTORY: 1,
    TEST: 1,
  });
  const [currentSubjects, setCurrentSubjects] = useState<string[]>([
    "MATH",
    "SCIENCE",
    "HISTORY",
  ]);
  const [startSpinning, setStartSpinning] = useState<boolean>(false);
  const [winningPrize, setWinningPrize] = useState<number>(0);

  const handleStartSpin = () => {
    const winner = getRandomInt(currentSubjects.length);
    setWinningPrize(winner);
    setStartSpinning(true);
  };

  const finishSpinning = () => {
    setStartSpinning(false);
    console.log(winningPrize);
  };

  const addNewSubject = (newSubject: string) => {
    if (currentSubjects.includes(newSubject)) {
      console.log(`ERROR, [SUBJECT]: ${newSubject} already exists`);
    } else {
      setCurrentSubjects((prev) => [...prev, newSubject]);
    }
  };

  const addSubject = (subject: string) => {
    const subjectPool = Object.keys(data);
    if (subjectPool.includes(subject)) {
      // valid subject
      setCurrentSubjects((prev) => [...prev, subject]);
    } else {
      console.log(`ERROR, [SUBJECT]: ${subject} is not a valid subject`);
    }
  };

  const removeSubject = (subject: string) => {
    if (currentSubjects.includes(subject)) {
      const index = currentSubjects.findIndex((curSub) => curSub === subject);
      const tempCurrentSubjects = [...currentSubjects];
      tempCurrentSubjects.splice(index, 1);
      setCurrentSubjects(tempCurrentSubjects);
    } else {
      console.log(`ERROR, [SUBJECT]: ${subject} is not a current subject`);
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
          data={currentSubjects.map((subject) => ({
            option: `${data[subject].option} [${subjectLevels[subject]}]`,
            style: data[subject].style,
          }))}
          onStopSpinning={finishSpinning}
        />
      </div>

      <div className="flex space-x-4 mt-4">
        <button onClick={handleStartSpin} className={btnClass}>
          Spin
        </button>
        <button onClick={() => addNewSubject("TEST")} className={btnClass}>
          Add Item
        </button>
        {currentSubjects
          .filter((value, index, array) => array.indexOf(value) === index)
          .map((subject) => (
            <div
              key={subject}
              className="flex items-center space-x-2 border border-white rounded-lg p-2"
            >
              <button onClick={() => addSubject(subject)}>+</button>
              <span>{subject}</span>
              <button onClick={() => removeSubject(subject)}>-</button>
            </div>
          ))}
      </div>
      <div className="mt-6">
        <button onClick={handleShowQuestion} className={btnClass}>
          Show Question
        </button>
      </div>
    </div>
  );
};

export default WheelSpinner;

const getRandomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};
