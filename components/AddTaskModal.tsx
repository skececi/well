import { Alert, Button, Modal, Picker, Pressable, StyleSheet, TextInput } from "react-native";
import { Text, TextProps, View } from "./Themed";
import * as React from "react";
import useTasks, { ActionType } from "../hooks/useTasks";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Task, TaskCategory } from "../types/taskTypes";
import uuid from 'react-native-uuid';
import { useForm, Controller } from "react-hook-form";


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
  const {
    control,
    handleSubmit,
    formState: {errors, isValid},
    reset,
  } = useForm({mode: 'onBlur'})

  const onSubmit = (data: any, e: any) => {
    console.log(data);
    const newCustomTask: Task = {
      ...data,
      id: uuid.v4(),
      duration: parseInt(data.duration),
    };
    // id: number;
    // title: string;
    // duration?: number;
    // taskCategory: TaskCategory | string; // string for custom category
    console.log(newCustomTask);
    dispatch({ type: ActionType.AddTask, payload: newCustomTask});
    reset();
    setShowAddTaskModal(false);
  }

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
        <Controller
          control={control}
          name="title"
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              placeholder="Daily Task Name"
              value={value}
              onBlur={onBlur}
              onChangeText={value => onChange(value)}
            />
          )}
          rules={{
            required: {
              value: true,
              message: 'Field is required!'
            },
          }}
        />
        <Controller
          control={control}
          name="duration"
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              placeholder={"Duration (Minutes) - Optional"}
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              keyboardType={"numeric"}
            />
          )}
          rules={{
            required: {
              value: false,
              message: 'Field is required!',
            },
            pattern: {
              value: /^\d+$/,
              message: "Duration must be a number",
            },
          }}
        />
        <Controller
          control={control}
          name="taskCategory"
          render={({field: {onChange, value, onBlur}}) => (
            <Picker
              style={{width: 150, height: 180}}
              selectedValue={value}
              itemStyle={{color:'black', fontSize:26}}
              onValueChange={value => onChange(value)}>
              {Object.values(TaskCategory).map((value, i) => (
                <Picker.Item label={value} value={i} key={i}/>
              ))}
            </Picker>
          )}
          rules={{
            required: {
              value: false,
              message: 'Field is required!',
            },
            pattern: {
              value: /^\d+$/,
              message: "Duration must be a number",
            },
          }}
        />
        <Button disabled={!isValid} title='Add To Daily Flow' onPress={handleSubmit(onSubmit)}/>

        <Pressable onPress={() => {
          console.log("cancel")
          setShowAddTaskModal(!showAddTaskModal);
          reset();
        }}>
          <Text>Cancel</Text>
        </Pressable>

      </View>
    </Modal>
  );
}

export default AddTaskModal;