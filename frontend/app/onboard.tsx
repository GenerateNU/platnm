import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CustomButton from '@/components/onboarding/OnboardButton';
import Header from '@/components/onboarding/Header';
import { useSharedValue, withTiming } from 'react-native-reanimated';
import ProgressBar from '@/components/onboarding/ProgressBar'; 
import { Ionicons } from '@expo/vector-icons'; 
import { router } from 'expo-router';

const slides = [
  { id: 1, title: "Let's get started", question: 'What is your name?', placeholder: 'Enter Name' },
  { id: 2, title: 'Account Information', question: 'What is your email?', placeholder: 'Enter Email' },
  { id: 3, title: 'Create a Password', question: 'Pick a password', placeholder: 'Enter Password' },
  { id: 4, title: 'Link Music Account', question: 'Link to your music account' },
];

const OnboardingCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);

  const [passwordVisible, setPasswordVisible] = useState(false); 
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); 

  const progressBar1 = useSharedValue(0);  // progress bar progress
  const progressBar2 = useSharedValue(0);

  // Check if passwords match
  useEffect(() => {
    if (currentSlide === 2) {
      setPasswordMatch(password === confirmPassword);
    }
  }, [password, confirmPassword, currentSlide]);

  // Function to handle slide changes and reset inputs
  const handleSlideChange = (newSlideIndex: number) => {
    setPasswordVisible(false);
    setConfirmPasswordVisible(false);
    setCurrentSlide(newSlideIndex);

    // Update progress bar
    if (newSlideIndex === 0) {
      progressBar1.value = withTiming(0, { duration: 500 });
      progressBar2.value = withTiming(0, { duration: 500 });
    } else if (newSlideIndex === 1) {
      progressBar1.value = withTiming(1, { duration: 500 });
      progressBar2.value = withTiming(0, { duration: 500 });
    } else {
      progressBar1.value = withTiming(1, { duration: 500 });
      progressBar2.value = withTiming((newSlideIndex - 1) / 3, { duration: 500 });
    }
  };

  // Move to the next slide (forwards)
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      handleSlideChange(currentSlide + 1);
    } else {
      alert(`Onboarding Completed! Name: ${name}, Email: ${email}, Password: ${password}`);
      router.push("/");
    }
  };

  return (
    <View style={styles.container}>
      <Header title={slides[currentSlide].title} subtitle={slides[currentSlide].question} />
      {currentSlide === 2 ? (
        <View>
          <View>
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setPasswordVisible(!passwordVisible)}
            >
              <Ionicons name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
            </TouchableOpacity>
          </View>

          <View>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!confirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
            >
              <Ionicons name={confirmPasswordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
            </TouchableOpacity>
            {!passwordMatch && <Text style={styles.errorText}>Passwords do not match.</Text>}

          </View>
        </View>
      ) : (
        currentSlide === 3 ? (
          <View style={styles.buttonGroup}>
            <CustomButton 
              text={'Log in with Spotify'} 
              onPress={() => {
                alert('Open with Spotify');
                handleNext();
              }} 
              backgroundColor='#1DB954' 
            />
            <CustomButton 
              text={'Log in with Apple'} 
              onPress={() => {
                alert('Open with Apple Music');
                handleNext();
              }} 
            />            
          </View>
        ) : (
          <TextInput
            style={styles.input}
            keyboardType={currentSlide === 1 ? 'email-address' : 'default'}
            placeholder={slides[currentSlide].placeholder}
            autoComplete={currentSlide === 1 ? 'email' : 'name'}
            value={currentSlide === 1 ? name : email}
            onChangeText={currentSlide === 1 ? setName : setEmail}
          />
        )
      )}

      <View style={styles.stickyContainer}>
        {currentSlide === 3 ? null : <CustomButton text="Continue" onPress={handleNext} />}
        <ProgressBar
          progress1={progressBar1}
          progress2={progressBar2}
          currentSlide={currentSlide}
          handleSlideChange={handleSlideChange} // Pass down the handleSlideChange function
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 150,
    marginHorizontal: 22,
    gap: 65,
  },
  input: {
    height: 50,
    borderWidth: 1,
    width: '100%',
    borderColor: '#33333314',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
  },

  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  stickyContainer: {
    position: 'absolute',
    bottom: 80,
    width: '100%',
    alignItems: 'center',
  },
  buttonGroup: {
    width: '100%',
    gap: 22,
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 14,
  },
});

export default OnboardingCarousel;
