"use client";

import React, { useEffect, useRef, useState } from "react";
import { cargarLeaflet } from "@/src/lib/ui/cliente";

// Coordenadas predeterminadas de ciudades peruanas
const COORDENADAS_CIUDADES: Record<string, [number, number]> = {
  "Chimbote": [-9.0744, -78.5936],
  "Nuevo Chimbote": [-9.1250, -78.5300],
  "Trujillo": [-8.1118, -79.0287],
  "Lima": [-12.0464, -77.0428],
  "Lima Metropolitana": [-12.0464, -77.0428],
  "Piura": [-5.1945, -80.6328],
  "Arequipa": [-16.4090, -71.5375],
  "Chiclayo": [-6.7714, -79.8409],
  "Cusco": [-13.5319, -71.9675],
  "Huancayo": [-12.0651, -75.2049],
};

interface MapaSelectorUbicacionProps {
  latitud: number | null;
  longitud: number | null;
  ciudadNombre?: string;
  onChange: (lat: number, lng: number) => void;
  altura?: string;
}

export default function MapaSelectorUbicacion({
  latitud,
  longitud,
  ciudadNombre,
  onChange,
  altura = "240px",
}: MapaSelectorUbicacionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  // Obtener coordenadas de inicio según lat/lng o ciudad
  const obtenerCoordsIniciales = (): [number, number] => {
    if (latitud != null && longitud != null && !isNaN(latitud) && !isNaN(longitud)) {
      return [latitud, longitud];
    }
    if (ciudadNombre && COORDENADAS_CIUDADES[ciudadNombre]) {
      return COORDENADAS_CIUDADES[ciudadNombre];
    }
    return [-9.0744, -78.5936]; // Por defecto Chimbote
  };

  useEffect(() => {
    let cancelado = false;

    cargarLeaflet().then(() => {
      if (cancelado || !containerRef.current) return;
      const L = (window as any).L;
      if (!L) return;

      // Destruir mapa previo si existe
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const coords = obtenerCoordsIniciales();
      const map = L.map(containerRef.current, {
        zoomControl: true,
      }).setView(coords, 15);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
      }).addTo(map);

      // Icono de Pin Personalizado Turquesa Cine Náutica
      const pinIcon = L.divIcon({
        className: "cinenautica-map-pin",
        html: `
          <div style="
            background-color: #0284C7;
            width: 34px;
            height: 34px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            border: 3px solid #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 14px rgba(2, 132, 199, 0.6);
            cursor: grab;
          ">
            <i class="fa-solid fa-location-dot" style="transform: rotate(45deg); color: #ffffff; font-size: 14px;"></i>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 34],
      });

      const marker = L.marker(coords, {
        draggable: true,
        icon: pinIcon,
      }).addTo(map);

      // Evento al arrastrar pin
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
      });

      // Evento al hacer clic en cualquier parte del mapa
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onChange(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      setCargando(false);

      // Invalidate size para asegurar renderizado correcto dentro de modal
      setTimeout(() => {
        map.invalidateSize();
      }, 250);
    });

    return () => {
      cancelado = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Actualizar posición del marcador cuando cambian latitud / longitud externamente
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;
    if (latitud != null && longitud != null && !isNaN(latitud) && !isNaN(longitud)) {
      const currentPos = markerRef.current.getLatLng();
      if (
        Math.abs(currentPos.lat - latitud) > 0.0001 ||
        Math.abs(currentPos.lng - longitud) > 0.0001
      ) {
        markerRef.current.setLatLng([latitud, longitud]);
        mapInstanceRef.current.panTo([latitud, longitud]);
      }
    }
  }, [latitud, longitud]);

  // Centrar mapa si cambia la ciudad seleccionada y no hay coordenadas fijadas
  useEffect(() => {
    if (!ciudadNombre || !mapInstanceRef.current || !markerRef.current) return;
    const coordsCiudad = COORDENADAS_CIUDADES[ciudadNombre];
    if (coordsCiudad && (latitud == null || longitud == null)) {
      mapInstanceRef.current.setView(coordsCiudad, 14);
      markerRef.current.setLatLng(coordsCiudad);
      onChange(Number(coordsCiudad[0].toFixed(6)), Number(coordsCiudad[1].toFixed(6)));
    }
  }, [ciudadNombre]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-white/10 shadow-inner">
      <div ref={containerRef} style={{ width: "100%", height: altura }} />
      {cargando && (
        <div className="absolute inset-0 bg-[#0B1528]/80 flex items-center justify-center text-cyan-400 gap-2 text-xs font-semibold">
          <i className="fa-solid fa-spinner fa-spin"></i>
          <span>Cargando mapa interactivo...</span>
        </div>
      )}
      <div className="absolute bottom-2 left-2 z-[400] bg-dark-900/90 backdrop-blur-sm border border-white/10 text-[10px] text-slate-300 px-2.5 py-1 rounded-lg pointer-events-none flex items-center gap-1.5 shadow">
        <i className="fa-solid fa-hand-pointer text-cyan-400"></i>
        <span>Haz clic o arrastra el pin para fijar la ubicación</span>
      </div>
    </div>
  );
}
