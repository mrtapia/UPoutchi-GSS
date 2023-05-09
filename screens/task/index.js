import * as React from 'react';
import { StyleSheet, View, Pressable, Text, Image, 
  TouchableOpacity, Keyboard, ScrollView, Modal, 
  TextInput, Button, Dimensions, LogBox } from 'react-native';
import Checkbox from 'expo-checkbox';
import { SelectList } from 'react-native-dropdown-select-list';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { NewItemModal } from '../../components/shared/newItemModal';

const { width } = Dimensions.get("window");

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
    due_date: '5/2/2023, 11:30:00 AM', // overdue, pending, all
    // code for this date format: const date = new Date().toLocaleString();
    task_name: 'Exercise',
    priority: 1,
    date_completed: '', // blank means not yet completed
    tags: [
      "CS180", "Exercise"
    ],
    description: 'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.'
  },
  {
    due_date: '5/4/2023, 11:30:00 AM',  //today's, pending, all
    task_name: 'Exersfsfcise',
    priority: 5,
    date_completed: '',
    tags: [
      "CS180"
    ],
    description: 'adasdasdNeque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.'
  },
  {
    due_date: '5/1/2023, 11:30:00 AM',  //completed
    task_name: 'aadfaewr',
    priority: 3,
    date_completed: '5/1/2023 11:30:00 AM',
    tags: [
      "CS180"
    ],
    description: 'adasdasdNeque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.'
  },
  {
    due_date: '5/5/2023, 11:30:00 AM',  //tomorrow, all
    task_name: 'sswfewr',
    priority: 4,
    date_completed: '',
    tags: [
      "CS180"
    ],
    description: 'adasdasdNeqqui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.'
  },
  {
    due_date: '5/8/2023, 11:30:00 AM', //next 7 days, all
    task_name: 'Exersfsfcise',
    priority: 3,
    date_completed: '',
    tags: [
      "CS180"
    ],
    description: 'adasdasdNeque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.'
  },{
    due_date: '5/20/2023, 11:30:00 AM', // all
    task_name: 'sfsfz',
    priority: 2,
    date_completed: '',
    tags: [
      
    ],
    description: 'adasdaum quia dolor sit amet, consectetur, adipisci velit.'
  },
];

