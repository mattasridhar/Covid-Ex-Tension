import { Marker } from "./Marker.js";

const mapAttribution = `&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>`;
const openStreetMapUrl = `http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`;
const subDomains = ["a", "b", "c"];

// Create the world map
export const MapCreator = () => {
  console.log("SRI in MApCreator");

  //   const mymap = L.map("mapid").setView([51.505, -0.09], 13);
  var mymap = L.map("mapid", {
    center: [51.505, -0.09],
    minZoom: 2,
    zoom: 2,
  });

  generateTiles(L, mymap);
  generateMarker(mymap);
  return mymap;
};

// Create the tiles of continent, country, city etc outline
const generateTiles = (L, mymap) => {
  L.tileLayer(openStreetMapUrl, {
    attribution: mapAttribution,
    subdomains: subDomains,
  }).addTo(mymap);
};

// Create a marker
const generateMarker = (mymap) => {
  const marker = Marker(mymap);

  return mymap;
};
