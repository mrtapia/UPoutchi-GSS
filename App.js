import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StartUpScreen } from './screens/entry';
import { LoginScreen } from './screens/entry/login';
import { SignUpScreen, PoutchiSignUpScreen } from './screens/entry/signup';
import { HomeScreen } from './screens/home';
import { ScheduleScreen } from './screens/schedule';
import { TaskScreen } from './screens/task';
import { DashboardScreen } from './screens/dashboard';
import { AuthContextProvider, UserAuth, TempAuthContext } from './contexts/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Navigators() {
  const { user } = UserAuth();

  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");

  return (
    <>
    {user !== null ? (
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Schedule" component={ScheduleScreen} />
          <Tab.Screen name="Task" component={TaskScreen} />
          <Tab.Screen name="Dashboard" component={DashboardScreen} />
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
