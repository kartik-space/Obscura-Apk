import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDriverProfile } from '../../hooks/useDriverProfile'; // Adjust import path

const Profile = () => {
  const navigation = useNavigation();
  const [userId, setUserId] = useState<string | null>(null); // Add state for userId
  const { data: userData, isLoading, isError } = useDriverProfile(userId || ''); // Fetch user profile

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const id = await AsyncStorage.getItem('driverId'); // Fetch driverId from AsyncStorage
        if (id) setUserId(id); // Set userId if found
      } catch (error) {
        Alert.alert('Error', 'Failed to load user ID');
      }
    };

    fetchUserId();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // Remove token on logout
      await AsyncStorage.removeItem('driverId'); // Remove driverId on logout
      navigation.navigate('login'); 
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error loading profile</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.profileInfo}>
        <Text style={styles.title}>Profile Information</Text>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{userData?.name}</Text>
        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{userData?.phone}</Text>
        <Text style={styles.label}>Car Number:</Text>
        <Text style={styles.value}>{userData?.carNumber}</Text>
        <Text style={styles.label}>Driving License:</Text>
        <Text style={styles.value}>{userData?.drivingLicense}</Text>
        <Text style={styles.label}>Aadhaar Card:</Text>
        <Text style={styles.value}>{userData?.aadhaarCard}</Text>
        <Text style={styles.label}>Employment Type:</Text>
        <Text style={styles.value}>{userData?.employmentType}</Text>
        <Text style={styles.label}>Car Type:</Text>
        <Text style={styles.value}>{userData?.carType}</Text>
        <Text style={styles.label}>Car Model:</Text>
        <Text style={styles.value}>{userData?.carModel}</Text>
        <Text style={styles.label}>Car Year:</Text>
        <Text style={styles.value}>{userData?.carYear}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  profileInfo: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Poppins-ExtraBold',
    color:'black',
    textAlign:'center',
  },
  label: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 10,
  },
  value: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#e63946',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    fontFamily: 'Poppins-Bold',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Profile;
