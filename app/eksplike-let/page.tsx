import type { Metadata } from "next";
import Explainer from "./explainer";

export const metadata: Metadata = {
  title: "Eksplike lèt mwen · Khada Pathway",
  description: "Pran yon foto lèt ou. N ap eksplike w li an kreyòl. · Take a photo of your letter. We'll explain it.",
};

export default function Page() {
  return <Explainer />;
}
