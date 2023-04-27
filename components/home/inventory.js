import React, { useRef, useState } from 'react';
import { View, Text, Pressable, Modal, Image, FlatList, Animated, Easing } from 'react-native';
import { useAssets } from 'expo-asset';
import { Items } from '../../lib/Items';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

const inventory = {
    'EN-RBK': 3,
    'HE-GMC': 2,
    'HU-BRG': 1,
    'HY-TAB': 1
  };

const CATEGORIES = {
    DEFAULT: {
        bgColor: "bg-gray-300",
        borderColor: "border-gray-800"
    },
    EN: {
        bgColor: "bg-yellow-300",
        borderColor: "border-yellow-800",
        icon: <FontAwesome name="smile-o" size={16} color="white" />
    },
    HE: {
        bgColor: "bg-red-300",
        borderColor: "border-red-800",
        icon: <Entypo name="heart" size={16} color="white" />
    },
    HU: {
        bgColor: "bg-green-300",
        borderColor: "border-green-800",
        icon: <Ionicons name="fast-food" size={16} color="white" />
    },
    HY: {
        bgColor: "bg-blue-300",
        borderColor: "border-blue-800",
        icon: <FontAwesome name="bathtub" size={16} color="white" />
    },
}

export function Inventory({ 
    visible, setVisible,
    health, setHealth,
    hunger, setHunger,
    hygiene, setHygiene,
    entertainment, setEntertainment,
    knowledge, setKnowledge 
}) {
    const [selected, setSelected] = useState({});
    const [refreshFlatlist, setRefreshFlatList] = useState(false);
    const isUsingItem = useRef(false);
    const itemUsed = useRef({});
    const opacity = useRef(new Animated.Value(0));
    const yPos = useRef(new Animated.Value(40));
    const [assets, error] = useAssets([
        require("../../assets/items/entertainment/bowl.png"),
        require("../../assets/items/entertainment/dart.png"),
        require("../../assets/items/entertainment/fish.png"),
        require("../../assets/items/entertainment/game.png"),
        require("../../assets/items/entertainment/listen.png"),
        require("../../assets/items/entertainment/read.png"),
        require("../../assets/items/entertainment/watch.png"),
        require("../../assets/items/health/barbell.png"),
        require("../../assets/items/health/bike.png"),
        require("../../assets/items/health/boxing.png"),
        require("../../assets/items/health/checkup.png"),
        require("../../assets/items/health/dental.png"),
        require("../../assets/items/health/dumbbell.png"),
        require("../../assets/items/health/firstaid.png"),
        require("../../assets/items/health/jumprope.png"),
        require("../../assets/items/health/kettlebell.png"),
        require("../../assets/items/health/medicine.png"),
        require("../../assets/items/health/treadmill.png"),
        require("../../assets/items/health/vaccine.png"),
        require("../../assets/items/health/vitamins.png"),
        require("../../assets/items/hunger/baguette.png"),
        require("../../assets/items/hunger/boiledegg.png"),
        require("../../assets/items/hunger/bread.png"),
        require("../../assets/items/hunger/burger.png"),
        require("../../assets/items/hunger/cheese.png"),
        require("../../assets/items/hunger/chicken.png"),
        require("../../assets/items/hunger/croissant.png"),
        require("../../assets/items/hunger/donut.png"),
        require("../../assets/items/hunger/egg.png"),
        require("../../assets/items/hunger/fries.png"),
        require("../../assets/items/hunger/hotdog.png"),
        require("../../assets/items/hunger/meat.png"),
        require("../../assets/items/hunger/pizza.png"),
        require("../../assets/items/hunger/ramen.png"),
        require("../../assets/items/hunger/sandwich.png"),
        require("../../assets/items/hunger/sausage.png"),
        require("../../assets/items/hygiene/bath.png"),
        require("../../assets/items/hygiene/hairdry.png"),
        require("../../assets/items/hygiene/hairstyle.png"),
        require("../../assets/items/hygiene/lotion.png"),
        require("../../assets/items/hygiene/shave.png"),
        require("../../assets/items/hygiene/toilet.png"),
        require("../../assets/items/hygiene/toothbrush.png"),
        require("../../assets/items/hygiene/wash.png")
    ]);

    
    const useItem = () => {
        isUsingItem.current = true;
        itemUsed.current = selected;
        animate();
        isUsingItem.current = false;
    }

    const updateValues = () => {
        inventory[itemUsed.current.id]--;
        let prev, new_val;
        if (itemUsed.current.category == "EN") {
            prev = entertainment;
            new_val = prev + itemUsed.current.item.points > 100 ? 100 : prev + itemUsed.current.item.points;
            setEntertainment(new_val);
        } else if (itemUsed.current.category == "HE") {
            prev = health;
            new_val = prev + itemUsed.current.item.points > 100 ? 100 : prev + itemUsed.current.item.points;
            setHealth(new_val);
        } else if (itemUsed.current.category == "HU") {
            prev = hunger;
            new_val = prev + itemUsed.current.item.points > 100 ? 100 : prev + itemUsed.current.item.points;
            setHunger(new_val);
        } else {
            prev = hygiene;
            new_val = prev + itemUsed.current.item.points > 100 ? 100 : prev + itemUsed.current.item.points;
            setHygiene(new_val);
        }
        if (inventory[itemUsed.current.id] == 0) {
            setSelected({});
            delete inventory[itemUsed.current.id];
            setRefreshFlatList(!refreshFlatlist);
        }
        itemUsed.current = {};
    }

    const animate = () => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(yPos.current, {
                    toValue: 10, // return to start
                    duration: 1200,
                    useNativeDriver: true,
                  }),
                  Animated.sequence([
                    Animated.timing(opacity.current, {
                        toValue: 100,
                        duration: 200,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacity.current, {
                        toValue: 0, // return to start
                        duration: 700,
                        easing: Easing.exp,
                        useNativeDriver: true,
                      }),
                  ])
            ]),
                Animated.timing(yPos.current, {
                toValue: 40, // return to start
                useNativeDriver: true,
                }),
          ]).start(() => updateValues()); // start the sequence group
    }

    return (
            <Modal visible={visible} transparent onRequestClose={() => setVisible(false)}>
                <View className="flex-auto bg-[#000000bb] items-center justify-center">
                    <View className="h-3/4 w-5/6 bg-[#232528] rounded-lg">
                        <View className="my-4 pb-4 mx-4 flex flex-row justify-between border-b-2 border-[#29435a]">
                            <View className="flex flex-row">
                                <View className="flex flex-col items-center mr-4 relative">
                                    <View className="flex flex-row gap-1">
                                        <Entypo name="heart" size={24} color="#3C78AF" />
                                        <Text className="text-white text-lg">{health}</Text>
                                    </View>
                                    {Object.keys(selected).length == 0 ? <></> : (isUsingItem && selected.category == "HE" ? 
                                    <Animated.View className="absolute" style={{opacity: opacity.current, transform: [{
                                        translateY: yPos.current 
                                      }]}}>
                                        <View className="flex flex-row  justify-center items-center">
                                            <Entypo name="plus" size={16} color="white" />
                                            <Text className="text-white">{selected.item.points}</Text>
                                        </View> 
                                    </Animated.View>
                                    : <></>)
                                    }
                                    
                                </View>
                                <View className="flex flex-col items-center mr-4">
                                    <View className="flex flex-row gap-1">
                                        <Ionicons name="fast-food" size={24} color="#3C78AF" />
                                        <Text className="text-white text-lg">{hunger}</Text>
                                    </View>
                                    {Object.keys(selected).length == 0 ? <></> : (isUsingItem && selected.category == "HU" ? 
                                    <Animated.View className="absolute" style={{opacity: opacity.current, transform: [{
                                        translateY: yPos.current 
                                      }]}}>
                                        <View className="flex flex-row  justify-center items-center">
                                            <Entypo name="plus" size={16} color="white" />
                                            <Text className="text-white">{selected.item.points}</Text>
                                        </View>
                                    </Animated.View> : <></>)
                                    }
                                </View>
                                <View className="flex flex-col items-center mr-4">
                                    <View className="flex flex-row gap-1">
                                        <FontAwesome name="bathtub" size={24} color="#3C78AF" />
                                        <Text className="text-white text-lg">{hygiene}</Text>
                                    </View>
                                    {Object.keys(selected).length == 0 ? <></> : (isUsingItem && selected.category == "HY" ? 
                                    <Animated.View className="absolute" style={{opacity: opacity.current, transform: [{
                                        translateY: yPos.current 
                                      }]}}>
                                        <View className="flex flex-row  justify-center items-center">
                                            <Entypo name="plus" size={16} color="white" />
                                            <Text className="text-white">{selected.item.points}</Text>
                                        </View>
                                    </Animated.View> : <></>)
                                    }
                                </View>
                                <View className="flex flex-col items-center mr-4">
                                    <View className="flex flex-row gap-1">
                                        <FontAwesome name="smile-o" size={24} color="#3C78AF" />
                                        <Text className="text-white text-lg">{entertainment}</Text>
                                    </View>
                                    {Object.keys(selected).length == 0 ? <></> : (isUsingItem && selected.category == "EN" ? 
                                    <Animated.View className="absolute" style={{opacity: opacity.current, transform: [{
                                        translateY: yPos.current 
                                      }]}}>
                                        <View className="flex flex-row  justify-center items-center">
                                            <Entypo name="plus" size={16} color="white" />
                                            <Text className="text-white">{selected.item.points}</Text>
                                        </View> 
                                    </Animated.View>: <></>)
                                    }
                                </View>
                            </View>
                            <Pressable onPress={() => setVisible(false)}>
                                <FontAwesome name="close" size={24} color="red" />
                            </Pressable>
                        </View>
                        <View className="mx-4 flex flex-row border-[#29435a] border-b-2 mb-4 pb-4 justify-between">
                            <View className="flex flex-row">
                                <View className={`${Object.keys(selected).length == 0 ? CATEGORIES.DEFAULT.bgColor + " " + CATEGORIES.DEFAULT.borderColor + " items-center justify-center " : CATEGORIES[selected.category].bgColor + " " + CATEGORIES[selected.category].borderColor} h-24 aspect-square p-2 rounded-md border mr-4`}>
                                    {Object.keys(selected).length == 0 ? 
                                        <FontAwesome name="question" size={24} color="gray" /> : 
                                        <Image className="w-full h-full" style={{resizeMode: 'contain'}}
                                        source={assets[selected.item.src]} />
                                    }
                                </View>
                                <View className="flex flex-col w-2/5">
                                    {Object.keys(selected).length == 0 ? 
                                        <Text className="text-white text-lg">No item selected</Text>
                                        :
                                        <>
                                        <Text className="text-white text-base mb-2" style={{lineHeight: 18}}>{selected.item.name}</Text>
                                        <Text className="text-white">+ {selected.item.points} {CATEGORIES[selected.category].icon}</Text>
                                        </>
                                    }
                                    
                                </View>
                            </View>
                            <View className="self-center">
                                <Pressable disabled={Object.keys(selected).length == 0} onPress={() => useItem()}>
                                    {({pressed}) => (
                                        <Text className={`px-4 py-2 ${Object.keys(selected).length == 0 ? "bg-[#888888]" : (pressed ? "bg-[#29435a]" : "bg-[#3C78AF]")} text-white`} >Use Item</Text>
                                    )}
                                    
                                </Pressable>
                            </View>
                        </View>
                        <View className="flex-auto items-center">
                        <Pressable onPress={() => {
                            setSelected({});
                        }}>
                            <FlatList
                            data={Object.keys(inventory)}
                            numColumns={3}
                            extraData={refreshFlatlist}
                            renderItem={({item}) => {
                                const [category, code] = item.split("-");
                                const count = inventory[item];
                                const current_item = Items[category][code];
                        
                                return ( 
                                    inventory[item] == 0 ? <></> :
                                <Pressable onPress={() => { 
                                    setSelected({item: current_item, category: category, id: item});
                                }}>
                                    <View className={`h-24 ${CATEGORIES[category].bgColor} ${CATEGORIES[category].borderColor} aspect-square p-2 rounded-md border m-2 relative`}>
                                        {Object.keys(current_item).length == 0 ? <></> :
                                        <Image className="w-full h-full" style={{resizeMode: 'contain'}}
                                        source={assets[current_item.src]} />}
                                        <View className="absolute -bottom-2 -right-2 rounded-full bg-white border-2 border-black h-8 w-8 justify-center items-center">
                                            <Text>{count}</Text>
                                        </View>
                                    </View>
                                </Pressable>
                                )
                            }} 
                        />
                        </Pressable>
                        
                        </View>
                    </View>
                </View>
            </Modal>
    );
}