import { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Task } from "../screens/MainScreen";


export default function useStoredTaskList() {
  const [taskList, setTaskList] = useState([]);
  useEffect(() => {
    loadTaskList().then(tasks => setTaskList(tasks));
  }, []);

  async function loadTaskList() {
    const loadedData = await AsyncStorage.getItem("@task_list");
    if (loadedData) {
      console.log(loadedData);
      return JSON.parse(loadedData);
    }
    return [];
  }
  async function storeTaskList(taskList: Task[]) {
    try {
      await AsyncStorage.setItem("@task_list", JSON.stringify(taskList));
    } catch (e) {
      // saving error
      console.error("saving error");
    }
  }
  return [taskList, setTaskList];
}