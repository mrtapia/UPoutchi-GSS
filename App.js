import * as React from 'react';
import {Pressable} from 'react-native';
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
import { AuthContextProvider, UserAuth, TempAuthContext } from './contexts/AuthContext';
import { Entypo } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

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

  const handleLogOut = () => {
    logOut();
  }

  return (
    <>
    {user !== null ? (
      <NavigationContainer>
        <Tab.Navigator screenOptions={{
          tabBarStyle: { paddingBottom:0, borderColor:"#161819" },
          tabBarLabelStyle: {paddingBottom:30 },
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
