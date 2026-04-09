"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Château de Chaussy - 64 Avenue de Vallon, 07120 Ruoms, Ardèche
const CHATEAU_LAT = 44.4547;
const CHATEAU_LNG = 4.3393;

export default function MapComponent() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
      zoomControl: false,
    }).setView([CHATEAU_LAT, CHATEAU_LNG], 13);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Elegant map tiles (CartoDB Positron - light and minimal)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }
    ).addTo(map);

    // Custom marker
    const goldIcon = L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          width: 36px;
          height: 36px;
          background: #C9A96E;
          border: 3px solid #FAF7F2;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <span style="transform: rotate(45deg); font-size: 14px;">🏰</span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -40],
    });

    L.marker([CHATEAU_LAT, CHATEAU_LNG], { icon: goldIcon })
      .addTo(map)
      .bindPopup(
        `<div style="text-align:center; font-family: 'Cormorant Garamond', serif; padding: 8px;">
          <strong style="font-size: 16px; color: #1B2A4A;">Château de Chaussy</strong><br/>
          <span style="font-size: 13px; color: #666;">64 Avenue de Vallon</span><br/>
          <span style="font-size: 13px; color: #666;">07120 Ruoms, Ardèche</span>
        </div>`
      );

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return <div ref={mapRef} className="h-full w-full rounded-lg" />;
}
