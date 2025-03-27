// // screens/FavoritesScreen.tsx
// import React from 'react';
// import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { tabStyles } from '../styles/tabStyles';

// interface FavoritesScreenProps {
//   // Define props if needed
// }

// // You can define an interface for your favorite items
// interface FavoriteItem {
//   id: string;
//   title: string;
//   price: number;
//   image?: string;
// }

// export default function FavoritesScreen({}: FavoritesScreenProps): React.ReactElement {
//   // Sample data - replace with actual data from your state management
//   const favorites: FavoriteItem[] = [];
  
//   return (
//     <View style={tabStyles.container}>
//       <View style={tabStyles.header}>
//         <Text style={tabStyles.headerTitle}>Your Favorites</Text>
//       </View>
      
//       <ScrollView style={tabStyles.content}>
//         {favorites.length > 0 ? (
//           <FlatList
//             data={favorites}
//             keyExtractor={(item) => item.id}
//             renderItem={({ item }) => (
//               <View style={styles.favoriteItem}>
//                 <View style={styles.imageContainer}>
//                   {item.image ? (
//                     <Text>Image would go here</Text>
//                   ) : (
//                     <Ionicons name="image-outline" size={40} color="#ccc" />
//                   )}
//                 </View>
//                 <View style={styles.itemDetails}>
//                   <Text style={styles.itemTitle}>{item.title}</Text>
//                   <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
//                 </View>
//                 <Ionicons name="heart" size={24} color="#007BFF" />
//               </View>
//             )}
//           />
//         ) : (
//           <View style={tabStyles.placeholderContent}>
//             <Ionicons name="heart-outline" size={50} color="#999" />
//             <Text style={tabStyles.placeholderText}>No favorites yet</Text>
//             <Text style={styles.emptyStateText}>
//               Items you save will appear here
//             </Text>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   favoriteItem: {
//     flexDirection: 'row',
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     alignItems: 'center',
//   },
//   imageContainer: {
//     width: 60,
//     height: 60,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 5,
//   },
//   itemDetails: {
//     flex: 1,
//     marginLeft: 15,
//   },
//   itemTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   itemPrice: {
//     fontSize: 14,
//     color: '#007BFF',
//     marginTop: 4,
//   },
//   emptyStateText: {
//     fontSize: 14,
//     color: '#999',
//     marginTop: 10,
//     textAlign: 'center',
//   }
// });


// client/screens/FavoritesScreen.tsx
// Purpose: Display a list of favorite items
// Description: This screen displays a list of favorite items. If the user is not logged in, a message is displayed prompting the user to log in. If the user is logged in, the list of favorite items is displayed. If there are no favorite items, a message is displayed indicating that there are no favorite items. Each item in the list displays the item's image, title, and price. The user can tap on an item to view more details or remove the item from their favorites.
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { tabStyles } from '../styles/tabStyles';
import { favoritesService } from '../services/favoritesService';
import { Listing } from '../services/listingsService';
import { useAuth } from '../hooks/useAuth';

interface FavoritesScreenProps {
  // Define props if needed
}

export default function FavoritesScreen({}: FavoritesScreenProps): React.ReactElement {
  const [favorites, setFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await favoritesService.getAllFavorites();
      setFavorites(data);
      setError(null);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || 'Failed to fetch favorites';
      setError(errorMessage);
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (id: string) => {
    try {
      await favoritesService.removeFavorite(id);
      setFavorites(favorites.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const renderFavoriteItem = ({ item }: { item: Listing }) => {
    const itemImageError = imageError[item._id] || false;
    
    return (
      <TouchableOpacity 
        style={styles.favoriteItem}
        onPress={() => router.push({
          pathname: '/productDetails',
          params: { productId: item._id }
        })}
      >
        <View style={styles.imageContainer}>
          {item.pictures && item.pictures.length > 0 ? (
            <Image 
              source={
                itemImageError 
                  ? require('../assets/images/placeholder.png') 
                  : { uri: item.pictures[0] }
              } 
              style={styles.itemImage}
              onError={() => {
                setImageError(prev => ({
                  ...prev,
                  [item._id]: true
                }));
              }}
            />
          ) : (
            <Ionicons name="image-outline" size={40} color="#ccc" />
          )}
        </View>
        <View style={styles.itemDetails}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <Text style={styles.itemPrice}>{formatPrice(item.price)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveFavorite(item._id)}
        >
          <Ionicons name="heart" size={24} color="#ff6b6b" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (!user) {
    return (
      <View style={tabStyles.container}>
        <View style={tabStyles.header}>
          <Text style={tabStyles.headerTitle}>Your Favorites</Text>
        </View>
        <View style={styles.notLoggedInContainer}>
          <Ionicons name="lock-closed-outline" size={50} color="#999" />
          <Text style={styles.notLoggedInText}>Please log in to view your favorites</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
          >
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={tabStyles.container}>
      <View style={tabStyles.header}>
        <Text style={tabStyles.headerTitle}>Your Favorites</Text>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading favorites...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ff6b6b" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchFavorites}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item._id}
          renderItem={renderFavoriteItem}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={fetchFavorites}
        />
      ) : (
        <View style={tabStyles.placeholderContent}>
          <Ionicons name="heart-outline" size={50} color="#999" />
          <Text style={tabStyles.placeholderText}>No favorites yet</Text>
          <Text style={styles.emptyStateText}>
            Save items you like by tapping the heart icon
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)/search')}
          >
            <Text style={styles.browseButtonText}>Browse Items</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 16,
  },
  favoriteItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  imageContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 15,
    color: '#007BFF',
    fontWeight: '700',
  },
  removeButton: {
    padding: 10,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notLoggedInText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});