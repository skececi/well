import { useReducer } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CompletionEntry, Task, TaskCategory } from "../types/taskTypes";
import { ActionMap } from "../types/actionMap";


const meditationTask: Task = {
  id: 1,
  title: "Meditate",
  duration: 5,
  taskCategory: TaskCategory.mental,
};

const exerciseTask: Task = {
  id: 2,
  title: "Exercise",
  duration: 15,
  taskCategory: TaskCategory.physical,
};

const exampleTasks: Task[] = [meditationTask, exerciseTask];


export default function useTasks() {
  // TODO https://blog.jscrambler.com/how-to-use-redux-persist-in-react-native-with-asyncstorage
  // Basically there is a built in way to persist data with redux, so this will avoid the async stuff
  // const initialState: TaskState = loadInitStateFromStorage();
  const initialState: TaskState = {
    taskList: [],
    completionEntryList: [],
  }

  // TODO see if there is anything to write in here...
  return useReducer(tasksReducer, initialState);
}

export interface TaskState {
  taskList: Task[];
  completionEntryList: CompletionEntry[];
}

export enum ActionType {
  OverrideState = "SET_STATE_FROM_STORAGE",
  AddTask = "ADD_TASK",
  DeleteTask = "DELETE_TASK",
  AddCompletionEntry = "ADD_COMPLETION_ENTRY",
  DeleteCompletionEntry = "DELETE_COMPLETION_ENTRY",
  ResetCompletionEntryList = "RESET_COMPLETION_ENTRY_LIST",
}

type ActionPayload = {
  [ActionType.OverrideState]: TaskState;
  [ActionType.AddTask]: Task;
  [ActionType.DeleteTask]: Task;
  [ActionType.AddCompletionEntry]: CompletionEntry;
  [ActionType.DeleteCompletionEntry]: CompletionEntry;
  [ActionType.ResetCompletionEntryList]: undefined,
}

export type Action = ActionMap<ActionPayload>[keyof ActionMap<ActionPayload>];

function tasksReducer(state: TaskState, action: Action): TaskState {
  switch (action.type) {
    case ActionType.OverrideState:
      // overwrite state with payload (for loading from storage)
      return action.payload;
    case ActionType.AddTask:
      console.log("adding task");
      console.log(state);
      return {
        ...state,
        taskList: [...state.taskList, action.payload],
      };
    case ActionType.DeleteTask:
      return {
        ...state,
        taskList: state.taskList.filter(element => element !== action.payload),
      };
    case ActionType.AddCompletionEntry:
      return {
        ...state,
        completionEntryList: [...state.completionEntryList, action.payload],
      };
    case ActionType.DeleteCompletionEntry:
      return {
        ...state,
        completionEntryList: state.completionEntryList.filter(element => element !== action.payload),
      };
    case ActionType.ResetCompletionEntryList:
      return {
        ...state,
        completionEntryList: [],
      }
    default:
      return state;
  }
}