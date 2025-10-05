import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Stack } from 'expo-router';
import { Alert, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

interface Character {
  id: string;
  name: string;
  role: string;
  affiliation: string;
  status: 'active' | 'deceased' | 'missing' | 'imprisoned';
  background: string;
  skills: string[];
  imageUrl?: string;
}

const characters: Character[] = [
  {
    id: '1',
    name: 'Raymond "Red" Reddington',
    role: 'Criminal Informant',
    affiliation: 'FBI Task Force (Informant)',
    status: 'active',
    background: 'Former U.S. Naval Intelligence officer turned international criminal. Known as "The Concierge of Crime" for his vast network of criminal contacts.',
    skills: ['Intelligence', 'Manipulation', 'Criminal Networks', 'Strategic Planning'],
  },
  {
    id: '2',
    name: 'Elizabeth Keen',
    role: 'FBI Profiler',
    affiliation: 'FBI Task Force',
    status: 'deceased',
    background: 'Former FBI criminal profiler and member of the task force. Reddington\'s complicated relationship with her drove much of the early investigations.',
    skills: ['Criminal Profiling', 'Interrogation', 'Undercover Work', 'Investigation'],
  },
  {
    id: '3',
    name: 'Donald Ressler',
    role: 'FBI Agent',
    affiliation: 'FBI Task Force',
    status: 'active',
    background: 'Senior FBI agent and task force leader. Former counterterrorism specialist with a strong sense of duty and justice.',
    skills: ['Leadership', 'Tactical Operations', 'Counter-terrorism', 'Investigation'],
  },
  {
    id: '4',
    name: 'Harold Cooper',
    role: 'Assistant Director',
    affiliation: 'FBI',
    status: 'active',
    background: 'FBI Assistant Director who oversees the task force. Former Marine with extensive law enforcement experience.',
    skills: ['Leadership', 'Strategic Planning', 'Administration', 'Crisis Management'],
  },
  {
    id: '5',
    name: 'Aram Mojtabai',
    role: 'FBI Tech Specialist',
    affiliation: 'FBI Task Force',
    status: 'active',
    background: 'Brilliant computer specialist and technical analyst for the task force. Expert in cybersecurity and digital forensics.',
    skills: ['Computer Science', 'Hacking', 'Digital Forensics', 'Technical Analysis'],
  },
  {
    id: '6',
    name: 'Dembe Zuma',
    role: 'Bodyguard/Associate',
    affiliation: 'Raymond Reddington',
    status: 'active',
    background: 'Reddington\'s loyal bodyguard and closest confidant. Former child soldier from Sierra Leone, saved and raised by Reddington.',
    skills: ['Combat', 'Protection', 'Loyalty', 'Strategic Thinking'],
  }
];

export default function CharactersScreen() {
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
    Alert.alert(
      character.name,
      `Role: ${character.role}\nAffiliation: ${character.affiliation}\n\nBackground:\n${character.background}\n\nSkills: ${character.skills.join(', ')}`,
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
      
      <ThemedView style={styles.skillsContainer}>
        <ThemedText style={styles.skillsTitle}>Key Skills:</ThemedText>
        <ThemedView style={styles.skillsWrapper}>
          {item.skills.slice(0, 3).map((skill, index) => (
            <ThemedView key={index} style={styles.skillTag}>
              <ThemedText style={styles.skillText}>{skill}</ThemedText>
            </ThemedView>
          ))}
          {item.skills.length > 3 && (
            <ThemedText style={styles.moreSkills}>+{item.skills.length - 3} more</ThemedText>
          )}
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Character Profiles', headerShown: true }} />
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerTitle}>CHARACTER PROFILES</ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            FBI Task Force Personnel Database
          </ThemedText>
          <ThemedText style={styles.classification}>
            CLASSIFICATION: RESTRICTED
          </ThemedText>
        </ThemedView>
        
        <FlatList
          data={characters}
          renderItem={renderCharacterItem}
          keyExtractor={(item) => item.id}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
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
  characterCard: {
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
  characterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  characterRole: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 2,
  },
  characterAffiliation: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  characterBackground: {
    fontSize: 16,
    color: '#e0e0e0',
    lineHeight: 22,
    marginBottom: 15,
  },
  statusContainer: {
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  skillsContainer: {
    marginTop: 10,
  },
  skillsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ff4444',
    marginBottom: 8,
  },
  skillsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  skillTag: {
    backgroundColor: '#333333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  skillText: {
    color: '#ffffff',
    fontSize: 12,
  },
  moreSkills: {
    color: '#cccccc',
    fontSize: 12,
    fontStyle: 'italic',
  },
});