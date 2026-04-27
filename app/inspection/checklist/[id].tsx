import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, useFocusEffect } from 'expo-router';
import { CheckCircle2, Circle, ChevronRight, Camera, ArrowLeft } from 'lucide-react-native';
import { INSPECTION_STEPS, InspectionStep } from '../../../src/constants/inspectionSteps';
import { databaseService, PhotoRecord } from '../../../src/services/databaseService';
import { useInspectionStore } from '../../../src/store/useInspectionStore';

export default function InspectionChecklist() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { saveInspectionData } = useInspectionStore();

  const loadPhotos = async () => {
    try {
      const capturedPhotos = await databaseService.getPhotos(id as string);
      setPhotos(capturedPhotos);
    } catch (error) {
      console.error('Failed to load photos', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadPhotos();
    }, [id])
  );

  const isStepCompleted = (stepId: string) => {
    return photos.some(p => p.type === stepId);
  };

  const handleStepPress = (step: InspectionStep) => {
    router.push({
      pathname: `/inspection/${id}`,
      params: { stepId: step.id, label: step.label }
    });
  };

  const handleFinish = async () => {
    const requiredSteps = INSPECTION_STEPS.filter(s => s.required);
    const completedRequired = requiredSteps.every(s => isStepCompleted(s.id));

    if (!completedRequired) {
      Alert.alert('Incomplete Inspection', 'Please complete all required steps before finishing.');
      return;
    }

    await saveInspectionData(id as string, {});
    router.replace('/(tabs)/history');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const completedCount = photos.length;
  const totalCount = INSPECTION_STEPS.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.title}>Inspection Checklist</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressText}>{completedCount} of {totalCount} steps completed</Text>
        </View>
      </View>

      <ScrollView style={styles.stepsList} contentContainerStyle={styles.stepsContent}>
        {INSPECTION_STEPS.map((step) => {
          const completed = isStepCompleted(step.id);
          return (
            <TouchableOpacity 
              key={step.id} 
              style={[styles.stepItem, completed && styles.stepItemCompleted]}
              onPress={() => handleStepPress(step)}
            >
              <View style={styles.stepInfo}>
                <View style={[styles.iconContainer, completed && styles.iconContainerCompleted]}>
                  {completed ? (
                    <CheckCircle2 size={24} color="#34C759" />
                  ) : (
                    <Circle size={24} color="#999" />
                  )}
                </View>
                <View style={styles.textContainer}>
                  <Text style={[styles.stepLabel, completed && styles.stepLabelCompleted]}>
                    {step.label} {step.required && <Text style={styles.requiredText}>*</Text>}
                  </Text>
                  <Text style={styles.stepDescription}>{step.description}</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#CCC" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.finishButton, completedCount === 0 && styles.finishButtonDisabled]} 
          onPress={handleFinish}
        >
          <Text style={styles.finishButtonText}>Complete Inspection</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#FFF',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#EEE',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  stepsList: {
    flex: 1,
  },
  stepsContent: {
    padding: 24,
  },
  stepItem: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  stepItemCompleted: {
    backgroundColor: '#F0FDF4',
    borderColor: '#DCFCE7',
    borderWidth: 1,
  },
  stepInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconContainerCompleted: {
    // Styling for completed icon
  },
  textContainer: {
    flex: 1,
  },
  stepLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  stepLabelCompleted: {
    color: '#166534',
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  requiredText: {
    color: '#EF4444',
  },
  footer: {
    padding: 24,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  finishButton: {
    backgroundColor: '#1A1A1A',
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishButtonDisabled: {
    backgroundColor: '#EEE',
  },
  finishButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
