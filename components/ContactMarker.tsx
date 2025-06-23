import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Contact } from '../store/contactsSlice';

interface ContactMarkerProps {
  contact: Contact;
  isSelected?: boolean;
  onPress?: () => void;
}

export default function ContactMarker({ contact, isSelected = false, onPress }: ContactMarkerProps) {
  const getTimeSinceLastSeen = (lastSeen: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
        !contact.isOnline && styles.offlineContainer,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Avatar */}
      <View style={[styles.avatarContainer, contact.isOnline ? styles.onlineAvatar : styles.offlineAvatar]}>
        <Text style={styles.avatar}>{contact.avatar}</Text>
        
        {/* Online status indicator */}
        <View style={[styles.statusIndicator, contact.isOnline ? styles.online : styles.offline]} />
      </View>
      
      {/* Name and info */}
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {contact.name}
        </Text>
        <View style={styles.detailsRow}>
          <Ionicons 
            name="time-outline" 
            size={10} 
            color={contact.isOnline ? "#4CAF50" : "#999"} 
          />
          <Text style={[styles.lastSeen, contact.isOnline ? styles.onlineText : styles.offlineText]}>
            {getTimeSinceLastSeen(contact.lastSeen)}
          </Text>
          {contact.accuracy && (
            <>
              <Ionicons 
                name="location-outline" 
                size={10} 
                color="#666" 
                style={styles.accuracyIcon}
              />
              <Text style={styles.accuracy}>±{contact.accuracy}m</Text>
            </>
          )}
        </View>
      </View>
      
      {/* Selection indicator */}
      {isSelected && (
        <View style={styles.selectionIndicator}>
          <Ionicons name="checkmark" size={12} color="white" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    minWidth: 80,
  },
  selectedContainer: {
    transform: [{ scale: 1.1 }],
  },
  offlineContainer: {
    opacity: 0.7,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  onlineAvatar: {
    borderColor: '#4CAF50',
  },
  offlineAvatar: {
    borderColor: '#999',
  },
  avatar: {
    fontSize: 24,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
  },
  online: {
    backgroundColor: '#4CAF50',
  },
  offline: {
    backgroundColor: '#999',
  },
  infoContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 70,
    alignItems: 'center',
  },
  name: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  lastSeen: {
    fontSize: 10,
    marginLeft: 2,
  },
  onlineText: {
    color: '#4CAF50',
  },
  offlineText: {
    color: '#ccc',
  },
  accuracyIcon: {
    marginLeft: 6,
  },
  accuracy: {
    fontSize: 10,
    color: '#ccc',
    marginLeft: 2,
  },
  selectionIndicator: {
    position: 'absolute',
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
}); 