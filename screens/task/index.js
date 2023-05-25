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
import Checkbox from "expo-checkbox";	
import { SelectList } from "react-native-dropdown-select-list";	
import { AntDesign, MaterialIcons, Entypo } from "@expo/vector-icons";	
import { NewItemModal } from "../../components/shared/newItemModal";	
import ReactChipsInput from "react-native-chips";	
import { Chips } from "../../components/task/chips";	
import { UserAuth } from "../../contexts/AuthContext";	
import { UserInfoContext } from "../../contexts/AuthContext";	
import { collection, addDoc, setDoc, doc, deleteDoc, Timestamp } from "firebase/firestore";	
import { db } from "../../lib/firebase";
import moment from "moment";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { DateTimePicker } from "../../components/task/datetimepicker";

const { width } = Dimensions.get("window");

const TASK_BG_COLORS = {
  1: '#3C78AF',
  2: '#766EB4',
  3: '#9166AD',
  4: '#AA5DA1',
  5: '#BD558F'
}

/* 
Notes:
Date today: 5/4/2023
Today: All tasks with due dates set to 5/4/2023
Overdue: tasks with due date set before 5/4/2023
Pending: Today's tasks + Overdue tasks 
Tomorrow: tasks with due date set to 5/5/2023
Next 7 Days: tasks with due date set to 5/4/2023 to 5/10/2023 (di siya necessarily Monday to Sunday, basta next 7 days)
Completed: All completed tasks
All: Overdue + All unfinished tasks (regardless of date)

Priority levels: [1,5] ?
5 - top priority
*/

const dummy_data = [
  {
    due_date: '2023-5-2 11:30', // overdue, pending, all
    // code for this date format: const date = new Date().toLocaleString();
    task_name: 'Exercise',
    priority: 1,
    date_completed: '', // blank means not yet completed
    tags: [
      "CS180", "Exercise"
    ],
    description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    reveal: 1
  },
  {
    due_date: '2023-5-25 11:30',  //today's, pending, all
    task_name: 'Exersfsfcise',
    priority: 5,
    date_completed: '',
    tags: [
      "CS180"
    ],
    description: 'adasdasdNeque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    reveal: 1
  },
  {
    due_date: '2023-5-25 11:30',  //completed
    task_name: 'aadfaewr',
    priority: 3,
    date_completed: '2023-5-1 11:30',
    tags: [
      "CS180"
    ],
    description: 'adasdasdNeque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    reveal: 1
  },
  {
    due_date: '2023-5-5 11:30',  //tomorrow, all
    task_name: 'sswfewr',
    priority: 4,
    date_completed: '',
    tags: [
      "CS180"
    ],
    description: 'adasdasdNeqqui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    reveal: 1
  },
  {
    due_date: '2023-5-25 11:30', //next 7 days, all
    task_name: 'Exersfsfcise',
    priority: 3,
    date_completed: '',
    tags: [
      "CS180"
    ],
    description: 'adasdasdNeque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
    reveal: 1
  },
  {
    due_date: '2023-5-30 11:30', // all
    task_name: 'sfsfz',
    priority: 2,
    date_completed: '',
    tags: [
      
    ],
    description: 'adasdaum quia dolor sit amet, consectetur, adipisci velit.',
    reveal: 1
  },
];

