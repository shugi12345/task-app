import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Modal, TouchableOpacity, LayoutAnimation } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import TaskItem from '../components/TaskItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FloatingActionButton from '../components/FloatingActionButton';
import UrgencyPicker from '../components/UrgencyPicker';
import Slider from '@react-native-community/slider';

function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const parts = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  return parts.join(' ') || '0m';
}

function formatDate(d) {
  return d.toISOString().slice(0, 10);
}

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [urgency, setUrgency] = useState(1);
  const [dueDate, setDueDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  const addTask = () => {
    if (!title) return;
    const task = {
      id: Date.now().toString(),
      title,
      duration: formatDuration(durationMinutes),
      urgency: Number(urgency),
      dueDate,
      created: new Date(),
    };
    const newTasks = [...tasks, task];
    setTasks(newTasks);
    setTitle('');
    setDurationMinutes(0);
    setUrgency(1);
    setDueDate(null);
    setShowForm(false);
    AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const completeTask = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
              <Text style={styles.input}>{formatDuration(durationMinutes) || 'Pick duration'}</Text>
            </TouchableOpacity>
            {showDurationPicker && (
              <Modal transparent animationType="fade">
                <View style={styles.modalBackdrop}>
                  <View style={styles.pickerModal}>
                    <Text style={styles.modalLabel}>{formatDuration(durationMinutes)}</Text>
                    <Slider
                      minimumValue={0}
                      maximumValue={240}
                      step={5}
                      value={durationMinutes}
                      onValueChange={setDurationMinutes}
                      minimumTrackTintColor="#bb86fc"
                    />
                    <Button title="Done" color="#bb86fc" onPress={() => setShowDurationPicker(false)} />
                  </View>
                </View>
              </Modal>
            )}

            <UrgencyPicker value={urgency} onChange={setUrgency} />

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.input}>{dueDate ? formatDate(dueDate) : 'Pick due date'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dueDate || new Date()}
                mode="date"
                display="calendar"
                onChange={(e, selected) => {
                  if (selected) setDueDate(selected);
                  setShowDatePicker(false);
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
  container: { flex: 1, padding: 20, backgroundColor: '#121212' },
  input: {
    borderColor: '#444',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
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
  pickerModal: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  modalLabel: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
