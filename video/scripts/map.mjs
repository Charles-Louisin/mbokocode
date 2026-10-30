// Points de la carte du portfolio (même bibliothèque et même cadrage que
// src/components/home/Capabilities.tsx du site), enregistrés pour la scène « carte ».
import { writeFileSync } from "node:fs";
import { createMap } from "../../node_modules/svg-dotted-map/dist/index.js";

const width = 100;
const height = 90;
const region = { lat: { min: -12, max: 58 }, lng: { min: -26, max: 42 } };
const { points, addMarkers } = createMap({ width, height, mapSamples: 1600, region });
// Lieux vérifiés (backend/src/scripts/seed-data.ts) : base à Douala, CASHGLASS à Strasbourg, FRIPCASH à Conakry.
const markers = addMarkers([
  { lat: 4.05, lng: 9.7, label: "Douala" },
  { lat: 48.58, lng: 7.75, label: "Strasbourg" },
  { lat: 9.64, lng: -13.58, label: "Conakry" },
]);
writeFileSync(
  "src/map.json",
  JSON.stringify({ width, height, points: points.map((p) => [+p.x.toFixed(2), +p.y.toFixed(2)]), markers: markers.map((m) => ({ label: m.label, x: +m.x.toFixed(2), y: +m.y.toFixed(2) })) }),
);
console.log(points.length, "points", markers);
