import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export const LocationMap = ({ 
  location, 
  onMarkerDragEnd,
  mapKey 
}) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  }, [location]);

  if (!location) return null;

  return (
    <View style={styles.mapContainer}>
      <MapView
        ref={mapRef}
        key={mapKey}
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          key={`${location.latitude}-${location.longitude}-${mapKey}`}
          coordinate={location}
          draggable
          title="Order will be delivered here"
          description="Move the pin to change location"
          onDragEnd={onMarkerDragEnd}
        />
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});