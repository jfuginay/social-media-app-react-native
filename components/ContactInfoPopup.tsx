import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Contact } from '../store/contactsSlice';

interface ContactInfoPopupProps {
  contact: Contact | null;
  userLocation?: { latitude: number; longitude: number };
  visible: boolean;
  onClose: () => void;
  onCenterOnContact: () => void;
}

const { width } = Dimensions.get('window');

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m away`;
  }
  return `${distance.toFixed(1)}km away`;
};

const getTimeSinceLastSeen = (lastSeen: number): string => {
  const now = Date.now();
  const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Active now';
  if (diffInMinutes < 60) return `Active ${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `Active ${Math.floor(diffInMinutes / 60)}h ago`;
  return `Active ${Math.floor(diffInMinutes / 1440)}d ago`;
};

export default function ContactInfoPopup({ 
  contact, 
  userLocation, 
  visible, 
  onClose, 
  onCenterOnContact 
}: ContactInfoPopupProps) {
  if (!contact) return null;

  const distance = userLocation ? 
    calculateDistance(
      userLocation.latitude, 
      userLocation.longitude, 
      contact.latitude, 
      contact.longitude
    ) : null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={styles.popup}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.contactAvatar}>{contact.avatar}</Text>
              <View style={styles.headerInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <View style={styles.statusContainer}>
                  <View style={[
                    styles.statusDot, 
                    contact.isOnline ? styles.onlineDot : styles.offlineDot
                  ]} />
                  <Text style={[
                    styles.statusText,
                    contact.isOnline ? styles.onlineText : styles.offlineText
                  ]}>
                    {contact.isOnline ? 'Online' : 'Offline'}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <View style={styles.infoRow}>
              <Ionicons name="time-outline" size={20} color="#666" />
              <Text style={styles.infoText}>
                {getTimeSinceLastSeen(contact.lastSeen)}
              </Text>
            </View>

            {distance && (
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={20} color="#007AFF" />
                <Text style={styles.infoText}>
                  {formatDistance(distance)}
                </Text>
              </View>
            )}

            {contact.accuracy && (
              <View style={styles.infoRow}>
                <Ionicons name="radio-outline" size={20} color="#FF9500" />
                <Text style={styles.infoText}>
                  Location accuracy: ±{contact.accuracy}m
                </Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Ionicons name="map-outline" size={20} color="#34C759" />
              <Text style={styles.infoText}>
                {contact.latitude.toFixed(6)}, {contact.longitude.toFixed(6)}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={onCenterOnContact}>
              <Ionicons name="navigate" size={20} color="white" />
              <Text style={styles.actionButtonText}>Center on Map</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <Ionicons name="chatbubble-outline" size={20} color="#007AFF" />
              <Text style={styles.secondaryButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  popup: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area padding
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactAvatar: {
    fontSize: 32,
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 14,
    fontWeight: '500',
  },
  onlineText: {
    color: '#4CAF50',
  },
  offlineText: {
    color: '#999',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 