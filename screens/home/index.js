import React, { useState, useEffect } from 'react';
import { View, Text, Animated, StyleSheet, Dimensions, Image, Pressable } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Sprite from '../../lib/Sprite';
import { GLView } from 'expo-gl';
import { Asset } from 'expo-asset';
import Expo2DContext from 'expo-2d-context';
import { Inventory } from '../../components/home/inventory';
const {height, width} = Dimensions.get("screen");
const SPRITE_SHEET = require('../../assets/poutchi/spritesheet.png');

export function HomeScreen ({ navigation }) {
  const [visible, setVisible] = useState(false);
  const [health, setHealth] = useState(60);
  const [hunger, setHunger] = useState(60);
  const [hygiene, setHygiene] = useState(60);
  const [entertainment, setEntertainment] = useState(60);
  
  return (
    <>
      <Inventory 
        visible={visible} 
        setVisible={setVisible}
        health={health}
        setHealth={setHealth}
        hunger={hunger}
        setHunger={setHunger}
        hygiene={hygiene}
        setHygiene={setHygiene}
        entertainment={entertainment}
        setEntertainment={setEntertainment}
      />
      <View className="bg-[#232528] flex-auto justify-start">
        <View className=" mt-4 mx-4 flex flex-row justify-between items-baseline">
          <Text className="text-white text-5xl font-bold">Poutchi</Text>
          <Pressable onPress={() => setVisible(true)}>
            <Entypo name="box" size={40} color="#3C78AF" />
          </Pressable>
        </View>
        <View className="my-2 mx-4 flex flex-row justify-start items-center">
          <Entypo name="heart" size={24} color="#3C78AF" />
          <Text className="ml-1 mr-4 text-white text-lg">{health}</Text>
          <Ionicons name="fast-food" size={24} color="#3C78AF" />
          <Text className="ml-1 mr-4 text-white text-lg">{hunger}</Text>
          <FontAwesome name="bathtub" size={24} color="#3C78AF" />
          <Text className="ml-1 mr-4 text-white text-lg">{hygiene}</Text>
          <FontAwesome name="smile-o" size={24} color="#3C78AF" />
          <Text className="ml-1 mr-4 text-white text-lg">{entertainment}</Text>
        </View>
        <GLView className="mt-16" style={{width: width, height: width}} onContextCreate={(gl) => _onContextCreate(gl)}/>
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