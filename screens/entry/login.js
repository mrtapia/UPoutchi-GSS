import * as React from 'react';
import { View, Pressable, Text, TextInput, Image, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserAuth } from '../../contexts/AuthContext';

export function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { signIn } = UserAuth();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [errors, setErrors] = React.useState("");

  const loginHandler = async () => {
    await signIn(email, password).then((success) => {
        if (!success) {
            setErrors("Invalid email or password.");
        }
    })
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
                    <View className="mb-4">
                        <Text className="text-white text-base mb-2">Email address</Text>
                        <TextInput className="bg-white text-[16px] rounded p-2 w-64" autoCapitalize='none' autoCorrect={false} onChangeText={(text) => setEmail(text)}></TextInput>
                    </View>
                    <View className="mb-4">
                        <Text className="text-white text-base mb-2">Password</Text>
                        <TextInput className="bg-white text-[16px] rounded p-2 w-64" autoCapitalize='none' autoCorrect={false} onChangeText={(text) => setPassword(text)} secureTextEntry={true}></TextInput>
                    </View>
                    {errors.length === 0 ? <></> : 
                    <Text className="text-red-800 text-xs my-1 w-64 text-center">{errors}</Text> }
                    <Pressable className="my-8"
                    onPress={loginHandler}
                    >
                    {({pressed}) => (
                        <View className={`w-40 py-2 rounded-lg shadow shadow-gray-800 ${pressed ? "bg-[#C84C48]" : "bg-[#EE7A76]"}`}>
                        <Text className="text-white text-lg text-center font-semibold">LOGIN</Text>
                    </View>
                    )}
                    </Pressable>
                </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      </View>
    );
  }