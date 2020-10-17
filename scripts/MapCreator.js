import { Marker } from "./Marker.js";

const mapAttribution = `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`;
const openStreetMapUrl = `http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`;
const subDomains = ["a", "b", "c"];
window.confirmedMarker = null;
window.recoveredMarker = null;
window.deathsMarker = null;

// Create the world map
export const MapCreator = (
  createdMap,
  latitude,
  longitude,
  zoomType,
  covidDisplayInfo
) => {
  let mapArea = document.getElementById("covidMapDiv");
  let zoomLevel = 0;
  if (zoomType === "country") {
    zoomLevel = 1.5;
  } else if (zoomType === "province") {
    zoomLevel = 4;
  }
  mapArea.innerHTML = `<div id="covidMap" style='width: 240px; height: 150px;'></div>`;

  const covidMap = L.map("covidMap", {
    center: [latitude, longitude],
    minZoom: 0,
    zoom: zoomLevel,
    zoomControl: false,
  });

  generateTiles(L, covidMap);

  // Create a marker
  const markers = Marker(
    covidMap,
    latitude,
    longitude,
    zoomType,
    covidDisplayInfo
  );
  confirmedMarker = markers.confirmedMarker;
  recoveredMarker = markers.recoveredMarker;
  deathsMarker = markers.deathsMarker;
  return covidMap;
};

// Create the tiles of continent, country, city etc outline
const generateTiles = (L, covidMap) => {
  L.tileLayer(openStreetMapUrl, {
    attribution: mapAttribution,
    subdomains: subDomains,
    reuseTiles: true,
    unloadInvisibleTiles: true,
  }).addTo(covidMap);
};
