import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, Car, ClipboardList, Settings, Bell, ChevronRight, TrendingUp, Clock, CheckCircle2 } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useInspectionStore } from '../../src/store/useInspectionStore';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function Home() {
  const user = useAuthStore((state) => state.user);
  const { inspections, isLoading, loadInspections } = useInspectionStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (user) {
      loadInspections(user.id);
    }
  }, [user]);

  const recentInspections = inspections.slice(0, 3);
  const totalInspections = inspections.length;
  const pendingInspections = inspections.filter(i => i.status === 'pending' || i.status === 'draft').length;

  const StatCard = ({ label, value, icon: Icon, color, delay }: any) => (
    <Animated.View entering={FadeInRight.delay(delay).duration(600).springify()} style={styles.statCard}>
      <LinearGradient colors={[color, color + 'CC']} style={styles.statGradient}>
        <Icon size={24} color="#fff" />
        <View style={styles.statInfo}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel}>{label}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <LinearGradient
            colors={['#4F46E5', '#6366F1', '#818CF8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.headerGradient, { paddingTop: insets.top + 20 }]}
          >
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.greetingText}>Welcome back,</Text>
                <Text style={styles.userNameText}>{user?.name || 'User'}</Text>
              </View>
              <TouchableOpacity style={styles.notificationBtn}>
                <Bell size={24} color="#fff" />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>

            <View style={styles.statsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
                <StatCard label="Total" value={totalInspections} icon={TrendingUp} color="#10B981" delay={200} />
                <StatCard label="Pending" value={pendingInspections} icon={Clock} color="#F59E0B" delay={400} />
                <StatCard label="Vehicles" value="8" icon={Car} color="#6366F1" delay={600} />
              </ScrollView>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.grid}>
            {[
              { href: "/(tabs)/camera", icon: Camera, label: "New Inspect", color: "#EEF2FF", iconColor: "#4F46E5" },
              { href: "/(tabs)/history", icon: ClipboardList, label: "History", color: "#ECFDF5", iconColor: "#10B981" },
              { href: "/(tabs)/vehicles", icon: Car, label: "Vehicles", color: "#FFFBEB", iconColor: "#F59E0B" },
              { href: "/(tabs)/settings", icon: Settings, label: "Settings", color: "#F8FAFC", iconColor: "#64748B" },
            ].map((item, index) => (
              <Animated.View 
                key={index} 
                entering={FadeInDown.delay(index * 100).duration(600)}
                style={styles.actionCardContainer}
              >
                <Link href={item.href as any} asChild>
                  <TouchableOpacity style={[styles.actionCard, { backgroundColor: item.color }]}>
                    <item.icon size={28} color={item.iconColor} />
                    <Text style={styles.actionLabel}>{item.label}</Text>
                  </TouchableOpacity>
                </Link>
              </Animated.View>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/history')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {recentInspections.length > 0 ? (
            recentInspections.map((item, index) => (
              <Animated.View 
                key={item.id} 
                entering={FadeInDown.delay(400 + index * 100).duration(600)}
              >
                <TouchableOpacity 
                  style={styles.activityItem}
                  onPress={() => router.push(`/inspection/${item.id}`)}
                >
                  <View style={[styles.activityIcon, { backgroundColor: item.status === 'completed' ? '#ECFDF5' : '#FFFBEB' }]}>
                    <CheckCircle2 size={20} color={item.status === 'completed' ? '#10B981' : '#F59E0B'} />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityTitle}>{item.vehicleName}</Text>
                    <Text style={styles.activityDate}>
                      {new Date(item.createdAt).toLocaleDateString()} • {item.status.toUpperCase()}
                    </Text>
                  </View>
                  <ChevronRight size={20} color="#CBD5E1" />
                </TouchableOpacity>
              </Animated.View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No recent inspections</Text>
            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerContainer: {
    height: 300,
    marginBottom: 40,
  },
  headerGradient: {
    paddingHorizontal: 24,
    height: '100%',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greetingText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginTop: 4,
    letterSpacing: -0.5,
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#4F46E5',
  },
  statsContainer: {
    marginTop: 8,
  },
  statsScroll: {
    paddingRight: 24,
  },
  statCard: {
    width: 140,
    height: 100,
    marginRight: 16,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  statGradient: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  statInfo: {
    marginTop: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#4F46E5',
    fontSize: 14,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCardContainer: {
    width: '48%',
    marginBottom: 16,
  },
  actionCard: {
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
  actionLabel: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  activityDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  emptyStateText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
  },
});
