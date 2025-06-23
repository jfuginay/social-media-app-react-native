import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  Image,
  Modal,
  Text,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Ionicons } from '@expo/vector-icons';
import { usePhotos } from '../services';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { addPhoto } = usePhotos();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
    if (!mediaLibraryPermission?.granted) {
      requestMediaLibraryPermission();
    }
  }, [permission, mediaLibraryPermission]);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Ionicons name="camera" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.permissionText}>Tap to enable camera</Text>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (photo) {
          setCapturedPhoto(photo.uri);
          setShowPreview(true);
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const savePhoto = async () => {
    if (!capturedPhoto) return;

    try {
      // Add to app context first
      addPhoto({ uri: capturedPhoto });

      // Save to device gallery if permission granted
      if (mediaLibraryPermission?.granted) {
        await MediaLibrary.saveToLibraryAsync(capturedPhoto);
        Alert.alert('Success!', 'Photo saved to your gallery and app feed!', [
          { text: 'OK', onPress: () => {
            setShowPreview(false);
            setCapturedPhoto(null);
          }}
        ]);
      } else {
        Alert.alert('Photo Captured!', 'Photo saved to app feed! Enable gallery permissions to save to your device.', [
          { text: 'OK', onPress: () => {
            setShowPreview(false);
            setCapturedPhoto(null);
          }}
        ]);
      }
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Error', 'Failed to save photo');
    }
  };

  const discardPhoto = () => {
    setCapturedPhoto(null);
    setShowPreview(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        <View style={styles.overlay}>
          <View style={styles.topControls}>
            <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.bottomControls}>
            <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>

      {/* Photo Preview Modal */}
      <Modal
        visible={showPreview}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.previewContainer}>
          <StatusBar barStyle="light-content" />
          {capturedPhoto && (
            <Image source={{ uri: capturedPhoto }} style={styles.previewImage} />
          )}
          
          <View style={styles.previewControls}>
            <TouchableOpacity style={styles.previewButton} onPress={discardPhoto}>
              <Ionicons name="close" size={24} color="white" />
              <Text style={styles.previewButtonText}>Discard</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.previewButton, styles.saveButton]} onPress={savePhoto}>
              <Ionicons name="checkmark" size={24} color="white" />
              <Text style={styles.previewButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 60,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  controlButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 25,
    padding: 15,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionButton: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 50,
  },
  permissionText: {
    color: 'white',
    marginTop: 15,
    fontSize: 16,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  previewButton: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 25,
    minWidth: 80,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  previewButtonText: {
    color: 'white',
    marginTop: 5,
    fontSize: 14,
    fontWeight: '600',
  },
}); 