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
  console.log(
    "SRI in MApCreator lat: ",
    latitude,
    " long: ",
    longitude,
    " zoomType: ",
    zoomType,
    " covidInfo: ",
    covidDisplayInfo,
    " mapArea: ",
    mapArea.className
  );
  let zoomLevel = 0;
  if (zoomType === "country") {
    zoomLevel = 1.5;
  } else if (zoomType === "province") {
    zoomLevel = 4;
  }
  mapArea.innerHTML = `<div id="covidMap" style='width: 240px; height: 150px;'></div>`;
  if (mapArea.className !== "") {
    // console.log("SRI mapArea: ", mapArea.className);
    // mapArea.innerHTML = `<div id="covidMap" style='width: 240px; height: 150px;'></div>`;
    /* confirmedMarker.setLatLng([latitude, longitude]);
    recoveredMarker.setLatLng([latitude, longitude]);
    deathsMarker.setLatLng([latitude, longitude]);
    createdMap.setZoom(zoomLevel);
    return; */
  }

  //   const covidMap = L.map("covidMap").setView([51.505, -0.09], 13);
  const covidMap = L.map("covidMap", {
    center: [latitude, longitude],
    minZoom: 0,
    zoom: zoomLevel,
    zoomControl: false,
  });

  generateTiles(L, covidMap);

  // Create a marker
  //generateMarker(
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

// Create Marker
const generateMarker = () => {
  return Marker(covidMap, latitude, longitude, zoomType, covidDisplayInfo);
};
