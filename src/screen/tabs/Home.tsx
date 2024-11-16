import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Alert,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform,
  Modal,
  Linking,
} from 'react-native';
import {Camera, useCameraDevice} from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Tts from 'react-native-tts';
import {translations} from './localization'; // Adjust the import path

const Home: React.FC = () => {
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [language, setLanguage] = useState('en'); // Default to English
  const [imageData, setImageData] = useState('');
  const [takePhotoclicked, setTakePhotoclicked] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState('');

  useEffect(() => {
    const fetchLanguage = async () => {
      const lang = await AsyncStorage.getItem('userLanguage'); // Updated key to 'userLanguage'
      if (lang) {
        setLanguage(lang);
      } else {
        Alert.alert(
          'Select Language',
          'Please select your preferred language',
          [
            {text: 'English', onPress: () => setAppLanguage('en')},
            {text: 'हिन्दी', onPress: () => setAppLanguage('hi')},
          ],
        );
      }
    };

    fetchLanguage();
  }, []);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const newCameraPermission = await Camera.requestCameraPermission();
    console.log(newCameraPermission);
  };

  if (device == null) return <ActivityIndicator />;

  const takePicture = async () => {
    if (camera.current) {
      try {
        const photo = await camera.current.takePhoto();
        const imageUri =
          Platform.OS === 'android' ? `file://${photo.path}` : photo.path;

        // Check if the file exists
        const fileExists = await checkFileExists(imageUri);
        if (!fileExists) {
          throw new Error('Image file does not exist');
        }

        setImageData(imageUri);
        setTakePhotoclicked(false);
        setShowImageModal(true); // Show the image modal

        // Create FormData to send the image to the backend
        const formData = new FormData();
        formData.append('file', {
          uri: imageUri,
          type: 'image/jpeg', // Adjust this if your image type is different
          name: 'photo.jpg',
        });

        const response = await fetch(
          'https://obscura-1.onrender.com/read-file',
          {
            method: 'POST',
            body: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        const responseText = await response.text();
        console.log('Response status:', response.status);
        console.log('Response text:', responseText);

        if (!response.ok) {
          throw new Error(`Image upload failed with status ${response.status}`);
        }

        // Parse the response text
        const result = JSON.parse(responseText);
        console.log('Upload response:', result);

        // Set the analysis text to display in the modal
        setImageAnalysis(result.generatedText);

        // Convert the image analysis text to speech
        Tts.speak(result.generatedText);
        Tts.setDefaultRate(0.7); // Adjust the rate (1.0 is the default rate)

        Alert.alert('Success', 'Image uploaded successfully');
      } catch (error) {
        console.error('Error taking picture or uploading:', error);
        Alert.alert(
          'Error',
          `Failed to take or upload picture: ${error.message}`,
        );
      }
    }
  };

  // Helper function to check if file exists
  const checkFileExists = async (path: string): Promise<boolean> => {
    try {
      const response = await fetch(path);
      return response.ok;
    } catch {
      return false;
    }
  };

  const setAppLanguage = async (lang: string) => {
    setLanguage(lang);
    await AsyncStorage.setItem('userLanguage', lang); // Updated key to 'userLanguage'
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  };

  const handleBoxPress = (position: string) => {
    Alert.alert(
      translations[language]?.pressBox.replace('{position}', position) ?? '',
    );
  };

  const openContacts = () => {
    if (Platform.OS === 'ios') {
      // For iOS, open contacts through the 'mailto' scheme (which opens the Contacts app)
      Linking.openURL('mailto:');
    } else {
      // For Android, open contacts using the content URI, which opens the default contacts app
      Linking.openURL('content://contacts/people/');
    }
  };

  const openMessagingApp = () => {
    const phoneNumber = '+916230757220'; // Optionally, specify a phone number

    if (Platform.OS === 'ios') {
      // For iOS, use the 'sms:' scheme
      Linking.openURL(`sms:${phoneNumber}`);
    } else {
      // For Android, use the same 'sms:' scheme to open the default messaging app
      Linking.openURL(`sms:${phoneNumber}`);
    }
  };

  //   const openWhatsApp = () => {
  //     const phoneNumber = '+1234567890'; // Specify a phone number (with country code)

  //     const url = `whatsapp://send?phone=${phoneNumber}`;

  //     Linking.canOpenURL(url)
  //       .then((supported) => {
  //         if (supported) {
  //           Linking.openURL(url);
  //         } else {
  //           console.log('WhatsApp is not installed on this device.');
  //           alert('WhatsApp is not installed on this device.');
  //         }
  //       })
  //       .catch((err) => {
  //         console.error('Error opening WhatsApp:', err);
  //         alert('An error occurred while trying to open WhatsApp.');
  //       });
  //   };

  return (
    <View style={{flex: 1}}>
      {takePhotoclicked ? (
        <View style={{flex: 1}}>
          <Camera
            ref={camera}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo
          />
          <TouchableOpacity
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: '#FF0037',
              position: 'absolute',
              bottom: 50,
              alignSelf: 'center',
            }}
            onPress={() => {
              takePicture();
            }}></TouchableOpacity>
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.backgroundImageContainer}>
            <Image
              source={require('../../assets/codifyformatter.png')}
              style={styles.backgroundImage}
            />
            <View style={styles.overlay} />
          </View>

          <ScrollView
            contentContainerStyle={styles.contentContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#0000ff']}
                tintColor="#0000ff"
              />
            }>
            <TouchableOpacity
              style={styles.boxTopLeft}
              onPress={() => handleBoxPress('Top Left')}>
              <Image
                source={require('../../assets/microphone-black-shape.png')}
                style={[styles.icon, {tintColor: 'white'}]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.boxTopRight}
              onPress={openMessagingApp}>
              <Image
                source={require('../../assets/chat.png')}
                style={[styles.icon, {tintColor: 'white'}]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.boxBottomLeft}
              onPress={() => handleBoxPress('Bottom Left')}>
              <Image
                source={require('../../assets/qr-code.png')}
                style={[styles.icon, {tintColor: 'white'}]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.boxBottomRight}
              onPress={openContacts}>
              <Image
                source={require('../../assets/phone.png')}
                style={[styles.icon, {tintColor: 'white'}]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureButtonContainer}
              onPress={() => {
                setTakePhotoclicked(true);
              }}>
              <View style={styles.captureButton}>
                <Text style={styles.captureText}>
                  {translations[language]?.openCamera ?? 'Open Camera'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Camera Modal */}
          </ScrollView>
        </View>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Image source={{uri: imageData}} style={styles.previewImage} />
              <Text style={styles.analysisText}>{imageAnalysis}</Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                Tts.stop(); // Stop any ongoing speech
                setShowImageModal(false);
                setImageData(''); // Clear the image data
                setImageAnalysis(''); // Clear the image analysis
              }}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backgroundImageContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  icon: {
    width: 30,
    height: 30,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#0047AB',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomRightRadius: 10,
  },
  boxTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#0047AB',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 10,
  },
  boxBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#0047AB',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 10,
  },
  boxBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0047AB',
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
  },
  //   captureButtonContainer: {
  //     marginTop: 20,
  //     padding: 10,
  //     backgroundColor: '#008080',
  //     borderRadius: 20,
  //     shadowColor: '#000',
  //     shadowOffset: {width: 0, height: 2},
  //     shadowOpacity: 0.3,
  //     shadowRadius: 4,
  //   },
  //   captureButton: {
  //     alignItems: 'center',
  //   },
  //   captureText: {
  //     color: 'white',
  //     fontSize: 18,
  //     fontWeight: 'bold',
  //   },
  captureButtonContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#008080', // Keep the base color
    borderRadius: 30, // Make it more rounded
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5, // Elevation for Android
    alignSelf: 'center', // Center the button horizontally
  },
  captureButton: {
    alignItems: 'center',
  },
  captureText: {
    color: '#fff', // Make sure the text is white for contrast
    fontSize: 20, // Increase font size for better readability
    fontWeight: '700', // Use a bolder font weight
    textShadowColor: '#000', // Add a slight shadow for text readability
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%', // Limit the maximum height to prevent it from being too tall
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    marginBottom: 10, // Space between image and text
  },
  analysisText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20, // Space between text and close button
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#FF0037',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Home;
