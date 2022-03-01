type Questions = {
  [key: string]: {
    [key: number]: string;
  };
};

const questions: Questions = {
  MATH: {
    1: "Math 1 question",
    2: "Math 2 question",
  },
  SCIENCE: {
    1: "Science 1 question",
    2: "Science 2 question",
  },
  HISTORY: {
    1: "History 1 question",
    2: "History 2 question",
  },
};

export default questions;
