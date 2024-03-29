import { atom, DefaultValue, selector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { endOfWeek, startOfWeek } from 'date-fns';
import { useEffect } from "react";

export enum DayOfTheWeek {
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}

export enum TaskCategory {
  physical = "Physical",
  mental = "Mental Health",
  leisure = "Leisure",
}

export enum TaskFrequency {
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
}

export type Task = {
  createdDate: number;
  title: string;
  taskCategory: TaskCategory | string; // string for custom category
  frequency: TaskFrequency;
  desiredCount: number;
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
];

function getTaskEntryForCurrentPeriod(taskHistory: ITaskPeriod[]) {
  const historyCopy = taskHistory.slice().sort((a, b) => a.endDate.getTime() - b.endDate.getTime());
  console.log('');
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

/* TODO-
   1. the date is not properly accounting for Saturdays (need to change to EOD saturday and very beginning of sunday)
*/
export default function useTasks() {
  // this is the store of a user's preferences for what they want to do each week
  const taskState = atom({
    key: 'taskState',
    default: exampleTasks as Task[],
  });

  // IMPORTANT: YOU MUST ONLY EVER *APPEND* TO THIS OR SOME LOGIC AROUND DATE CHECKING WILL BE MESSED UP
  const taskHistoryState = atom({
    key: 'taskHistoryState',
    default: exampleTaskHistory as ITaskPeriod[],
  });

  // time based
  const currentTaskPeriodState = selector({
    key: 'currentTaskPeriod',
    get: ({ get }): ITaskPeriod => {
      console.log("get curr task period state");
      console.log(get(taskHistoryState));
      const currentTaskHistory = get(taskHistoryState);
      
      if (!getTaskEntryForCurrentPeriod(currentTaskHistory)) {
        // add new task entry to the overall state and return latest
        console.log("BEFORE ADDING CURRENT PERIOD: " + JSON.stringify(get(taskHistoryState)));

        // TODO- this is not working?
        setTaskHistory((curr: ITaskPeriod[]) => [
          ...curr,
          createNewTaskPeriod(tasks, TaskFrequency.weekly, weekStart),
        ]);
        console.log("AFTER ADDING CURRENT PERIOD: " + JSON.stringify(get(taskHistoryState)));
        console.log("LAST ELEMENT: " + JSON.stringify(get(taskHistoryState)[get(taskHistoryState).length - 1]));
        // return last element (i.e. the one we just created) -- WILL THIS WORK?
        return currentTaskHistory[currentTaskHistory.length - 1]; 
      } else {
        // safe to add ! because we just checked above if it was undefined
        return getTaskEntryForCurrentPeriod(currentTaskHistory)!;
      }
    },
    set: ({ get, set }, updatedCurrentTaskPeriod) => {
      // Note that this simply updates the last entry - the logic for creating a new entry each week lives elsewhere!
      // check if there is a current task period, else we shouldn't be calling this!
      console.log("setting" + updatedCurrentTaskPeriod);
      if (getTaskEntryForCurrentPeriod(get(taskHistoryState))) {
        // slice all but the last, and append the new currentTaskPeriod
        const newVal: ITaskPeriod[] = [...get(taskHistoryState).slice(0, -1), updatedCurrentTaskPeriod] as ITaskPeriod[];
        set(taskHistoryState, newVal);
      } else {
        throw new Error("Shouldn't be calling updateCurrentTaskPeriod if it doesn't exist!")
      }
    }
  })

  const [tasks, setTasks] = useRecoilState(taskState);
  const [taskHistory, setTaskHistory] = useRecoilState(taskHistoryState);
  const [currentTaskPeriod, setCurrentTaskPeriod] = useRecoilState(currentTaskPeriodState);

  const weekStart = useRecoilValue(weekStartState);

  // TODO- load the initial data from storage

  return { tasks, setTasks, taskHistory, setTaskHistory, currentTaskPeriod, setCurrentTaskPeriod }
}