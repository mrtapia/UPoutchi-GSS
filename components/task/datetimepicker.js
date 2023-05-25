
import * as React from "react";	
import {	
  StyleSheet,	
  View,	
  Pressable,	
  Text,	
  Image,	
  TouchableOpacity,	
  Keyboard,	
  ScrollView,	
  Modal,	
  TextInput,	
  Button,	
  Dimensions,	
  LogBox,	
  Alert,
  Platform,	
} from "react-native";	
import RNDateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";

import {
    collection,
    addDoc,
    setDoc,
    doc,
    getDocs,
    query,
    where,
    Timestamp,
  } from "firebase/firestore";

export const DateTimePicker = ({date, setDate, readonly = false}) => {
    const [openDate, setOpenDate] = React.useState(false);
    const [openTime, setOpenTime] = React.useState(false);
    const datenow = new Date();

    const setDateTime = (event, newDate) => {
        setOpenDate(false);
        setOpenTime(false);
        setDate(newDate);
    }

    const checkDate = (curr) => {
        return curr !== "" && curr !== NaN && curr !== undefined && curr !== null;
    }


    return <View className="flex flex-row">
    { Platform.OS == 'ios' && 
    <>
      <RNDateTimePicker value={checkDate(date) ? date : datenow} mode='date' onChange={setDateTime} themeVariant='dark' disabled={readonly} />
      <RNDateTimePicker value={checkDate(date) ? date : datenow} mode='time' onChange={setDateTime} themeVariant='dark' disabled={readonly}/>
    </>
    }
    {Platform.OS == 'android' && 
    <>
    <View className="flex flex-row justify-around w-full">
    <Pressable 
        className="px-4 py-2 bg-[#37383D] rounded-md" 
        onPress={ () => readonly ? {} : setOpenDate(true) }>
            <Text className="text-white">{date == ""  || date == undefined ? moment(datenow).format("MMM D, YYYY") : moment(stamp?.toDate()).format("MMM D, YYYY")}</Text>
        </Pressable>
        <Pressable 
            className="px-4 py-2 bg-[#37383D] rounded-md"
            onPress={ () => readonly ? {} : setOpenTime(true) }>
            <Text className="text-white">{date == "" || date == undefined ? moment(datenow).format("hh:mm A") : moment(stamp?.toDate()).format("hh:mm A")}</Text>
        </Pressable>
    </View>
       
        {openDate && <RNDateTimePicker value={checkDate(date) ? date : datenow} mode='date' onChange={setDateTime} themeVariant='dark'/>}
        {openTime && <RNDateTimePicker value={checkDate(date) ? date : datenow} mode='time' onChange={setDateTime} themeVariant='dark'/>}
    </>
    }
  </View>
}