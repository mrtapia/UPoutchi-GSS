import * as React from 'react';
import { View, Pressable, Text, TextInput, Image, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TempAuthContext, UserAuth } from '../../contexts/AuthContext';
import validator from 'validator';

const errorMessages = [
    "First name should only contain alphabetic characters.",
    "Last name should only contain alphabetic characters.",
    "First name should be at least 2 characters.",
    "Last name should be at least 2 characters.",
    "Invalid email.",
    "Password should be at least 6 characters.",
    "Passwords do not match."
];

export function SignUpScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    firstname, setFirstname, 
    lastname, setLastname, 
    email, setEmail, 
    password, setPassword, 
    confirm, setConfirm} = React.useContext(TempAuthContext);

    const [errors, setErrors] = React.useState(["", "", "", "", "", "", ""]);

    const validate = () => {
        let tempErrors = ["", "", "", "", "", "", ""];
        let validlist = [
            validator.isAlpha(firstname),
            validator.isAlpha(lastname),
            validator.isLength(firstname, {min: 2}),
            validator.isLength(lastname, {min: 2}),
            validator.isEmail(email),
            validator.isLength(password, {min: 6}),
            validator.equals(password, confirm)
        ];

        if (validlist.includes(false)) {
            validlist.forEach((isValid, i) => {
                if (isValid) tempErrors[i] = "";
                else tempErrors[i] = errorMessages[i];
            });
            setErrors(tempErrors);
        } else {
            navigation.navigate("PoutchiSignUp");
        }
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
                            <Text className="text-white text-base mb-2">First name</Text>
                            <TextInput className="bg-white text-[16px] rounded p-2 w-64" autoCapitalize='none' autoCorrect={false} onChangeText={(text) => setFirstname(text)}></TextInput>
                            {errors[0].length === 0 ? <></> : 
                            <Text className="text-red-800 text-xs mt-1 w-64">{errors[0]}</Text> }
                            {errors[2].length === 0 ? <></> : 
                            <Text className="text-red-800 text-xs mt-1 w-64">{errors[2]}</Text> }
                        </View>
                        <View className="mb-4">
                            <Text className="text-white text-base mb-2">Last name</Text>
                            <TextInput className="bg-white text-[16px] rounded p-2 w-64" autoCapitalize='none' autoCorrect={false} onChangeText={(text) => setLastname(text)}></TextInput>
                            {errors[1].length === 0 ? <></> : 
                            <Text className="text-red-800 text-xs mt-1 w-64">{errors[1]}</Text> }
                            {errors[3].length === 0 ? <></> : 
                            <Text className="text-red-800 text-xs mt-1 w-64">{errors[3]}</Text> }
                        </View>
                        <View className="mb-4">
                            <Text className="text-white text-base mb-2">Email address</Text>
                            <TextInput className="bg-white text-[16px] rounded p-2 w-64" autoCapitalize='none' autoCorrect={false} onChangeText={(text) => setEmail(text)}></TextInput>
                            {errors[4].length === 0 ? <></> : 
                            <Text className="text-red-800 text-xs mt-1 w-64">{errors[4]}</Text> }
                        </View>
                        <View className="mb-4">
                            <Text className="text-white text-base mb-2">Password</Text>
                            <TextInput className="bg-white text-[16px] rounded p-2 w-64" autoCapitalize='none' autoCorrect={false} onChangeText={(text) => setPassword(text)}secureTextEntry={true}></TextInput>
                            {errors[5].length === 0 ? <></> : 
                            <Text className="text-red-800 text-xs mt-1 w-64">{errors[5]}</Text> }
                        </View>
                        <View className="mb-4">
                            <Text className="text-white text-base mb-2">Confirm password</Text>
                            <TextInput className="bg-white text-[16px] rounded p-2 w-64" autoCapitalize='none' autoCorrect={false} onChangeText={(text) => setConfirm(text)} secureTextEntry={true}></TextInput>
                            {errors[6].length === 0 ? <></> : 
                            <Text className="text-red-800 text-xs mt-1 w-64">{errors[6]}</Text> }
                        </View>
                        <Pressable className="my-8"
                        onPress={() => validate()}
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

  const [upoutchi, setUpoutchi] = React.useState("");
  const [errors, setErrors] = React.useState("");
  const {firstname, lastname, email, password} = React.useContext(TempAuthContext);
  const { signUp } = UserAuth();

  const signUpHandler = async () => {
    if (validator.isAlpha(upoutchi) && validator.isLength(upoutchi, {min: 2})) {
        await signUp(email, password, firstname, lastname, upoutchi).then((success) => {
            if (!success) setErrors("Failed to sign up user.");
        });
    } else {
        setErrors("Poutchi's name should only contain alphabetic characters and should be at least 2 characters.");
    }
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
                            <TextInput className="bg-white text-[16px] rounded p-2 w-64" autoCapitalize='none' autoCorrect={false} onChangeText={(text) => setUpoutchi(text)}></TextInput>
                            {errors.length === 0 ? <></> : 
                            <Text className="text-red-800 text-xs mt-1 w-64">{errors}</Text> }
                        </View>
                        
                        <Pressable className="my-8"
                        onPress={signUpHandler}
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