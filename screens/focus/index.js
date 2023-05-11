import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import {
	useCountdown,
	CountdownCircleTimer,
} from "react-native-countdown-circle-timer";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";

export function FocusScreen({ navigation }) {
	const [isPaused, setIsPaused] = React.useState(true);
	const togglePause = () => {
		setIsPaused(!isPaused);
	};
	const [key, setKey] = React.useState(0);
	const children = ({ remainingTime }) => {
		if (remainingTime === 0) {
			return `Time's up!`;
		}
		const minutes = Math.floor(remainingTime / 60);
		const seconds = remainingTime % 60;
		if (seconds <= 9) {
			return `${minutes}:0${seconds}`;
		} else return `${minutes}:${seconds}`;
	};

	return (
		<View style={styles.container}>
			<CountdownCircleTimer
				key={key}
				size={280}
				strokeWidth={20}
				duration={10}
				colors={["#439cfb", "#E5203E", "#FFFFFF"]}
				colorsTime={[10, 0.0001, 0]}
				isPlaying={!isPaused}
				trailColor="#111010"
				trailStrokeWidth={7}
				rotation="counterclockwise"
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
						name="md-reload-circle"
						title="Restart"
						onPress={() => {
							setKey((prevKey) => prevKey + 1);
							setIsPaused(true);
						}}
						size={80}
						color={"#111010"}
					/>
				</View>
			</View>
		</View>
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
