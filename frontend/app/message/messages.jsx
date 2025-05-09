import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { useRouter, useNavigation } from 'expo-router';

export const options = {
  headerShown: false,
};

const MessagesScreen = () => {
  const router = useRouter();
    const navigation = useNavigation();
    
    useEffect(() => {
      navigation.setOptions({
      headerShown: false,
      });
    }, []);

  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'Haveli Restaurant',
      text: 'Sounds awesome!',
      time: '19:20',
      isMe: false,
      avatar: require('../../assets/images/Land.jpg')
    },
    {
      id: '2',
      sender: 'Ali Kamran',
      text: 'Just coming in two miles...',
      time: '19:22',
      isMe: false,
      avatar: require('../../assets/images/friedFish.jpg')
    },
    {
      id: '3',
      sender: 'Lal Qila',
      text: 'Thanks dude.',
      time: '19:23',
      isMe: false,
      avatar: require('../../assets/images/logo.png')
    },
    {
      id: '4',
      sender: 'Gohar Ahmed',
      text: 'Thanks for delivering my postage.',
      time: '19:25',
      isMe: false,
      avatar: require('../../assets/images/on4.png')
    },
    {
      id: '5',
      sender: 'Rabri House',
      text: 'Thanks for the awesome food menu...',
      time: '19:27',
      isMe: false,
      avatar: require('../../assets/images/yum.png')
    },
  ]);
  
  const [newMessage, setNewMessage] = useState('');

  const handleSend = () => {
    if (newMessage.trim() === '') return;
    
    const message = {
      id: Date.now().toString(),
      sender: 'Me',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      avatar: require('../../assets/images/splash.png')
    };
    
    setMessages([...messages, message]);
    setNewMessage('');
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.messageItem, 
        item.isMe ? styles.myMessage : styles.otherMessage
      ]}
      activeOpacity={0.7}
    >
      {!item.isMe && (
        <Image source={item.avatar} style={styles.avatar} />
      )}
      
      <View style={[
        styles.messageContent,
        item.isMe ? styles.myMessageContent : styles.otherMessageContent
      ]}>
        {!item.isMe && (
          <Text style={styles.senderName}>{item.sender}</Text>
        )}
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.messageTime}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        inverted
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: Colors.White,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark,
    textAlign: 'center',
  },
  messagesList: {
    padding: 15,
    paddingBottom: 70,
  },
  messageItem: {
    flexDirection: 'row',
    marginBottom: 15,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    flexDirection: 'row-reverse',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  messageContent: {
    padding: 12,
    borderRadius: 15,
  },
  myMessageContent: {
    backgroundColor: Colors.primary,
    borderTopRightRadius: 0,
  },
  otherMessageContent: {
    backgroundColor: Colors.lightGray,
    borderTopLeftRadius: 0,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    color: Colors.dark,
  },
  myMessageText: {
    color: Colors.White,
  },
  messageTime: {
    fontSize: 10,
    color: Colors.gray,
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
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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

export default MessagesScreen;