export function TaskScreen({ navigation }) {
  const [taskList, setTaskList] = React.useState(dummy_data);
  const [selected, setSelected] = React.useState("");
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [newItemModalVisible, setNewItemModalVisible] = React.useState(false);
  const [task, setTask] = React.useState();
  const [date, setDate] = React.useState();
  const [desc, setDesc] = React.useState();
  let [option, setOption] = React.useState(0);
  const [placeholderTask, setPlaceholderTask] = React.useState("");
  const [placeholderDate, setPlaceholderDate] = React.useState("");
  const [placeholderDesc, setPlaceholderDesc] = React.useState("");

  const handleAddTask = () => {
    Keyboard.dismiss();
    const new_task = {
      due_date: date,
      task_name: task,
      priority: 1,
      date_completed: '',
      tags: [],
      description: desc
    };
    setTaskList([...taskList, new_task]);
    setTask(null);
    setDate(null);
    setDesc(null);
    setModalVisible(false);
  }

  const handleUpdatedTask = (index) => {
    Keyboard.dismiss();
    let li = [...taskList];
    
    li[index].task_name = placeholderTask;
    li[index].due_date = placeholderDate;
    li[index].description = placeholderDesc;
    setTaskList(li);

    setPlaceholderTask(null);
    setPlaceholderDate(null);
    setPlaceholderDesc(null);
    setModalVisible(false);
  }
  
  const deleteTask = (index) => {
    let tasksCopy = [...taskList];
    tasksCopy.splice(index, 1);
    setTaskList(tasksCopy);
  }

  const editTask = (index) => {
    setModalVisible(true);
    setPlaceholderTask(taskList[index].task_name);
    setPlaceholderDate(taskList[index].due_date);
    setPlaceholderDesc(taskList[index].description);
  }

  const checkTask = (index) => {
    setModalVisible(true);
    setPlaceholderTask(taskList[index].task_name);
    setPlaceholderDate(taskList[index].due_date);
    setPlaceholderDesc(taskList[index].description);
  }

  const makeGlobal = (index) => {
    global.index = index;
  }

  const onCheck = (index) => {
    const temp = [...taskList];
    if (temp[index].date_completed == "") {
      const datenow = new Date().toLocaleString();
      temp[index].date_completed = datenow;
      setNewItemModalVisible(true);
    } else {
      temp[index].date_completed = "";
    }
    setTaskList(temp);
  }

  const data = [
      {key:'1', value:'Today'},
      {key:'2', value:'Pending'},
      {key:'3', value:'Overdue'},
      {key:'4', value:'Tomorrow'},
      {key:'5', value:'Next 7 Days'}, // changed from This Week
      {key:'6', value:'Completed'},
      {key:'7', value:'All'}, // added to include tasks with due date ahead of 8 days from today
  ]

    return(
      <>
      <NewItemModal visible={newItemModalVisible} setVisible={setNewItemModalVisible} action={"TASK"}/>
      <View style = {{paddingHorizontal:10, paddingVertical:15, flex:1}}>
    
        <SelectList 
              setSelected={(val) => setSelected(val)} 
              search={false}
              placeholder='Today'
              data={data} 
              save="value"
          />

        <View style = {{paddingBottom:35, flex:1}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}} keyboardShouldPersistTaps='handled'>

        {
            taskList.map((item, index) => {
              const isChecked = item.date_completed == "" ? false : true;
              return (
                <View style={styles.container} key={index}>
                <View className={isChecked ? "bg-[#591b1c]" : `bg-[#7B1113]`} style={styles.taskContainer}>
                  <View className="flex flex-row">
                    <Checkbox className="mr-2 border-white"
                      color={"transparent"}
                      value={isChecked}
                      onValueChange={() => onCheck(index)}
                    /> 
                    <Text className={`text-white text-base ${isChecked ? "line-through" : ""}`}>{item.task_name}</Text>
                  </View>
                    <View className="flex flex-row gap-2">
                    <TouchableOpacity key={3*index} onPress={() => {checkTask(index); setOption(2); makeGlobal(index);}}>
                        <AntDesign  name="eyeo" size={22} color='#fff' />
                    </TouchableOpacity>
                    <TouchableOpacity key={3*index + 1} onPress={() => {editTask(index); setOption(1); makeGlobal(index);}}>
                        <AntDesign name="edit" size={22} color='#fff' />
                    </TouchableOpacity> 
                    <TouchableOpacity key={3*index + 2} onPress={() => deleteTask(index)}>
                        <MaterialIcons  name="delete" size={22} color='#fff' />
                    </TouchableOpacity>
                    </View>
                    
                </View>
                </View>
              )
            })
          }

        </ScrollView>
        </View>

        <TouchableOpacity onPress={() => {setModalVisible(true); setOption(0);}}>
            <AntDesign style={styles.plus} name="plussquare" size={30} color='#7B1113' />
        </TouchableOpacity>

        <Modal animationType="slide" 
                   transparent visible={isModalVisible} 
                   presentationStyle="overFullScreen" 
                   onDismiss={() => setModalVisible(false)}>
            <View style={styles.viewWrapper}>
                <View style={styles.modalView}>
                    <Text style={{width: '90%', fontSize: 16, position:'absolute', top:10}}>Task Name</Text>
                    {option === 0 && <TextInput placeholder="Enter something..."
                                value={task} style={styles.taskName} 
                                onChangeText={text => setTask(text)} />}
                    {option === 1 && <TextInput value={placeholderTask}
                                style={styles.taskName} 
                                onChangeText={text => setPlaceholderTask(text)} />}
                    {option === 2 && <TextInput value={placeholderTask}
                                style={styles.taskName} 
                                readOnly={true} />}
                    <Text style={{width: '90%', fontSize: 16, position:'absolute', top:100}}>Date Due</Text>
                    {option === 0 && <TextInput placeholder="Enter something..."
                                value={date} style={styles.taskDate}
                                onChangeText={text => setDate(text)} />}
                    {option === 1 && <TextInput value={placeholderDate} 
                                style={styles.taskDate}
                                onChangeText={text => setPlaceholderDate(text)} />}
                    {option === 2 && <TextInput value={placeholderDate}
                                style={styles.taskDate}
                                readOnly={true} />}
                    <Text style={{width: '90%', fontSize: 16, position:'absolute', top:190}}>Task Description</Text>
                    {option === 0 && <TextInput placeholder="Enter something..." multiline
                                value={desc} textAlignVertical='top' style={styles.taskDesc} 
                                onChangeText={desc => setDesc(desc)} />}
                    {option === 1 && <TextInput value={placeholderDesc} multiline
                                textAlignVertical='top' style={styles.taskDesc} 
                                onChangeText={desc => setPlaceholderDesc(desc)} />}
                    {option === 2 && <TextInput value={placeholderDesc} multiline
                                textAlignVertical='top' style={styles.taskDesc} 
                                readOnly={true} />}                                
                    <View style={{flexDirection: 'row', position: 'absolute', bottom: 15}}>
                    <Button title="Close" onPress={() => setModalVisible(false)} color='#7B1113'/>
                    <View style={{width: 150}} />
                    {option === 0 && <Button title="Add Task" onPress={() => { handleAddTask(); }} color='#7B1113' />}
                    {option === 1 && <Button title="Edit Task" onPress={() => { handleUpdatedTask(global.index); }} color='#7B1113' />}
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
        flexDirection: 'row',
    },
    index: {
        color: '#fff',
        fontSize: 20,
    },
    taskContainer: {
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 5,
        minHeight: 50,
        marginTop: 20,
    },
    task: {
        color: '#fff',
        width: '90%',
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
        right: 0
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
        transform: [{ translateX: -(width * 0.4) }, 
                    { translateY: -250 }],
        height: 500,
        width: width * 0.8,
        backgroundColor: "#fff",
        borderRadius: 7,
    },
    taskName: {
        width: "85%",
        position: "absolute",
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
        marginBottom: 8,
        top:40,
    },
    taskDate: {
      width: "85%",
      position: "absolute",
      borderRadius: 5,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderColor: "rgba(0, 0, 0, 0.2)",
      borderWidth: 1,
      marginBottom: 8,
      top:130,
  },
    taskDesc: {
        width: "85%",
        height: "42.5%",
        position: "absolute",
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
        marginBottom: 8,
        top:220,
    },
    container: {
      flexDirection: 'row',
  },
  index: {
      color: '#fff',
      fontSize: 20,
  },
  taskContainer: {
      borderRadius: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      flex: 1,
      paddingHorizontal: 20,
      paddingVertical: 5,
      minHeight: 50,
      marginTop: 20,
  },
});

LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();