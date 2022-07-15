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

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('../../assets/fonts/SpaceMono-Regular.ttf'),
        });

      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }
    loadResourcesAndDataAsync();

    return function cleanup() {
    };
  }, []);

  return isLoadingComplete;
}
