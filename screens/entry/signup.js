import * as React from 'react';
import { View, Pressable, Text, TextInput, Image, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext } from '../../contexts/AuthContext';

export function SignUpScreen({ navigation }) {
  const insets = useSafeAreaInsets();
    return (
        <View className="bg-[#407BB3] flex-auto" style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
        }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-auto">
                <TouchableWithoutFeedback  onPress={Keyboard.dismiss} accessible={false}>
                    <View className="flex-auto justify-center items-center">
                        <View className="flex-row items-center mb-12">
                            <Image source={require("../../assets/upoutchi-logo-dark.png")} />
                            <Text className="text-[#232528] text-5xl font-extrabold mt-4 ml-1">UPoutchi</Text>
                        </View>
                        <View className="mb-4">
                            <Text className="text-white text-base mb-2">First name</Text>
                            <TextInput className="bg-white text-[16px] rounded p-2 w-64"></TextInput>
                        </View>
                        <View className="mb-4">
                            <Text className="text-white text-base mb-2">Last name</Text>
                            <TextInput className="bg-white text-[16px] rounded p-2 w-64"></TextInput>
                        </View>
                        <View className="mb-4">
                            <Text className="text-white text-base mb-2">Email address</Text>
                            <TextInput className="bg-white text-[16px] rounded p-2 w-64"></TextInput>
                        </View>
                        <View className="mb-4">
                            <Text className="text-white text-base mb-2">Password</Text>
                            <TextInput className="bg-white text-[16px] rounded p-2 w-64" secureTextEntry={true}></TextInput>
                        </View>
                        <View className="mb-4">
                            <Text className="text-white text-base mb-2">Confirm password</Text>
                            <TextInput className="bg-white text-[16px] rounded p-2 w-64" secureTextEntry={true}></TextInput>
                        </View>
                        <Pressable className="my-8"
                        onPress={() => navigation.navigate("PoutchiSignUp")}
                        >
                        {({pressed}) => (
                            <View className={`w-40 py-2 rounded-lg shadow shadow-gray-800 ${pressed ? "bg-[#C84C48]" : "bg-[#EE7A76]"}`}>
                            <Text className="text-white text-lg text-center font-semibold">NEXT</Text>
                        </View>
                        )}
                        </Pressable>
                    </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    );
}

export function PoutchiSignUpScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {setIsLoggedIn} = React.useContext(AuthContext);
  
  const SignUpHandler = () => {
    setIsLoggedIn(true);
  }
    return (
        <View className="bg-[#407BB3] flex-auto" style={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
        }}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-auto">
                <TouchableWithoutFeedback  onPress={Keyboard.dismiss} accessible={false}>
                    <View className="flex-auto justify-center items-center">
                        <View className="flex-row items-center mb-12">
                            <Image source={require("../../assets/upoutchi-logo-dark.png")} />
                            <Text className="text-[#232528] text-5xl font-extrabold mt-4 ml-1">UPoutchi</Text>
                        </View>
                        <Image className="mb-4" source={require("../../assets/poutchi-default.png")} />
                        <View className="mb-4">
                            <Text className="text-white text-base mb-2">Poutchi name</Text>
                            <TextInput className="bg-white text-[16px] rounded p-2 w-64"></TextInput>
                        </View>
                        
                        <Pressable className="my-8"
                        onPress={SignUpHandler}
                        >
                        {({pressed}) => (
                            <View className={`w-40 py-2 rounded-lg shadow shadow-gray-800 ${pressed ? "bg-[#C84C48]" : "bg-[#EE7A76]"}`}>
                            <Text className="text-white text-lg text-center font-semibold">SIGN UP</Text>
                        </View>
                        )}
                        </Pressable>
                    </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </View>
    );
}