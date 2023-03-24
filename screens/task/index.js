import * as React from 'react';
import { StyleSheet, View, Pressable, Text, Image, TouchableOpacity, Keyboard, ScrollView, Modal, TextInput, Button, Dimensions } from 'react-native';
import Task from './components/taskformat';
import { SelectList } from 'react-native-dropdown-select-list';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

export function TaskScreen({ navigation }) {
  const [selected, setSelected] = React.useState("");
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [task, setTask] = React.useState();
  const [desc, setDesc] = React.useState();
  const [taskItems, setTaskItems] = React.useState([]);

  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, task])
    setTask(null);
  }

  const deleteTask = (index) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy)
  }

  const editTask = (index) => {
    let itemsCopy = [...taskItems];
    setTaskItems(itemsCopy)
  }

  const checkTask = (index) => {
    let itemsCopy = [...taskItems];
    setTaskItems(itemsCopy)
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
                <TouchableOpacity key={index}  onPress={() => deleteTask(index)}>
                  <Task text={item} /> 
                </TouchableOpacity>
              )
            })
          }

        </ScrollView>
        </View>

        <TouchableOpacity onPress={toggleModalVisibility}>
            <AntDesign style={styles.plus} name="plussquare" size={30} color='#7B1113' />
        </TouchableOpacity>

        <Modal animationType="slide" 
                   transparent visible={isModalVisible} 
                   presentationStyle="overFullScreen" 
                   onDismiss={toggleModalVisibility}>
            <View style={styles.viewWrapper}>
                <View style={styles.modalView}>
                    <Text style={{width: '90%', fontSize: 16, position:'absolute', top:10}}>Task Name</Text>
                    <TextInput placeholder="Enter something..." 
                                value={task} style={styles.taskName} 
                                onChangeText={text => setTask(text)} />
                    <Text style={{width: '90%', fontSize: 16, position:'absolute', top:100}}>Task Description</Text>
                    <TextInput placeholder="Enter something..." 
                                value={desc} textAlignVertical='top' style={styles.taskDesc} 
                                onChangeText={desc => setDesc(desc)} />
                    <View style={{flexDirection: 'row', position: 'absolute', bottom: 15}}>
                    <Button title="Close" onPress={toggleModalVisibility} color='#7B1113'/>
                    <View style={{width: 150}} />
                    <Button title="Add Task" onPress={() => handleAddTask()} color='#7B1113' />
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
    taskDesc: {
        width: "85%",
        height: "60%",
        position: "absolute",
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
        marginBottom: 8,
        top:130,
    },
});
