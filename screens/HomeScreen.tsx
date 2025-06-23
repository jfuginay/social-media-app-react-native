import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { usePhotos } from '../services';
import { PhotoGallery } from '../components';

export default function HomeScreen() {
  const { photos, clearPhotos } = usePhotos();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Photos</Text>
        <View style={styles.headerButtons}>
          {photos.length > 0 && (
            <TouchableOpacity style={styles.headerButton} onPress={clearPhotos}>
              <Ionicons name="trash-outline" size={24} color="#333" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="heart-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.content}>
        {photos.length > 0 && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>
              {photos.length} photo{photos.length !== 1 ? 's' : ''} captured
            </Text>
          </View>
        )}
        
        <PhotoGallery photos={photos} />
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
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 5,
    marginLeft: 10,
  },
  content: {
    flex: 1,
  },
  statsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  statsText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
}); 