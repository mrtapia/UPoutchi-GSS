import * as React from 'react';
import { StyleSheet, View, Text, Alert, TouchableOpacity, Modal, Button, TextInput, Dimensions, Keyboard } from 'react-native';
import {Calendar, AgendaSchedule} from 'react-native-calendars';
import { SelectList } from 'react-native-dropdown-select-list';
import { AntDesign } from '@expo/vector-icons';

const { width } = Dimensions.get("window");

export function ScheduleScreen({ navigation }) {
  const [selected, setSelected] = React.useState("");
  const [isModalVisible, setModalVisible] = React.useState(false);
  let [option, setOption] = React.useState(0);
  const [classN, setName] = React.useState();
  const [from, setFrom] = React.useState();
  const [until, setUntil] = React.useState();
  const [repeat, setRepeat] = React.useState();
  const [classItems, setClassItems] = React.useState([]);
  const [fromItems, setFromItems] = React.useState([]);
  const [untilItems, setUntilItems] = React.useState([]);
  const [repeatItems, setRepeatItems] = React.useState([]);

  const data = [
      {key:'1', value:'Daily'},
      {key:'2', value:'Weekly'},
      {key:'3', value:'Monthly'},
  ]

  const handleAddClass = () => {
    Keyboard.dismiss();
    setClassItems([...classItems, classN])
    setFromItems([...fromItems, from])
    setUntilItems([...untilItems, until])
    setRepeatItems([...repeatItems, repeat])
    setName(null);
    setFrom(null);
    setUntil(null);
    setRepeat(null);
    setModalVisible(!isModalVisible);
  }

  const toggleModalVisibility = () => {
    setModalVisible(!isModalVisible);
    };

    return (
      <View style = {{paddingHorizontal:20, paddingVertical:20, flex:1}}>
      
        <SelectList 
            setSelected={(val) => setSelected(val)} 
            data={data} 
            save="value"
            defaultOption={{key:'3', value:'Monthly'}}
            search={false}
        />

        <View style = {{paddingBottom:35, flex:1}}>
        {!!selected && (selected === 'Monthly' || selected === '3') && (
          <Calendar
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={'yyyy MMMM'}
          // Do not show days of other months in month page. Default = false
          hideExtraDays={true}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday
          firstDay={7}
          // Handler which gets executed when press arrow icon left. It receive a callback can go back month
          onPressArrowLeft={subtractMonth => subtractMonth()}
          // Handler which gets executed when press arrow icon right. It receive a callback can go next month
          onPressArrowRight={addMonth => addMonth()}
          // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
          disableAllTouchEventsForDisabledDays={true}
          />
        )}
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
                    <Text style={{width: '90%', fontSize: 16, position:'absolute', top:10}}>Class Name</Text>
                    {option === 0 && <TextInput placeholder="Class Name"
                                value={classN} style={styles.className} 
                                onChangeText={text => setName(text)} />}
                    <Text style={{width: '90%', fontSize: 16, position:'absolute', top:100}}>From</Text>
                    {option === 0 && <TextInput placeholder="YYYY/MM/DD"
                                value={from} style={styles.classFrom}
                                onChangeText={text => setFrom(text)} />}
                    <Text style={{width: '90%', fontSize: 16, position:'absolute', top:190}}>Until</Text>
                    {option === 0 && <TextInput placeholder="YYYY/MM/DD"
                                value={until} style={styles.classUntil}
                                onChangeText={text => setUntil(text)} />}
                    <Text style={{width: '90%', fontSize: 16, position:'absolute', top:280}}>Repeats on</Text>
                    {option === 0 && <TextInput placeholder="Su, Mo, Tu, We, Th, Fr, Sa"
                                value={repeat} style={styles.classRepeat}
                                onChangeText={text => setRepeat(text)} />}                                
                    <View style={{flexDirection: 'row', position: 'absolute', bottom: 15}}>
                    <Button title="Close" onPress={toggleModalVisibility} color='#7B1113'/>
                    <View style={{width: 90}} />
                    {option === 0 && <Button title="Add Class Record" onPress={() => { handleAddClass(); }} color='#7B1113' />}
                    </View>
                </View>
            </View>
        </Modal>
      </View>
    );
  }

  const styles = StyleSheet.create({
    plus: {
        position: "absolute", 
        bottom: 0,
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
        height: 450,
        width: width * 0.8,
        backgroundColor: "#fff",
        borderRadius: 7,
    },
    className: {
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
    classFrom: {
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
    classUntil: {
        width: "85%",
        position: "absolute",
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderColor: "rgba(0, 0, 0, 0.2)",
        borderWidth: 1,
        marginBottom: 8,
        top:220,
    },
    classRepeat: {
      width: "85%",
      position: "absolute",
      borderRadius: 5,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderColor: "rgba(0, 0, 0, 0.2)",
      borderWidth: 1,
      marginBottom: 8,
      top:310,
    },
});