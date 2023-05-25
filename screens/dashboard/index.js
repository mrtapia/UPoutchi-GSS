import * as React from "react";
import { useState, useCallback } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { BarChart } from "react-native-chart-kit";
import DropDownPicker from "react-native-dropdown-picker";
import moment from "moment";

import { UserAuth } from "../../contexts/AuthContext";
import { UserInfoContext } from "../../contexts/AuthContext";

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
import { db } from "../../lib/firebase";

/* 
Notes:
- should only display completed tasks.
- blank date_completed means task is not yet done
*/

const chartConfig = {
  backgroundColor: "#0000000",
  backgroundGradientFrom: "#022173",
  backgroundGradientTo: "#1b3fa0",
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  barPercentage: 0.35,
};

export function DashboardScreen({ navigation }) {
  const data1 = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [90, 45, 28, 80, 62, 43],
      },
    ],
  };
  const data2 = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [46, 21, 69, 34, 11, 52],
      },
    ],
  };

  const { user } = UserAuth();

  const [completedTask, setCompletedTask] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });
  const [completedSessions, setCompletedSessions] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  const [openTask, setTaskOpen] = useState(false);
  const [value, setValue] = useState(1);
  const [items, setItems] = useState([
    { label: "Daily", value: "1" }, // removed weekly (para mas maadali)
    { label: "Monthly", value: "2" },
    { label: "Yearly", value: "3" },
  ]);

  const [openFocus, setFocusOpen] = useState(false);
  const [value1, setValue1] = useState(1);
  const [items1, setItems1] = useState([
    { label: "Daily", value: "1" },
    { label: "Monthly", value: "2" },
    { label: "Yearly", value: "3" },
  ]);
  const onTaskOpen = useCallback(() => {
    setFocusOpen(false);
  }, []);

  const onFocusOpen = useCallback(() => {
    setTaskOpen(false);
  }, []);

  const width = Dimensions.get("window").width - 30;
  const height = 200;

  const getDailyTasks = async () => {
    const today = moment();
    const labels = [];
    for (let i = 0; i < 7; i++) {
      labels[i] = today.day(i).format("MM/D");
    }
    let dataset = [{ data: [0, 0, 0, 0, 0, 0, 0] }];

    let q = query(
      collection(db, "users", user.uid, "tasks"),
      where("date_completed", "!=", ""),
      where("date_completed", ">=", new Date(today.startOf("week"))),
      where("date_completed", "<=", new Date(today.endOf("week")))
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      let day = moment(data.date_completed.seconds).day();
      dataset[0].data[day] += 1;
    });
    setCompletedTask({
      labels: labels,
      datasets: dataset,
    });
  };

  const getDailySessions = async () => {
    const today = moment();
    const labels = [];
    for (let i = 0; i < 7; i++) {
      labels[i] = today.day(i).format("MM/D");
    }
    let dataset = [{ data: [0, 0, 0, 0, 0, 0, 0] }];

    let q = query(
      collection(db, "users", user.uid, "sessions"),
      where("date", ">=", new Date(today.startOf("week"))),
      where("date", "<=", new Date(today.endOf("week")))
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      let day = moment(data.date.toDate()).day();
      dataset[0].data[day] += 1;
    });
    setCompletedSessions({
      labels: labels,
      datasets: dataset,
    });
  };

  const getMonthlyTasks = async () => {
    const today = moment();
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let dataset = [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }];

    let q = query(
      collection(db, "users", user.uid, "tasks"),
      where("date_completed", "!=", ""),
      where("date_completed", ">=", new Date(today.startOf("year"))),
      where("date_completed", "<=", new Date(today.endOf("year")))
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      let month = moment(data.date_completed.toDate()).get("month");
      dataset[0].data[month] += 1;
    });
    setCompletedTask({
      labels: labels,
      datasets: dataset,
    });
  };

  const getMonthlySessions = async () => {
    const today = moment();
    const labels = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let dataset = [{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }];

    let q = query(
      collection(db, "users", user.uid, "sessions"),
      where("date", ">=", new Date(today.startOf("year"))),
      where("date", "<=", new Date(today.endOf("year")))
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      let month = moment(data.date.toDate()).get("month");
      dataset[0].data[month] += 1;
    });
    setCompletedSessions({
      labels: labels,
      datasets: dataset,
    });
  };

  const getYearlyTasks = async () => {
    const start = moment().subtract(4, "year").startOf("year");
    const end = moment().add("2", "year").endOf("year");
    const labels = [];
    for (let i = 0; i < 4; i++) {
      labels[i] = moment()
        .subtract(4 - i, "year")
        .year();
    }
    labels[4] = moment().year();

    let dataset = [{ data: [0, 0, 0, 0, 0] }];

    let q = query(
      collection(db, "users", user.uid, "tasks"),
      where("date_completed", "!=", ""),
      where("date_completed", ">=", new Date(start)),
      where("date_completed", "<=", new Date(end))
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      let year = moment(data.date_completed.toDate()).get("year");
      dataset[0].data[labels.indexOf(year)] += 1;
    });
    setCompletedTask({
      labels: labels,
      datasets: dataset,
    });
  };

  const getYearlySessions = async () => {
    const start = moment().subtract(4, "year").startOf("year");
    const end = moment().add("2", "year").endOf("year");
    const labels = [];
    for (let i = 0; i < 4; i++) {
      labels[i] = moment()
        .subtract(4 - i, "year")
        .year();
    }
    labels[4] = moment().year();

    let dataset = [{ data: [0, 0, 0, 0, 0] }];

    let q = query(
      collection(db, "users", user.uid, "sessions"),
      where("date", ">=", new Date(start)),
      where("date", "<=", new Date(end))
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      let year = moment(data.date.toDate()).get("year");
      dataset[0].data[labels.indexOf(year)] += 1;
    });
    setCompletedSessions({
      labels: labels,
      datasets: dataset,
    });
  };

  React.useEffect(() => {
    getDailyTasks();
    getDailySessions();
  }, []);

  React.useEffect(() => {
    if (value == 1) getDailyTasks();
    else if (value == 2) getMonthlyTasks();
    else getYearlyTasks();
  }, [value]);

  React.useEffect(() => {
    if (value1 == 1) getDailySessions();
    else if (value1 == 2) getMonthlySessions();
    else getYearlySessions();
  }, [value1]);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Tasks Completed</Text>
          <View>
            <DropDownPicker
              style={styles.dropdown}
              placeholder="Daily"
              open={openTask}
              onOpen={onTaskOpen}
              value={value}
              items={items}
              setOpen={setTaskOpen}
              setValue={setValue}
              setItems={setItems}
              placeholderStyle={{
                color: "white",
                fontWeight: "bold",
              }}
              textStyle={{
                fontSize: 18,
                color: "white",
                fontWeight: "bold",
              }}
              dropDownContainerStyle={{
                width: 120,
                backgroundColor: "#0f0f0f",
              }}
              listMode="SCROLLVIEW"
            />
          </View>
        </View>
        <BarChart
          width={width}
          height={height}
          data={completedTask}
          fromZero="True"
          chartConfig={chartConfig}
          style={styles.graphStyle}
        />
        <View style={styles.message}>
          <Text style={styles.messageText}>
            You have accomplished your goal for the month.
          </Text>
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Focus Sessions</Text>
          <View>
            <DropDownPicker
              style={styles.dropdown}
              placeholder="Daily"
              open={openFocus}
              onOpen={onFocusOpen}
              value={value1}
              items={items1}
              setOpen={setFocusOpen}
              setValue={setValue1}
              setItems={setItems1}
              placeholderStyle={{
                color: "white",
                fontWeight: "bold",
              }}
              textStyle={{
                fontSize: 18,
                color: "white",
                fontWeight: "bold",
              }}
              dropDownContainerStyle={{
                width: 120,
                backgroundColor: "#0f0f0f",
              }}
              listMode="SCROLLVIEW"
            />
          </View>
        </View>
        <BarChart
          width={width}
          height={height}
          data={completedSessions}
          fromZero="True"
          chartConfig={chartConfig}
          style={styles.graphStyle}
        />
        <View style={styles.message}>
          <Text style={styles.messageText}>
            You're on a 3-week productivity streak. Keep it up!
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#232528",
    flex: 1,
    justifyContent: "center",
  },
  section: {
    backgroundColor: "#232528",
    flex: 1,
    marginBottom: 10,
  },
  header: {
    zIndex: 3,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginHorizontal: 10,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 25,
    color: "white",
  },
  graphStyle: {
    zIndex: 2,
    marginVertical: 8,
    alignItems: "center",
    ...chartConfig.style,
  },
  dropdown: {
    width: 120,
    borderRadius: 18,
    backgroundColor: "#EE7A77",
  },
  message: {
    marginVertical: 5,
    backgroundColor: "#0f0f0f",
    marginHorizontal: 15,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  messageText: {
    marginHorizontal: 15,
    color: "white",
    fontSize: 15,
  },
});
