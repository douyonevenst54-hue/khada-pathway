import { notFound } from "next/navigation";
import { getPathway } from "@/lib/pathways";
import Screener from "./screener";

export default async function PathwayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const p = getPathway(id);
  if (!p) notFound();
  // Pass only serializable data to the client; the plan() function stays server-side.
  const { plan: _plan, ...data } = p;
  return <Screener pathway={data} />;
}
