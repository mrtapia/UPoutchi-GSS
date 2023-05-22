import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Image, Pressable, ActivityIndicator } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Sprite from '../../lib/Sprite';
import { GLView } from 'expo-gl';
import { Asset } from 'expo-asset';
import Expo2DContext from 'expo-2d-context';
import { Inventory } from '../../components/home/inventory';
import { UserAuth, UserInfoContext } from '../../contexts/AuthContext';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import moment from 'moment';
const {height, width} = Dimensions.get("screen");
const SPRITE_SHEET = require('../../assets/poutchi/spritesheet.png');

export function HomeScreen ({ navigation }) {
  const { user } = UserAuth();
  const {updateInventory, stats, updateStats} = useContext(UserInfoContext);
  const [isLoading, setIsLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            let data = docSnap.data();
            updateInventory(data.inventory);
            const datenow = new Date().toLocaleString();
            let diff = 0;
            Object.keys(data.stats).forEach((key) => {
              const datenow_formatted = moment(datenow, "M/D/YYYY, h:mm:ss A", true);
              const last_updated = moment((data.stats[key].updated).toString(), "M/D/YYYY, h:mm:ss A", true);
              diff = Math.floor((datenow_formatted - last_updated)/1000/60/30);
              data.stats[key].value = data.stats[key].value - diff;
              data.stats[key].updated = datenow;
            });
            if (diff > 0) {
              await updateDoc(userRef, {
                stats: data.stats
              });
            }
            updateStats(data.stats);
        }
        setIsLoading(false);
    }
    getData();
  }, []);
  
  return (
    <>
      <Inventory 
        visible={visible} 
        setVisible={setVisible}
      />
      <View className="bg-[#232528] flex-auto justify-start">
        <View className=" mt-4 mx-4 flex flex-row justify-between items-baseline">
          <Text className="text-white text-5xl font-bold">Poutchi</Text>
          <Pressable onPress={() => setVisible(true)}>
            <Entypo name="box" size={40} color="#3C78AF" />
          </Pressable>
        </View>
        {isLoading ? <ActivityIndicator className="flex-1" color="#3C78AF" size={'large'}/> : 
        <>
          <View className="my-2 mx-4 flex flex-row justify-start items-center">
          <Entypo name="heart" size={24} color="#3C78AF" />
          <Text className="ml-1 mr-4 text-white text-lg">{stats.HE.value}</Text>
          <Ionicons name="fast-food" size={24} color="#3C78AF" />
          <Text className="ml-1 mr-4 text-white text-lg">{stats.HU.value}</Text>
          <FontAwesome name="bathtub" size={24} color="#3C78AF" />
          <Text className="ml-1 mr-4 text-white text-lg">{stats.HY.value}</Text>
          <FontAwesome name="smile-o" size={24} color="#3C78AF" />
          <Text className="ml-1 mr-4 text-white text-lg">{stats.EN.value}</Text>
        </View>
        {/* <GLView className="mt-16" style={{width: width, height: width}} onContextCreate={(gl) => _onContextCreate(gl)}/> */}
        </>
        }
        
      </View>
    </>
  );
  
}

async function _onContextCreate(gl) {
  var ctx = new Expo2DContext(gl);
  const asset = await Asset.fromModule(require("../../assets/poutchi/spritesheet.png")).downloadAsync();
  const Poutchi = new Sprite(asset, width);

  const animate = () => {
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    Poutchi.draw(ctx);
    Poutchi.update();
    ctx.flush();
    requestAnimationFrame(animate);
  }
  animate();
}