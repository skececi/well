import * as React from 'react';
import { Button, Pressable, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from './Themed';
import { atom, useRecoilState, useSetRecoilState } from "recoil";
import { Task, TaskCategory, TaskFrequency } from "../types/taskTypes";
import uuid from "react-native-uuid";
import * as Haptics from "expo-haptics";


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
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    margin: 20
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',

  },
});

const meditationTask: Task = {
  createdDate: 1,
  title: "Meditate",
  taskCategory: TaskCategory.mental,
  frequency: TaskFrequency.weekly,
  desiredCount: 2,
  currentCount: 0,
};

const exerciseTask: Task = {
  createdDate: 2,
  title: "Exercise",
  taskCategory: TaskCategory.physical,
  frequency: TaskFrequency.weekly,
  desiredCount: 2,
  currentCount: 0,
};


const exampleTasks: Task[] = [meditationTask, exerciseTask];


const taskState = atom({
  key: 'taskState',
  default: exampleTasks,
});

export const NEWTHINGScreen = () => {
  const [tasks, setTasks] = useRecoilState(taskState);

  const isToday = (someDate: Date) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

  const sortedTasks = tasks.slice().sort((a, b) => a.createdDate - b.createdDate); // create a copy because the O.G. one is tied to Recoil state
  const taskTable = sortedTasks.map((task) => {
    const taskIsCompleted = task.currentCount >= task.desiredCount;
    return (
      <View
        key={task.createdDate}
        style={{
          paddingBottom: 20,
        }}
      >
        <Text>
          {task.title + " " + task.desiredCount + "x " + task.frequency}
        </Text>
        <Text>
          {"Progress || " + "X".repeat(task.currentCount)}
        </Text>
        <Pressable
          style={{...styles.button, backgroundColor: taskIsCompleted ? "#16a34a" : "#64748b"}}
          key={task.createdDate}
          onPress={() => {
            if (!taskIsCompleted) {
              setTasks((oldTaskList) => {
                const otherTasks = oldTaskList.filter((t) => t.createdDate !== task.createdDate);
                return [
                  ...otherTasks,
                  {
                    ...task,
                    currentCount: task.currentCount + 1,
                  }
                ]
              });
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }

          }}>
          <Text style={{...styles.text, padding: 10}}>{task.currentCount < task.desiredCount ? "Complete an entry of this task" : "YAY TASK COMPLETED!"}</Text>
        </Pressable>

        <Button
          title={"Remove Count"}
          onPress={() => {
            if (task.currentCount > 0) {
              setTasks((oldTaskList) => {
                const otherTasks = oldTaskList.filter((t) => t.createdDate !== task.createdDate);
                return [
                  ...otherTasks,
                  {
                    ...task,
                    currentCount: task.currentCount - 1,
                  }
                ]
              });
            }
          }}
        />
      </View>
    )
  })


  return (
    <View style={styles.container}>
      {taskTable}
    </View>
  )
};


// TODO- pull logic from AddTaskModal.tsx (unify with it)
export const NewTaskModal = () => {
  const setTasks = useSetRecoilState(taskState);
  const newTask: Task = {
    createdDate: Date.now(),
    title: "Exercise",
    taskCategory: TaskCategory.physical,
    frequency: TaskFrequency.weekly,
    desiredCount: 2,
    currentCount: 0,
  };
  const addItem = () => {
    setTasks((oldTodoList) => [
      ...oldTodoList,
      newTask,
    ]);
  };

}


// TODO- later, use Selectors to do:
//  FILTERS!! :D
//  STATISTICS!! :D
