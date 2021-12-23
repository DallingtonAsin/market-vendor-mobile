import React, {useState, useEffect} from 'react';
import { Text,Image, Button, View} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import messageData from './data/Chat';
import earlierMessages from './data/EarlierChat';
import styles from '../../assets/css/styles';

const Messages = (props) => {

const initialState = {
      messages: [],
  }
const [state, setMessages] = useState(initialState);

useEffect(() =>{
//   setMessages({
//     ...state,
//     messages: [{ 
//       _id:1,
//      text:'Hello developer',
//      createdAt: new Date(),
//      user: {
//        _id: 2,
//        name: 'React Native',
//        avatar: 'https://facebook.github.io/react/img/logo_og.png',
//      },
//    }],
//  });
});


  const onSend = (messages = []) => {
    setMessages(previousState => ({
        messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

   return(
    <GiftedChat messages={state.messages}
    onSend={messages => onSend(messages)}
    isTyping={true}
    user={{ _id:1, }}/>
   );

}

export default Messages