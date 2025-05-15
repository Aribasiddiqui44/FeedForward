import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './../constants/Colors';
import * as Linking from 'react-native'; // Import Linking module

const CallButton = ({ number = '1234567890' }) => {
  const handleCallPress = () => {
    const phoneUrl = `tel:${number}`;
    Linking.openURL(phoneUrl).catch((err) => {
      console.warn('Failed to open dialer:', err);
    });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleCallPress}>
      <Ionicons name="call" size={20} color={Colors.primary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20
  }
});

export default CallButton;
