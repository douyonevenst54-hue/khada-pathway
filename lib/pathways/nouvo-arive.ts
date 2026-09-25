import type { Pathway } from "../types";

// Pathway 2 — "Mwen fèk rive Massachusetts" / "I just arrived in Massachusetts"
// We never ask immigration status. Anything that depends on it is routed to a navigator or 2-1-1.
export const nouvoArive: Pathway = {
  id: "nouvo-arive",
  name: { ht: "Mwen fèk rive Massachusetts", en: "I just arrived in Massachusetts" },
  intro: {
    ht: "Reponn 6 kesyon epi n ap montre w kote pou w kòmanse: sante, lekòl, manje, ID, klas anglè. Nou pa mande estati imigrasyon w.",
    en: "Answer 6 questions and we'll show you where to start: health, school, food, ID, English classes. We don't ask immigration status.",
  },
  questions: [
    { key: "zip", type: "zip", text: { ht: "Ki kòd postal ou?", en: "What is your zip code?" } },
    { key: "hh", type: "choice", text: { ht: "Konbyen moun k ap viv avè w (ou ladan l)?", en: "How many people live with you (including you)?" },
      options: [{ ht: "1", en: "1" }, { ht: "2", en: "2" }, { ht: "3–4", en: "3–4" }, { ht: "5 oswa plis", en: "5 or more" }] },
    { key: "kids", type: "choice", text: { ht: "Èske gen timoun (anba 18 an) nan kay la ki pa nan lekòl toujou?", en: "Are there children (under 18) in the home not yet enrolled in school?" },
      options: [{ ht: "Wi", en: "Yes" }, { ht: "Non", en: "No" }] },
    { key: "ins", type: "choice", text: { ht: "Èske w gen asirans sante kounye a?", en: "Do you have health insurance now?" },
      options: [{ ht: "Wi", en: "Yes" }, { ht: "Non", en: "No" }, { ht: "M pa sèten", en: "Not sure" }] },
    { key: "food", type: "choice", text: { ht: "Èske w gen ase manje pou mwa sa a?", en: "Do you have enough food for this month?" },
      options: [{ ht: "Wi", en: "Yes" }, { ht: "Non", en: "No" }] },
    { key: "id", type: "choice", text: { ht: "Èske w gen yon ID Massachusetts (lisans oswa Mass ID)?", en: "Do you have a Massachusetts ID (license or Mass ID)?" },
      options: [{ ht: "Wi", en: "Yes" }, { ht: "Non", en: "No" }] },
  ],
  steps: {
    chc: {
      key: "chc",
      title: { ht: "Enskri nan sant sante kominotè a", en: "Register at the community health center" },
      why: { ht: "Se pòt antre a. Yo resevwa tout moun, yo pale Kreyòl, epi navigatè yo ap ede w ak asirans (MassHealth oswa Health Safety Net).", en: "This is the front door. They see everyone, they speak Creole, and their navigators help you with insurance (MassHealth or Health Safety Net)." },
      need: [{ ht: "Nenpòt ID oswa paspò", en: "Any ID or passport" }, { ht: "Prèv adrès si w genyen l (lèt, fakti)", en: "Proof of address if you have it (a letter, a bill)" }],
      where: { ht: "{chc}. Mande yon 'patient navigator'.", en: "{chc}. Ask for a patient navigator." },
      url: "{chcUrl}",
      urgent: { ht: "Kòmanse la", en: "Start here" },
    },
    school: {
      key: "school",
      title: { ht: "Enskri timoun yo lekòl", en: "Enroll the children in school" },
      why: { ht: "Chak timoun gen dwa ale lekòl piblik gratis, kèlkeswa sitiyasyon fanmi an. Lekòl la ap ede ak manje ak klas anglè tou.", en: "Every child has the right to free public school, whatever the family's situation. The school also helps with meals and English classes." },
      need: [
        { ht: "Batistè oswa paspò timoun nan", en: "Child's birth certificate or passport" },
        { ht: "Prèv adrès", en: "Proof of address" },
        { ht: "Kanè vaksen (si w genyen l — lekòl la ka ede w si w pa genyen l)", en: "Vaccination record (if you have it — the school can help if you don't)" },
      ],
      where: { ht: "{schools}.", en: "{schools}." },
      url: "{schoolsUrl}",
      urgent: { ht: "Semèn sa a", en: "This week" },
    },
    snap: {
      key: "snap",
      title: { ht: "Mande èd pou manje", en: "Ask for food help" },
      why: { ht: "Bank manje yo louvri pou tout moun. SNAP depann de sitiyasyon w — yon navigatè ap di w si w ka aplike.", en: "Food pantries are open to everyone. SNAP depends on your situation — a navigator will tell you if you can apply." },
      need: [{ ht: "Anyen pou bank manje a", en: "Nothing for the food pantry" }, { ht: "ID ak prèv adrès pou SNAP", en: "ID and proof of address for SNAP" }],
      where: { ht: "Rele 2-1-1 pou bank manje ki pi pre w la. Pou SNAP, mande navigatè KHADA a.", en: "Call 2-1-1 for the nearest food pantry. For SNAP, ask the KHADA navigator." },
      url: "https://mass211.org",
    },
    id: {
      key: "id",
      title: { ht: "Jwenn yon lisans kondwi oswa Mass ID", en: "Get a driver's license or Mass ID" },
      why: { ht: "Depi 2023, Massachusetts bay lisans kondwi estanda kèlkeswa estati imigrasyon w. Yon ID louvri pòt pou tout lòt bagay.", en: "Since 2023, Massachusetts issues standard driver's licenses regardless of immigration status. An ID opens every other door." },
      need: [
        { ht: "Paspò oswa batistè ak yon lòt dokiman idantite", en: "Passport or birth certificate plus another identity document" },
        { ht: "2 prèv adrès Massachusetts", en: "2 proofs of Massachusetts address" },
      ],
      where: { ht: "Pran randevou nan RMV (lyen anba a). Yon navigatè ka ede w ak lis dokiman yo.", en: "Book an RMV appointment (link below). A navigator can help with the document list." },
      url: "https://www.mass.gov/orgs/massachusetts-registry-of-motor-vehicles",
    },
    esol: {
      key: "esol",
      title: { ht: "Enskri nan klas anglè gratis (ESOL)", en: "Sign up for free English classes (ESOL)" },
      why: { ht: "Klas yo gratis, gen lis datant, se pou sa fòk ou enskri bonè.", en: "Classes are free and often have waitlists, so sign up early." },
      need: [{ ht: "Anyen — jis vin enskri", en: "Nothing — just come sign up" }],
      where: { ht: "Rele 2-1-1 oswa mande nan bibliyotèk vil la; KHADA ap ba w lis klas ki pi pre w yo.", en: "Call 2-1-1 or ask at the city library; KHADA will give you the list of nearby classes." },
      url: "https://www.doe.mass.edu/acls/",
    },
    legal: {
      key: "legal",
      title: { ht: "Pale ak yon òganizasyon legal gratis", en: "Talk to a free legal organization" },
      why: { ht: "Pou kesyon papye, pèmi travay, oswa nenpòt lèt ou resevwa. Pa peye pèsonn san w pa pale ak yo anvan.", en: "For paperwork, work permits, or any letter you receive. Don't pay anyone before talking to them first." },
      need: [{ ht: "Tout papye ou genyen", en: "Every paper you have" }],
      where: { ht: "Mande navigatè KHADA a yon referans, oswa rele 2-1-1.", en: "Ask the KHADA navigator for a referral, or call 2-1-1." },
      url: "https://www.masslegalhelp.org/immigration",
    },
  },
  plan(a) {
    const p: string[] = ["chc"];
    if (a.kids === 0) p.push("school");
    if (a.food === 1) p.push("snap");
    if (a.id === 1) p.push("id");
    p.push("esol", "legal");
    return p;
  },
};
