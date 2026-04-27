import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useInspectionStore } from '../../src/store/useInspectionStore';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Play } from 'lucide-react-native';

export default function StartInspection() {
  const [vehicleName, setVehicleName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const { startInspection } = useInspectionStore();
  const { user } = useAuthStore();

  const handleStart = async () => {
    if (!vehicleName || !user) return;

    setLoading(true);
    try {
      const id = await startInspection(user.id, vehicleName);
      console.log('Inspection started with ID:', id);
      router.push(`/inspection/checklist/${id}`);
    } catch (error) {
      console.error('Failed to start inspection', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Inspection</Text>
        <Text style={styles.subtitle}>Enter the vehicle details to begin</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Vehicle Name (e.g., Toyota Camry 2024)"
          value={vehicleName}
          onChangeText={setVehicleName}
          placeholderTextColor="#999"
        />

        <TouchableOpacity 
          style={[styles.button, !vehicleName && styles.buttonDisabled]} 
          onPress={handleStart}
          disabled={!vehicleName || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.buttonText}>Start Inspection</Text>
              <Play size={20} color="#fff" style={{ marginLeft: 8 }} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 32,
  },
  header: {
    marginTop: 40,
    marginBottom: 48,
  },
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 12,
    lineHeight: 24,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: '#F8F9FA',
    height: 72,
    borderRadius: 20,
    paddingHorizontal: 24,
    fontSize: 18,
    color: '#1A1A1A',
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#F1F3F5',
    marginBottom: 32,
  },
  button: {
    backgroundColor: '#1A1A1A',
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: '#F1F3F5',
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
});
