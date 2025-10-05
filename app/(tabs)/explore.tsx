import CriminalEditForm from '@/components/CriminalEditForm';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BlacklistCriminal, databaseService } from '@/database/simple-database';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, TouchableOpacity } from 'react-native';

export default function ExploreScreen() {
  const [criminals, setCriminals] = useState<BlacklistCriminal[]>([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedCriminal, setSelectedCriminal] = useState<BlacklistCriminal | null>(null);

  useEffect(() => {
    loadCriminals();
  }, []);

  const loadCriminals = () => {
    const data = databaseService.getAllCriminals();
    setCriminals(data);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'captured': return '#4CAF50';
      case 'deceased': return '#757575';
      case 'active': return '#ff4444';
      default: return '#FF9800';
    }
  };

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'low': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'high': return '#FF5722';
      case 'extreme': return '#ff0000';
      default: return '#757575';
    }
  };

  const handleCriminalPress = (criminal: BlacklistCriminal) => {
    const aliasArray = Array.isArray(criminal.alias) ? criminal.alias : JSON.parse(criminal.alias || '[]');
    const crimesArray = Array.isArray(criminal.crimes) ? criminal.crimes : JSON.parse(criminal.crimes || '[]');
    const aliasText = aliasArray.join(', ');
    const crimesText = crimesArray.join(', ');
    
    Alert.alert(
      `${criminal.name} (#${criminal.number})`,
      `Aliases: ${aliasText}\n\n${criminal.description}\n\nCrimes: ${crimesText}\n\nLast Known Location: ${criminal.lastKnownLocation}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Edit', onPress: () => handleEditCriminal(criminal) }
      ]
    );
  };

  const handleCriminalLongPress = (criminal: BlacklistCriminal) => {
    Alert.alert(
      'Criminal Actions',
      `What would you like to do with ${criminal.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit', onPress: () => handleEditCriminal(criminal) },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => handleDeleteCriminal(criminal.id!)
        }
      ]
    );
  };

  const handleEditCriminal = (criminal: BlacklistCriminal | null) => {
    setSelectedCriminal(criminal);
    setEditModalVisible(true);
  };

  const handleSaveCriminal = (criminal: BlacklistCriminal) => {
    if (criminal.id) {
      // Update existing criminal
      const success = databaseService.updateCriminal(criminal.id, criminal);
      if (success) {
        Alert.alert('Success', 'Criminal updated successfully');
        loadCriminals();
        setEditModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to update criminal');
      }
    } else {
      // Add new criminal
      const success = databaseService.addCriminal(criminal);
      if (success) {
        Alert.alert('Success', 'Criminal added successfully');
        loadCriminals();
        setEditModalVisible(false);
      } else {
        Alert.alert('Error', 'Failed to add criminal. Check if the number is unique.');
      }
    }
  };

  const handleDeleteCriminal = (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this criminal? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const success = databaseService.deleteCriminal(id);
            if (success) {
              Alert.alert('Success', 'Criminal deleted successfully');
              loadCriminals();
              setEditModalVisible(false);
            } else {
              Alert.alert('Error', 'Failed to delete criminal');
            }
          }
        }
      ]
    );
  };

  const handleAddNew = () => {
    const nextNumber = Math.max(...criminals.map(c => c.number), 0) + 1;
    const newCriminal = {
      id: 0,
      number: nextNumber,
      name: '',
      alias: '[]',
      status: 'unknown' as const,
      threat: 'medium' as const,
      description: '',
      crimes: '[]',
      lastKnownLocation: ''
    } as BlacklistCriminal;
    setSelectedCriminal(newCriminal);
    setEditModalVisible(true);
  };

  const renderCriminalItem = ({ item }: { item: BlacklistCriminal }) => {
    const aliasDisplay = Array.isArray(item.alias) ? item.alias.join(' • ') : item.alias;
    const crimesArray = Array.isArray(item.crimes) ? item.crimes : JSON.parse(item.crimes || '[]');
    const crimesDisplay = crimesArray.slice(0, 3).join(', ') + (crimesArray.length > 3 ? '...' : '');
    
    return (
      <Pressable
        onPress={() => handleCriminalPress(item)}
        onLongPress={() => handleCriminalLongPress(item)}
        style={styles.criminalCard}
      >
        <ThemedView style={styles.criminalHeader}>
          <ThemedView style={styles.numberBadge}>
            <ThemedText style={styles.numberText}>#{item.number}</ThemedText>
          </ThemedView>
          <ThemedView style={styles.criminalInfo}>
            <ThemedText style={styles.criminalName}>{item.name}</ThemedText>
            <ThemedText style={styles.criminalAlias}>
              {aliasDisplay}
            </ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedText style={styles.criminalDescription}>
          {item.description}
        </ThemedText>
        
        <ThemedView style={styles.statusContainer}>
          <ThemedView style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
            <ThemedText style={styles.statusText}>{item.status.toUpperCase()}</ThemedText>
          </ThemedView>
          <ThemedView style={[styles.threatBadge, { backgroundColor: getThreatColor(item.threat) }]}>
            <ThemedText style={styles.threatText}>THREAT: {item.threat.toUpperCase()}</ThemedText>
          </ThemedView>
        </ThemedView>
        
        <ThemedText style={styles.criminalCrimes}>
          Primary Charges: {crimesDisplay}
        </ThemedText>
      </Pressable>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>THE BLACKLIST</ThemedText>
        <ThemedText style={styles.headerSubtitle}>
          FBI's Most Wanted Criminal Database
        </ThemedText>
        <ThemedText style={styles.classification}>
          CLASSIFICATION: TOP SECRET
        </ThemedText>
        
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <ThemedText style={styles.addButtonText}>+ Add New Criminal</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      <FlatList
        data={criminals}
        renderItem={renderCriminalItem}
        keyExtractor={(item) => item.id?.toString() || ''}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <CriminalEditForm
        visible={editModalVisible}
        criminal={selectedCriminal}
        onSave={handleSaveCriminal}
        onCancel={() => setEditModalVisible(false)}
        onDelete={handleDeleteCriminal}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 2,
    borderBottomColor: '#ff4444',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ff4444',
    textAlign: 'center',
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    marginTop: 5,
  },
  classification: {
    fontSize: 12,
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 15,
  },
  criminalCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  criminalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  numberBadge: {
    backgroundColor: '#ff4444',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  numberText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  criminalInfo: {
    flex: 1,
  },
  criminalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  criminalAlias: {
    fontSize: 14,
    color: '#cccccc',
    fontStyle: 'italic',
  },
  criminalDescription: {
    fontSize: 16,
    color: '#e0e0e0',
    lineHeight: 22,
    marginBottom: 15,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  threatBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    flex: 1,
  },
  threatText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  criminalCrimes: {
    fontSize: 14,
    color: '#cccccc',
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: '#ff4444',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignSelf: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
