import { createMap } from "svg-dotted-map";
import { cn } from "@/src/lib/cn";

// Adapté de Magic UI « Dotted Map » (https://magicui.design/docs/components/dotted-map, MIT),
// rendu côté serveur : un planisphère en points avec des repères pulsés. Les repères ne
// pulsent pas si l'utilisateur réduit les animations (classe .map-pulse dans globals.css).

export type MapMarker = { lat: number; lng: number; label: string };

type Region = { lat: { min: number; max: number }; lng: { min: number; max: number } };

export function DottedMap({
  markers,
  className,
  region,
  width = 150,
  height = 75,
}: {
  markers: MapMarker[];
  className?: string;
  region?: Region;
  width?: number;
  height?: number;
}) {
  const { points, addMarkers } = createMap({ width, height, mapSamples: 1600, region });
  const placed = addMarkers(markers.map((marker) => ({ ...marker, size: 1.4 })));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={cn("h-auto w-full", className)} role="img" aria-label={`Carte : ${markers.map((m) => m.label).join(", ")}`}>
      {points.map((point, index) => (
        <circle key={index} cx={point.x} cy={point.y} r={0.42} className="fill-fg-subtle" />
      ))}
      {placed.map((marker, index) => (
        <g key={index}>
          <circle cx={marker.x} cy={marker.y} r={marker.size} className="map-pulse fill-none stroke-cobalt-soft" strokeWidth={0.4} />
          <circle cx={marker.x} cy={marker.y} r={marker.size} className="fill-cobalt-soft" />
        </g>
      ))}
    </svg>
  );
}
