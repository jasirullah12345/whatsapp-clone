import React, {useEffect, useRef, useState} from 'react';
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../firebase";
import {useRouter} from "next/router";
import styled from "styled-components";
import {Avatar, IconButton} from "@mui/material";
import {AttachFile, InsertEmoticon, Mic, MoreVert} from "@mui/icons-material";
import {getRecipientEmail} from "../utils/getRecipientEmail";
import {collection, doc, serverTimestamp, setDoc, addDoc, orderBy, query, where} from "firebase/firestore";
import Message from "./Message";
import {useCollection} from "react-firebase-hooks/firestore";
import TimeAgo from "timeago-react";


const ChatScreen = ({messages, chat}) => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const lastMessageRef = useRef(null);
    const recipient = getRecipientEmail(chat.users, user)
    const [input, setInput] = useState([]);

    const messagesRef = query(collection(db, "chats", router.query.id, "messages"), orderBy("timestamp", "asc"));
    const [messagesSnapshot] = useCollection((messagesRef))

    const userRef = query(collection(db, "users"), where("email", "==", recipient))
    const [userSnapshot] = useCollection((userRef))

    const displayMessages = () => {
        if (messagesSnapshot) {
            return messagesSnapshot?.docs?.map((doc) => {
                return {
                    id: doc.id, ...doc.data(),
                    user: doc.data()?.user,
                    timestamp: doc.data()?.timestamp?.toDate().getTime(),
                }
            })
        } else {
            return messages
        }
    }

    const sendMessage = async (e) => {
        e.preventDefault();

        if (input === "") return

        const content = input
        setInput("")

        // Update last seen of user
        await setDoc(doc(db, "users", user.uid), {
            lastSeen: serverTimestamp()
        }, {merge: true});

        // Add Message
        await addDoc(collection(db, "chats", router.query.id, "messages"), {
            content, user: user.email, photoURL: user.photoURL, timestamp: serverTimestamp()
        });

        scrollToBottom();
    }

    // Auto Scroll to bottom on start
    useEffect(() => {
        setTimeout(()=>{
            scrollToBottom()
        }, 100);
    }, []);


    const scrollToBottom = () => {
        lastMessageRef.current.scrollIntoView({
            behavior: "smooth", block: "start"
        });
    }

    return (<Container>
        <Header>
            {userSnapshot?.docs?.[0]?.data()?.photoURL ? (<Avatar src={userSnapshot?.docs?.[0]?.data()?.photoURL}/>) : (
                <Avatar>{recipient[0].toUpperCase()}</Avatar>)}

            <HeaderInformation>
                <h3>{recipient}</h3>
                <p>Last active : {''}
                    {userSnapshot?.docs?.[0]?.data()?.lastSeen.toDate() ? (
                        <TimeAgo datetime={userSnapshot?.docs?.[0]?.data()?.lastSeen.toDate()}/>) : ("Unavailable")}
                </p>
            </HeaderInformation>


            <HeaderIcons>
                <IconButton>
                    <AttachFile/>
                </IconButton>
                <IconButton>
                    <MoreVert/>
                </IconButton>
            </HeaderIcons>
        </Header>


        <MessageContainer>
            {displayMessages().map((msg) => {
                return <Message key={msg.id} id={msg.id} user={msg.user} message={msg}/>
            })}
            <EndOfMessage ref={lastMessageRef}/>
        </MessageContainer>


        <InputContainer onSubmit={sendMessage}>
            <IconButton>
                <InsertEmoticon/>
            </IconButton>
            <Input placeholder="Write your message!" value={input} onChange={e => setInput(e.target.value)}/>
            <IconButton>
                <Mic/>
            </IconButton>
        </InputContainer>
    </Container>);
};

export default ChatScreen;


const Container = styled.div`
  height: 100vh;
  position: relative;
`;

const Header = styled.div`
  width: calc(100% - 320px);
  position: fixed;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  align-items: center;
  padding: 11px;
  border-bottom: 1px solid whitesmoke;
  height: 80px;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: -10px;
  }

  > p {
    font-size: 14px;
    color: gray;
  }
`;

const HeaderIcons = styled.div``;

const MessageContainer = styled.div`
  overflow-y: scroll;
  padding: 10px;
  width: calc(100% - 320px);
  position: fixed;
  margin-top: 80px;
  height: calc(100vh - 140px);

  //Hide Scrollbar
  ::-webkit-scrollbar {
    display: none;
  }

  //IE and Edge
  -ms-overflow-style: none;
  //Firefox
  scrollbar-width: none;
`;

const EndOfMessage = styled.div``;

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  width: calc(100% - 320px);
  position: fixed;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;

const Input = styled.input`
  flex: 1;
  align-items: center;
  margin: 0 10px;
  border-radius: 5px;
  font-size: 15px;
  padding: 10px;
  border: none;
  outline: none;
  background-color: whitesmoke;
`;