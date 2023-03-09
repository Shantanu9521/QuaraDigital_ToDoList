import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TodoList = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);

  const loadTodos = async () => {
    try {
      const savedTodos = await AsyncStorage.getItem('todos');
      if (savedTodos !== null) {
        setTodos(JSON.parse(savedTodos));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const saveTodo = async (newTodo) => {
    try {
      const updatedTodos = [...todos, newTodo];
      if (updatedTodos.length > 10) {
        updatedTodos.shift();
      }
      await AsyncStorage.setItem('todos', JSON.stringify(updatedTodos));
      setTodos(updatedTodos);
    } catch (err) {
      console.log(err);
    }
  
  };

  const addTodo = () => {
    if (title && description) {
      const newTodo = { title, description };
      saveTodo(newTodo);
      setTitle('');
      setDescription('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />
        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text>Add Todo</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.todoList}>
        {todos.map((todo, index) => (
          <View key={index} style={styles.todo}>
            <Text style={styles.todoTitle}>{todo.title}</Text>
            <Text style={styles.todoDescription}>{todo.description}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
  },
  todoList: {
    flex: 1,
  },
  todo: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  todoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  todoDescription: {
    fontSize: 14,
  },
});

export default TodoList;
