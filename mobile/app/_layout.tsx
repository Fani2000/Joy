import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inProtectedRoute = inAuthGroup || 
                             segments[0] === 'send-gift' || 
                             segments[0] === 'send-message' ||
                             segments[0] === 'add-friend' ||
                             segments[0] === 'friends-list';

    if (!user && inProtectedRoute) {
      router.replace('/login');
    } else if (user && segments[0] === 'login') {
      router.replace('/(tabs)');
    }
  }, [user, segments, isLoading]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ec4899',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '900',
            fontSize: 18,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="send-gift" 
          options={{ 
            title: 'Send Gift',
            headerTitleStyle: {
              fontWeight: '900',
              fontSize: 18,
            }
          }} 
        />
        <Stack.Screen 
          name="send-message" 
          options={{ 
            title: 'Send Message',
            headerTitleStyle: {
              fontWeight: '900',
              fontSize: 18,
            }
          }} 
        />
        <Stack.Screen 
          name="add-friend" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="friends-list" 
          options={{ 
            headerShown: false,
          }} 
        />
        <Stack.Screen 
          name="login" 
          options={{ 
            headerShown: false,
          }} 
        />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

