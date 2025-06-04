import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import TaskItem from '../components/TaskItem';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [urgency, setUrgency] = useState(1);
  const [dueDate, setDueDate] = useState('');

  const addTask = () => {
    if (!title) return;
    const task = {
      id: Date.now().toString(),
      title,
      duration,
      urgency: Number(urgency),
      dueDate: dueDate ? new Date(dueDate) : null,
      created: new Date(),
    };
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    setTitle('');
    setDuration('');
    setUrgency(1);
    setDueDate('');
    AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const completeTask = (id) => {
    const newTasks = tasks.filter(t => t.id !== id);
    setTasks(newTasks);
    AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const renderItem = ({ item }) => (
    <TaskItem task={item} onComplete={() => completeTask(item.id)} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput
          placeholder="Task title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          placeholder="Duration (e.g. 2h)"
          value={duration}
          onChangeText={setDuration}
          style={styles.input}
        />
        <TextInput
          placeholder="Urgency (1-5)"
          keyboardType="numeric"
          value={String(urgency)}
          onChangeText={(v) => setUrgency(v)}
          style={styles.input}
        />
        <TextInput
          placeholder="Due date (YYYY-MM-DD)"
          value={dueDate}
          onChangeText={setDueDate}
          style={styles.input}
        />
        <Button title="Add" onPress={addTask} />
      </View>

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  form: { marginBottom: 16 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
  },
});
