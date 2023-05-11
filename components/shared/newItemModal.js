import React, { useEffect, useContext, useState } from 'react';
import { View, Text, Pressable, Modal, Image, ActivityIndicator } from 'react-native';
import { useAssets } from 'expo-asset';
import { Items, getCategories } from '../../lib/Items';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import Chooser from 'random-seed-weighted-chooser';
import { db } from '../../lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { UserAuth, UserInfoContext } from '../../contexts/AuthContext';

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
};

export function NewItemModal({visible, setVisible, action}) {
    const { user } = UserAuth();
    const {updateInventory} = useContext(UserInfoContext);
    const [isLoading, setIsLoading] = useState(false);
    const [newItem, setNewItem] = useState({});
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

    const randomize = () => {
        const category_list = Object.keys(Items).map((key) => {return {category: key, weight: 1}});
        const CAT = Chooser.chooseWeightedObject(category_list);
        const item_list = Object.keys(Items[CAT.category]).map((key) => {
            return {
                category: CAT.category,
                code: CAT.category + '-' + key,
                value: Items[CAT.category][key],
                weight: Items[CAT.category][key].weight
            }
        });
        const ITEM = Chooser.chooseWeightedObject(item_list);
        setNewItem({category: ITEM.category, code: ITEM.code, src: ITEM.value.src});
    }

    const addItem = async () => {
        if (isLoading) return;
        setIsLoading(true);
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
            let data = docSnap.data();
            if (newItem.code in data.inventory) {
                data.inventory[newItem.code] = data.inventory[newItem.code] + 1;
            } else {
                data.inventory[newItem.code] = 1;
            }
            await updateDoc(userRef, {
                inventory: data.inventory
            });
            updateInventory(data.inventory);
        }
        setIsLoading(false);
        setVisible(false);
    }

    useEffect(() => {
        if (visible) randomize();
    }, [visible]);

    return (
        <Modal visible={visible} transparent onRequestClose={() => setVisible(false)}>
            <View className="flex-auto bg-[#000000bb] items-center justify-center">
                <View className="h-1/4 w-5/6 bg-[#232528] rounded-lg">
                    <View className="flex flex-col justify-center items-center my-4">
                        <Text className="text-white text-2xl font-bold">{action} COMPLETED</Text>
                        <Text className="text-white text-base">You received an item!</Text>
                        { Object.keys(newItem).length == 0 ? <></> : 
                            <View className={`h-24 ${CATEGORIES[newItem.category].bgColor} ${CATEGORIES[newItem.category].borderColor} aspect-square p-2 rounded-md border m-2 relative`}>
                                {assets ? <Image className="w-full h-full" style={{resizeMode: 'contain'}}
                                source={assets[newItem.src]} /> : <></>}
                            </View>
                        }
                        <View className="w-1/4 my-2 h-[30px]">
                            <Pressable className="flex place-content-center place-items-center justify-center items-center" onPress={() => addItem()}>
                                {({pressed}) => (
                                    <View className={`w-full h-full items justify-center items-center ${(pressed ? "bg-[#29435a]" : "bg-[#3C78AF]")}`}>
                                        {
                                            isLoading ? 
                                            <ActivityIndicator className="w-full h-full bg-[#3C78AF]" color="white" size={'small'}/> : 
                                            <Text className="text-white"> OK </Text>
                                        }
                                    </View>  
                                )}
                            </Pressable>
                        </View>
                        
                    </View>
                </View>
            </View>
        </Modal>
    );
}