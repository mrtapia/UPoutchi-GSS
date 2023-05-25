import React, {useEffect} from 'react';
import {Platform, Pressable} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StartUpScreen } from './screens/entry';
import { LoginScreen } from './screens/entry/login';
import { SignUpScreen, PoutchiSignUpScreen } from './screens/entry/signup';
import { HomeScreen } from './screens/home';
import { FocusScreen } from './screens/focus';
import { TaskScreen } from './screens/task';
import { DashboardScreen } from './screens/dashboard';
import { AuthContextProvider, UserAuth, TempAuthContext, UserInfoContext } from './contexts/AuthContext';
import { Entypo } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { db } from './lib/firebase';
import { doc, updateDoc, getDoc, getDocs, collection, addDoc, Timestamp } from 'firebase/firestore';
import moment from 'moment';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ButtonScreen = () => null;

function Navigators() {
  const { user, logOut } = UserAuth();

  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");

  const [stats, setStats] = React.useState({});
  const [inventory, setInventory] = React.useState({});
  const [tasks, setTasks] = React.useState([]);
  const [sessions, setSessions] = React.useState([]);

  const handleLogOut = () => {
    logOut();
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  async function loop() {
    while (1) {
      await delay(1800000);
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
          let data = docSnap.data();
          const datenow = new Date().toLocaleString();
          let diff = 0;
          Object.keys(data.stats).forEach((key) => {
            const datenow_formatted = moment(datenow, "M/D/YYYY, h:mm:ss A", true);
            const last_updated = moment((data.stats[key].updated).toString(), "M/D/YYYY, h:mm:ss A", true);
            diff = Math.floor((datenow_formatted - last_updated)/1000/60/30);
            data.stats[key].value = (data.stats[key].value - diff) < 0 ? 0 : (data.stats[key].value - diff);
            data.stats[key].updated = datenow;
          });
          console.log("loop");
          if (diff > 0) {
            await updateDoc(userRef, {
              stats: data.stats
            });
          }
          setStats(data.stats);
      }
    }
  }

  const getTasksAndSessions = async () => {
    const tasksSnap = await getDocs(collection(db, "users", user.uid, "tasks"));
    let task_li = [];
    tasksSnap.forEach( (docu) => {
      let data = docu.data();
      data.id = docu.id;
      console.log("before", data.due_date);
      data.due_date = new Timestamp(data.due_date.seconds, data.due_date.nanoseconds).toDate();
      console.log("after", data.due_date);
      task_li.push(data);
    });
    task_li.sort((a,b) => {
      const d1 = moment(a.due_date);
      const d2 = moment(b.due_date);
      return d1-d2;
    });
    setTasks(task_li);
    const sessionSnap = await getDocs(collection(db, "users", user.uid, "sessions"));
    let session_li = [];
    sessionSnap.forEach( (docu) => {
      session_li.push(docu.data());
    });
    setSessions(session_li);
  }

  useEffect(() => {
    if (user !== null) {
      getTasksAndSessions();
      loop();
    }
  }, [user]);

  return (
    <>
    {user !== null ? (
      <UserInfoContext.Provider value={
        {
          stats, 
          updateStats: stats => setStats(stats), 
          inventory, 
          updateInventory: inventory => setInventory(inventory),
          tasks,
          setTasks,
          sessions,
          setSessions
        }
      }>
        <NavigationContainer>
          <Tab.Navigator screenOptions={{
            tabBarStyle: { paddingBottom:0, borderColor:"#161819" },
            tabBarLabelStyle: {
              paddingBottom: Platform.OS == 'android' ? 0 : 30
            },
            tabBarActiveBackgroundColor: "#161819",
            tabBarInactiveBackgroundColor: "#161819",
            tabBarActiveTintColor: "#3C78AF",
            tabBarInactiveTintColor: "#818181",
            headerStyle: {backgroundColor: "#161819" },
            headerTintColor: "#3C78AF"

          }}>
            <Tab.Screen name="Home" component={HomeScreen} 
            options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color }) => (
                <Entypo name="home" size={24} color={color} />
              ),
            }}/>
            <Tab.Screen name="Focus" component={FocusScreen} 
            options={{
              tabBarLabel: 'Focus',
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="timer" size={24} color={color} />
              ),
            }}/>
            <Tab.Screen name="Task" component={TaskScreen} 
            options={{
              tabBarLabel: 'Tasks',
              tabBarIcon: ({ color }) => (
                <Octicons name="checklist" size={24} color={color} />
              ),
            }}/>
            <Tab.Screen name="Dashboard" component={DashboardScreen} 
            options={{
              tabBarLabel: 'Dashboard',
              tabBarIcon: ({ color }) => (
                <MaterialIcons name="dashboard" size={24} color={color} />
              ),
            }}/>
            <Tab.Screen name="LogOut"  component={ButtonScreen}
                options={({navigation})=> ({
                  tabBarIcon: ({color}) => (<FontAwesome name="sign-out" size={24} color={color} />),
                  tabBarLabel: "Log Out",
                  tabBarButton:props => <Pressable {...props} onPress={()=>handleLogOut()}/>
            })}/>
          </Tab.Navigator>
        </NavigationContainer>
      </UserInfoContext.Provider>
    ):(
      <TempAuthContext.Provider value={{firstname, setFirstname, lastname, setLastname, email, setEmail, password, setPassword, confirm, setConfirm}}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen
              name="StartUp"
              component={StartUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="PoutchiSignUp"
              component={PoutchiSignUpScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </TempAuthContext.Provider>
    )}
    </>
  )

}

export default function App() {
  return ( 
      <AuthContextProvider>
        <SafeAreaProvider>
          <Navigators />
        </SafeAreaProvider>
      </AuthContextProvider>
  );
}
