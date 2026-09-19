export type Lang = "ht" | "en";
export type L = Record<Lang, string>;
export type Answers = Record<string, number | string | undefined>;

export type Question =
  | { key: string; type: "zip"; text: L }
  | { key: string; type: "choice"; text: L; options: L[] };

export type Step = {
  key: string;
  title: L;
  why: L;
  need: L[];
  where: L;
  url: string;
  urgent?: L;
};

export type Pathway = {
  id: string;
  name: L;
  intro: L;
  questions: Question[];
  steps: Record<string, Step>;
  /** Pure function: answers in, ordered step keys out. Keep all eligibility logic here. */
  plan: (a: Answers) => string[];
};
