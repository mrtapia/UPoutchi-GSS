import { useEffect, createContext, useContext, useState } from "react"; 
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut, 
    createUserWithEmailAndPassword 
} from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const AuthContext = createContext();
export const TempAuthContext = createContext(false);

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] =useState({});

    const signIn = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
          
            if (docSnap.exists()) {
              const data = docSnap.data();
              setUserInfo(data);
            }
            return true;
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            return false;
        });
    };

  const signUp = async (email, password, firstname, lastname, upoutchi) => {
    await createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
            firstname: firstname,
            lastname: lastname,
            upoutchi: upoutchi
          });
        return true;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        return false;
    });
  }

  const logOut = () => {
    signOut(auth);
    setUserInfo({});
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if(currentUser) setUser(currentUser);
        else setUser(null);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  
  return (
    <AuthContext.Provider
      value={{ signIn, signUp, logOut, user, userInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const UserAuth = () => {
  return useContext(AuthContext);
};
