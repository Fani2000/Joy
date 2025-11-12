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
import { getGifts, getMessages, getUpcomingBirthdays } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Gift, Message, Friend } from '../../services/api/types';

// Activity type that combines gifts and messages
type Activity = {
  id: string;
  type: 'gift' | 'message';
  recipientName: string;
  title?: string;
  content?: string;
  createdAt: string;
};

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [stats, setStats] = useState({ gifts: 0, messages: 0 });
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<Friend[]>([]);
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
      const [giftsData, messagesData, birthdaysData] = await Promise.all([
        getGifts(user.email).catch((err) => {
          console.log('Gifts fetch error:', err.message);
          return [];
        }),
        getMessages(user.email).catch((err) => {
          console.log('Messages fetch error:', err.message);
          return [];
        }),
        getUpcomingBirthdays(7).catch((err) => {
          console.log('Birthdays fetch error:', err.message);
          return [];
        }),
      ]);
      
      setStats({
        gifts: giftsData.length,
        messages: messagesData.length,
      });

      // Combine gifts and messages into activities
      const activities: Activity[] = [
        ...giftsData.map((gift: Gift) => ({
          id: gift.id,
          type: 'gift' as const,
          recipientName: gift.recipientName,
          title: gift.title,
          createdAt: gift.createdAt,
        })),
        ...messagesData.map((message: Message) => ({
          id: message.id,
          type: 'message' as const,
          recipientName: message.recipientName,
          content: message.content,
          createdAt: message.createdAt,
        })),
      ];

      // Sort by date (most recent first) and take only the last 3
      activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRecentActivities(activities.slice(0, 3));
      
      // Limit upcoming birthdays to 3 items
      setUpcomingBirthdays(birthdaysData.slice(0, 3));
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

  // Helper to format relative time
  const formatRelativeTime = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  // Helper to calculate days until birthday
  const getDaysUntilBirthday = (birthday: string): number => {
    const today = new Date();
    const bday = new Date(birthday);
    const thisYearBirthday = new Date(today.getFullYear(), bday.getMonth(), bday.getDate());
    
    if (thisYearBirthday < today) {
      thisYearBirthday.setFullYear(today.getFullYear() + 1);
    }
    
    const diffInMs = thisYearBirthday.getTime() - today.getTime();
    return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
  };

  // Helper to format birthday date
  const formatBirthday = (birthday: string): string => {
    const date = new Date(birthday);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Render activity item
  const renderActivityItem = (activity: Activity) => {
    const isGift = activity.type === 'gift';
    return (
      <View key={activity.id} style={styles.activityItem}>
        <View style={[styles.activityIcon, isGift ? styles.giftIcon : styles.messageIcon]}>
          <Ionicons 
            name={isGift ? 'gift' : 'heart'} 
            size={20} 
            color="#fff" 
          />
        </View>
        <View style={styles.activityContent}>
          <Text style={styles.activityTitle}>
            {isGift ? activity.title : 'Birthday Message'}
          </Text>
          <Text style={styles.activitySubtitle}>
            To {activity.recipientName}
          </Text>
          {!isGift && activity.content && (
            <Text style={styles.activityMessage} numberOfLines={2}>
              {activity.content}
            </Text>
          )}
        </View>
        <Text style={styles.activityTime}>
          {formatRelativeTime(activity.createdAt)}
        </Text>
      </View>
    );
  };

  // Render birthday item
  const renderBirthdayItem = (friend: Friend) => {
    const daysUntil = getDaysUntilBirthday(friend.birthday);
    return (
      <TouchableOpacity 
        key={friend.id} 
        style={styles.birthdayItem}
        onPress={() => router.push('/send-message')}
      >
        <View style={styles.birthdayIconContainer}>
          <Ionicons name="gift" size={24} color="#f59e0b" />
        </View>
        <View style={styles.birthdayContent}>
          <Text style={styles.birthdayName}>{friend.name}</Text>
          <Text style={styles.birthdayDate}>{formatBirthday(friend.birthday)}</Text>
        </View>
        <View style={styles.birthdayBadge}>
          <Text style={styles.birthdayDays}>
            {daysUntil === 0 ? 'Today!' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil}d`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#ec4899']} />
      }
    >
      <LinearGradient
        colors={['#ec4899', '#f59e0b']}
        style={styles.welcomeBanner}
      >
        <Text style={styles.welcomeText}>Spread Joy & Celebrate Love 💝</Text>
        
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
          <ActivityIndicator size="large" color="#ec4899" />
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
              <Text style={styles.actionSubtext}>🎁 Surprise someone special</Text>
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
              <Text style={styles.actionText}>Send Love</Text>
              <Text style={styles.actionSubtext}>💕 Share warm wishes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <Ionicons name="time-outline" size={24} color="#ec4899" />
          </View>
          
          {recentActivities.length > 0 ? (
            <View style={styles.activityCard}>
              {recentActivities.map(renderActivityItem)}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="sparkles-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No activity yet</Text>
              <Text style={styles.emptySubtitle}>Start sending gifts and messages!</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Birthdays</Text>
            <Ionicons name="calendar-outline" size={24} color="#ec4899" />
          </View>
          
          {upcomingBirthdays.length > 0 ? (
            <>
              <View style={styles.birthdayCard}>
                {upcomingBirthdays.map(renderBirthdayItem)}
              </View>
              <View style={styles.birthdayActions}>
                <TouchableOpacity 
                  style={styles.viewAllButtonAlt}
                  onPress={() => router.push('/friends-list')}
                >
                  <Text style={styles.viewAllText}>View All Friends</Text>
                  <Ionicons name="chevron-forward" size={16} color="#ec4899" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.addFriendButton}
                  onPress={() => router.push('/add-friend')}
                >
                  <Ionicons name="person-add-outline" size={20} color="#ec4899" />
                  <Text style={styles.addFriendText}>Add Friend</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons name="calendar-outline" size={48} color="#d1d5db" />
              <Text style={styles.emptyTitle}>No birthdays coming up</Text>
              <Text style={styles.emptySubtitle}>Add friends to see their birthdays</Text>
              <TouchableOpacity 
                style={styles.emptyAddButton}
                onPress={() => router.push('/add-friend')}
              >
                <LinearGradient
                  colors={['#ec4899', '#8b5cf6']}
                  style={styles.emptyAddButtonGradient}
                >
                  <Ionicons name="person-add" size={20} color="#fff" />
                  <Text style={styles.emptyAddButtonText}>Add Your First Friend</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
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
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ec4899',
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
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  giftIcon: {
    backgroundColor: '#f59e0b',
  },
  messageIcon: {
    backgroundColor: '#ec4899',
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  activityMessage: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  activityTime: {
    fontSize: 12,
    color: '#9ca3af',
    marginLeft: 8,
  },
  birthdayCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  birthdayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  birthdayIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fce7f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  birthdayContent: {
    flex: 1,
  },
  birthdayName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  birthdayDate: {
    fontSize: 13,
    color: '#6b7280',
  },
  birthdayBadge: {
    backgroundColor: '#fce7f3',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  birthdayDays: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ec4899',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fce7f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  birthdayActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  viewAllButtonAlt: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 6,
  },
  addFriendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fce7f3',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  addFriendText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ec4899',
  },
  emptyAddButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyAddButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyAddButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});

