import { answerPortfolio as a } from "./answer";

console.assert(a("Can Diva work remotely?").includes("Yes."));
console.assert(a("where is diva from").includes("Pekalongan"));
console.assert(
  a("Keahlian teknis Diva apa saja?", "id").includes("Keahlian teknis"),
);
console.assert(a("diva orang mana", "id").includes("Pekalongan"));
console.assert(a("alamat lengkap diva?", "id").includes("belum tersedia"));
console.assert(
  a("Tell me about School Tuition VA Payment Gateway").includes("Laravel"),
);
console.log("ok");
