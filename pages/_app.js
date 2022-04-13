import '../styles/globals.css'
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth, db} from "../firebase";
import Login from "../components/Login";
import Loading from "../components/Loading";
import {useEffect} from "react";
import {doc, setDoc, serverTimestamp} from "firebase/firestore";


function MyApp({Component, pageProps}) {
    const [user, loading, error] = useAuthState(auth);


    useEffect(() => {
        if (user) {
            const addUserToDB = async () => {
                // Add a new document in collection "users" if exits then update
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email, lastSeen: serverTimestamp(), photoURL: user.photoURL
                }, {merge: true});
            };
            addUserToDB();
        }
    }, [user]);


    if (loading) return <Loading/>
    // If user not exists than display login section
    if (!user) return <Login/>

    return <Component {...pageProps} />
}

export default MyApp
