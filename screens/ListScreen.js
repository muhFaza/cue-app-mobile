import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import axios from 'axios';

// Replace with your Google Places API key
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const ListScreen = ({ route, navigation }) => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { location } = route.params;

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&rankby=distance&type=bar&keyword=billiards+pool+hall&key=${API_KEY}`;
      
      const response = await axios.get(url);
      
      if (response.data.status === 'OK') {
        setPlaces(response.data.results);
      } else {
        setError('Failed to fetch places. Please try again.');
      }

      console.log(response.data);
      console.log('API KEY:', API_KEY);
    } catch (err) {
      setError('An error occurred. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const PlaceCard = ({ place }) => {
    const isOpen = place.opening_hours ? place.opening_hours.open_now : null;
    
    const photoReference = place.photos && place.photos.length > 0 
      ? place.photos[0].photo_reference 
      : null;
    
    const photoUrl = photoReference 
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${API_KEY}`
      : null;
    
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('Detail', { placeId: place.place_id })}
      >
        <View style={styles.cardContent}>
          {photoUrl ? (
            <Image 
              source={{ uri: photoUrl }} 
              style={styles.placeImage} 
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.placeholderText}>No Image</Text>
            </View>
          )}
          
          <View style={styles.placeInfo}>
            <Text style={styles.placeName} numberOfLines={1}>{place.name}</Text>
            <Text style={styles.placeAddress} numberOfLines={2}>{place.vicinity}</Text>
            
            <View style={styles.infoRow}>
              <Text style={styles.ratingText}>
                {place.rating ? `${place.rating} ★` : 'No ratings'}
              </Text>
              
              {isOpen !== null && (
                <View style={styles.statusContainer}>
                  <View style={[styles.statusDot, { backgroundColor: isOpen ? '#4CD964' : '#FF3B30' }]} />
                  <Text style={styles.statusText}>{isOpen ? 'Open Now' : 'Closed'}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#121212"/>
      <SafeAreaView style={styles.safeArea}>
        
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Nearby Billiard Halls</Text>
        </View>
        
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loaderText}>Finding billiard halls near you...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchPlaces}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={places}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => <PlaceCard place={item} />}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No billiard halls found nearby.</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search or location.</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0
  },
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 16,
    backgroundColor: '#1E1E1E',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    height: 120,
  },
  placeImage: {
    width: 120,
    height: '100%',
  },
  placeholderImage: {
    width: 120,
    height: '100%',
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999999',
    fontSize: 14,
  },
  placeInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  placeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  placeAddress: {
    fontSize: 14,
    color: '#cccccc',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
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
    alignSelf: 'flex-start',
  },
  ratingText: {
    fontSize: 14,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loaderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
  },
});

export default ListScreen;