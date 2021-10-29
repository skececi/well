import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import useTasks, { ActionType, TaskState } from "./useTasks";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export async function loadObjFromStorage(key: string) {
  const loadedData = await AsyncStorage.getItem(key);
  if (loadedData) {
    console.log("loaded data")
    console.log(loadedData);
    return JSON.parse(loadedData);
  }
  return null;
}

export async function saveObjToStorage(key: string, obj: any) {
  console.log("blah");
  try {
    await AsyncStorage.setItem(key, JSON.stringify(obj));
  } catch (e) {
    console.error("saving error");
  }
}

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);
  const [taskState, taskDispatch] = useTasks();

  const saveDataOnAppClose = async (nextAppState: string) => {
    console.log("heyo1")

    if (nextAppState === 'background' || nextAppState === 'inactive') {
      console.log("heyo22")

      await saveObjToStorage("@task_state", JSON.stringify(taskState));
    }
  };

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    console.log("heyo")
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('../assets/fonts/SpaceMono-Regular.ttf'),
        });

        // Load Task data from cache and set that as the app state
        taskDispatch({
          type: ActionType.OverrideState,
          payload: await loadObjFromStorage("@task_state") as TaskState,
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    AppState.addEventListener('change', saveDataOnAppClose);
    loadResourcesAndDataAsync();

    return function cleanup() {
      AppState.removeEventListener('change', saveDataOnAppClose);
    };
  }, []);

  return isLoadingComplete;
}
