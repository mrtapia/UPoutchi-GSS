import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Modal, Image, FlatList, Animated, Easing, ActivityIndicator } from 'react-native';
import { useAssets } from 'expo-asset';
import { Items, getCategories } from '../../lib/Items';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { db } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { UserAuth, UserInfoContext } from '../../contexts/AuthContext';

const CATEGORIES = getCategories();

export function Inventory({ 
    visible, setVisible
}) {
    const {inventory, updateInventory, stats, updateStats} = useContext(UserInfoContext);
    const {user} = UserAuth();
    const [isLoading, setIsLoading] = useState(false);
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

    const updateValues = async () => {
        setIsLoading(true);
        const datenow = new Date().toLocaleString();
        const userRef = doc(db, "users", user.uid);
        
        let temp_inventory = inventory;
        let temp_stats = stats;
        temp_inventory[itemUsed.current.id]--;
        let prev, new_val;
        if (itemUsed.current.category == "EN") {
            prev = stats.EN.value;
            new_val = prev + itemUsed.current.item.points > 100 ? 100 : prev + itemUsed.current.item.points;
            temp_stats["EN"] = {
                value: new_val,
                updated: datenow
            };
            await updateDoc(userRef, {
                "stats.EN": temp_stats["EN"]
            });
        } else if (itemUsed.current.category == "HE") {
            prev = stats.HE.value;
            new_val = prev + itemUsed.current.item.points > 100 ? 100 : prev + itemUsed.current.item.points;
            temp_stats["HE"] = {
                value: new_val,
                updated: datenow
            };
            await updateDoc(userRef, {
                "stats.HE": temp_stats["HE"]
            });
            
        } else if (itemUsed.current.category == "HU") {
            prev = stats.HU.value;
            new_val = prev + itemUsed.current.item.points > 100 ? 100 : prev + itemUsed.current.item.points;
            temp_stats["HU"] = {
                value: new_val,
                updated: datenow
            };
            await updateDoc(userRef, {
                "stats.HU": temp_stats["HU"]
            });
        } else {
            prev = stats.HY.value;
            new_val = prev + itemUsed.current.item.points > 100 ? 100 : prev + itemUsed.current.item.points;
            temp_stats["HY"] = {
                value: new_val,
                updated: datenow
            };
            await updateDoc(userRef, {
                "stats.HY": temp_stats["HY"]
            });
        }
        if (temp_inventory[itemUsed.current.id] == 0) {
            setSelected({});
            delete temp_inventory[itemUsed.current.id];
            await updateDoc(userRef, {
                inventory: temp_inventory
            });
            setRefreshFlatList(!refreshFlatlist);
        }
        updateStats(temp_stats);
        updateInventory(temp_inventory);
        itemUsed.current = {};
        setIsLoading(false);
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
                        { assets && stats && stats.HE && stats.HU && stats.HY && stats.EN && inventory && !isLoading ?
                        <>
                            <View className="my-4 pb-4 mx-4 flex flex-row justify-between border-b-2 border-[#29435a]">
                                <View className="flex flex-row">
                                    <View className="flex flex-col items-center mr-4 relative">
                                        <View className="flex flex-row gap-1">
                                            <Entypo name="heart" size={24} color="#3C78AF" />
                                            <Text className="text-white text-lg">{stats.HE.value}</Text>
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
                                            <Text className="text-white text-lg">{stats.HU.value}</Text>
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
                                            <Text className="text-white text-lg">{stats.HY.value}</Text>
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
                                            <Text className="text-white text-lg">{stats.EN.value}</Text>
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
                        </>
                        :  <ActivityIndicator className="flex-1" color="#3C78AF" size={'large'}/> }
                        
                        
                    </View>
                </View>
            </Modal>
    );
}