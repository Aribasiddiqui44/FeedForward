import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { Link, useRouter } from 'expo-router';

const MessagesScreen = () => {
  const router = useRouter();
  const [conversations, setConversations] = useState([
    {
      id: '1',
      name: 'Haveli Restaurant',
      lastMessage: 'Sounds awesome!',
      time: '19:20',
      unread: 2,
      avatar: require('../../../assets/images/th (1).jpg')
    },
    {
      id: '2',
      name: 'Ali Kamran',
      lastMessage: 'Just coming in two miles...',
      time: '19:22',
      unread: 0,
      avatar: require('../../../assets/images/th (2).jpg')
    },
    {
      id: '3',
      name: 'Lal Qila',
      lastMessage: 'Thanks dude.',
      time: '19:23',
      unread: 1,
      avatar: require('../../../assets/images/th (1).jpg')
    },
    {
      id: '4',
      name: 'Gohar Ahmed',
      lastMessage: 'Thanks for delivering my postage.',
      time: '19:25',
      unread: 0,
      avatar: require('../../../assets/images/th (2).jpg')
    },
    {
      id: '5',
      name: 'Rabri House',
      lastMessage: 'Thanks for the awesome food menu...',
      time: '19:27',
      unread: 0,
      avatar: require('../../../assets/images/th (2).jpg')
    },
  ]);

  // Mock function to simulate receiving new messages
  useEffect(() => {
    const interval = setInterval(() => {
      setConversations(prev => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        updated[randomIndex] = {
          ...updated[randomIndex],
          lastMessage: 'New message!',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          unread: (updated[randomIndex].unread || 0) + 1
        };
        return updated;
      });
    }, 15000); // New message every 15 seconds for demo

    return () => clearInterval(interval);
  }, []);

  const handleConversationPress = (conversationId) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unread: 0 } : conv
    ));
    
    const conversation = conversations.find(c => c.id === conversationId);
    router.push({
      pathname: `/chat/${conversationId}`,
      params: { 
        contactName: conversation.name,
        avatar: conversation.avatar,
        initialMessages: JSON.stringify(conversation.messages)
      }
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.conversationItem}
            onPress={() => handleConversationPress(item.id)}
          >
            <Image source={item.avatar} style={styles.avatar} />
            
            <View style={styles.leftColumn}>
              <Text style={styles.name}>{item.name}</Text>
              <Text 
                style={[
                  styles.lastMessage,
                  item.unread > 0 && styles.unreadMessage
                ]} 
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
            </View>
            
            <View style={styles.rightColumn}>
              <Text style={styles.time}>{item.time}</Text>
              {item.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unread}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  header: {
    padding: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    textAlign: 'center',
  },
  listContainer: {
    paddingVertical: 10,
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: Colors.White,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  leftColumn: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  rightColumn: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10,
    minWidth: 70,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark,
    marginBottom: 5,
  },
  time: {
    fontSize: 12,
    color: Colors.Grey,
    marginBottom: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: Colors.Grey,
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: Colors.dark,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: Colors.White,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default MessagesScreen;