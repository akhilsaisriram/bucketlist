
import React, { useState, useEffect } from "react";
import { Map as MapLibreMap, NavigationControl, Popup } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import axios from "axios";

const Map = ({ payload }) => {
  console.log(payload);
  
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map) return; // Initialize map only once

    const mapInstance = new MapLibreMap({
      container: "central-map",
      center: [0, 0],
      zoom: 2,
      style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
      transformRequest: (url, resourceType) => {
        if (!url.includes('?')) {
          url += "?api_key=MdsBLQtub1D2n4KEMKHXyHggjA89vCj0RIJbx2YH";
        } else {
          url += "&api_key=MdsBLQtub1D2n4KEMKHXyHggjA89vCj0RIJbx2YH";
        }
        return { url, resourceType };
      },
    });

    mapInstance.addControl(new NavigationControl({ visualizePitch: true }), "top-left");

    mapInstance.on('load', () => {
      const polylineDecoded = decodePolyline(payload);

      mapInstance.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: polylineDecoded
            }
          }
        },
        paint: {
          'line-color': '#ff7e5f',
          'line-width': 3
        }
      });

      const [sourceCoords, destinationCoords] = [polylineDecoded[0], polylineDecoded[polylineDecoded.length - 1]];

      mapInstance.addLayer({
        id: 'source-point',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: sourceCoords
            }
          }
        },
        paint: {
          'circle-radius': 8,
          'circle-color': '#ff0000'
        }
      });

      mapInstance.addLayer({
        id: 'destination-point',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: destinationCoords
            }
          }
        },
        paint: {
          'circle-radius': 8,
          'circle-color': '#0000ff'
        }
      });

      mapInstance.fitBounds([
        [
          Math.min(...polylineDecoded.map(coord => coord[0])),
          Math.min(...polylineDecoded.map(coord => coord[1]))
        ],
        [
          Math.max(...polylineDecoded.map(coord => coord[0])),
          Math.max(...polylineDecoded.map(coord => coord[1]))
        ]
      ], { padding: 50 });
    });

    setMap(mapInstance);

   

    return () => {
      if (map) {
        map.remove();
      }
    };

  }, [map, payload]);

  const decodePolyline = (encoded) => {
    const points = [];
    let index = 0;
    let lat = 0;
    let lng = 0;

    while (index < encoded.length) {
      let b;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;
      points.push([lng / 1E5, lat / 1E5]);
    }
    return points;
  };

  return (
    <div
      style={{ width: "auto", height: "100vh", overflow: "hidden" }}
      id="central-map"
    />
  );
};

export default Map;
