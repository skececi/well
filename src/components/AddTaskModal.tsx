import { Alert, Button, Modal, Pressable, StyleSheet, TextInput } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { Text, View } from "./Themed";
import * as React from "react";
import { Dispatch, FC, SetStateAction, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import useTasks, { ITaskCompletions, ITaskPeriod, Task, TaskCategory, TaskFrequency } from '../hooks/useTasks';

// TODO- fix cyclic import, move the state to a separate file that gets imported here and in NewThingScreen


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

export const AddTaskModal: FC<{
  showAddTaskModal: boolean,
  setShowAddTaskModal: Dispatch<SetStateAction<boolean>>,
}> = ({
  showAddTaskModal,
  setShowAddTaskModal,
}) => {

  const { tasks, setTasks, taskHistory, setTaskHistory, currentTaskPeriod, setCurrentTaskPeriod } = useTasks();

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
      createdDate: Date.now(),
      frequency: TaskFrequency.weekly, // enums aren't working
      taskCategory: TaskCategory.mental,
    };
    setTasks((currTasks) => [
      ...currTasks,
      newCustomTask,
    ]);
    setCurrentTaskPeriod((currTaskPeriod: ITaskPeriod): ITaskPeriod => {
      const newTaskCompletion: ITaskCompletions = {
        task: newCustomTask,
        completions: 0,
      }
      return {
        ...currTaskPeriod,
        taskCompletions: [
          ...currTaskPeriod.taskCompletions,

        ]
      }
    })
    console.log(newCustomTask);
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
        <Text>{JSON.stringify(tasks)}</Text>
        <Controller
          control={control}
          name="title"
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              placeholder={selectedFrequency + " Task Name"}
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
          name="desiredCount"
          render={({field: {onChange, value, onBlur}}) => (
            <TextInput
              placeholder={"Goal count (" + selectedFrequency + ")"}
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
              message: "Frequency must be an integer",
            },
          }}
        />
        <Controller
          control={control}
          name="frequency"
          render={({field: {onChange, value, onBlur}}) => (
            <Picker
              style={{width: 150, height: 180}}
              selectedValue={value}
              itemStyle={{color:'black', fontSize:26}}
              onValueChange={(value: TaskFrequency) => {
                onChange(value);
                setSelectedFrequency(value);
              }}>
              {Object.values(TaskFrequency).map((value, i) => (
                <Picker.Item label={value} value={i} key={i}/>
              ))}
            </Picker>
          )}
          rules={{
            required: {
              value: false,
              message: 'Field is required!',
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
                <Picker.Item  value={i} key={i}/>
              ))}
            </Picker>
          )}
          rules={{
            required: {
              value: false,
              message: 'Field is required!',
            },
          }}
        />
        <Button disabled={!isValid} title='Add Task to Weekly Goals' onPress={handleSubmit(onSubmit)}/>

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