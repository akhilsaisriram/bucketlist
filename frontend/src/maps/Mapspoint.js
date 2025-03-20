import React, { useState, useEffect } from "react";
import { Map as MapLibreMap, NavigationControl, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl from "maplibre-gl"; // Add this line to import maplibregl

const Mapspoint = ({ payload }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map) return; // Initialize map only once

    const mapInstance = new MapLibreMap({
      container: "central-map",
      center: [0, 0],
      zoom: 2,
      style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      transformRequest: (url, resourceType) => {
        if (!url.includes("?")) {
          url += "?api_key=MdsBLQtub1D2n4KEMKHXyHggjA89vCj0RIJbx2YH";
        } else {
          url += "&api_key=MdsBLQtub1D2n4KEMKHXyHggjA89vCj0RIJbx2YH";
        }
        return { url, resourceType };
      },
    });

    mapInstance.addControl(
      new NavigationControl({ visualizePitch: true }),
      "top-left"
    );

    mapInstance.on("load", () => {
      // Add markers for each coordinate in the payload
      payload.forEach((coord, index) => {
        const markerEl = document.createElement("div");
        markerEl.style.backgroundColor = "#ff7e5f";
        markerEl.style.width = "20px";
        markerEl.style.height = "20px";
        markerEl.style.borderRadius = "50%";
        markerEl.style.cursor = "pointer";

        // Add popup for each marker
        const popup = new Popup({ offset: 25 }).setText(
          `Point ${index + 1}: [${coord[1]}, ${coord[0]}]`
        );

        new maplibregl.Marker(markerEl)
          .setLngLat([coord[0], coord[1]])
          .setPopup(popup)
          .addTo(mapInstance);
      });

      // Fit the map bounds to include all markers
      const bounds = payload.reduce(
        (bounds, coord) => bounds.extend([coord[0], coord[1]]),
        new maplibregl.LngLatBounds(payload[0], payload[0])
      );

      mapInstance.fitBounds(bounds, { padding: 50 });
    });

    setMap(mapInstance);

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map, payload]);

  return (
    <div
      style={{ width: "auto", height: "100vh" }}
      id="central-map"
    />
  );
};

export default Mapspoint;
