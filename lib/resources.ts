import type { Lang, L } from "./types";

// Local resources by zip. Add cities here as KHADA expands; unknown zips fall back to Mass 211.
type Local = { chc: L; chcUrl: string; schools: L; schoolsUrl: string };

const LOWELL: Local = {
  chc: { ht: "Lowell Community Health Center (161 Jackson St, Lowell)", en: "Lowell Community Health Center (161 Jackson St, Lowell)" },
  chcUrl: "https://www.lchealth.org",
  schools: { ht: "Lowell Public Schools — Family Resource Center", en: "Lowell Public Schools — Family Resource Center" },
  schoolsUrl: "https://www.lowell.k12.ma.us",
};
const LYNN: Local = {
  chc: { ht: "Lynn Community Health Center (269 Union St, Lynn)", en: "Lynn Community Health Center (269 Union St, Lynn)" },
  chcUrl: "https://www.lchcnet.org",
  schools: { ht: "Lynn Public Schools — Parent Information Center", en: "Lynn Public Schools — Parent Information Center" },
  schoolsUrl: "https://www.lynnschools.org",
};
const FALLBACK: Local = {
  chc: { ht: "Sant sante kominotè ki pi pre w la — rele 2-1-1 pou jwenn li", en: "Your nearest community health center — call 2-1-1 to find it" },
  chcUrl: "https://www.mass.gov/community-health-centers",
  schools: { ht: "Lekòl piblik vil ou a — rele 2-1-1 si w pa konnen kote pou w ale", en: "Your city's public schools — call 2-1-1 if you're not sure where to go" },
  schoolsUrl: "https://www.doe.mass.edu",
};

export function localFor(zip: string): Local {
  if (/^0185[0-4]$/.test(zip)) return LOWELL;
  if (/^0190[1-5]$/.test(zip)) return LYNN;
  return FALLBACK;
}

/** Replace {chc} / {schools} placeholders in step text with the local resource. */
export function fill(text: string, zip: string, lang: Lang) {
  const l = localFor(zip);
  return text.replace("{chc}", l.chc[lang]).replace("{schools}", l.schools[lang]);
}
export function fillUrl(url: string, zip: string) {
  const l = localFor(zip);
  return url === "{chcUrl}" ? l.chcUrl : url === "{schoolsUrl}" ? l.schoolsUrl : url;
}