export function TaskScreen({ navigation }) {
  const [taskList, setTaskList] = React.useState([]);
  const [selected, setSelected] = React.useState("");
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [newItemModalVisible, setNewItemModalVisible] = React.useState(false);
  const [task, setTask] = React.useState("");	
  const [date, setDate] = React.useState("");	
  const [prio, setPrio] = React.useState("");	
  const [desc, setDesc] = React.useState("");	
  const [tags, setTags] = React.useState([]);
  let [option, setOption] = React.useState(0);
  const [placeholderTask, setPlaceholderTask] = React.useState("");
  const [placeholderDate, setPlaceholderDate] = React.useState("");
  const [placeholderPrio, setPlaceholderPrio] = React.useState(Number);
  const [placeholderTags, setPlaceholderTags] = React.useState([]);	
  const [placeholderDocId, setPlaceholderDocId] = React.useState("");
  const [placeholderDesc, setPlaceholderDesc] = React.useState("");

  const [visible, setVisible] = React.useState(false);
  const [isConfirmed, setConfirmation] = React.useState(false);

  const [openDate, setOpenDate] = React.useState(false);
  const [openTime, setOpenTime] = React.useState(false);

  const { user } = UserAuth();	
  const { tasks, setTasks } = React.useContext(UserInfoContext);	
  React.useEffect(() => {	
    if (tasks.length !== 0) { 
      checkInTimeList(tasks, "Pending");
    }
  }, []);

  const showConfirmDialog = (index) => {
    return Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
          onPress: () => {
            setVisible(false);
          },
        },

        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            setVisible(false);
            deleteTask(index);
          },
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  function checkInTimeList(task=taskList, filter=selected) {
    let li = [...task];
    li.sort((a, b) => {	
      const d1 = moment(a.due_date);	
      const d2 = moment(b.due_date);	
      return d1 - d2;	
    });

    for (let i = 0; i < li.length; i++) {
      let dueDate = li[i].due_date;
      let completedDate = li[i].date_completed;
      li[i].reveal = checkInTime(dueDate, completedDate, filter);
    }

    setTaskList(li);
    setTask(li);
  }

  function checkInTime(dueDate, completedDate, filter=selected) {
    let momentDate = moment(dueDate);
    if (filter == "Today") {
      return momentDate.isSame(moment(), 'date') && !completedDate;
    } 
    
    else if (filter == "Pending") {
      return momentDate.isSameOrBefore(moment(), 'date') && !completedDate;
    } 
    
    else if (filter == "Overdue") {
      return momentDate.isBefore(moment(), 'date') && !completedDate;
    } 
    
    else if (filter == "Tomorrow") {
      return momentDate.isSame(moment().add(1, 'day'), 'date') && !completedDate;
    } 
    
    else if (filter == "Next 7 Days") {
      return momentDate.isSameOrBefore(moment().add(7, 'day'), 'date') && momentDate.isSameOrAfter(moment(), 'date') && !completedDate;
    } 
    
    else if (filter == "Completed") {
      return !completedDate ? false : true;
    } 
    
    else {
      return true;
    }
  }

  const clear = () => {
    setTask("");	
    setDate("");	
    setPrio("");	
    setTags([]);	
    setDesc("");
    setPlaceholderTask("");	
    setPlaceholderDate("");	
    setPlaceholderPrio("");	
    setPlaceholderTags([]);	
    setPlaceholderDesc("");
  }

  const handleAddTask = async () => {
    Keyboard.dismiss();
    const new_task = {
      due_date: date,
      task_name: task,
      priority: prio,
      date_completed: "",	
      tags: tags,
      description: desc,
    };
    	
    const docRef = await addDoc(	
      collection(db, "users", user.uid, "tasks"),	
      new_task	
    );	
    new_task.id = docRef.id;	
    new_task.reveal = checkInTime(date, "");
    let li = [...taskList, new_task];	
    checkInTimeList(li);
    clear();
    setModalVisible(false);
  };

  const handleUpdatedTask = async (index) => {
    Keyboard.dismiss();
    let li = [...taskList];
    
    li[index].task_name = placeholderTask;
    li[index].due_date = placeholderDate;
    li[index].priority = placeholderPrio;
    li[index].tags = placeholderTags;
    li[index].description = placeholderDesc;
    li[index].reveal = checkInTime(placeholderDate, li[index].date_completed);

    try {	
      await setDoc(doc(db, "users", user.uid, "tasks", placeholderDocId), {	
        task_name: placeholderTask,	
        due_date: placeholderDate,	
        priority: placeholderPrio,	
        tags: placeholderTags,	
        description: placeholderDesc,	
      });	
    } catch (err) {	
      console.log(err);	
    }

    checkInTimeList(li);
    clear();
    setModalVisible(false);
  };
  
  const deleteTask = async (index) => {
    await deleteDoc(doc(db, "users", user.uid, "tasks", taskList[index].id));
    let tasksCopy = [...taskList];
    tasksCopy.splice(index, 1);
    setTaskList(tasksCopy);
    setTasks(tasksCopy);
  };

  const editTask = (index) => {
    console.log("edit date", taskList[index].due_date);
    setModalVisible(true);
    setPlaceholderTask(taskList[index].task_name);
    setPlaceholderDate(taskList[index].due_date);
    setPlaceholderPrio(taskList[index].priority);
    setPlaceholderTags(taskList[index].tags);	
    setPlaceholderDocId(taskList[index].id);
    setPlaceholderDesc(taskList[index].description);
  };

  const checkTask = (index) => {
    console.log("check date", taskList[index].due_date);
    setModalVisible(true);
    setPlaceholderTask(taskList[index].task_name);
    setPlaceholderDate(taskList[index].due_date);
    setPlaceholderPrio(taskList[index].priority);
    setPlaceholderTags(taskList[index].tags);
    setPlaceholderDesc(taskList[index].description);
  };

  const makeGlobal = (index) => {
    global.index = index;
  };

  const onCheck = async (index) => {	
    const temp = [...taskList];	
    if (temp[index].date_completed == "") {	
      const datenow = Timestamp.now()	
      await setDoc(doc(db, "users", user.uid, "tasks", temp[index].id), {	
        date_completed: datenow	
      }, {merge: true});	
      temp[index].date_completed = datenow;	
      temp[index].reveal = checkInTime(temp[index].due_date, datenow);
      setNewItemModalVisible(true);	
    } else {	
      await setDoc(doc(db, "users", user.uid, "tasks", temp[index].id), {	
        date_completed: ""	
      }, {merge: true});	
      temp[index].date_completed = "";	
      temp[index].reveal = checkInTime(temp[index].due_date, "");
    }	
    setTaskList(temp);	
    setTask(temp);
  };

  const dateData = [
    {key:'1', value:'All'}, // added to include tasks with due date ahead of 8 days from today
    {key:'2', value:'Today'},
    {key:'3', value:'Pending'},
    {key:'4', value:'Overdue'},
    {key:'5', value:'Tomorrow'},
    {key:'6', value:'Next 7 Days'}, // changed from This Week
    {key:'7', value:'Completed'},
]

  const prioData = [
    {key:'1', value:1},
    {key:'2', value:2},
    {key:'3', value:3},
    {key:'4', value:4},
    {key:'5', value:5},
  ];

    return (
      <>
        <NewItemModal
          visible={newItemModalVisible}
          setVisible={setNewItemModalVisible}
          action={"TASK"}
        />
        <View
          style={{ paddingHorizontal: 10, paddingVertical: 15, flex: 1 }}
          className="bg-[#232528]"
        >
          <SelectList
            setSelected={(val) => setSelected(val)}
            search={false}
            placeholder="Pending"
            defaultOption={{key:'3', value:'Pending'}}
            data={dateData}
            save="value"
            boxStyles={{ backgroundColor: "#EE7A77", borderColor: "#EE7A77" }}
            inputStyles={{ color: "white", fontWeight: "bold", fontSize: 18 }}
            dropdownStyles={{ backgroundColor: "#0f0f0f" }}
            dropdownItemStyles={{ backgroundColor: "#0f0f0f" }}
            dropdownTextStyles={{ backgroundColor: "#0f0f0f", color: "white" }}
            onSelect={() => checkInTimeList()}
          />

          <View style={{ paddingBottom: 35, flex: 1 }}>
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              {taskList.map((item, index) => {
                const isChecked = !item.date_completed ? false : true;
                const taskBgColor = isChecked ? '#161819' : TASK_BG_COLORS[item.priority];
                if (item.reveal) {
                  return (
                    <View style={styles.container} key={index}>
                      <View
                        style={[styles.taskContainer, {backgroundColor: taskBgColor}]}
                      >
                        <View className="flex flex-row">
                          <Checkbox
                            className="mr-2 border-white"
                            color={isChecked ? "#161819" : `${taskBgColor}`}
                            value={isChecked}
                            onValueChange={() => onCheck(index)}
                          />
                          <Text
                            className={`text-white text-base ${
                              isChecked ? "line-through" : ""
                            }`}
                          >
                            {item.task_name}
                          </Text>
                        </View>
                        <View className="flex flex-row gap-2">
                          <TouchableOpacity
                            key={3 * index}
                            onPress={() => {
                              checkTask(index);
                              setOption(2);
                              makeGlobal(index);
                            }}
                          >
                            <AntDesign name="eyeo" size={22} color="#fff" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            key={3 * index + 1}
                            onPress={() => {
                              editTask(index);
                              setOption(1);
                              makeGlobal(index);
                            }}
                          >
                            <AntDesign name="edit" size={22} color="#fff" />
                          </TouchableOpacity>
                          <TouchableOpacity
                            key={3 * index + 2}
                            onPress={() => showConfirmDialog(index)}
                          >
                            <MaterialIcons
                              name="delete"
                              size={22}
                              color="#fff"
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  );
                }
              })}
            </ScrollView>
          </View>

          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setOption(0);
            }}
          >
            <AntDesign
              style={styles.plus}
              name="plussquare"
              size={40}
              color="#3C78AF"
            />
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent
            visible={isModalVisible}
            presentationStyle="overFullScreen"
            onDismiss={() => setModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-[#000000bb]">
              <View className="flex h-3/5 w-5/6 bg-[#232528] p-4 rounded">
                <View className="flex flex-grow">
                  <ScrollView
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                  >
                    <Text className="text-[16px] my-2 text-white">
                      Task Name
                    </Text>
                    {option === 0 && (
                      <TextInput
                        placeholder="Enter something..."
                        value={task}
                        className="w-full px-2 py-2 rounded-md border-[#ffffff55] border text-white"
                        placeholderTextColor={"#ffffffaa"}
                        onChangeText={(text) => setTask(text)}
                      />
                    )}
                    {option === 1 && (
                      <TextInput
                        value={placeholderTask}
                        className="w-full px-2 py-2 rounded-md border-[#ffffff55] border text-white"
                        onChangeText={(text) => setPlaceholderTask(text)}
                      />
                    )}
                    {option === 2 && (
                      <TextInput
                        value={placeholderTask}
                        className="w-full px-2 py-2 rounded-md border-[#ffffff55] border text-white"
                        readOnly={true}
                      />
                    )}
                    <View className="flex flex-row justify-between">
                      <View className="flex w-3/4">
                        <Text className="text-[16px] my-2 text-white">
                          Date Due
                        </Text>
                        {option === 0 && (
                          <DateTimePicker date={date} setDate={setDate} />
                        )}
                        {option === 1 && (
                          <DateTimePicker
                            date={placeholderDate}
                            setDate={setPlaceholderDate}
                          />
                        )}
                        {option === 2 && (
                          <DateTimePicker
                            date={placeholderDate}
                            setDate={setPlaceholderDate}
                            readonly={true}
                          />
                        )}
                      </View>
                      <View className="flex w-1/5">
                        <Text className="text-[16px] my-2 text-white">
                          Priority
                        </Text>
                        <View className="z-50">
                          {option === 0 && (
                            <SelectList
                              defaultOption={{ key: "1", value: 1 }}
                              setSelected={(val) => setPrio(val)}
                              boxStyles={styles.taskPrio}
                              inputStyles={{ color: "white" }}
                              dropdownStyles={styles.taskDrop}
                              dropdownTextStyles={{ color: "white" }}
                              arrowicon={
                                <Entypo
                                  name="chevron-down"
                                  size={12}
                                  color="white"
                                />
                              }
                              search={false}
                              data={prioData}
                            />
                          )}
                          {option === 1 && (
                            <SelectList
                              setSelected={(val) => setPlaceholderPrio(val)}
                              boxStyles={styles.taskPrio}
                              inputStyles={{ color: "white" }}
                              dropdownStyles={styles.taskDrop}
                              dropdownTextStyles={{ color: "white" }}
                              arrowicon={
                                <Entypo
                                  name="chevron-down"
                                  size={12}
                                  color="white"
                                />
                              }
                              search={false}
                              placeholder={placeholderPrio}
                              data={prioData}
                            />
                          )}
                          {option === 2 && (
                            <TextInput
                              value={placeholderPrio}
                              className="w-full px-2 py-2 rounded-md border-[#ffffff55] border text-white"
                              readOnly={true}
                            />
                          )}
                        </View>
                      </View>
                    </View>
                    <Text className="text-[16px] my-2 text-white">Tags</Text>
                    {(option === 0 || option === 1) && (
                      <View className="-pt-[18px] -mt-[36px] -z-10">
                        <ReactChipsInput
                          label=" "
                          initialChips={option == 0 ? tags : placeholderTags}
                          onChangeChips={(chips) =>
                            option == 0
                              ? setTags(chips)
                              : setPlaceholderTags(chips)
                          }
                          chipStyle={{ backgroundColor: "#ffffff55" }}
                          inputStyle={{
                            fontSize: 16,
                            borderColor: "#ffffff55",
                            borderRadius: 5,
                            borderWidth: 1,
                            marginBottom: 4,
                            color: "#fff",
                          }}
                          labelStyle={{ display: "none" }}
                          labelOnBlur={{ display: "none" }}
                        />
                      </View>
                    )}
                    {option === 2 && placeholderTags && (
                      <View className="flex flex-row flex-wrap">
                        {placeholderTags.map((item, index) => {
                          return <Chips value={item} key={index} />;
                        })}
                      </View>
                    )}
                    <Text className="text-[16px] my-2 text-white">
                      Task Description
                    </Text>
                    {option === 0 && (
                      <TextInput
                        placeholder="Enter something..."
                        multiline
                        value={desc}
                        textAlignVertical="top"
                        className="border  border-[#ffffff55] text-white rounded-md h-2/5 p-2 -z-10"
                        placeholderTextColor={"#ffffffaa"}
                        onChangeText={(desc) => setDesc(desc)}
                      />
                    )}
                    {option === 1 && (
                      <TextInput
                        value={placeholderDesc}
                        multiline
                        textAlignVertical="top"
                        className="border  border-[#ffffff55] text-white rounded-md h-2/5 p-2 -z-10"
                        placeholderTextColor={"#ffffffaa"}
                        onChangeText={(desc) => setPlaceholderDesc(desc)}
                      />
                    )}
                    {option === 2 && (
                      <TextInput
                        value={placeholderDesc}
                        multiline
                        textAlignVertical="top"
                        className="border  border-[#ffffff55] text-white rounded-md h-2/5 p-2 -z-10"
                        placeholderTextColor={"#ffffffaa"}
                        readOnly={true}
                      />
                    )}
                  </ScrollView>
                </View>
                <View className="flex flex-row justify-between">
                  <Button
                    title="Close"
                    onPress={() => {
                      clear();
                      setModalVisible(false);
                    }}
                    color="#3C78AF"
                  />
                  <View style={{ width: 150 }} />
                  {option === 0 && (
                    <Button
                      title="Add Task"
                      onPress={() => {
                        handleAddTask();
                      }}
                      color="#3C78AF"
                    />
                  )}
                  {option === 1 && (
                    <Button
                      title="Edit Task"
                      onPress={() => {
                        handleUpdatedTask(global.index);
                      }}
                      color="#3C78AF"
                    />
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </>
    );	
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  index: {
    color: "#fff",
    fontSize: 20,
  },
  taskContainer: {
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 5,
    minHeight: 50,
    marginTop: 20,
  },
  task: {
    color: "#fff",
    width: "90%",
    fontSize: 16,
  },
  check: {
    marginLeft: -50,
  },
  edit: {
    marginLeft: -25,
  },
  delete: {
    marginLeft: 0,
  },
  plus: {
    position: "absolute",
    bottom: -5,
    right: 0,
  },
  viewWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    elevation: 5,
    transform: [{ translateX: -(width * 0.4) }, { translateY: -250 }],
    height: 500,
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  taskName: {
    width: "85%",
    height: "7.5%",
    position: "absolute",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 8,
    top: 40,
  },
  taskDate: {
    width: "55%",
    height: "7.5%",
    position: "absolute",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 8,
    top: 120,
    left: 25,
  },
  taskPrio: {
    borderRadius: 5,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 8,
    paddingLeft: 12,
    borderColor: "#ffffff55",
    borderWidth: 1,
    color: "white"
  },
  taskPrioView: {
    width: "22.5%",
    height: "7.5%",
    position: "absolute",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 8,
    top: 120,
    left: 215,
  },
  taskDrop: {
    position: "absolute",
    top: 30,
    borderRadius: 5,
    backgroundColor: "#232528",
    zIndex: 999,
    elevation: 999,
  },
  taskDesc: {
    width: "85%",
    height: "30%",
    position: "absolute",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 8,
    top: 280,
  },
  container: {
    flexDirection: "row",
  },
  index: {
    color: "#fff",
    fontSize: 20,
  },
  taskContainer: {
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 5,
    minHeight: 50,
    marginTop: 20,
  },
});

LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();
