import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';


import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { useEffect } from "react";

// TODO- make everything enums (+ custom)
export type Task = {
  taskTitle: string;
  taskCategory: string;
  completedToday: boolean;
}

export default function MainScreen() {
  const [taskList, setTaskList] = React.useState([]);
  // TODO- load state from some storage (look into local storage- account based)

  const meditationTask: Task = {
    taskTitle: "Meditate 5 minutes",
    taskCategory: "Mental Health",
    completedToday: false, // TODO state-ify this?
  };

  const dailyTasks: Task[] = [meditationTask];
  const tasksButtons = dailyTasks.map((task, index) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }}>
        <Text> {task.taskTitle} </Text>
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
