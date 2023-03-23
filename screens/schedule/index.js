import * as React from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import {Calendar, AgendaSchedule} from 'react-native-calendars';
import { SelectList } from 'react-native-dropdown-select-list';


export function ScheduleScreen({ navigation }) {
  const [selected, setSelected] = React.useState("");

  const data = [
      {key:'1', value:'Daily'},
      {key:'2', value:'Weekly'},
      {key:'3', value:'Monthly'},
  ]
    return (
      <View style = {{paddingHorizontal:20, paddingVertical:20, flex:1}}>
      
        <SelectList 
            setSelected={(val) => setSelected(val)} 
            data={data} 
            save="value"
            defaultOption={{key:'3', value:'Monthly'}}
            search={false}
        />
        {!!selected && selected === 'Monthly' && (
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
    );
  }