import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';


import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { useEffect } from "react";

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
  taskTitle: string;
  taskCategory: string;
  lastCompleted?: Date;
};

// Map of Date -> Task (completed)
// Map of Date -> Journal entry
// Map of Date -> Num tasks?

const meditationTask: Task = {
  taskTitle: "Meditate 5 minutes",
  taskCategory: "Mental Health",
};

const exerciseTask: Task = {
  taskTitle: "Exercise 15 minutes",
  taskCategory: "Physical Health",
};

export default function MainScreen() {
  const [taskList, setTaskList] = React.useState([]);
  // TODO- load state from some storage (look into local storage- account based)
  // TODO- handling of completion
  async function storeTaskList(taskList: Task[]) {
    try {
      await AsyncStorage.setItem('@task_list', JSON.stringify(taskList));
    } catch (e) {
      // saving error
      console.error("saving error");
    }
  }

  // TODO- have the date cutoff be dynamic and flexible
  function setCompleted(task: Task) {
    task.lastCompleted = new Date();
  }

  useEffect(() => {
    storeTaskList(taskList);
  }, [taskList]);


  const dailyTasks: Task[] = [meditationTask, exerciseTask];
  const tasksButtons = dailyTasks.map((task, index) => {
    return (
      <TouchableOpacity
        style={{
          elevation: 8,
          backgroundColor: "#A2F9DE",
          borderRadius: 10,
          paddingVertical: 10,
          paddingHorizontal: 12
        }}
        key={index}
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


