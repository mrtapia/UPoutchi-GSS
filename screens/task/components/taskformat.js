import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const taskformat = (props) => {

    return (
        <View style={styles.container}>
            <View style={styles.taskContainer}>
                <Text style={styles.task}>{props.text}</Text>
                <TouchableOpacity onPress={() => props.checkTask()}>
                    <AntDesign style={styles.check} name="eyeo" size={22} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => props.editTask()}>
                    <AntDesign style={styles.edit} name="edit" size={22} color='#fff' />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteTask()}>
                    <MaterialIcons style={styles.delete} name="delete" size={22} color='#fff' />
                </TouchableOpacity>
            </View>
        </View>
    )};

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
    start: {
        marginLeft: -80
    }
});

export default taskformat;