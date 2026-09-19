import type { Pathway } from "../types";
import { lostJob } from "./lost-job";

export const pathways: Record<string, Pathway> = { [lostJob.id]: lostJob };
export const getPathway = (id: string) => pathways[id] ?? null;
