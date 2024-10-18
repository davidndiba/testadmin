
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import { ProCard } from '@ant-design/pro-components';
import { LatLngExpression } from 'leaflet';

const HeatMap: React.FC = () => {
  const points: LatLngExpression[] = [
    [37.7749, -122.4194], [34.0522, -118.2437], [51.5074, -0.1278],
    [35.6895, 139.6917], [19.4326, -99.1332], [-33.8688, 151.2093],
    [48.8566, 2.3522], [40.7128, -74.0060], [55.7558, 37.6173],
    [28.6139, 77.2090], [-23.5505, -46.6333], [1.3521, 103.8198],
    [39.9042, 116.4074], [41.9028, 12.4964], [30.0444, 31.2357],
  ];

  const HeatLayer: React.FC = () => {
    const map = useMap();
    useEffect(() => {
      const heatLayer = L.heatLayer(points, { radius: 25, blur: 15 }).addTo(map);
      return () => {
        map.removeLayer(heatLayer);
      };
    }, [map]);

    return null;
  };

  return (
    <ProCard
      title="World Heat Map"
      style={{ marginBottom: 24, height: '500px' }} 
      bordered
      bodyStyle={{ padding: 0, height: '100%', overflow: 'hidden' }} // Prevent overflow
    >
      <div style={{ height: '100%', width: '100%' }}>
        <MapContainer
          center={[0, 0]} // Center the map on the equator and prime meridian
          zoom={2} // Set zoom level to show the entire world
          style={{ height: '100%', width: '100%' }} // Ensure the map fits within the container
          scrollWheelZoom={false} // Disable scroll wheel zoom if desired
          minZoom={2} // Set minimum zoom level
          maxZoom={19} // Set maximum zoom level, adjust if needed
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          <HeatLayer />
        </MapContainer>
      </div>
    </ProCard>
  );
};

export default HeatMap;
