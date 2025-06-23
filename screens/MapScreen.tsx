import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useLocation } from '../services';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { simulateContactMovement, setSelectedContact, toggleLocationSharing, Contact } from '../store/contactsSlice';
import { ContactMarker, ContactInfoPopup, ContactSearchBar, MapStyleSelector } from '../components';
import type { MapType } from '../components/MapStyleSelector';

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function MapScreen() {
  const { location, hasPermission, isLoading, error, requestPermission, startLocationUpdates } = useLocation();
  const dispatch = useAppDispatch();
  const { contacts, isLocationSharingEnabled, selectedContactId } = useAppSelector(state => state.contacts);
  
  const [mapReady, setMapReady] = useState(false);
  const [following, setFollowing] = useState(true);
  const [mapRegion, setMapRegion] = useState<MapRegion | null>(null);
  const [showContactsList, setShowContactsList] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [selectedContactForPopup, setSelectedContactForPopup] = useState<Contact | null>(null);
  const [showMapStyleSelector, setShowMapStyleSelector] = useState(false);
  const [mapType, setMapType] = useState<MapType>('standard');
  const [showSearchBar, setShowSearchBar] = useState(false);
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

  // Real-time contact location simulation
  useEffect(() => {
    if (!isLocationSharingEnabled) return;

    const interval = setInterval(() => {
      dispatch(simulateContactMovement());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [dispatch, isLocationSharingEnabled]);

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

  const handleContactPress = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      // Show contact popup
      setSelectedContactForPopup(contact);
      setShowContactPopup(true);
      
      // Select contact on map
      dispatch(setSelectedContact(contactId === selectedContactId ? null : contactId));
      setFollowing(false);
    }
  };

  const handleContactMarkerPress = (contactId: string) => {
    handleContactPress(contactId);
  };

  const centerOnContact = (contact: Contact) => {
    if (mapRef.current) {
      const contactRegion: MapRegion = {
        latitude: contact.latitude,
        longitude: contact.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };
      mapRef.current.animateToRegion(contactRegion, 1000);
      setFollowing(false);
    }
  };

  const handleSearchContact = (contact: Contact) => {
    centerOnContact(contact);
    dispatch(setSelectedContact(contact.id));
    setShowSearchBar(false);
  };

  const handleMapStyleChange = (style: MapType) => {
    setMapType(style);
    setShowMapStyleSelector(false);
  };

  const handleZoomIn = () => {
    if (mapRef.current && mapRegion) {
      const newRegion = {
        ...mapRegion,
        latitudeDelta: mapRegion.latitudeDelta * 0.5,
        longitudeDelta: mapRegion.longitudeDelta * 0.5,
      };
      mapRef.current.animateToRegion(newRegion, 300);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current && mapRegion) {
      const newRegion = {
        ...mapRegion,
        latitudeDelta: mapRegion.latitudeDelta * 2,
        longitudeDelta: mapRegion.longitudeDelta * 2,
      };
      mapRef.current.animateToRegion(newRegion, 300);
    }
  };

  const handleToggleLocationSharing = () => {
    dispatch(toggleLocationSharing());
  };

  const onlineContactsCount = contacts.filter(c => c.isOnline).length;

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
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Map</Text>
          {isLocationSharingEnabled && (
            <Text style={styles.contactsCount}>
              {onlineContactsCount} online
            </Text>
          )}
        </View>
        <View style={styles.headerInfo}>
          {location?.accuracy && (
            <Text style={styles.accuracyText}>±{Math.round(location.accuracy)}m</Text>
          )}
          <TouchableOpacity 
            style={[styles.headerButton, isLocationSharingEnabled && styles.activeHeaderButton]}
            onPress={handleToggleLocationSharing}
          >
            <Ionicons 
              name={isLocationSharingEnabled ? "people" : "people-outline"} 
              size={24} 
              color={isLocationSharingEnabled ? "white" : "#333"} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerButton, showSearchBar && styles.activeHeaderButton]}
            onPress={() => setShowSearchBar(!showSearchBar)}
          >
            <Ionicons 
              name="search" 
              size={24} 
              color={showSearchBar ? "white" : "#333"} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerButton, showMapStyleSelector && styles.activeHeaderButton]}
            onPress={() => setShowMapStyleSelector(!showMapStyleSelector)}
          >
            <Ionicons 
              name="layers-outline" 
              size={24} 
              color={showMapStyleSelector ? "white" : "#333"} 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowContactsList(!showContactsList)}
          >
            <Ionicons name="list-outline" size={24} color="#333" />
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
            mapType={mapType}
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

            {/* Contact markers */}
            {isLocationSharingEnabled && contacts.map((contact) => (
              <Marker
                key={contact.id}
                coordinate={{
                  latitude: contact.latitude,
                  longitude: contact.longitude,
                }}
                title={contact.name}
                description={`Last seen: ${new Date(contact.lastSeen).toLocaleTimeString()}`}
                onPress={() => handleContactMarkerPress(contact.id)}
              >
                <ContactMarker
                  contact={contact}
                  isSelected={contact.id === selectedContactId}
                  onPress={() => handleContactPress(contact.id)}
                />
              </Marker>
            ))}
          </MapView>
        )}

        {/* Search Bar */}
        {showSearchBar && (
          <ContactSearchBar
            contacts={contacts}
            onSelectContact={handleSearchContact}
          />
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

        {/* Floating Action Button - Center on User */}
        <TouchableOpacity style={styles.fabButton} onPress={centerOnUser}>
          <Ionicons name="locate" size={24} color="white" />
        </TouchableOpacity>

        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
            <Ionicons name="add" size={20} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.zoomButton, styles.zoomButtonBottom]} onPress={handleZoomOut}>
            <Ionicons name="remove" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Map Style Selector */}
        <MapStyleSelector
          selectedStyle={mapType}
          onStyleChange={handleMapStyleChange}
          visible={showMapStyleSelector}
        />

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

        {/* Contacts List Overlay */}
        {showContactsList && isLocationSharingEnabled && (
          <View style={styles.contactsOverlay}>
            <View style={styles.contactsHeader}>
              <Text style={styles.contactsTitle}>Contacts</Text>
              <TouchableOpacity onPress={() => setShowContactsList(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.contactsList}>
              {contacts.map((contact) => (
                <TouchableOpacity
                  key={contact.id}
                  style={[
                    styles.contactItem,
                    contact.id === selectedContactId && styles.selectedContactItem
                  ]}
                  onPress={() => handleContactPress(contact.id)}
                >
                  <Text style={styles.contactAvatar}>{contact.avatar}</Text>
                  <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{contact.name}</Text>
                    <View style={styles.contactStatus}>
                      <View style={[
                        styles.statusDot, 
                        contact.isOnline ? styles.onlineDot : styles.offlineDot
                      ]} />
                      <Text style={styles.statusText}>
                                                 {contact.isOnline ? 'Online' : `Last seen ${Math.floor((Date.now() - contact.lastSeen) / 60000)}m ago`}
                      </Text>
                    </View>
                  </View>
                  {contact.accuracy && (
                    <Text style={styles.contactAccuracy}>±{contact.accuracy}m</Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
                     </View>
         )}

        {/* Contact Info Popup */}
        <ContactInfoPopup
          contact={selectedContactForPopup}
          userLocation={location ? { latitude: location.latitude, longitude: location.longitude } : undefined}
          visible={showContactPopup}
          onClose={() => {
            setShowContactPopup(false);
            setSelectedContactForPopup(null);
          }}
          onCenterOnContact={() => {
            if (selectedContactForPopup) {
              centerOnContact(selectedContactForPopup);
              setShowContactPopup(false);
            }
          }}
        />
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
  headerLeft: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  contactsCount: {
    fontSize: 12,
    color: '#4CAF50',
    marginTop: 2,
    fontWeight: '500',
  },
  activeHeaderButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  contactsOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 280,
    maxHeight: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contactsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  contactsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  contactsList: {
    maxHeight: 300,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedContactItem: {
    backgroundColor: '#E3F2FD',
  },
  contactAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  contactStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  onlineDot: {
    backgroundColor: '#4CAF50',
  },
  offlineDot: {
    backgroundColor: '#999',
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  contactAccuracy: {
    fontSize: 12,
    color: '#999',
    fontFamily: 'monospace',
  },
  fabButton: {
    position: 'absolute',
    bottom: 200,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  zoomControls: {
    position: 'absolute',
    bottom: 120,
    right: 20,
    flexDirection: 'column',
  },
  zoomButton: {
    width: 40,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E5E5E5',
  },
  zoomButtonBottom: {
    marginTop: 2,
  },
}); 