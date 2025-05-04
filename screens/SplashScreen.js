import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import * as Location from 'expo-location';

const SplashScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        
        if (status === 'granted') {
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });
        } else {
          setLocation({
            latitude: -6.166267,
            longitude: 106.876645,
          });
          Alert.alert(
            "Location Access Denied",
            "Using default location in Jakarta. Some features may be limited."
          );
        }
      } catch (error) {
        console.error("Error getting location:", error);
        setLocation({
          latitude: -6.166267,
          longitude: 106.876645,
        });
      }
    })();
  }, []);

  const handleContinue = () => {
    if (location) {
      navigation.navigate('List', { location });
    } else {
      navigation.navigate('List', { 
        location: { 
          latitude: -6.166267, 
          longitude: 106.876645 
        } 
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/cueapp-logo.jpg')}
        resizeMode="contain"
      />
      <Text style={styles.title}>CueApp</Text>
      <Text style={styles.subtitle}>Find the best billiard halls near you</Text>
      
      <TouchableOpacity 
        style={styles.continueButton}
        onPress={handleContinue}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 40,
    textAlign: 'center',
  },
  continueButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SplashScreen;