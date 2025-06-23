import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
  Text,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CapturedPhoto, usePhotos } from '../services';

const { width } = Dimensions.get('window');
const ITEM_SIZE = (width - 30) / 3; // 3 columns with padding

interface PhotoGalleryProps {
  photos: CapturedPhoto[];
  numColumns?: number;
}

export default function PhotoGallery({ photos, numColumns = 3 }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<CapturedPhoto | null>(null);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const { removePhoto } = usePhotos();

  const openPhoto = (photo: CapturedPhoto) => {
    setSelectedPhoto(photo);
    setShowFullScreen(true);
  };

  const closePhoto = () => {
    setSelectedPhoto(null);
    setShowFullScreen(false);
  };

  const deletePhoto = () => {
    if (selectedPhoto) {
      removePhoto(selectedPhoto.id);
      closePhoto();
    }
  };

  const renderPhoto = ({ item }: { item: CapturedPhoto }) => (
    <TouchableOpacity
      style={styles.photoContainer}
      onPress={() => openPhoto(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.uri }} style={styles.photo} />
    </TouchableOpacity>
  );

  if (photos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="images-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>No photos yet</Text>
        <Text style={styles.emptySubtext}>Tap the camera tab to capture your first photo!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={photos}
        renderItem={renderPhoto}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />

      {/* Full Screen Photo Modal */}
      <Modal
        visible={showFullScreen}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={closePhoto}
      >
        <SafeAreaView style={styles.fullScreenContainer}>
          <StatusBar barStyle="light-content" />
          
          {/* Header */}
          <View style={styles.fullScreenHeader}>
            <TouchableOpacity style={styles.headerButton} onPress={closePhoto}>
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton} onPress={deletePhoto}>
              <Ionicons name="trash" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {/* Photo */}
          {selectedPhoto && (
            <View style={styles.fullScreenImageContainer}>
              <Image 
                source={{ uri: selectedPhoto.uri }} 
                style={styles.fullScreenImage}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Footer with photo info */}
          {selectedPhoto && (
            <View style={styles.fullScreenFooter}>
              <Text style={styles.photoTimestamp}>
                {selectedPhoto.timestamp.toLocaleDateString()} at {selectedPhoto.timestamp.toLocaleTimeString()}
              </Text>
            </View>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    padding: 5,
  },
  photoContainer: {
    margin: 2,
    borderRadius: 8,
    overflow: 'hidden',
  },
  photo: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    backgroundColor: '#f0f0f0',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  fullScreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  headerButton: {
    padding: 10,
  },
  fullScreenImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  fullScreenFooter: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  photoTimestamp: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
}); 