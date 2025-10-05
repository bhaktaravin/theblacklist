import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BlacklistCriminal } from '@/database/simple-database';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity
} from 'react-native';

interface CriminalEditFormProps {
  visible: boolean;
  criminal: BlacklistCriminal | null;
  onSave: (criminal: BlacklistCriminal) => void;
  onCancel: () => void;
  onDelete?: (id: number) => void;
}

export default function CriminalEditForm({
  visible,
  criminal,
  onSave,
  onCancel,
  onDelete
}: CriminalEditFormProps) {
  const [formData, setFormData] = useState<BlacklistCriminal>({
    id: 0,
    number: 0,
    name: '',
    alias: '[]',
    status: 'unknown',
    threat: 'medium',
    description: '',
    crimes: '[]',
    lastKnownLocation: ''
  });

  const [aliasInput, setAliasInput] = useState('');
  const [crimesInput, setCrimesInput] = useState('');

  React.useEffect(() => {
    if (criminal) {
      setFormData(criminal);
      const aliasArray = typeof criminal.alias === 'string' ? JSON.parse(criminal.alias || '[]') : criminal.alias;
      const crimesArray = typeof criminal.crimes === 'string' ? JSON.parse(criminal.crimes || '[]') : criminal.crimes;
      setAliasInput(aliasArray.join(', '));
      setCrimesInput(crimesArray.join(', '));
    } else {
      // Reset form for new criminal
      setFormData({
        id: 0,
        number: 0,
        name: '',
        alias: '[]',
        status: 'unknown',
        threat: 'medium',
        description: '',
        crimes: '[]',
        lastKnownLocation: ''
      });
      setAliasInput('');
      setCrimesInput('');
    }
  }, [criminal]);

  const handleSave = () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    if (formData.number <= 0) {
      Alert.alert('Error', 'Valid number is required');
      return;
    }

    const aliasArray = aliasInput.split(',').map(a => a.trim()).filter(a => a.length > 0);
    const crimesArray = crimesInput.split(',').map(c => c.trim()).filter(c => c.length > 0);

    const criminalToSave = {
      ...formData,
      alias: JSON.stringify(aliasArray),
      crimes: JSON.stringify(crimesArray),
    };

    onSave(criminalToSave);
  };

  const handleDelete = () => {
    if (!criminal?.id) return;
    
    Alert.alert(
      'Delete Criminal',
      `Are you sure you want to delete ${criminal.name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => onDelete?.(criminal.id!)
        }
      ]
    );
  };

  const statusOptions = ['active', 'captured', 'deceased', 'unknown'];
  const threatOptions = ['low', 'medium', 'high', 'extreme'];

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.headerTitle}>
            {criminal ? 'Edit Criminal' : 'Add New Criminal'}
          </ThemedText>
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <ThemedText style={styles.closeButtonText}>✕</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Blacklist Number *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.number.toString()}
              onChangeText={(text) => setFormData({...formData, number: parseInt(text) || 0})}
              keyboardType="numeric"
              placeholder="Enter blacklist number"
              placeholderTextColor="#888"
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Name *</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({...formData, name: text})}
              placeholder="Enter criminal name"
              placeholderTextColor="#888"
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Aliases</ThemedText>
            <TextInput
              style={styles.input}
              value={aliasInput}
              onChangeText={setAliasInput}
              placeholder="Enter aliases separated by commas"
              placeholderTextColor="#888"
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Status</ThemedText>
            <ThemedView style={styles.buttonGroup}>
              {statusOptions.map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.optionButton,
                    formData.status === status && styles.optionButtonSelected
                  ]}
                  onPress={() => setFormData({...formData, status: status as any})}
                >
                  <ThemedText style={[
                    styles.optionButtonText,
                    formData.status === status && styles.optionButtonTextSelected
                  ]}>
                    {status.toUpperCase()}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Threat Level</ThemedText>
            <ThemedView style={styles.buttonGroup}>
              {threatOptions.map((threat) => (
                <TouchableOpacity
                  key={threat}
                  style={[
                    styles.optionButton,
                    formData.threat === threat && styles.optionButtonSelected
                  ]}
                  onPress={() => setFormData({...formData, threat: threat as any})}
                >
                  <ThemedText style={[
                    styles.optionButtonText,
                    formData.threat === threat && styles.optionButtonTextSelected
                  ]}>
                    {threat.toUpperCase()}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Description</ThemedText>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData({...formData, description: text})}
              placeholder="Enter criminal description"
              placeholderTextColor="#888"
              multiline
              numberOfLines={4}
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Crimes</ThemedText>
            <TextInput
              style={styles.input}
              value={crimesInput}
              onChangeText={setCrimesInput}
              placeholder="Enter crimes separated by commas"
              placeholderTextColor="#888"
            />
          </ThemedView>

          <ThemedView style={styles.inputGroup}>
            <ThemedText style={styles.label}>Last Known Location</ThemedText>
            <TextInput
              style={styles.input}
              value={formData.lastKnownLocation || ''}
              onChangeText={(text) => setFormData({...formData, lastKnownLocation: text})}
              placeholder="Enter last known location"
              placeholderTextColor="#888"
            />
          </ThemedView>
        </ScrollView>

        <ThemedView style={styles.buttonContainer}>
          {criminal && onDelete && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <ThemedText style={styles.deleteButtonText}>Delete</ThemedText>
            </TouchableOpacity>
          )}
          
          <ThemedView style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <ThemedText style={styles.saveButtonText}>Save</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 2,
    borderBottomColor: '#ff4444',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#ff4444',
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#555',
  },
  optionButtonSelected: {
    backgroundColor: '#ff4444',
    borderColor: '#ff4444',
  },
  optionButtonText: {
    color: '#cccccc',
    fontSize: 12,
    fontWeight: 'bold',
  },
  optionButtonTextSelected: {
    color: '#ffffff',
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#555',
    padding: 15,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});