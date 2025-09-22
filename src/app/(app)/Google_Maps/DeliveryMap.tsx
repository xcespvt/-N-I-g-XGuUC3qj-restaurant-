"use client";
import {
  GoogleMap,
  LoadScript,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import { useEffect, useMemo, useState } from "react";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const restaurant = { lat: 28.6139, lng: 77.209 }; // Connaught Place
const customer = { lat: 28.5355, lng: 77.391 }; // Noida

export default function DeliveryMap() {
  const [path, setPath] = useState<google.maps.LatLngLiteral[]>([]);
  const [riderIndex, setRiderIndex] = useState(0);
  const [error, setError] = useState("");

  // Fetch route
  useEffect(() => {
    if (!window.google) return;

    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: restaurant,
        destination: customer,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (
          status === google.maps.DirectionsStatus.OK &&
          result?.routes[0]?.overview_path
        ) {
          const routePath = result.routes[0].overview_path.map((p) => ({
            lat: p.lat(),
            lng: p.lng(),
          }));
          setPath(routePath);
        } else {
          console.error("Directions request failed:", status);
          setError(
            "Unable to fetch route. Check your API key or billing status."
          );
        }
      }
    );
  }, []);

  // Animate rider along path
  useEffect(() => {
    if (path.length === 0) return;

    const interval = setInterval(() => {
      setRiderIndex((prev) => {
        if (prev < path.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 500); // adjust speed (ms) here

    return () => clearInterval(interval);
  }, [path]);

  const rider = useMemo(() => path[riderIndex], [path, riderIndex]);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyB830UCpDE6Pf23VdJjg7T3KgkoXpvdHiU"
      onError={(e) => setError("Google Maps failed to load.")}
    >
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={restaurant}
        zoom={12}
      >
        <Marker position={restaurant} label="🍔" title="Restaurant" />
        <Marker position={customer} label="🏠" title="Customer" />

        {rider && (
          <Marker
            position={rider}
            icon={{
              url: "/bike.png", // put bike.png in /public
              scaledSize: new window.google.maps.Size(50, 50),
            }}
          />
        )}

        {path.length > 0 && (
          <Polyline
            path={path}
            options={{
              strokeColor: "#00BFFF",
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
}
