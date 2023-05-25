import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Ionicons } from "@expo/vector-icons";
import { NewItemModal } from "../../components/shared/newItemModal";

import { UserAuth } from "../../contexts/AuthContext";
import { UserInfoContext } from "../../contexts/AuthContext";

import {
	collection,
	addDoc,
	setDoc,
	doc,
	deleteDoc,
	Timestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export function FocusScreen({ navigation }) {
	const { user } = UserAuth();
	const { sessions, setSessions } = React.useContext(UserInfoContext);

	const [isPaused, setIsPaused] = React.useState(true);
	const [isStart, setIsStart] = React.useState(true);
	const [newItemModalVisible, setNewItemModalVisible] = React.useState(false);
	const time = React.useRef(0);

	const stopHandler = async () => {
		await addDoc(collection(db, "users", user.uid, "sessions"), {
			time: time.current,
			date: Timestamp.now(),
		});
		setSessions([...sessions, { time: time.current, date: datenow }]);
	};

	const togglePause = () => {
		if (isStart) setIsStart(false);
		setIsPaused(!isPaused);
	};
	const [key, setKey] = React.useState(0);
	const children = ({ remainingTime }) => {
		if (remainingTime === 0) {
			setNewItemModalVisible(true);
			stopHandler();
			return `Time's up!`;
		}
		time.current = 1500 - remainingTime;
		const minutes = Math.floor(remainingTime / 60);
		const seconds = remainingTime % 60;
		if (seconds <= 9) {
			return `${minutes}:0${seconds}`;
		} else return `${minutes}:${seconds}`;
	};

	return (
		<>
			<NewItemModal
				visible={newItemModalVisible}
				setVisible={setNewItemModalVisible}
				action={"SESSION"}
			/>
			<View style={styles.container}>
				<CountdownCircleTimer
					key={key}
					size={280}
					strokeWidth={20}
					duration={1500}
					colors={["#439cfb", "#E5203E", "#FFFFFF"]}
					colorsTime={[1500, 0.0001, 0]}
					isPlaying={!isPaused}
					trailColor="#111010"
					trailStrokeWidth={7}
					rotation="counterclockwise"
					onComplete={() => {
						return { shouldRepeat: true, delay: 0.5 };
					}}
				>
					{({ remainingTime, color }) => (
						<Text style={{ fontSize: 50, fontWeight: "bold", color }}>
							{children({ remainingTime })}
						</Text>
					)}
				</CountdownCircleTimer>
				<View style={{ flexDirection: "row", marginTop: 20 }}>
					<View style={styles.btnContainer}>
						<Ionicons
							name={isPaused ? "md-play-circle" : "md-pause-circle"}
							title={isPaused ? "Resume" : "Pause"}
							onPress={togglePause}
							size={80}
							color={isPaused ? "#439cfb" : "#E5203E"}
						/>
					</View>
					<View style={styles.btnContainer}>
						<Ionicons
							name="stop"
							title="Stop"
							disabled={isStart}
							onPress={() => {
								setNewItemModalVisible(true);
								setIsPaused(true);
								setIsStart(true);
								stopHandler();
								setKey((prevKey) => prevKey + 1);
							}}
							size={80}
							color={isStart ? "#111010" : "#E5203E"}
						/>
					</View>
					<View style={styles.btnContainer}>
						<Ionicons
							name="md-reload-circle"
							title="Restart"
							onPress={() => {
								setKey((prevKey) => prevKey + 1);
								setIsPaused(true);
								setIsStart(true);
							}}
							size={80}
							color={"#111010"}
						/>
					</View>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#232528",
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	heading: {
		fontSize: 30,
		color: "#FFFFFF",
		marginBottom: 50,
	},
	btnContainer: {
		marginHorizontal: 20,
	},
	timeRemaining: {
		fontSize: 50,
		fontWeight: "bold",
		color: "white",
	},
});
