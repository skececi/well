import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';


import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { useEffect, useState } from "react";
import useStoredTaskList from "../hooks/useStoredTaskList";

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

export type TaskEntry = {
  task: Task;
  date: Date;
}

export type JournalEntry = {
  message: string;
  date: Date;
}

export enum Mood {
  "happy",
  "content",
  "sad",
  "stressed",
}

export type MoodEntry = {
  mood: Mood;
  date: Date;
}



const meditationTask: Task = {
  id: 1,
  taskTitle: "Meditate 5 minutes",
  taskCategory: "Mental Health",
};

const exerciseTask: Task = {
  id: 2,
  taskTitle: "Exercise 15 minutes",
  taskCategory: "Physical Health",
};

const exampleTasks: Task[] = [meditationTask, exerciseTask];

export default function MainScreen() {
  const [taskList, setTaskList] = useStoredTaskList();


  const [lastCompleted, setLastCompleted] = useState(new Map<number, Date>());

  // Map of Date -> TaskID : Completed?
  // List of journal entries (

  // TODO- handling of completion of tasks - writing back to the datastructure
  // TODO- have the date cutoff be dynamic and flexible

  // https://stackoverflow.com/questions/49477547/setstate-of-an-array-of-objects-in-react
  function setCompleted(task: Task) {
    setTaskList()
  }

  useEffect(() => {
    storeTaskList(taskList);
  }, [taskList]);


  const dailyTasks: Task[] = [meditationTask, exerciseTask];
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
          {task.taskTitle}
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


