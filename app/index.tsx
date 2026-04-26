import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera, Car, ClipboardList, Settings, LogOut } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';

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
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.title}>Hello, {user?.name || 'User'}</Text>
            <Text style={styles.subtitle}>Ready for an inspection?</Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <LogOut size={24} color="#f4511e" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.grid}>
        <Link href="/(tabs)/camera" asChild>
          <TouchableOpacity style={styles.card}>
            <Camera size={32} color="#f4511e" />
            <Text style={styles.cardText}>New Inspection</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/history" asChild>
          <TouchableOpacity style={styles.card}>
            <ClipboardList size={32} color="#f4511e" />
            <Text style={styles.cardText}>History</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/vehicles" asChild>
          <TouchableOpacity style={styles.card}>
            <Car size={32} color="#f4511e" />
            <Text style={styles.cardText}>My Vehicles</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/(tabs)/settings" asChild>
          <TouchableOpacity style={styles.card}>
            <Settings size={32} color="#f4511e" />
            <Text style={styles.cardText}>Settings</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 10,
    backgroundColor: '#fff5f2',
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
});
