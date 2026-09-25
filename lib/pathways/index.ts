import type { Pathway } from "../types";
import { lostJob } from "./lost-job";
import { nouvoArive } from "./nouvo-arive";

export const pathways: Record<string, Pathway> = {
  [lostJob.id]: lostJob,
  [nouvoArive.id]: nouvoArive,
};
export const getPathway = (id: string) => pathways[id] ?? null;
