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
export const UserInfoContext = createContext({});

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const isEmailAvailable = async (email) => {
      const q = query(collection(db, "users"), where("email", "==", email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return true;
      else return false;
    }

    const signIn = async (email, password) => {
        await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
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
        const datenow = new Date().toLocaleString();
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
            firstname: firstname,
            lastname: lastname,
            email: email,
            upoutchi: upoutchi,
            stats: {
              EN: {
                value: 60,
                updated: datenow
              },
              HE: {
                value: 60,
                updated: datenow
              },
              HU: {
                value: 60,
                updated: datenow
              },
              HY: {
                value: 60,
                updated: datenow
              }
            },
            inventory: {}
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
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if(currentUser) {
          setUser(currentUser);
        }
        else setUser(null);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  
  return (
    <AuthContext.Provider
      value={{ signIn, signUp, logOut, isEmailAvailable, user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const UserAuth = () => {
  return useContext(AuthContext);
};
