import React, {useState} from 'react';
import styled from "styled-components";
import {Avatar, Button, IconButton} from "@mui/material";
import ChatIcon from '@mui/icons-material/Chat';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as EmailValidator from "email-validator";
import {auth, db} from "../firebase";
import {signOut} from "firebase/auth";
import {useAuthState} from "react-firebase-hooks/auth";
import {collection, query, where, addDoc} from "firebase/firestore";
import {useCollection} from "react-firebase-hooks/firestore";
import Chat from "./Chat";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);

    const [user] = useAuthState(auth);
    const userChatsRef = query(collection(db, "chats"), where("users", "array-contains", user.email));
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [chatsSnapshot] = useCollection(userChatsRef);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setEmail("");
        setError(false)
        setOpen(false);
    };

    const createNewChat = async () => {
        if (!EmailValidator.validate(email)) {
            return setError("Email is not valid")
        } else if (email === user.email) {
            return setError("Email is not valid (This is your email)")
        } else if (chatAlreadyExists(email)) {
            return setError("Chat with this email is already exists")
        }
        const newEmail = email;
        handleClose();

        // Add new chat to database
        await addDoc(collection(db, "chats"), {
            users: [user.email, newEmail]
        });
    };

    const signOutUser = async () => {
        await signOut(auth);
    }

    const chatAlreadyExists = (recipientEmail) => {
        let data = chatsSnapshot?.docs;
        let res = data.find((chat) => {
            return chat.data().users.find((user) => {
                return user === recipientEmail
            })
        })
        // "!!" used to return answer in true or false
        return !!res
    }

    return (<>
        {/*Header*/}
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={signOutUser} title="Click to Sign out"/>
                <IconsContainer>
                    <IconButton>
                        <ChatIcon/>
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon/>
                    </IconButton>
                </IconsContainer>
            </Header>

            {/*Search bar*/}
            <SearchBox>
                <SearchIcon/>
                <SearchInput placeholder="Search in Chats"/>
            </SearchBox>

            {/*New Chat btn*/}
            <NewChatButton onClick={handleClickOpen}>
                Start a new chat
            </NewChatButton>

            {/*All Chats*/}
            {chatsSnapshot?.docs.map((chat) => {
                return <Chat key={chat.id} id={chat.id} users={chat.data().users}/>
            })}

        </Container>

        {/*Modal*/}
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>New Chat</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Please enter the email address of the user you wish to chat with
                </DialogContentText>
                <TextField
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="standard"
                />
                {error && <div style={{fontSize: "13px", color: "red"}}>&#9755; {error}</div>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={createNewChat}>Start</Button>
            </DialogActions>
        </Dialog>
    </>);
};

export default Navbar;

const Container = styled.div`
  width: 320px;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  overflow-y: scroll;

  //Hide Scrollbar
  ::-webkit-scrollbar {
    display: none;
  }

  //IE and Edge
  -ms-overflow-style: none;
  //Firefox
  scrollbar-width: none;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: white;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const UserAvatar = styled(Avatar)`
  cursor: pointer;

  :hover {
    opacity: 0.8;
  }
`;

const IconsContainer = styled.div``;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  background-color: transparent;
  border: none;
  flex: 1;
  margin-left: 10px;
  font-size: 15px;
`;

const NewChatButton = styled(Button)`
  color: black;
  display: block;
  width: calc(100% - 20px);
  background-color: lightgray;
  margin: 0 auto 10px;

  :hover {
    background-color: darkgray;
  }
`;
