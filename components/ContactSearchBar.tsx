import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Contact } from '../store/contactsSlice';

interface ContactSearchBarProps {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onSearchChange?: (query: string) => void;
}

export default function ContactSearchBar({
  contacts,
  onSelectContact,
  onSearchChange,
}: ContactSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    onSearchChange?.(query);

    if (query.trim() === '') {
      setFilteredContacts([]);
      setIsExpanded(false);
    } else {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredContacts(filtered);
      setIsExpanded(true);
    }
  };

  const handleSelectContact = (contact: Contact) => {
    setSearchQuery(contact.name);
    setIsExpanded(false);
    onSelectContact(contact);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setFilteredContacts([]);
    setIsExpanded(false);
    onSearchChange?.('');
  };

  const getTimeSinceLastSeen = (lastSeen: number): string => {
    const now = Date.now();
    const diffInMinutes = Math.floor((now - lastSeen) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const renderContactItem = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleSelectContact(item)}
    >
      <Text style={styles.contactAvatar}>{item.avatar}</Text>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <View style={styles.contactStatus}>
          <View style={[
            styles.statusDot,
            item.isOnline ? styles.onlineDot : styles.offlineDot
          ]} />
          <Text style={styles.statusText}>
            {item.isOnline ? 'Online' : getTimeSinceLastSeen(item.lastSeen)}
          </Text>
        </View>
      </View>
      <Ionicons name="navigate" size={16} color="#007AFF" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search contacts..."
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholderTextColor="#999"
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isExpanded && filteredContacts.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={filteredContacts}
            keyExtractor={(item) => item.id}
            renderItem={renderContactItem}
            style={styles.resultsList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}

      {isExpanded && searchQuery.length > 0 && filteredContacts.length === 0 && (
        <View style={styles.resultsContainer}>
          <View style={styles.noResultsContainer}>
            <Ionicons name="person-outline" size={32} color="#ccc" />
            <Text style={styles.noResultsText}>No contacts found</Text>
            <Text style={styles.noResultsSubtext}>Try a different search term</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  searchContainer: {
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
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 5,
  },
  resultsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resultsList: {
    maxHeight: 250,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  contactAvatar: {
    fontSize: 20,
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  contactStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
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
  noResultsContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    fontWeight: '500',
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
}); 