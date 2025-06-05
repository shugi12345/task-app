import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Modal, TouchableOpacity, LayoutAnimation } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import TaskItem from '../components/TaskItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FloatingActionButton from '../components/FloatingActionButton';
import UrgencyPicker from '../components/UrgencyPicker';
import AppButton from '../components/AppButton';
import Slider from '@react-native-community/slider';

function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const parts = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  return parts.join(' ') || '0m';
}

function parseDuration(str) {
  const match = str.match(/(?:(\d+)h)?\s*(\d+)m/);
  if (!match) return 0;
  return Number(match[1] || 0) * 60 + Number(match[2]);
}

function formatDurationWithZeros(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const parts = [];
  if (h) parts.push(`${h}h`);
  parts.push(`${m.toString().padStart(2, '0')}m`);
  return parts.join(' ');
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
  const [editingTask, setEditingTask] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);

  const saveTask = () => {
    if (!title) return;

    if (editingTask) {
      const updated = tasks.map((t) =>
        t.id === editingTask.id
          ? {
              ...editingTask,
              title,
              duration: formatDuration(durationMinutes),
              urgency: Number(urgency),
              dueDate,
            }
          : t
      );
      setTasks(updated);
      AsyncStorage.setItem('tasks', JSON.stringify(updated));
    } else {
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
      AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    }

    setTitle('');
    setDurationMinutes(0);
    setUrgency(1);
    setDueDate(null);
    setEditingTask(null);
    setShowForm(false);
  };

  const completeTask = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newTasks = tasks.filter(t => t.id !== id);
    setTasks(newTasks);
    AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const startEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDurationMinutes(parseDuration(task.duration));
    setUrgency(task.urgency);
    setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setShowForm(true);
  };

  const renderItem = ({ item }) => (
    <TaskItem task={item} onPress={() => startEdit(item)} onComplete={() => completeTask(item.id)} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.appName}>Task Rabbit</Text>
      <Text style={styles.screenTitle}>Tasks</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      <FloatingActionButton onPress={() => setShowForm(true)} />

      <Modal visible={showForm} animationType="slide" transparent onRequestClose={() => setShowForm(false)}>
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
              <Modal transparent animationType="fade" onRequestClose={() => setShowDurationPicker(false)}>
                <View style={styles.modalBackdrop}>
                  <View style={styles.pickerModal}>
                    <Text style={styles.modalLabel}>{formatDurationWithZeros(durationMinutes)}</Text>
                    <Slider
                      minimumValue={0}
                      maximumValue={240}
                      step={5}
                      value={durationMinutes}
                      onValueChange={setDurationMinutes}
                      minimumTrackTintColor="#bb86fc"
                      style={{ width: '100%', height: 40, marginBottom: 16 }}
                    />
                    <AppButton title="Done" onPress={() => setShowDurationPicker(false)} />
                  </View>
                </View>
              </Modal>
            )}

            <UrgencyPicker value={urgency} onChange={setUrgency} />

            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={[styles.input, styles.dateInput]}>
                {dueDate ? formatDate(dueDate) : 'Pick due date'}
              </Text>
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
              <AppButton title="Cancel" onPress={() => { setShowForm(false); setEditingTask(null); }} />
              <AppButton title={editingTask ? 'Save' : 'Add'} onPress={saveTask} />
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
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
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
  dateInput: {
    marginTop: 20,
  },
  appName: {
    color: '#bb86fc',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalLabel: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
