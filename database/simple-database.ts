// Simple in-memory database for cross-platform compatibility
export interface BlacklistCriminal {
  id?: number;
  number: number;
  name: string;
  alias: string; // JSON string for compatibility
  status: 'captured' | 'deceased' | 'active' | 'unknown';
  threat: 'low' | 'medium' | 'high' | 'extreme';
  description: string;
  crimes: string; // JSON string for compatibility
  lastKnownLocation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Character {
  id?: number;
  name: string;
  role: string;
  affiliation: string;
  status: 'active' | 'deceased' | 'missing' | 'imprisoned';
  background: string;
  skills: string; // JSON string for compatibility
  createdAt?: string;
  updatedAt?: string;
}

// In-memory storage
class SimpleDatabase {
  private criminals: BlacklistCriminal[] = [
    {
      id: 1,
      number: 1,
      name: 'Raymond Reddington',
      alias: JSON.stringify(['Red', 'The Concierge of Crime']),
      status: 'active',
      threat: 'extreme',
      description: 'Former US Naval Intelligence officer turned high-profile criminal. Known for his extensive criminal network and intelligence connections.',
      crimes: JSON.stringify(['Treason', 'Murder', 'Conspiracy', 'Arms Dealing', 'Money Laundering']),
      lastKnownLocation: 'Unknown'
    },
    {
      id: 2,
      number: 2,
      name: 'Freya Oslo',
      alias: JSON.stringify(['The Pharmaceutical']),
      status: 'captured',
      threat: 'high',
      description: 'Norwegian biochemist who developed illegal performance-enhancing drugs for criminal organizations.',
      crimes: JSON.stringify(['Drug Manufacturing', 'Conspiracy', 'Assault']),
      lastKnownLocation: 'Federal Prison'
    },
    {
      id: 3,
      number: 3,
      name: 'Wujing',
      alias: JSON.stringify(['The Chemist']),
      status: 'deceased',
      threat: 'extreme',
      description: 'Chinese spy and assassin known for creating untraceable poisons and chemical weapons.',
      crimes: JSON.stringify(['Espionage', 'Murder', 'Chemical Weapons', 'Terrorism']),
      lastKnownLocation: 'Deceased'
    },
    {
      id: 4,
      number: 4,
      name: 'The Stewmaker',
      alias: JSON.stringify(['Stanley R. Kornish']),
      status: 'deceased',
      threat: 'extreme',
      description: 'Serial killer who specialized in disposing of bodies using chemical dissolution.',
      crimes: JSON.stringify(['Serial Murder', 'Body Disposal', 'Chemical Weapons']),
      lastKnownLocation: 'Deceased'
    },
    {
      id: 5,
      number: 5,
      name: 'The Courier',
      alias: JSON.stringify(['Tommy Phelps']),
      status: 'captured',
      threat: 'medium',
      description: 'Professional smuggler specializing in transporting high-value illegal items across international borders.',
      crimes: JSON.stringify(['Smuggling', 'Conspiracy', 'Tax Evasion']),
      lastKnownLocation: 'Federal Prison'
    }
  ];

