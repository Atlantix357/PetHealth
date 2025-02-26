import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { handleGoogleSignIn, checkUserAuth } from '../services/firebase';
import Animated, { FadeIn } from 'react-native-reanimated';

const AuthScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  
  useEffect(() => {
    // Configure Google Sign-In
    GoogleSignin.configure({
      webClientId: 'YOUR_WEB_CLIENT_ID', // Replace with your web client ID
    });
    
    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const user = await checkUserAuth();
        if (user) {
          navigation.replace('Main');
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [navigation]);
  
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // Get ID token
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      
      // Sign in with Firebase
      await handleGoogleSignIn(idToken);
      
      // Navigate to main app
      navigation.replace('Main');
    } catch (error) {
      console.error('Google sign-in error:', error);
      setError('Login failed. Please try again.');
      setSnackbarVisible(true);
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#26A69A" />
      </View>
    );
  }
  
  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(800)}
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>PetPulse</Text>
        <Text style={styles.subtitle}>Your Pet's Lifeline</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          icon="google"
          onPress={signInWithGoogle}
          style={styles.googleButton}
          labelStyle={styles.buttonLabel}
        >
          Sign in with Google
        </Button>
      </View>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Retry',
          onPress: signInWithGoogle,
        }}
      >
        {error}
      </Snackbar>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#26A69A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FF6F61',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  googleButton: {
    backgroundColor: '#26A69A',
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 4,
  },
});

export default AuthScreen;
