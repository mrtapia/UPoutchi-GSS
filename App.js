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
import { AuthContext } from './contexts/AuthContext';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return ( 
    <>
      <AuthContext.Provider value={{isLoggedIn, setIsLoggedIn}}>
        <SafeAreaProvider>
        { isLoggedIn ? (
          <NavigationContainer>
            <Tab.Navigator>
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Schedule" component={ScheduleScreen} />
              <Tab.Screen name="Task" component={TaskScreen} />
              <Tab.Screen name="Dashboard" component={DashboardScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        ):(
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
        )}
        </SafeAreaProvider>
      </AuthContext.Provider>
    </>
  );
}
