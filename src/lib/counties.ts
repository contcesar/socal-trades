import type { County } from "./types";

// The eight counties covered at launch. County name strings on a business
// must match one of these exactly.
export const COUNTIES: County[] = [
  { name: "Los Angeles", slug: "los-angeles" },
  { name: "Orange", slug: "orange" },
  { name: "San Diego", slug: "san-diego" },
  { name: "Riverside", slug: "riverside" },
  { name: "San Bernardino", slug: "san-bernardino" },
  { name: "Ventura", slug: "ventura" },
  { name: "Imperial", slug: "imperial" },
  { name: "Kern", slug: "kern" },
];
