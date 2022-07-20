import * as React from 'react';
import { Button, Pressable, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from './Themed';
import { atom, DefaultValue, selector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Task, TaskCategory, TaskFrequency } from "../types/taskTypes";
import uuid from "react-native-uuid";
import * as Haptics from "expo-haptics";
import { endOfWeek, startOfWeek } from 'date-fns';
import { useEffect } from "react";

enum DayOfTheWeek {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
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
};

const exerciseTask: Task = {
  createdDate: 2,
  title: "Exercise",
  taskCategory: TaskCategory.physical,
  frequency: TaskFrequency.weekly,
  desiredCount: 2,
};

// represents the tracked number of completions for one specific period of time
export interface ITaskCompletions {
  task: Task,
  completions: number,
}

export interface ITaskPeriod {
  startDate: Date;
  endDate: Date;
  taskCompletions: ITaskCompletions[];
}

const exampleTasks: Task[] = [meditationTask, exerciseTask];
const exampleTaskCompletions: ITaskCompletions[] = [
  {
    task: exerciseTask,
    completions: 1
  },
  {
    task: meditationTask,
    completions: 2,
  }]

const weekStartState = atom({
  key: 'weekStart',
  default: DayOfTheWeek.SUNDAY,
});

const exampleTaskHistory: ITaskPeriod[] = [
  {
    startDate: new Date("2019-01-01"),
    endDate: new Date("2019-01-07"),
    taskCompletions: exampleTaskCompletions
  },
  {
    startDate: new Date("2022-07-10"),
    endDate: new Date("2022-07-16"),
    taskCompletions: exampleTaskCompletions
  },
  {
    startDate: new Date("2022-07-10"),
    endDate: new Date("2022-07-16"),
    taskCompletions: exampleTaskCompletions
  },
  {
    startDate: new Date("2022-07-17"),
    endDate: new Date("2022-07-23"),
    taskCompletions: exampleTaskCompletions
  }
];

// IMPORTANT: YOU MUST ONLY EVER *APPEND* TO THIS OR SOME LOGIC AROUND DATE CHECKING WILL BE MESSED UP
const taskHistoryState = atom({
  key: 'taskHistoryState',
  default: exampleTaskHistory as ITaskPeriod[],
});

function getTaskEntryForCurrentPeriodIfItExists(taskHistory: ITaskPeriod[]) {
  // TODO optimize to only check the last entry if this is slow
  const historyCopy = taskHistory.slice().sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
  console.log("testio" + !historyCopy[historyCopy.length - 1])
  if (!historyCopy[historyCopy.length - 1] || historyCopy[historyCopy.length - 1]!.endDate.getTime() < Date.now()) {
    console.log(Date.now())
    return undefined;
  } else {
    return historyCopy[historyCopy.length - 1];
  }
}

function createNewTaskPeriod(tasks: Task[], frequency: TaskFrequency, weekStart: DayOfTheWeek): ITaskPeriod {
  // TODO- switch on monthly, daily, etc
  const startDate = startOfWeek(Date.now(), { weekStartsOn: weekStart });
  const endDate = endOfWeek(Date.now(), { weekStartsOn: weekStart });
  const taskCompletions: ITaskCompletions[] = tasks.map((task) => (
    {
      task,
      completions: 0,
    }
  ));
  return {
    startDate,
    endDate,
    taskCompletions,
  }
}

// // TODO- determine whether this works when things are updated!
export function useCurrentTaskPeriod() {
  const [taskHistory, setTaskHistory] = useRecoilState(taskHistoryState);
  const weekStart = useRecoilValue(weekStartState);
  const tasks = useRecoilValue(taskState);
  return {
    getCurrentTaskPeriod: () => getTaskEntryForCurrentPeriodIfItExists(taskHistory),
    initiallyAppendNewPeriod: () => setTaskHistory([
      ...taskHistory,
      createNewTaskPeriod(tasks, TaskFrequency.weekly, weekStart),
    ]),
    updateLatestTaskPeriod: (updatedLatestPeriod: ITaskPeriod) => setTaskHistory([...taskHistory.slice(0, -1), updatedLatestPeriod]),
  }
}


const currentTaskPeriodState = selector({
  key: 'currentTaskPeriod',
  get: ({ get }): ITaskPeriod | undefined => {
    console.log("testing get curr task period state");
    console.log(get(taskHistoryState));
    return getTaskEntryForCurrentPeriodIfItExists(get(taskHistoryState));
  },
  set: ({ get, set }, updatedCurrentTaskPeriod) => {
    // Note that this simply updates the last entry - the logic for creating a new entry each week lives elsewhere!
    // check if there is a current task period, else we shouldn't be calling this!
    console.log("setting" + updatedCurrentTaskPeriod);
    if (getTaskEntryForCurrentPeriodIfItExists(get(taskHistoryState))) {
      // slice all but the last, and append the new currentTaskPeriod
      const newVal: ITaskPeriod[] = [...get(taskHistoryState).slice(0, -1), updatedCurrentTaskPeriod] as ITaskPeriod[];
      set(taskHistoryState, newVal);
    } else {
      throw new Error("Shouldn't be calling updateCurrentTaskPeriod if it doesn't exist!")
    }
  }
})

// this is the store of a user's preferences for what they want to do each week
const taskState = atom({
  key: 'taskState',
  default: exampleTasks as Task[],
});


/* call when the app is loaded:
  1. Load the state from storage and pass into recoil state
  2. Check time period from last completed task history, and see if we need to store the current taskState into history and reset it
  3.
 */
function onLoad() {
  // TODO-
}

export const NEWTHINGScreen = () => {
  const [tasks, setTasks] = useRecoilState(taskState);
  const [taskHistory, setTaskHistory] = useRecoilState(taskHistoryState);
  const [currentTaskPeriod, setCurrentTaskPeriod] = useRecoilState(currentTaskPeriodState);
  const weekStart = useRecoilValue(weekStartState);

  useEffect(() => {
    // TODO- load the initial data from storage

    if (!currentTaskPeriod) {
      setTaskHistory((curr: ITaskPeriod[]) => [
        ...curr,
        createNewTaskPeriod(tasks, TaskFrequency.weekly, weekStart),
      ]);
    }
  }, [])

  const isToday = (someDate: Date) => {
    const today = new Date()
    return someDate.getDate() == today.getDate() &&
      someDate.getMonth() == today.getMonth() &&
      someDate.getFullYear() == today.getFullYear()
  }

  // @ts-ignore
  const sortedTaskCompletions: ITaskCompletions[] = currentTaskPeriod?.taskCompletions.slice().sort((a: ITaskCompletions, b: ITaskCompletions) => a.task.createdDate - b.task.createdDate); // create a copy because the O.G. one is tied to Recoil state
  const taskTable = sortedTaskCompletions.map((taskCompletion: ITaskCompletions) => {
    console.log("testing " + taskCompletion)
    const task = taskCompletion.task;
    const taskIsCompleted = taskCompletion.completions >= taskCompletion.task.desiredCount;
    return (
      <>
        <View
          style={{
            borderBottomColor: 'red',
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
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
                setCurrentTaskPeriod((currTaskPeriod: ITaskPeriod) => {
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
                setCurrentTaskPeriod((currTaskPeriod: ITaskPeriod) => {
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
      </>
    )
  })


  return (
    <View style={styles.container}>
      <Text>Tasks</Text>
      {taskTable}
      <Text>{JSON.stringify(sortedTaskCompletions)}</Text>
    </View>
  )
};


// TODO- pull logic from AddTaskModal.tsx (unify with it)
export const NewTaskModal = () => {
  const setTasks = useSetRecoilState(taskState);
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
