import React from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  Image
} from 'react-native';
import { Pet } from '../../types/pet';

// Define a consistent color palette
const COLORS = {
  primary: '#4A6FA5', // A nice, professional blue
  primaryLight: '#E3F2FD',
  white: '#FFFFFF',
  darkText: '#333333',
  lightText: '#666666',
  metaText: '#888888',
  border: '#DDDDDD',
  lightGray: '#F5F5F5',
};

interface PetSelectorProps {
  pets: Pet[];
  selectedPetId: string | null;
  onSelectPet: (petId: string) => void;
  showAddButton?: boolean;
  onAddPet?: () => void;
}

const PetSelector: React.FC<PetSelectorProps> = ({
  pets,
  selectedPetId,
  onSelectPet,
  showAddButton = false,
  onAddPet
}) => {
  const renderPetItem = ({ item }: { item: Pet }) => {
    // Determine if this card is the selected one
    const isSelected = selectedPetId === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.petCard,
          isSelected && styles.selectedPetCard // Apply selected background
        ]}
        onPress={() => onSelectPet(item.id)}
        activeOpacity={0.7}
      >
        {item.imageUrl && (
          <Image 
            source={{ uri: item.imageUrl }} 
            style={styles.petImage} 
            resizeMode="cover"
          />
        )}
        <View style={styles.petInfo}>
          {/* Apply selected text color conditionally */}
          <Text style={[styles.petName, isSelected && styles.selectedText]}>
            {item.name}
          </Text>
          <Text style={[styles.petDetails, isSelected && styles.selectedText]}>
            {item.type} • {item.breed || 'Mixed'} • {item.age}y
          </Text>
          {item.gender && (
            <Text style={[styles.petMeta, isSelected && styles.selectedText]}>
              {item.gender}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>1. Select Your Pet</Text>
      <FlatList
        horizontal
        data={pets}
        renderItem={renderPetItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsHorizontalScrollIndicator={false}
        ListFooterComponent={
          showAddButton ? (
            <TouchableOpacity 
              style={styles.addPetCard} 
              onPress={onAddPet}
            >
              <Text style={styles.addPetText}>+ Add Pet</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.darkText,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  petCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedPetCard: {
    backgroundColor: COLORS.primary, // Change background on selection
    borderColor: COLORS.primary,     // Use the same color for the border
  },
  selectedText: {
    color: COLORS.white, // **THIS IS THE FIX**
  },
  petImage: {
    width: '100%',
    height: 100,
  },
  petInfo: {
    padding: 12,
  },
  petName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.darkText,
    marginBottom: 4,
  },
  petDetails: {
    fontSize: 12,
    color: COLORS.lightText,
    marginBottom: 4,
  },
  petMeta: {
    fontSize: 11,
    color: COLORS.metaText,
    fontStyle: 'italic',
  },
  addPetCard: {
    width: 120, // Make it a bit smaller
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.primaryLight,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  addPetText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default PetSelector;