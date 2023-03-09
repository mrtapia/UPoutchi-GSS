import * as React from 'react';
import { View, Pressable, Text, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function StartUpScreen({ navigation }) {
  const insets = useSafeAreaInsets();
    return (
      <View className="bg-[#407BB3] flex-auto justify-center items-center" style={{
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}>
        <Image 
          className="mb-8 -mt-36"
          source={require('../../assets/upoutchi-logo.png')} />
        <View>        
         <Text className="text-white font-extrabold text-5xl tracking-widest z-[1]">UPoutchi</Text>   
         <Text className="absolute mt-1 text-black font-extrabold text-5xl tracking-widest">UPoutchi</Text>   
        </View>
        <Pressable className="my-8"
          onPress={() => navigation.navigate("Login")}>
          {({pressed}) => (
            <View className={`w-64 py-4 rounded-2xl shadow shadow-gray-800 ${pressed ? "bg-[#C84C48]" : "bg-[#EE7A76]"}`}>
            <Text className="text-white text-2xl text-center font-semibold">LOGIN</Text>
          </View>
          )}
        </Pressable>
        <Pressable
          onPress={() => navigation.navigate("SignUp")}>
          {({pressed}) => (
            <View className={`w-64 py-4 rounded-2xl shadow shadow-gray-800 ${pressed ? "bg-[#C84C48]" : "bg-[#EE7A76]"}`}>
            <Text className="text-white text-2xl text-center font-semibold">SIGN UP</Text>
          </View>
          )}
        </Pressable>

      </View>
    );
  }