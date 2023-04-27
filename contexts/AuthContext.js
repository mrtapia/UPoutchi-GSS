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
    setDoc,
    query,
    collection,
    where,
    getDocs
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";

const AuthContext = createContext();
export const TempAuthContext = createContext(false);

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] =useState({});

    const isEmailAvailable = async (email) => {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return true;
      else return false;
    }

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
            email: email,
            upoutchi: upoutchi
          });
        return true;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, "Message:", errorMessage);
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
      value={{ signIn, signUp, logOut, isEmailAvailable, user, userInfo }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const UserAuth = () => {
  return useContext(AuthContext);
};
