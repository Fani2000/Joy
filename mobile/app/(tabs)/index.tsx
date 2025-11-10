import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getGifts, getMessages } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({ gifts: 0, messages: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadStats();
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      loadStats();
    }, [user])
  );

  const loadStats = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      const [giftsData, messagesData] = await Promise.all([
        getGifts(user.email).catch((err) => {
          console.log('Gifts fetch error:', err.message);
          return [];
        }),
        getMessages(user.email).catch((err) => {
          console.log('Messages fetch error:', err.message);
          return [];
        }),
      ]);
      
      setStats({
        gifts: giftsData.length,
        messages: messagesData.length,
      });
    } catch (error) {
      console.log('Stats error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366f1']} />
      }
    >
      <LinearGradient
        colors={['#8b5cf6', '#6366f1']}
        style={styles.welcomeBanner}
      >
        <Text style={styles.welcomeText}>Spread happiness to your friends 💝</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statBadge}>
            <Ionicons name="gift" size={18} color="#fff" />
            <Text style={styles.statBadgeText}>{stats.gifts} Gifts</Text>
          </View>
          <View style={styles.statBadge}>
            <Ionicons name="heart" size={18} color="#fff" />
            <Text style={styles.statBadgeText}>{stats.messages} Messages</Text>
          </View>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
        </View>
      ) : (
        <View style={styles.content}>
          <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/send-gift')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#f59e0b', '#f97316']}
              style={styles.actionGradient}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="gift" size={40} color="#fff" />
              </View>
              <Text style={styles.actionText}>Send Gift</Text>
              <Text style={styles.actionSubtext}>Surprise someone special</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push('/send-message')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#ec4899', '#f43f5e']}
              style={styles.actionGradient}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="heart" size={40} color="#fff" />
              </View>
              <Text style={styles.actionText}>Birthday Message</Text>
              <Text style={styles.actionSubtext}>Send warm wishes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Ionicons name="time-outline" size={24} color="#6366f1" />
          </View>
          
          <View style={styles.emptyCard}>
            <Ionicons name="sparkles-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No activity yet</Text>
            <Text style={styles.emptySubtitle}>Start sending gifts and messages!</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Birthdays</Text>
            <Ionicons name="calendar-outline" size={24} color="#6366f1" />
          </View>
          
          <View style={styles.emptyCard}>
            <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
            <Text style={styles.emptyTitle}>No birthdays coming up</Text>
            <Text style={styles.emptySubtitle}>Add friends to see their birthdays</Text>
          </View>
        </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  welcomeBanner: {
    paddingVertical: 28,
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  statBadgeText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  content: {
    padding: 20,
    marginTop: -10,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 32,
  },
  actionCard: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  actionGradient: {
    padding: 20,
    alignItems: 'center',
    minHeight: 160,
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 12,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.9,
    textAlign: 'center',
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

