import { MapSearchAddress, MapDraw, MapLocation } from "./module";

function App() {

  const handleGroupLayer = (data) => {
    console.log("group layer", data)
  }

  const handleSingleLayer = (data) => {
    console.log("single layer", data)
  }

  // return <MapDraw
  //   onAddFeatureGroupLayer={handleGroupLayer}
  //   onAddSingleFeatureGroupLayer={handleSingleLayer}
  // />

  return <MapLocation
    location={[-2.721044, 116.62442]}
    onDragMarkerEnd={(data) => console.log("on marker", data)}
  />
}

export default App;
