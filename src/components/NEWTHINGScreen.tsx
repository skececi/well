import * as React from 'react';
import { Button, Pressable, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from './Themed';
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import AddTaskModal from "./AddTaskModal";
import useTasks, { ITaskCompletions, ITaskPeriod, Task, TaskCategory, TaskFrequency } from '../hooks/useTasks';


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


/* 
  High level TODOs:
  - Add task creation modal!
  - design! (work w savanna)
  - multiple set of goals for daily, weekly, monthly (right now only weekly works - fine for a bit)
  - history view
  - celebration for completion
  - 
*/

/* call when the app is loaded:
  1. Load the state from storage and pass into recoil state
  2. Check time period from last completed task history, and see if we need to store the current taskState into history and reset it
  3.
 */
function onLoad() {
  // TODO-
}

export const NEWTHINGScreen = () => {
  const { tasks, setTasks, taskHistory, setTaskHistory, currentTaskPeriod, setCurrentTaskPeriod } = useTasks();
  
  const [sortedTaskCompletions, setSortedTaskCompletions] = useState((currentTaskPeriod as ITaskPeriod)?.taskCompletions);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  useEffect(() => {
    console.log("use effect currentTaskPeriod changed. should update the renderable sortedTaskCompletions")
    setSortedTaskCompletions((currentTaskPeriod as ITaskPeriod)?.taskCompletions.slice().sort((a: ITaskCompletions, b: ITaskCompletions) => a.task.createdDate - b.task.createdDate));
  },
    [currentTaskPeriod]);

  const taskTable = sortedTaskCompletions.map((taskCompletion: ITaskCompletions) => {
    console.log("testing " + taskCompletion)
    const task = taskCompletion.task;
    const taskIsCompleted = taskCompletion.completions >= taskCompletion.task.desiredCount;
    return (
        <View
          key={taskCompletion.task.createdDate}
          style={{
            paddingBottom: 20,
          }}
        >
          <Text>
            {task.title + " " + task.desiredCount + "x " + task.frequency}
          </Text>
          <Text>
            {"Progress || " + "X".repeat(taskCompletion.completions)}
          </Text>
          <Pressable
            style={{ ...styles.button, backgroundColor: taskIsCompleted ? "#16a34a" : "#64748b" }}
            key={task.createdDate}
            onPress={() => {
              if (!taskIsCompleted) {
                // TODO------
                // increment the current count of the pressed task
                setCurrentTaskPeriod((currTaskPeriod: ITaskPeriod | undefined) => {
                  if (!currTaskPeriod) {
                    throw new Error("cannot be no current task period!");
                  }
                  const currTaskList = currTaskPeriod.taskCompletions;
                  const otherTasks = currTaskList.filter((t) => t.task.createdDate !== task.createdDate);
                  return {
                    ...currTaskPeriod,
                    taskCompletions: [
                      ...otherTasks,
                      {
                        ...taskCompletion,
                        completions: taskCompletion.completions + 1,
                      },
                    ],
                  };
                });
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              }

            }}>
            <Text style={{
              ...styles.text,
              padding: 10
            }}>{taskCompletion.completions < taskCompletion.task.desiredCount ? "Complete an entry of this task" : "YAY TASK COMPLETED!"}</Text>
          </Pressable>

          <Button
            title={"Remove Count"}
            onPress={() => {
              if (taskCompletion.completions > 0) {
                setCurrentTaskPeriod((currTaskPeriod: ITaskPeriod | undefined) => {
                  if (!currTaskPeriod) {
                    throw new Error("cannot be no current task period!");
                  }
                  const currTaskList = currTaskPeriod.taskCompletions;
                  const otherTasks = currTaskList.filter((t) => t.task.createdDate !== task.createdDate);
                  return {
                    ...currTaskPeriod,
                    taskCompletions: [
                      ...otherTasks,
                      {
                        ...taskCompletion,
                        completions: taskCompletion.completions - 1,
                      },
                    ],
                  };
                });
              }
            }} />
        </View>
    )
  });

  const addTaskButton = (
    <TouchableOpacity onPress={() => setShowAddTaskModal(true)}>
      <Text>+ ADD TASK </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView>
      <Text>Tasks</Text>
      {taskTable}
      {addTaskButton}
      <AddTaskModal showAddTaskModal={showAddTaskModal} setShowAddTaskModal={setShowAddTaskModal}/>
      <Text>{"sortedTaskCompletions" + JSON.stringify(sortedTaskCompletions)}</Text>
      <Text>{JSON.stringify(tasks)}</Text>
      <Text>------------------------</Text>
      <Text>{JSON.stringify(currentTaskPeriod)}</Text>
    </ScrollView>
  )
};


// TODO- pull logic from AddTaskModal.tsx (unify with it)
export const NewTaskModal = () => {
  const { setTasks } = useTasks();
  // TODO get this from the user input
  const newTask: Task = {
    createdDate: Date.now(),
    title: "Exercise",
    taskCategory: TaskCategory.physical,
    frequency: TaskFrequency.weekly,
    desiredCount: 2,
  };

  const addItem = () => {
    setTasks((oldTaskList) => [
      ...oldTaskList,
      newTask,
    ]);
  };

  return (
    <Pressable onPress={addItem}>
      <Text>Press me to add a new hardcoded task</Text>
    </Pressable>
  )
}


// TODO- later, use Selectors to do:
//  FILTERS!! :D
//  STATISTICS!! :D
