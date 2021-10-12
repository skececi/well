import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';


import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { useEffect, useState } from "react";
import useTasks, { ActionType } from "../hooks/useTasks";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

// TODO- make everything enums (+ custom string option)
export type Task = {
  id: number;
  taskTitle: string;
  taskCategory: string;
};

export type Journal = {
  message: string;
}

export enum Mood {
  happy = "Happy",
  content = "Content",
  sad = "Sad",
  stressed = "Stressed",
}

// TODO move this into better place when ready
export type CompletionEntry = {
  entry: Task | Journal | Mood;
  date: Date;
}



export default function MainScreen() {
  const [state, dispatch] = useTasks();

  // TODO- handling of completion of tasks - writing back to the datastructure
  function setCompleted(entry: Task | Journal | Mood) {
    const completionEntry: CompletionEntry = {
      entry: entry,
      date: new Date(),
    }
    dispatch({
      type: ActionType.AddCompletionEntry,
      payload: completionEntry,
    });
  }

  const isToday = (someDate: Date) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

  // TODO- have the date cutoff be dynamic and flexible
  function taskIsCompleted(task: Task): boolean {
    console.log(state.completionEntryList);
    // check if there is an entry for that task in the completion list for TODAY
    return state.completionEntryList.filter(entry =>
      entry.entry === task && isToday(entry.date)
    ).length !== 0;
  }

  const dailyTasks: Task[] = state.taskList;
  const tasksButtons = dailyTasks.map((task) => {
    return (
      <TouchableOpacity
        style={{
          elevation: 8,
          backgroundColor: "#A2F9DE",
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 12
        }}
        key={task.id}
        onPress={() => {
          setCompleted(task);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}>
        <Text style={{
          fontSize: 18,
          color: "black",
          fontWeight: "bold",
          alignSelf: "center",
          textTransform: "uppercase"
        }}>
          {taskIsCompleted && task.taskTitle}
        </Text>
      </TouchableOpacity>
    )
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main - buttons to confirm etc etc</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
      {tasksButtons}
    </View>
  );
}


