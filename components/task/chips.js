import React from "react";
import { View, Text } from "react-native";

export const Chips = ({value}) => {
    return (
        <View className="border-[#3C78AF] border-1 border m-[2px] py-[5px] px-[5px] rounded-[15px] bg-[#3C78AF]">
            <Text style={[{ paddingHorizontal: 5, color: "white" }]}>{value}</Text>
        </View>
    )
}