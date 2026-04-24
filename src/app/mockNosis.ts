import type { NosisData } from "./types";

export function evaluateNosis(dni: string, genero: string): NosisData {
  const seeds = [
    {
      nombre: "Luciano",
      apellido: "Gomez",
      ciudad: "Rosario",
      provincia: "Santa Fe",
    },
    {
      nombre: "Camila",
      apellido: "Diaz",
      ciudad: "Cordoba",
      provincia: "Cordoba",
    },
    {
      nombre: "Agustin",
      apellido: "Perez",
      ciudad: "Mendoza",
      provincia: "Mendoza",
    },
    {
      nombre: "Martina",
      apellido: "Lopez",
      ciudad: "La Plata",
      provincia: "Buenos Aires",
    },
  ];

  const hash = Number(dni.slice(-2));
  const pick = seeds[hash % seeds.length];
  const birthYear = 1978 + (hash % 22);
  const birthMonth = String((hash % 12) + 1).padStart(2, "0");
  const birthDay = String((hash % 27) + 1).padStart(2, "0");
  const normalizedGender =
    genero === "M" ? "Masculino" : genero === "F" ? "Femenino" : "No binario";

  return {
    nombre: pick.nombre,
    apellido: pick.apellido,
    dni,
    genero: normalizedGender,
    fechaNacimiento: `${birthYear}-${birthMonth}-${birthDay}`,
    cuil: `20-${dni.slice(0, 8).padStart(8, "0")}-${(hash % 9) + 1}`,
    direccion: `Av. ${pick.apellido} ${120 + hash}`,
    ciudad: pick.ciudad,
    provincia: pick.provincia,
    pep: dni.endsWith("7"),
    repet: dni.endsWith("9"),
    fallecido: dni.endsWith("5"),
  };
}
