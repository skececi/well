import * as React from 'react';
import { Alert, Button, Modal, Pressable, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

import EditScreenInfo from './EditScreenInfo';
import { Text, View } from './Themed';
import { useEffect, useState } from "react";
import AddTaskModal from "./AddTaskModal";


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
  buttonNotCompleted: {
    elevation: 8,
    backgroundColor: "#A2F9DE",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  buttonCompleted: {
    elevation: 8,
    backgroundColor: "gray",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
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

export default function MainScreen() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Will be deleted soon! </Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
    </View>
  );
}


