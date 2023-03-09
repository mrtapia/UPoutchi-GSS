import * as React from 'react';
import { StyleSheet, View, Pressable, Text, Image, TouchableOpacity } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';


export function TaskScreen({ navigation }) {
  const [selected, setSelected] = React.useState("");

  const data = [
      {key:'1', value:'Today'},
      {key:'2', value:'Pending'},
      {key:'3', value:'Overdue'},
      {key:'4', value:'Tomorrow'},
      {key:'5', value:'This Week'},
      {key:'6', value:'Completed'},
  ]

    return(
      <View style = {{paddingHorizontal:20, paddingVertical:20, flex:1}}>
    
        <SelectList 
              setSelected={(val) => setSelected(val)} 
              search={false}
              placeholder='Today'
              data={data} 
              save="value"
          />
    
        <View style={styles.container}>
            <View style={styles.taskContainer}>
                <Text style={styles.task}>Task 1</Text>
                <TouchableOpacity onPress={() => props.checkTask()}>
                    <AntDesign style={styles.check} name="eyeo" size={22} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.editTask()}>
                    <AntDesign style={styles.edit} name="edit" size={22} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.deleteTask()}>
                    <MaterialIcons style={styles.delete} name="delete" size={22} color='#fff' />
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.container}>
            <View style={styles.taskContainer}>
                <Text style={styles.task}>Task 2</Text>
                <TouchableOpacity onPress={() => props.checkTask()}>
                    <AntDesign style={styles.check} name="eyeo" size={22} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.editTask()}>
                    <AntDesign style={styles.edit} name="edit" size={22} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.deleteTask()}>
                    <MaterialIcons style={styles.delete} name="delete" size={22} color='#fff' />
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.container}>
            <View style={styles.taskContainer}>
                <Text style={styles.task}>Task 3</Text>
                <TouchableOpacity onPress={() => props.checkTask()}>
                    <AntDesign style={styles.check} name="eyeo" size={22} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.editTask()}>
                    <AntDesign style={styles.edit} name="edit" size={22} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.deleteTask()}>
                    <MaterialIcons style={styles.delete} name="delete" size={22} color='#fff' />
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.container}>
            <View style={styles.taskContainer}>
                <Text style={styles.task}>Task 4</Text>
                <TouchableOpacity onPress={() => props.checkTask()}>
                    <AntDesign style={styles.check} name="eyeo" size={22} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.editTask()}>
                    <AntDesign style={styles.edit} name="edit" size={22} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.deleteTask()}>
                    <MaterialIcons style={styles.delete} name="delete" size={22} color='#fff' />
                </TouchableOpacity>
            </View>
        </View>

        <View style={styles.container}>
            <View style={styles.taskContainer}>
                <Text style={styles.task}>Task 5</Text>
                <TouchableOpacity onPress={() => props.checkTask()}>
                    <AntDesign style={styles.check} name="eyeo" size={22} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.editTask()}>
                    <AntDesign style={styles.edit} name="edit" size={22} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.deleteTask()}>
                    <MaterialIcons style={styles.delete} name="delete" size={22} color='#fff' />
                </TouchableOpacity>
            </View>
        </View>

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
});
