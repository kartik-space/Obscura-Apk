import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Snackbar } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import useRegisterDriver from '../../hooks/useRegisterDriver';
import { DriverData } from '../../types/driverTypes';

const { width, height } = Dimensions.get('window');

const Signup = ({ navigation }: any) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<DriverData>({
    name: '',
    phone: '',
    carNumber: '',
    carModel: '',
    carYear: 2020,
    carType: '',
    drivingLicense: '',
    aadhaarCard: '',
    employmentType: '',
    password: '',
    status: true,
    driverType: 'cab',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const { registerDriver, isLoading, isError, error, data } = useRegisterDriver();

  const handleChange = (name: keyof DriverData, value: string) => {
    if (name === 'carYear') {
      const numericValue = parseInt(value.replace(/\D/g, ''), 10);
      setFormData(prevData => ({ ...prevData, [name]: isNaN(numericValue) ? 0 : numericValue }));
    } else {
      setFormData(prevData => ({ ...prevData, [name]: value }));
    }
  };

  const handleNext = async () => {
    if (step === 3) {
      try {
        await registerDriver(formData);
        navigation.navigate('login');
      } catch (error) {
        console.error('Failed to register driver:', error);
        setSnackbarMessage('Failed to register driver. Please try again.');
        setSnackbarVisible(true);
      }
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handlePasswordVisibility = () => {
    setPasswordVisible(prev => !prev);
  };

  const progressBarWidth = (step / 3) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollView}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={120}
      >
        <View style={styles.imageContainer}>
          <Image
            resizeMode="contain"
            style={styles.image}
            source={require('../../assets/images/login.png')}
          />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Let's Get Started!</Text>
          <Text style={styles.subtitle}>Fill the form to continue</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progressBarWidth}%` }]} />
          </View>
        </View>

        <View style={styles.form}>
          {step === 1 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  placeholder="Enter Name"
                  placeholderTextColor="#868585"
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleChange('name', text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  placeholder="Enter phone number"
                  placeholderTextColor="#868585"
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => handleChange('phone', text)}
                  keyboardType="phone-pad"
                />
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Car Number</Text>
                <TextInput
                  placeholder="Enter Car Number"
                  placeholderTextColor="#868585"
                  style={styles.input}
                  value={formData.carNumber}
                  onChangeText={(text) => handleChange('carNumber', text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Car Model</Text>
                <TextInput
                  placeholder="Enter Car Model"
                  placeholderTextColor="#868585"
                  style={styles.input}
                  value={formData.carModel}
                  onChangeText={(text) => handleChange('carModel', text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Car Year</Text>
                <TextInput
                  placeholder="Enter Car Year"
                  placeholderTextColor="#868585"
                  style={styles.input}
                  value={formData.carYear.toString()}
                  onChangeText={(text) => handleChange('carYear', text)}
                  keyboardType="numeric"
                />
              </View>
              <RNPickerSelect
                placeholder={{ label: 'Select Car Type', value: '' }}
                value={formData.carType}
                onValueChange={(value) => handleChange('carType', value)}
                items={[
                  { label: 'SUV', value: 'SUV' },
                  { label: 'Sedan', value: 'Sedan' },
                  { label: 'Traveller', value: 'Traveller' }
                ]}
                style={pickerSelectStyles}
              />
            </>
          )}

          {step === 3 && (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Driving License Number</Text>
                <TextInput
                  placeholder="Enter Driving License Number"
                  placeholderTextColor="#868585"
                  style={styles.input}
                  value={formData.drivingLicense}
                  onChangeText={(text) => handleChange('drivingLicense', text)}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Aadhaar Card Number</Text>
                <TextInput
                  placeholder="Enter Aadhaar Card Number"
                  placeholderTextColor="#868585"
                  style={styles.input}
                  value={formData.aadhaarCard}
                  onChangeText={(text) => handleChange('aadhaarCard', text)}
                />
              </View>
              <RNPickerSelect
                placeholder={{ label: 'Select Employment Type', value: '' }}
                value={formData.employmentType}
                onValueChange={(value) => handleChange('employmentType', value)}
                items={[
                  { label: 'Salaried', value: 'Salaried' },
                  { label: 'Freelancer', value: 'Freelancer' }
                ]}
                style={pickerSelectStyles}
              />
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    placeholder="Enter Password"
                    placeholderTextColor="#868585"
                    style={[styles.input, styles.passwordInput]}
                    secureTextEntry={!passwordVisible}
                    value={formData.password}
                    onChangeText={(text) => handleChange('password', text)}
                  />
                  <TouchableOpacity
                    onPress={handlePasswordVisibility}
                    style={styles.eyeIcon}
                  >
                    <Image
                      resizeMode="contain"
                      style={styles.eyeIconImage}
                      source={
                        passwordVisible
                          ? require('../../assets/images/hide.png')
                          : require('../../assets/images/visible.png')
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          {step > 1 && (
            <TouchableOpacity style={[styles.button, styles.previousButton]} onPress={handlePrevious}>
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>{step === 3 ? 'Submit' : 'Next'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.footerContent}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('login')}>
            <Text style={styles.footerLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        action={{
          label: 'Close',
          onPress: () => {
            // Do nothing on press
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 30,
    marginBottom: 15,
    color: 'black',
    fontSize: 16,
  },
  placeholder: {
    color: '#868585',
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  container: {flex: 1},
  scrollView: {flexGrow: 1},
  imageContainer: {
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.8,
    height: undefined,
    aspectRatio: 1,
  },
  header: {
    margin: 20,
    alignItems: 'center',
  },
  title: {fontFamily: 'Poppins-Regular', fontSize: 25, color: 'black'},
  subtitle: {fontFamily: 'Poppins-Regular', fontSize: 12, color: 'black'},
  progressBarContainer: {
    height: 10,
    backgroundColor: '#B8B8B8',
    borderRadius: 5,
    marginVertical: 15,
    marginHorizontal: 30,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'black',
    borderRadius: 5,
  },
  form: {flex: 1, marginBottom: 20},
  inputContainer: {marginHorizontal: 30, marginTop: 10},
  label: {fontFamily: 'Poppins-Medium', color: 'black', fontSize: 14},
  input: {
    borderWidth: 1,
    borderColor: '#B8B8B8',
    borderRadius: 10,
    fontFamily: 'Poppins-Medium',
    padding: 10,
    paddingHorizontal: 15,
    color: 'black',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#B8B8B8',
    borderRadius: 10,
    paddingRight: 10,
  },
  passwordInput: {flex: 1, borderWidth: 0},
  eyeIcon: {marginLeft: 10},
  eyeIconImage: {width: 20, height: 20},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  previousButton: {backgroundColor: '#aaa'},
  buttonText: {color: '#fff', fontFamily: 'Poppins-Medium'},
  footer: {
    paddingBottom: 30,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },
  footerText: {fontFamily: 'Poppins-Medium', color: 'black'},
  footerLink: {fontFamily: 'Poppins-Bold', color: 'black'},
});

export default Signup;
