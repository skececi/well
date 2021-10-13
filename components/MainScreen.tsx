import * as React from 'react';
import { Alert, Button, Modal, Pressable, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EditScreenInfo from './EditScreenInfo';
import { Text, View } from './Themed';
import { useEffect, useState } from "react";
import useTasks, { ActionType } from "../hooks/useTasks";
import AddTaskModal from "./AddTaskModal";
import { CompletionEntry, Journal, Mood, Task } from "../types/taskTypes";


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
  buttonNotCompleted: {
    elevation: 8,
    backgroundColor: "#A2F9DE",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  buttonCompleted: {
    elevation: 8,
    backgroundColor: "gray",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});

export default function MainScreen() {
  const [state, dispatch] = useTasks();
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

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
    // check if there is an entry for that task in the completion list for TODAY
    return state.completionEntryList.filter(entry =>
      entry.entry == task && isToday(entry.date)
    ).length !== 0;
  }

  const addTaskButton = (
    <TouchableOpacity
      onPress={() => setShowAddTaskModal(true)}
    >
      <Text>+ ADD TASK </Text>
    </TouchableOpacity>
  );

  const tasksButtons = state.taskList.map((task) => {
    return (
      <TouchableOpacity
        style={taskIsCompleted(task) ? styles.buttonCompleted : styles.buttonNotCompleted}
        key={task.id}
        onPress={() => {
          if (taskIsCompleted(task)) {
            // TODO - uncomplete the task
            return;
          }
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
          {taskIsCompleted(task) && "✅"}
          {task.title + " [" + task.duration + " min]"}

        </Text>
      </TouchableOpacity>
    )
  });



  return (
    <View style={styles.container}>
      <Text style={styles.title}>Main - This all needs to be styled :) </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
      {tasksButtons}
      <Button
        title={"Reset Tasks"}
        onPress={() => dispatch({type: ActionType.ResetCompletionEntryList})}
      />
      <Text>{state.completionEntryList.map((e) => {
        // @ts-ignore
        return "\n" + e.entry.title + "---" + e.date.toDateString();
      })} </Text>
      {addTaskButton}
      <AddTaskModal showAddTaskModal={showAddTaskModal} setShowAddTaskModal={setShowAddTaskModal}/>
    </View>
  );
}


