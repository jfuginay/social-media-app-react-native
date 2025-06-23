import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type MapType = 'standard' | 'satellite' | 'hybrid';

interface MapStyleSelectorProps {
  selectedStyle: MapType;
  onStyleChange: (style: MapType) => void;
  visible: boolean;
}

interface MapStyleOption {
  id: MapType;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  description: string;
}

const MAP_STYLES: MapStyleOption[] = [
  {
    id: 'standard',
    name: 'Standard',
    icon: 'map-outline',
    description: 'Default map view',
  },
  {
    id: 'satellite',
    name: 'Satellite',
    icon: 'earth-outline',
    description: 'Satellite imagery',
  },
  {
    id: 'hybrid',
    name: 'Hybrid',
    icon: 'layers-outline',
    description: 'Satellite with labels',
  },
];

export default function MapStyleSelector({ 
  selectedStyle, 
  onStyleChange, 
  visible 
}: MapStyleSelectorProps) {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Map Style</Text>
      </View>
      <ScrollView style={styles.optionsContainer} showsVerticalScrollIndicator={false}>
        {MAP_STYLES.map((style) => (
          <TouchableOpacity
            key={style.id}
            style={[
              styles.styleOption,
              selectedStyle === style.id && styles.selectedOption
            ]}
            onPress={() => onStyleChange(style.id)}
            activeOpacity={0.7}
          >
            <View style={styles.optionLeft}>
              <View style={[
                styles.iconContainer,
                selectedStyle === style.id && styles.selectedIconContainer
              ]}>
                <Ionicons 
                  name={style.icon} 
                  size={20} 
                  color={selectedStyle === style.id ? 'white' : '#666'} 
                />
              </View>
              <View style={styles.optionInfo}>
                <Text style={[
                  styles.optionName,
                  selectedStyle === style.id && styles.selectedText
                ]}>
                  {style.name}
                </Text>
                <Text style={styles.optionDescription}>
                  {style.description}
                </Text>
              </View>
            </View>
            {selectedStyle === style.id && (
              <View style={styles.selectedIndicator}>
                <Ionicons name="checkmark" size={16} color="#007AFF" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  optionsContainer: {
    maxHeight: 200,
  },
  styleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedOption: {
    backgroundColor: '#F8F9FA',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  selectedIconContainer: {
    backgroundColor: '#007AFF',
  },
  optionInfo: {
    flex: 1,
  },
  optionName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  selectedText: {
    color: '#007AFF',
  },
  optionDescription: {
    fontSize: 12,
    color: '#666',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 