import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from './../constants/Colors';
import { Link } from 'expo-router';

const ChatButton = ({ receiverrId = '2' }) => { // Default hardcoded ID
  return (
    <Link href={{
      pathname: `/chat/${receiverrId}`,
      params: {
        contactName: 'Recipient Name', // Hardcoded for demo
        avatar: require('./../assets/images/th (2).jpg'), // Hardcoded image
        initialMessages: JSON.stringify([
          {
            id: '1',
            text: 'Hello there!',
            time: '10:00 AM',
            isMe: false
          }
        ])
      }
    }} asChild>
      <TouchableOpacity style={styles.button}>
        <Ionicons name="chatbox" size={20} color={Colors.primary} />
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20
  }
});

export default ChatButton;