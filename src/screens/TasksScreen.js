import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import TaskItem from '../components/TaskItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import FloatingActionButton from '../components/FloatingActionButton';
import UrgencyPicker from '../components/UrgencyPicker';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [urgency, setUrgency] = useState(1);
  const [dueDate, setDueDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);

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
    setShowForm(false);
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
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      <FloatingActionButton onPress={() => setShowForm(true)} />

      <Modal visible={showForm} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Task title"
              placeholderTextColor="#aaa"
              value={title}
              onChangeText={setTitle}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowDurationPicker(true)}>
              <Text style={styles.input}>{duration || 'Pick duration'}</Text>
            </TouchableOpacity>
            {showDurationPicker && (
              <DateTimePicker
                value={new Date()}
                mode="time"
                onChange={(e, d) => {
                  setShowDurationPicker(false);
                  if (d) {
                    const hours = d.getHours();
                    const minutes = d.getMinutes();
                    const parts = [];
                    if (hours) parts.push(`${hours}h`);
                    if (minutes) parts.push(`${minutes}m`);
                    setDuration(parts.join(' ') || '0m');
                  }
                }}
              />
            )}

            <UrgencyPicker value={urgency} onChange={setUrgency} />

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.input}>{dueDate || 'Pick due date'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dueDate ? new Date(dueDate) : new Date()}
                mode="date"
                onChange={(e, d) => {
                  setShowDatePicker(false);
                  if (d) {
                    const dateStr = d.toISOString().slice(0,10);
                    setDueDate(dateStr);
                  }
                }}
              />
            )}
            <View style={styles.buttonRow}>
              <Button title="Add" color="#bb86fc" onPress={addTask} />
              <Button title="Cancel" color="#bb86fc" onPress={() => setShowForm(false)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#121212' },
  input: {
    borderColor: '#444',
    borderWidth: 1,
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
    color: '#fff',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    borderRadius: 8,
    width: '90%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
