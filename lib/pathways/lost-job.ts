import type { Pathway } from "../types";

// Pathway 1 — "Mwen pèdi travay mwen" / "I lost my job"
// Thresholds and program rules change yearly: keep them in this file, not in components.
export const lostJob: Pathway = {
  id: "lost-job",
  name: { ht: "Mwen pèdi travay mwen", en: "I lost my job" },
  intro: {
    ht: "Reponn 6 kesyon epi n ap ba w yon plan, etap pa etap. Ou pa bezwen kont, ou pa bezwen bay non w.",
    en: "Answer 6 questions and we'll give you a plan, step by step. No account, no name needed.",
  },
  questions: [
    { key: "zip", type: "zip", text: { ht: "Ki kòd postal ou?", en: "What is your zip code?" } },
    { key: "hh", type: "choice", text: { ht: "Konbyen moun k ap viv avè w (ou ladan l)?", en: "How many people live with you (including you)?" },
      options: [{ ht: "1", en: "1" }, { ht: "2", en: "2" }, { ht: "3–4", en: "3–4" }, { ht: "5 oswa plis", en: "5 or more" }] },
    { key: "ins", type: "choice", text: { ht: "Èske w te gen asirans sante nan travay ou te pèdi a?", en: "Did you have health insurance through the job you lost?" },
      options: [{ ht: "Wi", en: "Yes" }, { ht: "Non", en: "No" }, { ht: "M pa sèten", en: "Not sure" }] },
    { key: "inc", type: "choice", text: { ht: "Konbyen lajan k ap antre nan kay la mwa sa a?", en: "How much money is coming into the household this month?" },
      options: [{ ht: "Anyen", en: "None" }, { ht: "Yon ti kras", en: "A little" }, { ht: "Yon bon pati toujou", en: "Still a good part" }] },
    { key: "rent", type: "choice", text: { ht: "Kote w ye ak lwaye a?", en: "Where are you with rent?" },
      options: [{ ht: "Mwen ajou", en: "Caught up" }, { ht: "Mwen an reta", en: "Behind" }, { ht: "Mèt kay la ban m yon avi (notice)", en: "Landlord gave me a notice" }] },
    { key: "food", type: "choice", text: { ht: "Èske w gen ase manje pou mwa sa a?", en: "Do you have enough food for this month?" },
      options: [{ ht: "Wi", en: "Yes" }, { ht: "Non", en: "No" }] },
  ],
  steps: {
    dua: {
      key: "dua",
      title: { ht: "Aplike pou chomaj (DUA)", en: "Apply for unemployment (DUA)" },
      why: { ht: "Fè sa premye. Lèt apwobasyon an sèvi kòm prèv revni pou tout lòt etap yo.", en: "Do this first. The approval letter is your proof of income for every other step." },
      need: [
        { ht: "Nimewo Sekirite Sosyal ou", en: "Your Social Security number" },
        { ht: "Non ak adrès dènye travay ou", en: "Name and address of your last employer" },
        { ht: "Dat ou te sispann travay", en: "Date you stopped working" },
      ],
      where: { ht: "Sou entènèt: mass.gov/unemployment", en: "Online: mass.gov/unemployment" },
      url: "https://www.mass.gov/unemployment-insurance-ui-online",
      urgent: { ht: "Fè l semèn sa a", en: "Do it this week" },
    },
    mh: {
      key: "mh",
      title: { ht: "Aplike pou MassHealth", en: "Apply for MassHealth" },
      why: { ht: "Ak revni ki ba, ou ka kalifye pou asirans gratis oswa ki koute piti.", en: "With low income you may qualify for free or low-cost insurance." },
      need: [
        { ht: "Prèv revni (lèt DUA a, oswa dènye chèk peman)", en: "Proof of income (DUA letter or last pay stub)" },
        { ht: "Prèv adrès Massachusetts", en: "Proof of Massachusetts address" },
        { ht: "Dat nesans tout moun nan kay la", en: "Birth dates of everyone in the household" },
      ],
      where: { ht: "mahealthconnector.org, oswa yon navigatè nan sant sante kominotè a (Lowell CHC / Lynn CHC).", en: "mahealthconnector.org, or a navigator at the community health center (Lowell CHC / Lynn CHC)." },
      url: "https://www.mahealthconnector.org",
    },
    hc: {
      key: "hc",
      title: { ht: "Enskri nan Health Connector (enskripsyon espesyal)", en: "Enroll through the Health Connector (special enrollment)" },
      why: { ht: "Lè w pèdi asirans travay, ou gen 60 jou pou w chwazi yon nouvo plan.", en: "When you lose job coverage you have 60 days to pick a new plan." },
      need: [
        { ht: "Dat asirans ou te fini", en: "Date your coverage ended" },
        { ht: "Prèv revni", en: "Proof of income" },
        { ht: "Prèv adrès", en: "Proof of address" },
      ],
      where: { ht: "Sou entènèt: mahealthconnector.org", en: "Online: mahealthconnector.org" },
      url: "https://www.mahealthconnector.org",
      urgent: { ht: "60 jou sèlman", en: "60 days only" },
    },
    chc: {
      key: "chc",
      title: { ht: "Wè yon doktè kounye a, menm san asirans", en: "See a doctor now, even without insurance" },
      why: { ht: "Sant sante kominotè yo resevwa w ak yon pri selon revni w.", en: "Community health centers charge based on your income." },
      need: [{ ht: "Nenpòt ID", en: "Any ID" }, { ht: "Prèv revni si w genyen l", en: "Proof of income if you have it" }],
      where: { ht: "Lowell Community Health Center oswa Lynn Community Health Center. Mande 'sliding fee'.", en: "Lowell Community Health Center or Lynn Community Health Center. Ask for the sliding fee." },
      url: "https://www.mass.gov/community-health-centers",
    },
    snapx: {
      key: "snapx",
      title: { ht: "Aplike pou SNAP (manje) — vwa rapid", en: "Apply for SNAP (food) — fast track" },
      why: { ht: "Ak prèske pa gen lajan, ou ka jwenn benefis manje nan 7 jou.", en: "With almost no money coming in, you may get food benefits within 7 days." },
      need: [{ ht: "ID", en: "ID" }, { ht: "Prèv adrès", en: "Proof of address" }, { ht: "Enfòmasyon sou revni ak lwaye", en: "Income and rent information" }],
      where: { ht: "Sou entènèt: DTAConnect.com", en: "Online: DTAConnect.com" },
      url: "https://dtaconnect.eohhs.mass.gov",
      urgent: { ht: "Di yo 'expedited'", en: "Say 'expedited'" },
    },
    snap: {
      key: "snap",
      title: { ht: "Aplike pou SNAP (manje)", en: "Apply for SNAP (food)" },
      why: { ht: "SNAP ede w achte manje pandan w ap chèche travay.", en: "SNAP helps you buy food while you look for work." },
      need: [{ ht: "ID", en: "ID" }, { ht: "Prèv adrès", en: "Proof of address" }, { ht: "Enfòmasyon sou revni ak lwaye", en: "Income and rent information" }],
      where: { ht: "Sou entènèt: DTAConnect.com", en: "Online: DTAConnect.com" },
      url: "https://dtaconnect.eohhs.mass.gov",
    },
    raft: {
      key: "raft",
      title: { ht: "Aplike pou RAFT (èd pou lwaye)", en: "Apply for RAFT (rent help)" },
      why: { ht: "RAFT ka peye lwaye ou dwe pou anpeche yon degèpisman.", en: "RAFT can pay rent you owe to prevent an eviction." },
      need: [
        { ht: "Kontra lwaye oswa lèt mèt kay la", en: "Lease or a letter from your landlord" },
        { ht: "Avi ou te resevwa a, si genyen", en: "The notice you received, if any" },
        { ht: "Prèv revni ak ID", en: "Proof of income and ID" },
      ],
      where: { ht: "mass.gov/raft. Mèt kay la ap gen pou l ranpli yon pati.", en: "mass.gov/raft. Your landlord will need to fill out a part." },
      url: "https://www.mass.gov/how-to/apply-for-residential-assistance-for-families-in-transition-raft",
    },
    legal: {
      key: "legal",
      title: { ht: "Pale ak yon avoka gratis anvan w ale nan tribinal", en: "Talk to a free lawyer before any court date" },
      why: { ht: "Yon avi pa vle di ou dwe kite kay la. Ou gen dwa.", en: "A notice does not mean you have to leave. You have rights." },
      need: [{ ht: "Avi mèt kay la ban w lan", en: "The notice from your landlord" }, { ht: "Nenpòt papye tribinal", en: "Any court papers" }],
      where: { ht: "Rele 2-1-1 epi mande èd legal pou lojman, oswa Northeast Legal Aid.", en: "Call 2-1-1 and ask for housing legal aid, or Northeast Legal Aid." },
      url: "https://www.masslegalhelp.org/housing",
      urgent: { ht: "Pa tann", en: "Don't wait" },
    },
  },
  plan(a) {
    const p: string[] = ["dua"];
    const low = a.inc === 0 || a.inc === 1;
    p.push(a.ins === 0 && !low ? "hc" : "mh");
    p.push("chc");
    if (a.food === 1 || a.inc === 0) p.push(a.inc === 0 ? "snapx" : "snap");
    if (a.rent === 2) p.push("raft", "legal");
    else if (a.rent === 1) p.push("raft");
    return p;
  },
};
