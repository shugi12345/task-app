import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  LayoutAnimation,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import TaskItem from '../components/TaskItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

const TasksScreen = forwardRef((props, ref) => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [urgency, setUrgency] = useState(1);
  const [dueDate, setDueDate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortMode, setSortMode] = useState('priority');
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const sortTasks = (list, mode = sortMode) => {
    const sorted = [...list];
    switch (mode) {
      case 'alpha':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'added':
        sorted.sort((a, b) => new Date(b.created) - new Date(a.created));
        break;
      default:
        sorted.sort((a, b) => {
          if (b.urgency !== a.urgency) return b.urgency - a.urgency;
          return a.title.localeCompare(b.title);
        });
    }
    return sorted;
  };

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('tasks');
      if (saved) setTasks(sortTasks(JSON.parse(saved)));
      const removed = await AsyncStorage.getItem('deletedTasks');
      if (removed) setDeletedTasks(JSON.parse(removed));
    })();
  }, []);

  useEffect(() => {
    setTasks((prev) => sortTasks(prev, sortMode));
  }, [sortMode]);

  useImperativeHandle(ref, () => ({
    openAdd: () => {
      setEditingTask(null);
      setShowForm(true);
    },
  }));

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
      const sorted = sortTasks(updated);
      setTasks(sorted);
      AsyncStorage.setItem('tasks', JSON.stringify(sorted));
    } else {
      const task = {
        id: Date.now().toString(),
        title,
        duration: formatDuration(durationMinutes),
        urgency: Number(urgency),
        dueDate,
        created: new Date(),
      };
      const newTasks = sortTasks([...tasks, task]);
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
    const removed = tasks.find(t => t.id === id);
    const newTasks = sortTasks(tasks.filter(t => t.id !== id));
    setTasks(newTasks);
    AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
    if (removed) {
      const newDeleted = [removed, ...deletedTasks];
      setDeletedTasks(newDeleted);
      AsyncStorage.setItem('deletedTasks', JSON.stringify(newDeleted));
    }
  };

  const restoreTask = (id) => {
    const item = deletedTasks.find(t => t.id === id);
    if (!item) return;
    const newDeleted = deletedTasks.filter(t => t.id !== id);
    setDeletedTasks(newDeleted);
    AsyncStorage.setItem('deletedTasks', JSON.stringify(newDeleted));
    const newTasks = sortTasks([...tasks, item]);
    setTasks(newTasks);
    AsyncStorage.setItem('tasks', JSON.stringify(newTasks));
  };

  const deleteForever = (id) => {
    const newDeleted = deletedTasks.filter(t => t.id !== id);
    setDeletedTasks(newDeleted);
    AsyncStorage.setItem('deletedTasks', JSON.stringify(newDeleted));
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
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Tasks</Text>
        <View style={styles.headerButtons}>
          <AppButton
            style={styles.sortHeaderButton}
            textStyle={styles.sortHeaderButtonText}
            title="History"
            onPress={() => setShowHistory(true)}
          />
          <AppButton
            style={styles.sortHeaderButton}
            textStyle={styles.sortHeaderButtonText}
            title={`Sort: ${
              sortMode === 'priority'
                ? 'Priority'
                : sortMode === 'alpha'
                ? 'A-Z'
                : 'Latest'
            }`}
            onPress={() => setShowSortModal(true)}
          />
        </View>
      </View>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />

      <Modal visible={showForm} animationType="slide" transparent onRequestClose={() => setShowForm(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>New Task</Text>
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

      <Modal
        visible={showHistory}
        animationType="slide"
        transparent
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.historyModal}>
            <Text style={styles.modalLabel}>Deleted tasks</Text>
            <FlatList
              data={deletedTasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyTitle}>{item.title}</Text>
                  </View>
                  <View style={styles.buttonRow}>
                    <AppButton title="Restore" onPress={() => restoreTask(item.id)} />
                    <AppButton title="Delete" onPress={() => deleteForever(item.id)} />
                  </View>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No deleted tasks</Text>}
            />
            <AppButton title="Close" onPress={() => setShowHistory(false)} />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showSortModal}
        animationType="fade"
        transparent
        onRequestClose={() => setShowSortModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.sortModal}>
            <Text style={styles.modalLabel}>Sort tasks by:</Text>
            <AppButton
              style={styles.sortOption}
              title="Priority"
              onPress={() => {
                setSortMode('priority');
                setShowSortModal(false);
              }}
            />
            <AppButton
              style={styles.sortOption}
              title="A-Z"
              onPress={() => {
                setSortMode('alpha');
                setShowSortModal(false);
              }}
            />
            <AppButton
              style={styles.sortOption}
              title="Latest"
              onPress={() => {
                setSortMode('added');
                setShowSortModal(false);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
});

export default TasksScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#121212' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortHeaderButton: {
    backgroundColor: 'transparent',
    borderColor: '#bb86fc',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  sortHeaderButtonText: {
    color: '#bb86fc',
    fontSize: 14,
  },
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
  sortModal: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    borderRadius: 8,
    width: '80%',
  },
  sortOption: {
    marginVertical: 4,
  },
  historyModal: {
    backgroundColor: '#1c1c1c',
    padding: 16,
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    padding: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  historyTitle: {
    color: '#fff',
    fontSize: 16,
    marginRight: 8,
  },
  emptyText: {
    color: '#fff',
    textAlign: 'center',
    marginVertical: 8,
  },
});
