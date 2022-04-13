import React from 'react';
import styled from "styled-components";
import {Avatar} from "@mui/material";
import {getRecipientEmail} from "../utils/getRecipientEmail";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db} from "../firebase";
import {collection, query, where} from "firebase/firestore";
import {useCollection} from "react-firebase-hooks/firestore";
import {useRouter} from "next/router";


const Chat = ({id, users}) => {
    const [user] = useAuthState(auth);
    const router = useRouter();
    const recipientEmail = getRecipientEmail(users, user)
    const recipientRef = query(collection(db, "users"), where("email", "==", recipientEmail));
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [recipientSnapshot] = useCollection(recipientRef);
    const recipient = recipientSnapshot?.docs?.[0]?.data();

    const enterChat = async () => {
        await router.push(`/chat/${id}`)
    }

    return (<Container onClick={enterChat}>
        {recipient ? (<UserAvatar src={recipient?.photoURL}/>) : (
            <UserAvatar>{recipientEmail[0].toUpperCase()}</UserAvatar>)}
        <p>{recipientEmail}</p>
    </Container>);
};

export default Chat;


const Container = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  word-wrap: break-word;

  :hover {
    background-color: #e9eaeb;
  }
`;
const UserAvatar = styled(Avatar)`
  margin: 5px 15px 5px 5px;
`;