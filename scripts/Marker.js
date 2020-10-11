export const Marker = (mymap) => {
  console.log("SRI in Marker");
  const marker = L.marker([51.5, -0.09]).addTo(mymap);
  return marker;
  /* function setup() {
    console.log("SRI PS setup");
  }

  function draw() {
    console.log("SRI PS draw");
    createCanvas(200, 150);
    //   image(createdMap);
  } */
};
