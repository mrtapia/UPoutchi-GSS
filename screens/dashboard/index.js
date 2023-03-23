import * as React from 'react';
import { useState, useCallback } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import DropDownPicker from 'react-native-dropdown-picker';

const chartConfig = {
    backgroundColor: '#0000000',
    backgroundGradientFrom: '#022173',
    backgroundGradientTo: '#1b3fa0',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16
    }
    };

export function DashboardScreen({ navigation }) {
  const data1 = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      data: [90, 45, 28, 80, 62, 43],
    }
  ]
  };
  const data2 = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [46, 21, 69, 34, 11, 52],
      }
    ]
  };

  const [openTask, setTaskOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: 'Daily', value: '1' },
    { label: 'Weekly', value: '2' },
    { label: 'Monthly', value: '3' },
    { label: 'Yearly', value: '4' },
  ]);

  const [openFocus, setFocusOpen] = useState(false);
  const [value1, setValue1] = useState(null);
  const [items1, setItems1] = useState([
    { label: 'Daily', value: '1' },
    { label: 'Weekly', value: '2' },
    { label: 'Monthly', value: '3' },
    { label: 'Yearly', value: '4' },
  ]);
  const onTaskOpen = useCallback(() => {
    setFocusOpen(false);
  }, []);

  const onFocusOpen = useCallback(() => {
    setTaskOpen(false);
  }, []);

  const width = Dimensions.get('window').width - 30;
  const height = 190;

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Tasks Completed</Text>    
          <View>
          <DropDownPicker
            style={styles.dropdown}
            placeholder="Select"
            open={openTask}
            onOpen={onTaskOpen}
            value={value}
            items={items}
            setOpen={setTaskOpen}
            setValue={setValue}
            setItems={setItems}
            placeholderStyle={{
              color: 'white',
              opacity: .5, 
              fontWeight: "bold"
            }}
            textStyle={{
              fontSize: 18,
              color: 'white',
              fontWeight: 'bold'
            }}
            dropDownContainerStyle={{
              width : 120,
              backgroundColor: "#0f0f0f"
            }}
            listMode="SCROLLVIEW"
          /></View>    
        </View>
        <BarChart
          width={width}
          height={height}
          data={data1}
          fromZero='True'
          chartConfig={chartConfig}
          style={styles.graphStyle}
        />
        <View style={styles.message}>
          <Text style={styles.messageText}>You have accomplished your goal for the month.</Text>
        </View>
      </View>
      <View style={styles.section}>
      <View style={styles.header}>
          <Text style={styles.headerText}>Focus Sessions</Text>    
          <View>
          <DropDownPicker
            style={styles.dropdown}
            placeholder="Select"
            open={openFocus}
            onOpen={onFocusOpen}
            value={value1}
            items={items1}
            setOpen={setFocusOpen}
            setValue={setValue1}
            setItems={setItems1}
            placeholderStyle={{
              color: 'white',
              opacity: .5, 
              fontWeight: "bold"
            }}
            textStyle={{
              fontSize: 18,
              color: 'white',
              fontWeight: 'bold'
            }}
            dropDownContainerStyle={{
              width : 120,
              backgroundColor: "#0f0f0f"
            }}
            listMode="SCROLLVIEW"
          /></View>    
        </View>
        <BarChart
          width={width}
          height={height}
          data={data2}
          fromZero='True'
          chartConfig={chartConfig}
          style={styles.graphStyle}
        />
        <View style={styles.message}>
          <Text style={styles.messageText}>You're on a 3-week productivity streak. Keep it up!</Text>
        </View>
      </View>
    </View>


  );
  }

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#232528',
    flex: 1,
    justifyContent: 'center',
  },
  section: {
    backgroundColor :'#232528',
    flex: 1,
    marginBottom: 10,
  },
  header:{
    zIndex : 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginHorizontal: 10,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 25,
    color: 'white',
  },
  graphStyle : {
    zIndex : 2,
    marginVertical: 8,
    alignItems: 'center',
    ...chartConfig.style
  },
  dropdown : { 
    width : 120,
    borderRadius: 18,
    backgroundColor: '#EE7A77',
  },
  message: {
    marginVertical: 5,
    backgroundColor: '#0f0f0f',
    marginHorizontal: 15,
    borderRadius : 18,
    alignItems : 'center',
    justifyContent: 'center',
    flex : 1
  },
  messageText: {
    marginHorizontal: 15,
    color : 'white',
    fontSize : 15
  }
});
