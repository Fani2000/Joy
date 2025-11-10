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
import { getMessages, Message } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export default function MessagesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [user]);

  useFocusEffect(
    React.useCallback(() => {
      loadMessages();
    }, [user])
  );

  const loadMessages = async () => {
    if (!user?.email) {
      setLoading(false);
      return;
    }

    try {
      const data = await getMessages(user.email);
      setMessages(data);
    } catch (error) {
      console.log('Error loading messages:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadMessages();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderMessageItem = ({ item }: { item: Message }) => (
    <View style={styles.messageCard}>
      <View style={styles.messageIcon}>
        <Ionicons name="heart" size={24} color="#ec4899" />
      </View>
      <View style={styles.messageDetails}>
        <Text style={styles.messageContent} numberOfLines={2}>{item.content}</Text>
        <View style={styles.messageMeta}>
          <Text style={styles.messageRecipient}>
            To: {item.recipientName || item.recipientEmail}
          </Text>
          <Text style={styles.messageDate}>{formatDate(item.createdAt)}</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name="chatbubbles-outline" size={80} color="#d1d5db" />
      </View>
      <Text style={styles.emptyTitle}>No Messages Yet</Text>
      <Text style={styles.emptySubtitle}>
        Send a heartfelt birthday message to someone special!
      </Text>
      <TouchableOpacity
        style={styles.sendButton}
        onPress={() => router.push('/send-message')}
      >
        <LinearGradient
          colors={['#ec4899', '#f43f5e']}
          style={styles.buttonGradient}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.buttonText}>Send a Message</Text>
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
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ec4899']} />
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
  messageCard: {
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
  messageIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fce7f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  messageDetails: {
    flex: 1,
  },
  messageContent: {
    fontSize: 15,
    color: '#1f2937',
    marginBottom: 8,
    lineHeight: 22,
  },
  messageMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  messageRecipient: {
    fontSize: 12,
    color: '#9ca3af',
  },
  messageDate: {
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

