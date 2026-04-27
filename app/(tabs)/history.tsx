import React, { useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from 'react-native';
import { useInspectionStore } from '../../src/store/useInspectionStore';
import { useAuthStore } from '../../src/store/useAuthStore';
import { CheckCircle2, Clock, AlertCircle, ChevronRight, Image as ImageIcon, ClipboardList } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { databaseService } from '../../src/services/databaseService';
import Animated, { FadeInRight } from 'react-native-reanimated';

export default function History() {
  const { inspections, isLoading, loadInspections } = useInspectionStore();
  const { user } = useAuthStore();
  const [photos, setPhotos] = React.useState<Record<string, string>>({});
  const router = useRouter();

  useEffect(() => {
    const fetchPhotos = async () => {
      const photoMap: Record<string, string> = {};
      for (const inspection of inspections) {
        const itemPhotos = await databaseService.getPhotos(inspection.id);
        if (itemPhotos.length > 0) {
          photoMap[inspection.id] = itemPhotos[0].uri;
        }
      }
      setPhotos(photoMap);
    };

    if (inspections.length > 0) {
      fetchPhotos();
    }
  }, [inspections]);

  const onRefresh = React.useCallback(() => {
    if (user) loadInspections(user.id);
  }, [user]);

  const getStatusIcon = (status: string) => {
    if (status === 'uploaded') return <CheckCircle2 size={16} color="#34c759" />;
    return <Clock size={16} color="#4F46E5" />;
  };

  const renderItem = ({ item, index }: { item: any, index: number }) => (
    <Animated.View entering={FadeInRight.delay(index * 100).duration(500).springify()}>
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => router.push(`/inspection/details/${item.id}`)}
      >
        <View style={styles.cardLeft}>
          <View style={styles.thumbnailContainer}>
            {photos[item.id] ? (
              <Image source={{ uri: photos[item.id] }} style={styles.thumbnail} />
            ) : (
              <View style={styles.placeholderThumbnail}>
                <ImageIcon size={24} color="#ccc" />
              </View>
            )}
          </View>
          <View>
            <Text style={styles.vehicleName}>{item.vehicleName || 'Unknown Vehicle'}</Text>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
        </View>
        <View style={styles.cardRight}>
          <View style={styles.statusBadge}>
            {getStatusIcon(item.status)}
            <Text style={[styles.statusText, { color: item.status === 'uploaded' ? '#34c759' : '#4F46E5' }]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
          <ChevronRight size={20} color="#ccc" />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {isLoading && inspections.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#f4511e" />
        </View>
      ) : inspections.length === 0 ? (
        <View style={styles.centered}>
          <ClipboardList size={64} color="#eee" />
          <Text style={styles.emptyText}>No inspections yet</Text>
        </View>
      ) : (
        <FlatList
          data={inspections}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor="#f4511e" />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  list: {
    padding: 24,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F3F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  thumbnailContainer: {
    marginRight: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
  },
  placeholderThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },
  vehicleName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '800',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 20,
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
});
