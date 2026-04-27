import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera, Car, ClipboardList, Settings, LogOut } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/useAuthStore';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function Home() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInDown.duration(800)} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Hello, {user?.name || 'User'}</Text>
            <Text style={styles.subtitle}>Ready for an inspection?</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <LogOut size={24} color="#4F46E5" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.grid}>
        {[
          { href: "/(tabs)/camera", icon: Camera, label: "New Inspection", delay: 200 },
          { href: "/(tabs)/history", icon: ClipboardList, label: "History", delay: 300 },
          { href: "/(tabs)/vehicles", icon: Car, label: "My Vehicles", delay: 400 },
          { href: "/(tabs)/settings", icon: Settings, label: "Settings", delay: 500 },
        ].map((item, index) => (
          <Animated.View 
            key={index} 
            entering={FadeInDown.delay(item.delay).duration(600).springify()}
            style={styles.cardContainer}
          >
            <Link href={item.href as any} asChild>
              <TouchableOpacity style={styles.card}>
                <item.icon size={32} color="#4F46E5" />
                <Text style={styles.cardText}>{item.label}</Text>
              </TouchableOpacity>
            </Link>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F3F5',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 6,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardContainer: {
    width: '47%',
    marginBottom: 20,
  },
  card: {
    width: '100%',
    aspectRatio: 0.9,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F3F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  cardText: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
  },
});
