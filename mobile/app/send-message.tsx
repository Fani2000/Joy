import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { sendMessage, requestAIMessage, sendEmail } from '../services/api';

export default function SendMessageScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);

  const handleGenerateAIMessage = async () => {
    if (!recipientName.trim()) {
      Alert.alert('Missing Information', 'Please enter the recipient name first');
      return;
    }

    setGeneratingAI(true);
    try {
      const aiMessage = await requestAIMessage(
        `Generate a warm birthday message for ${recipientName}`
      );
      setMessage(aiMessage);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to generate message');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !recipientEmail.trim()) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    if (!user?.email) {
      Alert.alert('Error', 'You must be logged in to send messages');
      return;
    }

    setSending(true);
    
    try {
      // Send message to backend
      await sendMessage({
        content: message.trim(),
        recipientName: recipientName.trim() || undefined,
        recipientEmail: recipientEmail.trim(),
        senderEmail: user.email,
      });

      // Try to send via email
      try {
        await sendEmail(
          recipientEmail.trim(),
          `Birthday Wishes from ${user.name || user.email}`,
          message.trim()
        );
      } catch (commError) {
        console.log('Email send failed (non-blocking):', commError);
      }

      Alert.alert(
        'Success! 💝',
        `Your message has been sent to ${recipientName || recipientEmail}`,
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <LinearGradient
            colors={['#ec4899', '#f43f5e']}
            style={styles.iconGradient}
          >
            <Ionicons name="heart" size={48} color="#fff" />
          </LinearGradient>
        </View>

        <Text style={styles.title}>Send Birthday Wishes</Text>
        <Text style={styles.subtitle}>Make someone feel special on their birthday</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Your Birthday Message</Text>
              <TouchableOpacity
                style={styles.aiButton}
                onPress={handleGenerateAIMessage}
                disabled={generatingAI}
              >
                {generatingAI ? (
                  <ActivityIndicator size="small" color="#ec4899" />
                ) : (
                  <>
                    <Ionicons name="sparkles" size={16} color="#ec4899" />
                    <Text style={styles.aiButtonText}>AI Generate</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Write a heartfelt birthday message..."
                value={message}
                onChangeText={setMessage}
                multiline
                numberOfLines={6}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g., Sarah Johnson"
                value={recipientName}
                onChangeText={setRecipientName}
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Recipient Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="recipient@email.com"
                value={recipientEmail}
                onChangeText={setRecipientEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendMessage}
          disabled={sending}
        >
          <LinearGradient
            colors={['#ec4899', '#f43f5e']}
            style={styles.buttonGradient}
          >
            {sending ? (
              <Text style={styles.buttonText}>Sending...</Text>
            ) : (
              <>
                <Ionicons name="send" size={20} color="#fff" />
                <Text style={styles.buttonText}>Send Message</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 40,
  },
  form: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  aiButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ec4899',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1f2937',
    paddingVertical: 14,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  sendButton: {
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 32,
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
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

