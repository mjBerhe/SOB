import { useState } from "react";
import questions from "../data/questions";

type Props = {
  currentQuestion: Question;
};

type Question = {
  subject: string;
  level: number;
};

const QuestionScreen: React.FC<Props> = ({ currentQuestion }) => {
  const { subject, level } = currentQuestion;

  return <div>{questions[subject][level]}</div>;
};

export default QuestionScreen;
