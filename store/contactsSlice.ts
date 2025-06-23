import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  latitude: number;
  longitude: number;
  lastSeen: Date;
  isOnline: boolean;
  accuracy?: number;
}

interface ContactsState {
  contacts: Contact[];
  isLocationSharingEnabled: boolean;
  selectedContactId: string | null;
}

// Mock contact data with San Francisco area coordinates
const initialContacts: Contact[] = [
  {
    id: '1',
    name: 'Alice Chen',
    avatar: '👩‍💻',
    latitude: 37.7749 + (Math.random() - 0.5) * 0.01,
    longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
    lastSeen: new Date(),
    isOnline: true,
    accuracy: 5,
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: '👨‍🎨',
    latitude: 37.7849 + (Math.random() - 0.5) * 0.01,
    longitude: -122.4094 + (Math.random() - 0.5) * 0.01,
    lastSeen: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    isOnline: true,
    accuracy: 8,
  },
  {
    id: '3',
    name: 'Charlie Davis',
    avatar: '👨‍🚀',
    latitude: 37.7649 + (Math.random() - 0.5) * 0.01,
    longitude: -122.4294 + (Math.random() - 0.5) * 0.01,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    isOnline: false,
    accuracy: 12,
  },
  {
    id: '4',
    name: 'Diana Kim',
    avatar: '👩‍🔬',
    latitude: 37.7549 + (Math.random() - 0.5) * 0.01,
    longitude: -122.4394 + (Math.random() - 0.5) * 0.01,
    lastSeen: new Date(),
    isOnline: true,
    accuracy: 3,
  },
  {
    id: '5',
    name: 'Ethan Wilson',
    avatar: '👨‍🎸',
    latitude: 37.7449 + (Math.random() - 0.5) * 0.01,
    longitude: -122.4094 + (Math.random() - 0.5) * 0.01,
    lastSeen: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    isOnline: false,
    accuracy: 20,
  },
];

const initialState: ContactsState = {
  contacts: initialContacts,
  isLocationSharingEnabled: true,
  selectedContactId: null,
};

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    updateContactLocation: (
      state,
      action: PayloadAction<{
        contactId: string;
        latitude: number;
        longitude: number;
        accuracy?: number;
      }>
    ) => {
      const { contactId, latitude, longitude, accuracy } = action.payload;
      const contact = state.contacts.find(c => c.id === contactId);
      if (contact) {
        contact.latitude = latitude;
        contact.longitude = longitude;
        contact.lastSeen = new Date();
        contact.isOnline = true;
        if (accuracy) contact.accuracy = accuracy;
      }
    },
    
    setContactOnlineStatus: (
      state,
      action: PayloadAction<{ contactId: string; isOnline: boolean }>
    ) => {
      const { contactId, isOnline } = action.payload;
      const contact = state.contacts.find(c => c.id === contactId);
      if (contact) {
        contact.isOnline = isOnline;
        if (!isOnline) {
          contact.lastSeen = new Date();
        }
      }
    },
    
    addContact: (state, action: PayloadAction<Contact>) => {
      state.contacts.push(action.payload);
    },
    
    removeContact: (state, action: PayloadAction<string>) => {
      state.contacts = state.contacts.filter(c => c.id !== action.payload);
    },
    
    toggleLocationSharing: (state) => {
      state.isLocationSharingEnabled = !state.isLocationSharingEnabled;
    },
    
    setSelectedContact: (state, action: PayloadAction<string | null>) => {
      state.selectedContactId = action.payload;
    },
    
    simulateContactMovement: (state) => {
      // Simulate realistic movement for online contacts
      state.contacts.forEach(contact => {
        if (contact.isOnline) {
          // Small random movement (within ~100 meters)
          const deltaLat = (Math.random() - 0.5) * 0.001; // ~100m
          const deltaLng = (Math.random() - 0.5) * 0.001; // ~100m
          
          contact.latitude += deltaLat;
          contact.longitude += deltaLng;
          contact.lastSeen = new Date();
          
          // Occasionally change accuracy
          if (Math.random() < 0.3) {
            contact.accuracy = Math.floor(Math.random() * 15) + 3; // 3-18 meters
          }
        }
      });
    },
  },
});

export const {
  updateContactLocation,
  setContactOnlineStatus,
  addContact,
  removeContact,
  toggleLocationSharing,
  setSelectedContact,
  simulateContactMovement,
} = contactsSlice.actions;

export default contactsSlice.reducer; 