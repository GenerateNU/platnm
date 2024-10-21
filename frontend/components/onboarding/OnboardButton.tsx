import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, GestureResponderEvent } from 'react-native';

// Define props for the CustomButton
interface CustomButtonProps {
  text: string;
  onPress: (event: GestureResponderEvent) => void;
  style?: object;
  backgroundColor?: string;
  svgIcon?: JSX.Element;
}

// CustomButton component definition in TypeScript
const OnboardButton: React.FC<CustomButtonProps> = ({ text, onPress, style, backgroundColor, svgIcon }) => {
  const buttonStyle = [
    styles.button,
    { backgroundColor: backgroundColor || '#000000' },
    style,
  ];

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      {svgIcon ? <View style={styles.icon}>{svgIcon}</View> : null}  
      <Text style={styles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

// Define the styles used in the button
const styles = StyleSheet.create({
    button: {
      paddingVertical: 15,
      paddingHorizontal: 22,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',  // Center content horizontally
      flexDirection: 'row',  
      width: '100%',
      textAlign: 'center',
    },
    buttonText: {
      fontSize: 16,          // Set text size to 16px
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    icon: {
      marginRight: 10,       // Space between icon and text
    },
  });
  
export default OnboardButton;
