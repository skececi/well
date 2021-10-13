import { Alert, Modal, Pressable, StyleSheet, TextInput } from "react-native";
import { Text, TextProps, View } from "./Themed";
import * as React from "react";
import useTasks, { ActionType } from "../hooks/useTasks";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Task, TaskCategory } from "../types/taskTypes";
import uuid from 'react-native-uuid';



const styles = StyleSheet.create({
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

const AddTaskModal: FC<{
  showAddTaskModal: boolean,
  setShowAddTaskModal: Dispatch<SetStateAction<boolean>>,
}> = ({
  showAddTaskModal,
  setShowAddTaskModal,
}) => {
  const [state, dispatch] = useTasks();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCategory, setTaskCategory] = useState<TaskCategory | string>("");

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showAddTaskModal}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setShowAddTaskModal(!showAddTaskModal);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text>Hello World!</Text>
          <TextInput
            style={{height: 40}}
            placeholder="Task"
            onChangeText={title => setTaskTitle(title)}
            defaultValue={taskTitle}
          />

          <Pressable
            onPress={() => setShowAddTaskModal(!showAddTaskModal)}
          >
            <Text>Cancel</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setShowAddTaskModal(!showAddTaskModal);
            }}
          >
            <Text>Add Task</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default AddTaskModal;