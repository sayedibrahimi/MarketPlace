// client/screens/AccountScreen.tsx
// Purpose: This file defines the AccountScreen component.
// Description: It provides a UI for user account management, including profile information and settings.
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tabStyles } from '../styles/tabStyles';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'expo-router';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../hooks/useTheme';

interface MenuItem {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
}

export default function AccountScreen(): React.ReactElement {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const { isDarkTheme } = useTheme();
  
  const menuItems: MenuItem[] = [
    { 
      id: 'listings', 
      title: 'My Listings', 
      icon: 'list',
      onPress: () => router.push({
        pathname: '/myListings',
      })
    },
    { 
      id: 'purchases', 
      title: 'Purchase History', 
      icon: 'cart',
      onPress: () => Alert.alert('Purchases', 'Navigate to purchases') 
    },
    { 
      id: 'settings', 
      title: 'Settings', 
      icon: 'settings',
      onPress: () => Alert.alert('Settings', 'Navigate to settings') 
    },
    { 
      id: 'help', 
      title: 'Help & Support', 
      icon: 'help-circle',
      onPress: () => Alert.alert('Help', 'Navigate to help') 
    }
  ];
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              // First logout - since logout() returns void, we don't need to check its result
              await logout();
              
              // Then navigate with a slight delay to ensure state is updated
              setTimeout(() => {
                router.replace('/auth/login');
              }, 100);
            } catch (error) {
              console.error('Error during logout:', error);
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={[
        styles.loadingContainer,
        isDarkTheme && styles.darkBackground
      ]}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[
        tabStyles.container,
        isDarkTheme && styles.darkBackground
      ]}>
        <View style={[
          tabStyles.header,
          isDarkTheme && styles.darkHeader
        ]}>
          <Text style={[
            tabStyles.headerTitle,
            isDarkTheme && styles.darkText
          ]}>My Account</Text>
        </View>
        <View style={styles.notLoggedInContainer}>
          <Ionicons name="lock-closed-outline" size={50} color={isDarkTheme ? "#fff" : "#999"} />
          <Text style={[
            styles.notLoggedInText,
            isDarkTheme && styles.darkText
          ]}>Please log in to view your account</Text>
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
    <View style={[
      tabStyles.container,
      isDarkTheme && styles.darkBackground
    ]}>
      <View style={[
        tabStyles.header,
        isDarkTheme && styles.darkHeader
      ]}>
        <Text style={[
          tabStyles.headerTitle,
          isDarkTheme && styles.darkText
        ]}>My Account</Text>
      </View>
      
      <ScrollView style={tabStyles.content}>
        <View style={[
          styles.profileSection,
          isDarkTheme && styles.darkProfileSection
        ]}>
          <View style={styles.profileImagePlaceholder}>
            <Ionicons name="person" size={50} color={isDarkTheme ? "#fff" : "#666"} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={[
              styles.userName,
              isDarkTheme && styles.darkText
            ]}>{user.firstName} {user.lastName}</Text>
            <Text style={[
              styles.userEmail,
              isDarkTheme && styles.darkSubText
            ]}>{user.email}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={[
          styles.menuSection,
          isDarkTheme && styles.darkMenuSection
        ]}>
          {menuItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.menuItem,
                isDarkTheme && styles.darkMenuItem
              ]}
              onPress={item.onPress}
            >
              <Ionicons name={item.icon as any} size={24} color="#007BFF" />
              <Text style={[
                styles.menuItemText,
                isDarkTheme && styles.darkText
              ]}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={24} color={isDarkTheme ? "#777" : "#ccc"} />
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Theme Toggle Section */}
        <View style={[
          styles.menuSection,
          isDarkTheme && styles.darkMenuSection
        ]}>
          <ThemeToggle />
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
        
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    marginLeft: 20,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  editButton: {
    marginTop: 8,
  },
  editButtonText: {
    color: '#007BFF',
    fontSize: 14,
  },
  menuSection: {
    marginBottom: 30,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 16,
  },
  logoutButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Dark mode styles
  darkBackground: {
    backgroundColor: '#151718',
  },
  darkHeader: {
    backgroundColor: '#1e2022',
    borderBottomColor: '#333',
  },
  darkText: {
    color: '#ECEDEE',
  },
  darkSubText: {
    color: '#9BA1A6',
  },
  darkProfileSection: {
    backgroundColor: 'transparent',
  },
  darkMenuSection: {
    backgroundColor: '#1e2022',
    shadowColor: '#000',
    borderColor: '#333',
  },
  darkMenuItem: {
    borderBottomColor: '#333',
  }
});