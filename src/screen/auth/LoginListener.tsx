import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const LoginListener = ({navigation}: any) => {
  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          navigation.replace('HomeTabs');
        } else {
          navigation.replace('login');
        }
      } catch (error) {
        console.error('Error checking token:', error);
        navigation.replace('login');
      }
    };

    checkToken();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="white" />
      <Text
        style={{color: 'white', fontFamily: 'Poppins-Medium', marginTop: 10}}>
        Loading
      </Text>
    </View>
  );
};

export default LoginListener;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C0C0C',
  },
});
