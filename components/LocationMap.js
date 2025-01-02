import { useIsFocused } from '@react-navigation/native';
import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export const LocationMap = ({ location, onMarkerDragEnd }) => {
  const mapRef = useRef(null);
  const [markerKey, setMarkerKey] = useState(0);
  const isFocused = useIsFocused()
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );
      setCurrentLocation(location);
      setMarkerKey((prevKey) => prevKey + 1);
    }
  }, [location,isFocused]);

  useEffect(() => {
    setCurrentLocation(location);
  }, [location]);

  console.log(currentLocation,"currentLocation")

  if (!location) return null;

  return (
    <View style={styles.container}>
     {currentLocation &&  <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        moveOnMarkerPress={false}
        showsUserLocation
      >
        <Marker
          // key={markerKey} // Force the marker to re-render
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,}}
          draggable
          tracksViewChanges={false} // Improve performance on Android
          title="Delivery Location"
          description="Drag to adjust location"
          onDragEnd={onMarkerDragEnd}
        />
      </MapView>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
