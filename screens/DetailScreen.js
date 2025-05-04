import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import axios from 'axios';

const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const DetailScreen = ({ route, navigation }) => {
  const { placeId } = route.params;
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaceDetails();
  }, []);

  const fetchPlaceDetails = async () => {
    try {
      setLoading(true);
      
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,opening_hours,rating,reviews,website,price_level,photos,geometry&key=${API_KEY}`;
      
      const response = await axios.get(url);
      
      if (response.data.status === 'OK') {
        setPlaceDetails(response.data.result);
      } else {
        setError('Failed to fetch place details. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openInGoogleMaps = () => {
    if (!placeDetails) return;
    
    const { geometry, name } = placeDetails;
    const { lat, lng } = geometry.location;
    
    const url = Platform.select({
      ios: `maps:0,0?q=${lat},${lng}(${name})`,
      android: `geo:0,0?q=${lat},${lng}(${name})`,
    });
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          const browserUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${placeId}`;
          return Linking.openURL(browserUrl);
        }
      })
      .catch(err => {
        Alert.alert('Error', 'Could not open Google Maps');
      });
  };

  const getOpeningHoursText = () => {
    if (!placeDetails?.opening_hours?.weekday_text) {
      return 'Opening hours not available';
    }
    return placeDetails.opening_hours.weekday_text;
  };

  const getPriceLevel = () => {
    if (placeDetails?.price_level === undefined) return 'Price information not available';
    
    const priceLevel = placeDetails.price_level;
    return '$'.repeat(priceLevel) + ' ' + (priceLevel === 1 ? '(Inexpensive)' : priceLevel === 2 ? '(Moderate)' : priceLevel === 3 ? '(Expensive)' : '(Very Expensive)');
  };

  const getPhotoUrls = () => {
    if (!placeDetails?.photos || placeDetails.photos.length === 0) {
      return [];
    }
    
    return placeDetails.photos.map(photo => {
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${API_KEY}`;
    });
  };

  const openWebsite = () => {
    if (placeDetails?.website) {
      Linking.openURL(placeDetails.website);
    }
  };

  const callPhoneNumber = () => {
    if (placeDetails?.formatted_phone_number) {
      Linking.openURL(`tel:${placeDetails.formatted_phone_number}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchPlaceDetails}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!placeDetails) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>No details available</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const photoUrls = getPhotoUrls();
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButtonHeader} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.googleButton} 
          onPress={openInGoogleMaps}
        >
          <Text style={styles.googleButtonText}>Open in Maps</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.placeName}>{placeDetails.name}</Text>
        
        {photoUrls.length > 0 ? (
          <Image 
            source={{ uri: photoUrls[0] }} 
            style={styles.heroImage} 
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderHeroImage}>
            <Text style={styles.placeholderText}>No Image Available</Text>
          </View>
        )}
        
        <View style={styles.infoRow}>
          {placeDetails.opening_hours && (
            <View style={styles.statusContainer}>
              <View 
                style={[
                  styles.statusDot, 
                  { backgroundColor: placeDetails.opening_hours.open_now ? '#4CD964' : '#FF3B30' }
                ]} 
              />
              <Text style={styles.statusText}>
                {placeDetails.opening_hours.open_now ? 'Open Now' : 'Closed'}
              </Text>
            </View>
          )}
          
          {placeDetails.rating && (
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>
                {placeDetails.rating} ★
              </Text>
            </View>
          )}
          
          {placeDetails.price_level !== undefined && (
            <Text style={styles.priceText}>{getPriceLevel()}</Text>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Address</Text>
          <Text style={styles.sectionText}>{placeDetails.formatted_address}</Text>
        </View>
        
        {placeDetails.formatted_phone_number && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <TouchableOpacity onPress={callPhoneNumber}>
              <Text style={styles.phoneText}>{placeDetails.formatted_phone_number}</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {placeDetails.website && (
          <TouchableOpacity style={styles.section} onPress={openWebsite}>
            <Text style={styles.sectionTitle}>Website</Text>
            <Text style={styles.websiteText}>{placeDetails.website}</Text>
          </TouchableOpacity>
        )}
        
        {placeDetails.opening_hours?.weekday_text && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Opening Hours</Text>
            {getOpeningHoursText().map((day, index) => (
              <Text key={index} style={styles.sectionText}>{day}</Text>
            ))}
          </View>
        )}
        
        {/* TODO: Map not working with expo-maps */}
        {/* {placeDetails.geometry && (
          <View style={styles.mapContainer}>
            <Text style={styles.sectionTitle}>Location</Text>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: placeDetails.geometry.location.lat,
                longitude: placeDetails.geometry.location.lng,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker
                coordinate={{
                  latitude: placeDetails.geometry.location.lat,
                  longitude: placeDetails.geometry.location.lng,
                }}
                title={placeDetails.name}
              />
            </MapView>
          </View>
        )} */}
        
        {photoUrls.length > 1 && (
          <View style={styles.gallerySection}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.galleryContainer}
            >
              {photoUrls.slice(1).map((url, index) => (
                <Image 
                  key={index} 
                  source={{ uri: url }} 
                  style={styles.galleryImage} 
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}
        
        {placeDetails.reviews && placeDetails.reviews.length > 0 && (
          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {placeDetails.reviews.map((review, index) => (
              <View key={index} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewAuthor}>{review.author_name}</Text>
                  <Text style={styles.reviewRating}>{review.rating} ★</Text>
                </View>
                <Text style={styles.reviewTime}>
                  {new Date(review.time * 1000).toLocaleDateString()}
                </Text>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButtonHeader: {
    padding: 8,
  },
  backButtonText: {
    color: '#3498db',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  googleButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  contentContainer: {
    padding: 16,
  },
  placeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  heroImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  placeholderHeroImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    color: '#999999',
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    color: '#cccccc',
  },
  ratingContainer: {
    marginRight: 16,
  },
  ratingText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 14,
    color: '#cccccc',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 4,
  },
  phoneText: {
    fontSize: 16,
    color: '#3498db',
  },
  websiteText: {
    fontSize: 16,
    color: '#3498db',
    textDecorationLine: 'underline',
  },
  mapContainer: {
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  gallerySection: {
    marginBottom: 20,
  },
  galleryContainer: {
    paddingTop: 8,
  },
  galleryImage: {
    width: 160,
    height: 120,
    borderRadius: 8,
    marginRight: 12,
  },
  reviewsSection: {
    marginBottom: 20,
  },
  reviewItem: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewAuthor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  reviewRating: {
    fontSize: 14,
    color: '#FFD700',
  },
  reviewTime: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 6,
  },
  reviewText: {
    fontSize: 14,
    color: '#cccccc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 16,
  },
});

export default DetailScreen;