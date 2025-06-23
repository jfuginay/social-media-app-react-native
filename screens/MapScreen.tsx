import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../services';

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function MapScreen() {
  const { location, hasPermission, isLoading, error, requestPermission, startLocationUpdates } = useLocation();
  const [mapReady, setMapReady] = useState(false);
  const [following, setFollowing] = useState(true);
  const [mapRegion, setMapRegion] = useState<MapRegion | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (!hasPermission && !isLoading && !error) {
      requestPermission();
    }
  }, [hasPermission, isLoading, error]);

  useEffect(() => {
    if (hasPermission && !isLoading) {
      startLocationUpdates();
    }
  }, [hasPermission, isLoading]);

  useEffect(() => {
    if (location) {
      const region: MapRegion = {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      
      setMapRegion(region);

      // Auto-follow user if following is enabled
      if (following && mapRef.current) {
        mapRef.current.animateToRegion(region, 1000);
      }
    }
  }, [location, following]);

  const centerOnUser = () => {
    if (mapRegion && mapRef.current) {
      mapRef.current.animateToRegion(mapRegion, 1000);
      setFollowing(true);
    }
  };

  const toggleFollowing = () => {
    setFollowing(!following);
    if (!following && mapRegion && mapRef.current) {
      mapRef.current.animateToRegion(mapRegion, 1000);
    }
  };

  const onRegionChangeComplete = () => {
    // Stop following when user manually moves the map
    if (following) {
      setFollowing(false);
    }
  };

  const handleRetry = () => {
    requestPermission();
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Getting your location...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !hasPermission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="location-outline" size={64} color="#ccc" />
          <Text style={styles.errorText}>
            {error || 'Location permission is required to use the map'}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Enable Location</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Map</Text>
        <View style={styles.headerInfo}>
          {location?.accuracy && (
            <Text style={styles.accuracyText}>±{Math.round(location.accuracy)}m</Text>
          )}
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="layers-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.mapContainer}>
        {mapRegion && (
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={mapRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={true}
            showsScale={true}
            rotateEnabled={true}
            pitchEnabled={true}
            scrollEnabled={true}
            zoomEnabled={true}
            onMapReady={() => setMapReady(true)}
            onRegionChangeComplete={onRegionChangeComplete}
            mapType="standard"
          >
            {/* Custom marker for user location */}
            <Marker
              coordinate={{
                latitude: mapRegion.latitude,
                longitude: mapRegion.longitude,
              }}
              title="You are here"
              description={`Updated: ${new Date(location?.timestamp || 0).toLocaleTimeString()}`}
            >
              <View style={styles.customMarker}>
                <View style={styles.markerInner}>
                  <Ionicons name="person" size={16} color="white" />
                </View>
              </View>
            </Marker>
          </MapView>
        )}

        {/* Map Controls */}
        <View style={styles.mapControls}>
          <TouchableOpacity
            style={[styles.controlButton, following && styles.activeControl]}
            onPress={toggleFollowing}
          >
            <Ionicons 
              name={following ? "navigate" : "navigate-outline"} 
              size={24} 
              color={following ? "white" : "#333"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.controlButton} onPress={centerOnUser}>
            <Ionicons name="locate" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Location Info */}
        {location && (
          <View style={styles.locationInfo}>
            <Text style={styles.locationText}>
              📍 {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
            </Text>
            <Text style={styles.locationSubtext}>
              Last updated: {new Date(location.timestamp).toLocaleTimeString()}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accuracyText: {
    fontSize: 12,
    color: '#666',
    marginRight: 10,
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  headerButton: {
    padding: 5,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapControls: {
    position: 'absolute',
    right: 20,
    top: 20,
    flexDirection: 'column',
  },
  controlButton: {
    backgroundColor: 'white',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  activeControl: {
    backgroundColor: '#007AFF',
  },
  locationInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 15,
  },
  locationText: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'monospace',
  },
  locationSubtext: {
    color: '#ccc',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  customMarker: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 