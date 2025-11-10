import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getGifts, Gift } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function GiftsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadGifts();
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      loadGifts();
    }, [user])
  );

  const loadGifts = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      const data = await getGifts(user.email);
      setGifts(data);
    } catch (error) {
      console.log('Error loading gifts:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadGifts();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderGiftItem = ({ item }: { item: Gift }) => (
    <View style={styles.giftCard}>
      <View style={styles.giftIcon}>
        <Ionicons name="gift" size={28} color="#6366f1" />
      </View>
      <View style={styles.giftDetails}>
        <Text style={styles.giftTitle}>{item.title}</Text>
        <Text style={styles.giftDescription}>{item.description}</Text>
        <View style={styles.giftMeta}>
          <Text style={styles.giftRecipient}>
            To: {item.recipientName || item.recipientEmail}
          </Text>
          <Text style={styles.giftDate}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="gift-outline" size={80} color="#d1d5db" />
      </View>
      <Text style={styles.emptyTitle}>No Gifts Yet</Text>
      <Text style={styles.emptySubtitle}>
        Start spreading joy by sending your first gift!
      </Text>
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => router.push('/send-gift')}
      >
        <LinearGradient
          colors={['#f59e0b', '#f97316']}
          style={styles.buttonGradient}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.buttonText}>Send a Gift</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={gifts}
        renderItem={renderGiftItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366f1']} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  listContent: {
    padding: 20,
    paddingTop: 20,
    flexGrow: 1,
  },
  giftCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  giftIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  giftDetails: {
    flex: 1,
  },
  giftTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  giftDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  giftMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  giftRecipient: {
    fontSize: 12,
    color: '#9ca3af',
  },
  giftDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 40,
  },
  sendButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
});

