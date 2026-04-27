import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { databaseService, InspectionRecord, PhotoRecord } from '../../../src/services/databaseService';
import { CheckCircle2, Clock, MapPin, Calendar, User, ArrowLeft } from 'lucide-react-native';

export default function InspectionDetails() {
  const { id } = useLocalSearchParams();
  const [inspection, setInspection] = useState<InspectionRecord | null>(null);
  const [photos, setPhotos] = useState<PhotoRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const db = await databaseService.getDb();
        const inspectionData = await db.getFirstAsync<InspectionRecord>(
          'SELECT * FROM inspections WHERE id = ?',
          [id as string]
        );
        const photoData = await databaseService.getPhotos(id as string);
        
        setInspection(inspectionData);
        setPhotos(photoData);
      } catch (err) {
        console.error('Failed to load inspection details', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f4511e" />
      </View>
    );
  }

  if (!inspection) {
    return (
      <View style={styles.centered}>
        <Text>Inspection not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inspection Details</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <User size={18} color="#999" />
              <Text style={styles.infoLabel}>Owner ID:</Text>
              <Text style={styles.infoValue}>{inspection.userId}</Text>
            </View>
            <View style={styles.infoRow}>
              <MapPin size={18} color="#999" />
              <Text style={styles.infoLabel}>Vehicle:</Text>
              <Text style={styles.infoValue}>{inspection.vehicleName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Calendar size={18} color="#999" />
              <Text style={styles.infoLabel}>Date:</Text>
              <Text style={styles.infoValue}>{new Date(inspection.createdAt).toLocaleString()}</Text>
            </View>
            <View style={styles.infoRow}>
              {inspection.status === 'uploaded' ? (
                <CheckCircle2 size={18} color="#34c759" />
              ) : (
                <Clock size={18} color="#ff9500" />
              )}
              <Text style={styles.infoLabel}>Status:</Text>
              <Text style={[styles.infoValue, { color: inspection.status === 'uploaded' ? '#34c759' : '#ff9500' }]}>
                {inspection.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Captured Photos ({photos.length})</Text>
          <View style={styles.photoGrid}>
            {photos.map((photo) => (
              <View key={photo.id} style={styles.photoCard}>
                <Image source={{ uri: photo.uri }} style={styles.photo} />
                <View style={styles.photoLabel}>
                  <Text style={styles.photoTypeText}>{photo.type.replace('_', ' ')}</Text>
                </View>
              </View>
            ))}
            {photos.length === 0 && (
              <Text style={styles.emptyText}>No photos captured yet</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    height: 100,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  photo: {
    width: '100%',
    aspectRatio: 1,
  },
  photoLabel: {
    padding: 8,
    backgroundColor: '#fff',
  },
  photoTypeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
  }
});
