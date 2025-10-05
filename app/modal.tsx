import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Character, databaseService } from '@/database/simple-database';
import { Link, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function ModalScreen() {
  const [characters, setCharacters] = useState<Character[]>([]);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = () => {
    const data = databaseService.getAllCharacters();
    setCharacters(data);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'deceased': return '#757575';
      case 'missing': return '#FF9800';
      case 'imprisoned': return '#FF5722';
      default: return '#cccccc';
    }
  };

  const getAffiliationColor = (affiliation: string) => {
    if (affiliation.includes('FBI')) return '#0066cc';
    if (affiliation.includes('Reddington')) return '#ff4444';
    return '#cccccc';
  };

  const handleCharacterPress = (character: Character) => {
    const skillsArray = typeof character.skills === 'string' ? JSON.parse(character.skills || '[]') : character.skills;
    Alert.alert(
      character.name,
      `Role: ${character.role}\nAffiliation: ${character.affiliation}\n\nBackground:\n${character.background}\n\nSkills: ${skillsArray.join(', ')}`,
      [{ text: 'Close', style: 'cancel' }]
    );
  };

  const renderCharacterItem = ({ item }: { item: Character }) => (
    <TouchableOpacity
      style={styles.characterCard}
      onPress={() => handleCharacterPress(item)}
      activeOpacity={0.7}
    >
      <ThemedView style={styles.characterHeader}>
        <ThemedView style={styles.avatar}>
          <ThemedText style={styles.avatarText}>
            {item.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.characterInfo}>
          <ThemedText style={styles.characterName}>{item.name}</ThemedText>
          <ThemedText style={styles.characterRole}>{item.role}</ThemedText>
          <ThemedText style={[styles.characterAffiliation, { color: getAffiliationColor(item.affiliation) }]}>
            {item.affiliation}
          </ThemedText>
        </ThemedView>
      </ThemedView>
      
      <ThemedText style={styles.characterBackground} numberOfLines={3}>
        {item.background}
      </ThemedText>
      
      <ThemedView style={styles.statusContainer}>
        <ThemedView style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <ThemedText style={styles.statusText}>{item.status.toUpperCase()}</ThemedText>
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Character Profiles',
        headerStyle: { backgroundColor: '#1a1a1a' },
        headerTintColor: '#ff4444',
        headerTitleStyle: { fontWeight: 'bold' }
      }} />
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerTitle}>CHARACTER PROFILES</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            FBI Task Force Personnel Database
          </ThemedText>
        </ThemedView>
        
        <FlatList
          data={characters}
          renderItem={renderCharacterItem}
          keyExtractor={(item) => item.id?.toString() || ''}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
        
        <Link href="/" dismissTo style={styles.backButton}>
          <ThemedText style={styles.backButtonText}>Back to Task Force</ThemedText>
        </Link>
      </ThemedView>
    </>
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
    paddingTop: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#ff4444',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff4444',
    textAlign: 'center',
    letterSpacing: 1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
    marginTop: 5,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 15,
    paddingBottom: 80,
  },
  characterCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#ff4444',
  },
  characterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  characterRole: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 2,
  },
  characterAffiliation: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  characterBackground: {
    fontSize: 14,
    color: '#e0e0e0',
    lineHeight: 20,
    marginBottom: 10,
  },
  statusContainer: {
    marginBottom: 5,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
