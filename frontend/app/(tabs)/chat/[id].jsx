import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { useLocalSearchParams, useNavigation } from 'expo-router';

// Mock data - Replace with real API calls later
const mockConversations = {
  'user1': [
    { id: '1', text: 'Hi there!', time: '10:00 AM', isMe: false },
    { id: '2', text: 'Hello!', time: '10:02 AM', isMe: true },
  ],
  'user2': [
    { id: '1', text: 'Can you help?', time: '11:30 AM', isMe: false },
    { id: '2', text: 'Of course!', time: '11:32 AM', isMe: true },
  ],
};

const mockUserData = {
  'user1': { name: 'Volunteer', avatar: require('../../../assets/images/th (2).jpg') },
  'user2': { name: 'Donor', avatar: require('../../../assets/images/th (2).jpg') },
};

const ChatScreen = () => {
  const { userId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser] = useState({ id: 'currentUser' }); // Replace with real auth later

  // Mock fetch messages - Replace with API call
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setMessages(mockConversations[userId] || []);
    }, 300);
    
    navigation.setOptions({ 
      headerTitle: () => (
        <View style={styles.headerContent}>
          <Image 
            source={mockUserData[userId]?.avatar || require('../../../assets/images/th (2).jpg')} 
            style={styles.headerImage} 
          />
          <Text style={styles.headerTitle}>{mockUserData[userId]?.name || 'User'}</Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>
      ),
    });
  }, [userId]);

  // Mock send message - Replace with API call
  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now().toString(),
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      // These will be used for backend:
      senderId: currentUser.id,
      receiverId: userId,
    };
    
    // Optimistic UI update
    setMessages([message, ...messages]);
    setNewMessage('');
    
    // In future: await sendMessageAPI(message);
  };

  // Mock send image - Replace with API call
  const pickImage = async () => {
    // Simulate image picker
    const mockImage = {
      uri: 'https://placehold.co/600x400', // Will be real image URI later
      width: 600,
      height: 400
    };
    
    const message = {
      id: Date.now().toString(),
      image: mockImage.uri,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      senderId: currentUser.id,
      receiverId: userId,
    };
    
    setMessages([message, ...messages]);
    // In future: await uploadImageAPI(message);
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.isMe ? styles.myMessageContainer : styles.otherMessageContainer
    ]}>
      {item.image ? (
        <Image 
          source={{ uri: item.image }} 
          style={styles.messageImage}
        />
      ) : (
        <View style={[
          styles.messageBubble,
          item.isMe ? styles.myMessageBubble : styles.otherMessageBubble
        ]}>
          <Text style={item.isMe ? styles.myMessageText : styles.otherMessageText}>
            {item.text}
          </Text>
        </View>
      )}
      <Text style={styles.messageTime}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        inverted
      />
      
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.attachmentButton}>
          <Ionicons name="image" size={24} color={Colors.primary} />
        </TouchableOpacity>
        
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        
        <TouchableOpacity 
          style={styles.sendButton} 
          onPress={handleSend}
          disabled={!newMessage.trim()}
        >
          <Ionicons 
            name="send" 
            size={24} 
            color={newMessage.trim() ? Colors.primary : Colors.gray} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark,
  },
  messagesList: {
    padding: 15,
    paddingBottom: 70,
  },
  messageContainer: {
    marginBottom: 10,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 15,
  },
  imageMessageBubble: {
    maxWidth: '80%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  myMessageBubble: {
    backgroundColor: Colors.primary,
    borderTopRightRadius: 0,
  },
  otherMessageBubble: {
    backgroundColor: Colors.lightGray,
    borderTopLeftRadius: 0,
  },
  myMessageText: {
    color: Colors.White,
    fontSize: 16,
  },
  otherMessageText: {
    color: Colors.dark,
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: Colors.Grey,
    marginTop: 4,
    textAlign: 'right',
  },
  messageTime2: {
    fontSize: 12,
    color: Colors.lightGray,
    marginTop: 4,
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.White,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGray,
  },
  attachmentButton: {
    padding: 8,
    marginRight: 5,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    backgroundColor: Colors.White,
  },
  sendButton: {
    marginLeft: 10,
    padding: 10,
  },
});

export default ChatScreen;