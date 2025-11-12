import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { getFriends, deleteFriend } from '../services/api';
import { Friend } from '../services/api/types';

export default function FriendsListScreen() {
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    loadFriends();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadFriends();
    }, [])
  );

  const loadFriends = async () => {
    try {
      const data = await getFriends();
      // Sort by birthday (nearest first)
      const sortedFriends = data.sort((a, b) => {
        const dateA = new Date(a.birthday);
        const dateB = new Date(b.birthday);
        const now = new Date();
        
        // Get this year's birthday for both
        const thisYearA = new Date(now.getFullYear(), dateA.getMonth(), dateA.getDate());
        const thisYearB = new Date(now.getFullYear(), dateB.getMonth(), dateB.getDate());
        
        return thisYearA.getTime() - thisYearB.getTime();
      });
      setFriends(sortedFriends);
    } catch (error: any) {
      console.log('Error loading friends:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadFriends();
  };

  const formatBirthday = (birthday: string): string => {
    const date = new Date(birthday);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric',
    });
  };

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

  const handleDeleteFriend = (friend: Friend) => {
    setSelectedFriend(friend);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedFriend) return;
    
    setShowDeleteModal(false);
    try {
      await deleteFriend(selectedFriend.id);
      setFriends(friends.filter(f => f.id !== selectedFriend.id));
      setShowSuccessModal(true);
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to remove friend.');
      setShowErrorModal(true);
    }
    setSelectedFriend(null);
  };

  const renderFriendItem = (friend: Friend) => {
    const daysUntil = getDaysUntilBirthday(friend.birthday);
    const isUpcoming = daysUntil <= 30;

    return (
      <View key={friend.id} style={styles.friendCard}>
        <View style={styles.friendHeader}>
          <View style={[styles.friendAvatar, isUpcoming && styles.friendAvatarUpcoming]}>
            <Ionicons name="person" size={24} color={isUpcoming ? '#f59e0b' : '#6366f1'} />
          </View>
          <View style={styles.friendInfo}>
            <Text style={styles.friendName}>{friend.name}</Text>
            <Text style={styles.friendEmail}>{friend.email}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteFriend(friend)}
          >
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>

        <View style={styles.birthdayInfo}>
          <View style={styles.birthdayRow}>
            <Ionicons name="gift" size={18} color="#6b7280" />
            {/* <Ionicons name="calendar-outline" size={18} color="#6b7280" style={styles.calendarIcon} /> */}
            <Text style={styles.birthdayText}>{formatBirthday(friend.birthday)}</Text>
          </View>
          {isUpcoming && (
            <View style={styles.upcomingBadge}>
              <Text style={styles.upcomingText}>
                {daysUntil === 0 ? 'Today! 🎉' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/send-message')}
          >
            <Ionicons name="heart-outline" size={18} color="#ec4899" />
            <Text style={styles.actionButtonText}>Send Message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/send-gift')}
          >
            <Ionicons name="gift-outline" size={18} color="#f59e0b" />
            <Text style={styles.actionButtonText}>Send Gift</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#ec4899', '#f59e0b']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/add-friend')}
          >
            <Ionicons name="person-add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>💝 My Friends</Text>
        <Text style={styles.headerSubtitle}>
          {friends.length} {friends.length === 1 ? 'friend' : 'friends'} to celebrate with
        </Text>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#6366f1']} />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : friends.length > 0 ? (
          <View style={styles.friendsList}>
            {friends.map(renderFriendItem)}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="people-outline" size={64} color="#d1d5db" />
            </View>
            <Text style={styles.emptyTitle}>No friends yet</Text>
            <Text style={styles.emptySubtitle}>
              Add your friends to never miss a birthday!
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/add-friend')}
            >
              <LinearGradient
                colors={['#ec4899', '#8b5cf6']}
                style={styles.emptyButtonGradient}
              >
                <Ionicons name="heart" size={20} color="#fff" />
                <Text style={styles.emptyButtonText}>Add Your First Friend</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="warning" size={64} color="#f59e0b" />
            </View>
            <Text style={styles.modalTitle}>Remove Friend</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to remove {selectedFriend?.name}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButtonSecondary}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonPrimary}
                onPress={confirmDelete}
              >
                <LinearGradient
                  colors={['#ef4444', '#dc2626']}
                  style={styles.modalButtonGradient}
                >
                  <Text style={styles.modalButtonPrimaryText}>Remove</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="checkmark-circle" size={64} color="#10b981" />
            </View>
            <Text style={styles.modalTitle}>Success</Text>
            <Text style={styles.modalMessage}>
              {selectedFriend?.name} has been removed from your friends list.
            </Text>
            <TouchableOpacity
              style={styles.modalButtonPrimary}
              onPress={() => setShowSuccessModal(false)}
            >
              <LinearGradient
                colors={['#ec4899', '#8b5cf6']}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonPrimaryText}>OK</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal
        visible={showErrorModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <Ionicons name="close-circle" size={64} color="#ef4444" />
            </View>
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.modalButtonPrimary}
              onPress={() => setShowErrorModal(false)}
            >
              <LinearGradient
                colors={['#ef4444', '#dc2626']}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonPrimaryText}>OK</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
  friendsList: {
    padding: 20,
  },
  friendCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  friendAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fce7f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  friendAvatarUpcoming: {
    backgroundColor: '#fef3c7',
  },
  friendInfo: {
    flex: 1,
  },
  friendName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  friendEmail: {
    fontSize: 14,
    color: '#6b7280',
  },
  deleteButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  birthdayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    marginBottom: 12,
  },
  birthdayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  calendarIcon: {
    marginLeft: -4,
  },
  birthdayText: {
    fontSize: 14,
    color: '#6b7280',
  },
  upcomingBadge: {
    backgroundColor: '#fce7f3',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  upcomingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ec4899',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconContainer: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButtonPrimary: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modalButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalButtonSecondary: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonSecondaryText: {
    color: '#4b5563',
    fontSize: 16,
    fontWeight: '600',
  },
});

