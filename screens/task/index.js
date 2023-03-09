import * as React from 'react';
import { View, Pressable, Text, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SelectList } from 'react-native-dropdown-select-list'


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
    
      </View>
    );
  }
