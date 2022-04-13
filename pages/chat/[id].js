import React from 'react';
import styled from "styled-components";
import Navbar from "../../components/Navbar";
import ChatScreen from "../../components/ChatScreen";
import Head from "next/head";
import {collection, getDoc, getDocs, doc, query, orderBy} from "firebase/firestore";
import {auth, db} from "../../firebase";
import {getRecipientEmail} from "../../utils/getRecipientEmail";
import {useAuthState} from "react-firebase-hooks/auth";


const ChatPage = ({messages, chat}) => {
    const [user] = useAuthState(auth);
    const recipient = getRecipientEmail(JSON.parse(chat).users, user)

    return (<Container>
        <Head>
            <title>
                Chat with - {recipient}
            </title>
        </Head>
        <Navbar/>
        <ChatContainer>
            <ChatScreen messages={JSON.parse(messages)} chat={JSON.parse(chat)}/>
        </ChatContainer>
    </Container>);
};

export default ChatPage;

export async function getServerSideProps(context) {
    const id = context.query.id;
    const chatSnapshot = await getDoc(doc(db, "chats", id))
    const messagesRef = await collection(db, "chats", id, "messages")
    const orderedMessagesRef = await query(messagesRef, orderBy("timestamp", "asc"));
    const messagesSnapshot = await getDocs(orderedMessagesRef);

    // Prepare Messages
    let messages = messagesSnapshot?.docs.map((doc) => {
        return {
            id: doc.id, ...doc.data()
        }
    })
    messages = messages.map((message) => {
        return {
            ...message, timestamp: message?.timestamp.toDate().getTime()
        }
    })

    // Prepare Chat
    const chat = {
        id: chatSnapshot?.id, ...chatSnapshot?.data()
    }

    return {
        props: {
            messages: JSON.stringify(messages), chat: JSON.stringify(chat)
        },
    }
}


const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;
  height: 100vh;

  //Hide Scrollbar
  ::-webkit-scrollbar {
    display: none;
  }

  //IE and Edge
  -ms-overflow-style: none;
  //Firefox
  scrollbar-width: none;
`;