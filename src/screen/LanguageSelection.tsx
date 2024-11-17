import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect} from 'react';
import Tts from 'react-native-tts';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const LanguageSelection: React.FC<{navigation: any}> = ({navigation}) => {
  const [loading, setLoading] = React.useState(false);

  const setLanguage = async (lang: string) => {
    setLoading(true);
    try {
      await AsyncStorage.setItem('userLanguage', lang);
      navigation.navigate('Home'); // Navigate to Home after setting language
    } catch (error) {
      console.error('Error setting language:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Speak when the component mounts
    Tts.speak('Select Language between Hindi and English', {
      androidParams: {
        KEY_PARAM_VOLUME: 1.0, // Set volume to maximum
      },
      rate: 0.5,
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Language</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setLanguage('en')}>
          <Text style={styles.buttonText}>English</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setLanguage('hi')}>
          <Text style={styles.buttonText}>Hindi</Text>
        </TouchableOpacity>
      </View>
      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  loader: {
    marginTop: 20,
  },
});

export default LanguageSelection;
