type ProblemDraft = {
  text: string;
  answer: string;
};

const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const generateAddition = (): ProblemDraft => {
  const a = randomInt(10, 99);
  const b = randomInt(10, 99);
  return { text: `${a} + ${b}`, answer: String(a + b) };
};

const generateSubtraction = (): ProblemDraft => {
  const a = randomInt(40, 120);
  const b = randomInt(5, 39);
  return { text: `${a} - ${b}`, answer: String(a - b) };
};

const generateMultiplication = (): ProblemDraft => {
  const a = randomInt(5, 25);
  const b = randomInt(3, 12);
  return { text: `${a} * ${b}`, answer: String(a * b) };
};

const generateMod = (): ProblemDraft => {
  const a = randomInt(40, 300);
  const b = randomInt(3, 17);
  return { text: `${a} mod ${b}`, answer: String(a % b) };
};

export const generateProblem = (): ProblemDraft => {
  const generators = [
    generateAddition,
    generateSubtraction,
    generateMultiplication,
    generateMod,
  ];
  const generator = generators[randomInt(0, generators.length - 1)];
  return generator();
};
