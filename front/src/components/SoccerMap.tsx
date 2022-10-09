import { LoadScript, GoogleMap, MarkerF } from "@react-google-maps/api"
import { MarkerCoordinates } from "../types/MarkerCoordinates"

const containerStyle = {
  width: "100%",
  height: "100vh"
};

export default function SoccerMap({
  userPosition,
  goalPosition
}: {
  userPosition: MarkerCoordinates;
  goalPosition: MarkerCoordinates;
}) {
  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_MAPS_API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={userPosition} zoom={15}>
        <MarkerF
          position={userPosition}
          icon={{
            url: "ball.png",
            scale: 1
          }}
        ></MarkerF>
        <MarkerF
          position={goalPosition}
          icon={{
            url: "goal.png",
            scale: 1
          }}
        ></MarkerF>
      </GoogleMap>
    </LoadScript>
  );
}