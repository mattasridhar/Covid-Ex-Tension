export const Marker = (
  covidMap,
  latitude,
  longitude,
  zoomType,
  covidDisplayInfo
) => {
  let confirmedRadius = 400;
  let recoveredRadius = 200;
  let deathsRadius = 100;

  if (zoomType === "country") {
    confirmedRadius = 800000;
    recoveredRadius = 400000;
    deathsRadius = 200000;
  } else if (zoomType === "province") {
    confirmedRadius = 400000;
    recoveredRadius = 200000;
    deathsRadius = 100000;
  }

  // Create different markers for each Covid case type
  const confirmedMarker = L.circle([latitude, longitude], {
    color: "red",
    fillColor: "#ff4f4f",
    fillOpacity: 0.5,
    radius: confirmedRadius,
  }).addTo(covidMap);
  confirmedMarker.bindPopup(`Confimed: ${covidDisplayInfo.confirmed}`);

  const recoveredMarker = L.circle([latitude, longitude], {
    color: "green",
    fillColor: "#00ff88",
    fillOpacity: 0.5,
    radius: recoveredRadius,
  }).addTo(covidMap);
  recoveredMarker.bindPopup(`Recovered: ${covidDisplayInfo.recovered}`);

  const deathsMarker = L.circle([latitude, longitude], {
    color: "black",
    fillColor: "#590000",
    fillOpacity: 0.5,
    radius: deathsRadius,
  }).addTo(covidMap);
  deathsMarker.bindPopup(`Deaths: ${covidDisplayInfo.deaths}`);

  return { confirmedMarker, recoveredMarker, deathsMarker };
};
