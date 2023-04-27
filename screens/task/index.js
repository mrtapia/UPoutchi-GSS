import * as React from 'react';
import { StyleSheet, View, Pressable, Text, Image, TouchableOpacity, Keyboard, ScrollView, Modal, TextInput, Button, Dimensions, LogBox} from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer'
import { SelectList } from 'react-native-dropdown-select-list';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

export function TaskScreen({ navigation }) {
  const [selected, setSelected] = React.useState("");
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [isModalVisible1, setModalVisible1] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [task, setTask] = React.useState();
  const [date, setDate] = React.useState();
  const [desc, setDesc] = React.useState();
  const [taskItems, setTaskItems] = React.useState([]);
  const [dateItems, setDateItems] = React.useState([]);
  const [descItems, setDescItems] = React.useState([]);
  let [option, setOption] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const togglePause = () => {
      setIsPaused(!isPaused);
  }

  const children = ({ remainingTime }) => {
    const minutes = Math.floor(remainingTime / 60)
    const seconds = remainingTime % 60
    if (seconds <= 9){
      return `${minutes}:0${seconds}`
    }
    else return `${minutes}:${seconds}`
  }

  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, task])
    setDateItems([...dateItems, date])
    setDescItems([...descItems, desc])
    setTask(null);
    setDate(null);
    setDesc(null);
    setModalVisible(!isModalVisible);
  }

  const handleUpdatedTask = (index) => {
    Keyboard.dismiss();
    let tasksCopy = [...taskItems];
    tasksCopy[index] = task;
    setTaskItems(tasksCopy)

    let datesCopy = [...dateItems];
    datesCopy[index] = date;
    setDateItems(datesCopy)

    let descsCopy = [...descItems];
    descsCopy[index] = desc;
    setDescItems(descsCopy)

    setTask(null);
    setDate(null);
    setDesc(null);
    setModalVisible(!isModalVisible);
  }
  
  const deleteTask = (index) => {
    let tasksCopy = [...taskItems];
    tasksCopy.splice(index, 1);
    setTaskItems(tasksCopy)

    let datesCopy = [...dateItems];
    datesCopy.splice(index, 1);
    setDateItems(datesCopy)

    let descsCopy = [...descItems];
    descsCopy.splice(index, 1);
    setDescItems(descsCopy)
  }

  const editTask = (index) => {
    toggleModalVisibility();
    placeholderTask = taskItems[index];
    placeholderDate = dateItems[index];
    placeholderDesc = descItems[index];
  }

  const checkTask = (index) => {
    toggleModalVisibility();
    placeholderTask = taskItems[index];
    placeholderDate = dateItems[index];
    placeholderDesc = descItems[index];
  }

  const makeGlobal = (index) => {
    global.index = index;
  }

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
    };

  const data = [
      {key:'1', value:'Today'},
      {key:'2', value:'Pending'},
      {key:'3', value:'Overdue'},
      {key:'4', value:'Tomorrow'},
      {key:'5', value:'This Week'},
      {key:'6', value:'Completed'},
  ]

    return(
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
            taskItems.map((item, index) => {
              return (
                <View style={styles.container}>
                <View style={styles.taskContainer}>
                    <Text style={styles.task}>{item}</Text>
                    <TouchableOpacity key={3*index} onPress={() => {checkTask(index), setOption(2), makeGlobal(index)}}>
                        <AntDesign style={styles.check} name="eyeo" size={22} color='#fff' />
                    </TouchableOpacity>
                    <TouchableOpacity key={3*index + 1} onPress={() => {editTask(index), setOption(1), makeGlobal(index)}}>
                        <AntDesign style={styles.edit} name="edit" size={22} color='#fff' />
                    </TouchableOpacity> 
                    <TouchableOpacity key={3*index + 2} onPress={() => deleteTask(index)}>
                        <MaterialIcons style={styles.delete} name="delete" size={22} color='#fff' />
                    </TouchableOpacity>
                </View>
                </View>
              )
            })
          }

        </ScrollView>
        </View>
        <View style={{marginTop:-20 ,alignItems: "center", justifyContent: "center"}}>
            <Button
                title="Start timer"
                color='#3C78AF'
                onPress={() => {
                  setModalVisible1(true);
                }}
            />
            <Modal
            visible = {isModalVisible1}
            transparent = {true}
            animationType='slide'
            onRequestClose = {() => {setModalVisible1(false)}}
            presentationStyle="overFullScreen" 
            >
              <View style={{
                top: "50%",
                left: "50%",
                elevation: 5,
                transform: [{ translateX: -(width * 0.4) }, 
                            { translateY: -200 }],
                borderRadius: 14,
                backgroundColor: '#fff',
                padding: 20,
                width: '80%',
                height: '50%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <CountdownCircleTimer
                  duration={300}
                  colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                  colorsTime={[7, 5, 2, 0]}
                  isPlaying={!isPaused}
                >
                  {({ remainingTime }) => <Text style = {{fontSize: 50, fontWeight: 'bold'}}>{children({remainingTime})}</Text>}
                </CountdownCircleTimer>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <View style={{ backgroundColor: '#161819', borderRadius: 40 , marginHorizontal: 15}}>
                    <Ionicons
                    name={isPaused ? 'play' : 'pause'}
                    title={isPaused ? 'Resume' : 'Pause'}
                    onPress={togglePause}
                    size={40}
                    color="#3C78AF"
                    style={{ padding: 15 }}
                    />
                  </View>
                  <View style={{ backgroundColor: '#161819', borderRadius: 40, marginHorizontal: 15}}>
                    <Ionicons 
                    name="stop" 
                    title="Cancel"
                    onPress={() => {
                      setModalVisible1(false);
                    }}
                    size={40} 
                    color="#3C78AF" 
                    style={{ padding: 15 }}
                    />
                  </View>
                </View>
              </View>
            </Modal>
        </View> 

        <TouchableOpacity onPress={() => {toggleModalVisibility(); setOption(0)}}>
            <AntDesign style={styles.plus} name="plussquare" size={30} color='#7B1113' />
        </TouchableOpacity>

        <Modal animationType="slide" 
                   transparent visible={isModalVisible} 
                   presentationStyle="overFullScreen" 
                   onDismiss={toggleModalVisibility}>
            <View style={styles.viewWrapper}>
                <View style={styles.modalView}>
                    <Text style={{width: '90%', fontSize: 16, position:'absolute', top:10}}>Task Name</Text>
                    {option === 0 && <TextInput placeholder="Enter something..."
                                value={task} style={styles.taskName} 
                                onChangeText={text => setTask(text)} />}
                    {option === 1 && <TextInput defaultValue={placeholderTask}
                                style={styles.taskName} 
                                onChangeText={text => setTask(text)} />}
                    {option === 2 && <TextInput defaultValue={placeholderTask}
                                style={styles.taskName} 
                                readOnly={true} />}
                    <Text style={{width: '90%', fontSize: 16, position:'absolute', top:100}}>Date Due</Text>
                    {option === 0 && <TextInput placeholder="Enter something..."
                                value={date} style={styles.taskDate}
                                onChangeText={text => setDate(text)} />}
                    {option === 1 && <TextInput defaultValue={placeholderDate} 
                                style={styles.taskDate}
                                onChangeText={text => setDate(text)} />}
                    {option === 2 && <TextInput defaultValue={placeholderDate}
                                style={styles.taskDate}
                                readOnly={true} />}
                    <Text style={{width: '90%', fontSize: 16, position:'absolute', top:190}}>Task Description</Text>
                    {option === 0 && <TextInput placeholder="Enter something..."
                                value={desc} textAlignVertical='top' style={styles.taskDesc} 
                                onChangeText={desc => setDesc(desc)} />}
                    {option === 1 && <TextInput defaultValue={placeholderDesc}
                                textAlignVertical='top' style={styles.taskDesc} 
                                onChangeText={desc => setDesc(desc)} />}
                    {option === 2 && <TextInput defaultValue={placeholderDesc}
                                textAlignVertical='top' style={styles.taskDesc} 
                                readOnly={true} />}                                
                    <View style={{flexDirection: 'row', position: 'absolute', bottom: 15}}>
                    <Button title="Close" onPress={toggleModalVisibility} color='#7B1113'/>
                    <View style={{width: 150}} />
                    {option === 0 && <Button title="Add Task" onPress={() => { handleAddTask(); }} color='#7B1113' />}
                    {option === 1 && <Button title="Edit Task" onPress={() => { handleUpdatedTask(global.index); }} color='#7B1113' />}
                    </View>
                </View>
            </View>
        </Modal>

      </View>

      
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
        backgroundColor: '#7B1113',
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
      backgroundColor: '#7B1113',
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