  private characters: Character[] = [
    {
      id: 1,
      name: 'Raymond "Red" Reddington',
      role: 'Criminal Informant',
      affiliation: 'FBI Task Force (Informant)',
      status: 'active',
      background: 'Former U.S. Naval Intelligence officer turned international criminal. Known as "The Concierge of Crime" for his vast network of criminal contacts.',
      skills: JSON.stringify(['Intelligence', 'Manipulation', 'Criminal Networks', 'Strategic Planning'])
    },
    {
      id: 2,
      name: 'Elizabeth Keen',
      role: 'FBI Profiler',
      affiliation: 'FBI Task Force',
      status: 'deceased',
      background: 'Former FBI criminal profiler and member of the task force. Reddington\'s complicated relationship with her drove much of the early investigations.',
      skills: JSON.stringify(['Criminal Profiling', 'Interrogation', 'Undercover Work', 'Investigation'])
    },
    {
      id: 3,
      name: 'Donald Ressler',
      role: 'FBI Agent',
      affiliation: 'FBI Task Force',
      status: 'active',
      background: 'Senior FBI agent and task force leader. Former counterterrorism specialist with a strong sense of duty and justice.',
      skills: JSON.stringify(['Leadership', 'Tactical Operations', 'Counter-terrorism', 'Investigation'])
    },
    {
      id: 4,
      name: 'Harold Cooper',
      role: 'Assistant Director',
      affiliation: 'FBI',
      status: 'active',
      background: 'FBI Assistant Director who oversees the task force. Former Marine with extensive law enforcement experience.',
      skills: JSON.stringify(['Leadership', 'Strategic Planning', 'Administration', 'Crisis Management'])
    },
    {
      id: 5,
      name: 'Aram Mojtabai',
      role: 'FBI Tech Specialist',
      affiliation: 'FBI Task Force',
      status: 'active',
      background: 'Brilliant computer specialist and technical analyst for the task force. Expert in cybersecurity and digital forensics.',
      skills: JSON.stringify(['Computer Science', 'Hacking', 'Digital Forensics', 'Technical Analysis'])
    }
  ];

  constructor() {
    console.log('Simple in-memory database initialized successfully');
  }

  // Criminal CRUD operations
  getAllCriminals(): BlacklistCriminal[] {
    return [...this.criminals];
  }

  getCriminalById(id: number): BlacklistCriminal | null {
    return this.criminals.find(c => c.id === id) || null;
  }

  addCriminal(criminal: Omit<BlacklistCriminal, 'id' | 'createdAt' | 'updatedAt'>): boolean {
    try {
      // Check if number already exists
      if (this.criminals.some(c => c.number === criminal.number)) {
        return false;
      }

      const newId = Math.max(...this.criminals.map(c => c.id || 0), 0) + 1;
      const newCriminal = {
        ...criminal,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.criminals.push(newCriminal);
      return true;
    } catch (error) {
      console.error('Error adding criminal:', error);
      return false;
    }
  }

  updateCriminal(id: number, criminal: Partial<BlacklistCriminal>): boolean {
    try {
      const index = this.criminals.findIndex(c => c.id === id);
      if (index >= 0) {
        this.criminals[index] = {
          ...this.criminals[index],
          ...criminal,
          id, // Preserve ID
          updatedAt: new Date().toISOString()
        };
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating criminal:', error);
      return false;
    }
  }

  deleteCriminal(id: number): boolean {
    try {
      const index = this.criminals.findIndex(c => c.id === id);
      if (index >= 0) {
        this.criminals.splice(index, 1);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting criminal:', error);
      return false;
    }
  }

  // Character operations
  getAllCharacters(): Character[] {
    return [...this.characters];
  }

  getCharacterById(id: number): Character | null {
    return this.characters.find(c => c.id === id) || null;
  }

  addCharacter(character: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>): boolean {
    try {
      const newId = Math.max(...this.characters.map(c => c.id || 0), 0) + 1;
      const newCharacter = {
        ...character,
        id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.characters.push(newCharacter);
      return true;
    } catch (error) {
      console.error('Error adding character:', error);
      return false;
    }
  }

  updateCharacter(id: number, character: Partial<Character>): boolean {
    try {
      const index = this.characters.findIndex(c => c.id === id);
      if (index >= 0) {
        this.characters[index] = {
          ...this.characters[index],
          ...character,
          id, // Preserve ID
          updatedAt: new Date().toISOString()
        };
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating character:', error);
      return false;
    }
  }

  deleteCharacter(id: number): boolean {
    try {
      const index = this.characters.findIndex(c => c.id === id);
      if (index >= 0) {
        this.characters.splice(index, 1);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting character:', error);
      return false;
    }
  }
}

export const databaseService = new SimpleDatabase();