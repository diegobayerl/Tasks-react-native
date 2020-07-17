import React, { useState, useCallback, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity,
  Modal, 
  FlatList,
  TextInput,
  AsyncStorage
 } from 'react-native';
import { Ionicons } from '@expo/vector-icons'
import * as Animatable from 'react-native-animatable';

import TaskList from './src/components/TaskList'

const AnimatableBtn = Animatable.createAnimatableComponent(TouchableOpacity);

export default function App() {

  const [task, setTask] = useState([]);

  const [open, setOpen] = useState(false)
  const [Input, SetInput] = useState('')

  useEffect(() => {
    async function loadTasks(){
      const taskStorege = await AsyncStorage.getItem('@task');

      if(taskStorege){
        setTask(JSON.parse(taskStorege));
      }
    };

    loadTasks();
  }, []);

  useEffect(() => {
    async function saveTask(){
      await AsyncStorage.setItem('@task', JSON.stringify(task))
    }
    saveTask();
  },[task]);

  function handleAdd(){
    if(Input === '') return;

    const data = {
      key : Input,
      task : Input
    };

    setTask([...task, data]);
    setOpen(false);
    SetInput('');
  }
  
  const handleDelete = useCallback((data) => {
    const find = task.filter(r => r.key !== data.key);
    setTask(find);
  })


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroudColor="#171d31" barStyle="light-content" />

      <View style={styles.content}>
      <Text style={styles.title}>Minhas Tarefas</Text>
      </View>

      <Modal 
      animationType="slide" 
      transparent={false} visible={open}
      >
        <SafeAreaView style={styles.Modal}>

          <View style={styles.ModalHeader}>
            <TouchableOpacity onPress={()=> setOpen(false)}>
              <Ionicons style={{marginLeft: 5, marginRight: 5}} name="md-arrow-back" size={40} color="#fff" />
            </TouchableOpacity> 
            <Text style={styles.ModalText}>Nova Tarefa</Text>
          </View>

          <Animatable.View style={styles.ModalBody} animation="fadeInUp" useNativeDriver>
            <TextInput 
            multiline={true}
            placeholderTextColor="#757575"
            autoCorrect={true}
            placeholder="O que precisa fazer hoje ?"
            style={styles.ModalInput}
            value={Input}
            onChangeText={(text)=> SetInput(text)}
            />

            <TouchableOpacity style={styles.ModalAddTarefa} onPress={handleAdd}>
              <Text style={styles.ModalAddText}>Adicionar</Text>
            </TouchableOpacity>
          </Animatable.View>

        </SafeAreaView>
      </Modal>


      <FlatList
        marginHorizontal={10}
        showsHorizontalScrollIndicator={false}
        data={task}
        keyExtractor={(item) => String(item.key)}
        renderItem={({item}) => <TaskList data={item} handleDelete={handleDelete} />}
      />


      <AnimatableBtn 
      style={styles.fab}
      useNativeDriver
      animation= "bounceInUp"
      duration={1500}
      onPress={()=> setOpen(true)}
      >
        <Ionicons name="ios-add" size={35} color="#fff" />
      </AnimatableBtn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#171d31',
  },
  title:{
    color: "#fff",
    fontSize: 25,
    marginBottom: 10,
    marginTop: 10,
    textAlign: "center",
  },
  content:{},
  fab:{
    position: "absolute",
    width: 60,
    height: 60,
    backgroundColor: '#0094ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    right: 25,
    bottom: 25,
    elevation: 2,
    zIndex: 9,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 1,
      height: 3
    }
  },
  Modal:{
   flex: 1,
   backgroundColor: '#171d31',
  },
  ModalHeader:{
    marginLeft: 10,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ModalText:{
    color: '#fff',
    fontSize: 25,
    marginLeft: 15,
  },
  ModalBody:{
    marginTop: 15,
  },
  ModalInput:{
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 9,
    color: '#000',
    borderRadius: 5,
  },
  ModalAddTarefa:{
    backgroundColor: '#fff',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  ModalAddText:{
    color:'#999',
    fontSize: 20,
  }
});
