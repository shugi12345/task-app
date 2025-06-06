import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
} from 'react-native';
import TodoItem from '../components/TodoItem';
import AppButton from '../components/AppButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TodoScreen = forwardRef((props, ref) => {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortMode, setSortMode] = useState('added');
  const [deletedItems, setDeletedItems] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const sortItems = (list, mode = sortMode) => {
    const sorted = [...list];
    if (mode === 'alpha') {
      sorted.sort((a, b) => a.text.localeCompare(b.text));
    } else {
      sorted.sort((a, b) => new Date(b.created) - new Date(a.created));
    }
    return sorted;
  };

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('todoItems');
      if (saved) setItems(sortItems(JSON.parse(saved)));
      const removed = await AsyncStorage.getItem('deletedTodoItems');
      if (removed) setDeletedItems(JSON.parse(removed));
    })();
  }, []);

  useEffect(() => {
    setItems(prev => sortItems(prev, sortMode));
  }, [sortMode]);

  useImperativeHandle(ref, () => ({
    openAdd: () => setShowForm(true),
  }));

  const addItem = () => {
    if (!text) return;
    const item = { id: Date.now().toString(), text, created: new Date() };
    const newItems = sortItems([...items, item]);
    setItems(newItems);
    AsyncStorage.setItem('todoItems', JSON.stringify(newItems));
    setText('');
  };

  const toggleItem = (id) => {
    const removed = items.find(i => i.id === id);
    const newItems = items.filter(i => i.id !== id);
    setItems(newItems);
    AsyncStorage.setItem('todoItems', JSON.stringify(newItems));
    if (removed) {
      const newDeleted = [removed, ...deletedItems];
      setDeletedItems(newDeleted);
      AsyncStorage.setItem('deletedTodoItems', JSON.stringify(newDeleted));
    }
  };

  const restoreItem = (id) => {
    const item = deletedItems.find(i => i.id === id);
    if (!item) return;
    const newDeleted = deletedItems.filter(i => i.id !== id);
    setDeletedItems(newDeleted);
    AsyncStorage.setItem('deletedTodoItems', JSON.stringify(newDeleted));
    const newItems = sortItems([...items, item]);
    setItems(newItems);
    AsyncStorage.setItem('todoItems', JSON.stringify(newItems));
  };

  const deleteForever = (id) => {
    const newDeleted = deletedItems.filter(i => i.id !== id);
    setDeletedItems(newDeleted);
    AsyncStorage.setItem('deletedTodoItems', JSON.stringify(newDeleted));
  };

  const renderItem = ({ item }) => (
    <TodoItem item={item} onToggle={() => toggleItem(item.id)} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Todo</Text>
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
            title={`Sort: ${sortMode === 'alpha' ? 'A-Z' : 'Latest'}`}
            onPress={() => setShowSortModal(true)}
          />
        </View>
      </View>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />

      <Modal visible={showForm} animationType="slide" transparent onRequestClose={() => setShowForm(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalLabel}>New Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Add todo"
              placeholderTextColor="#aaa"
              value={text}
              onChangeText={setText}
            />
            <View style={styles.buttonRow}>
              <AppButton title="Cancel" onPress={() => setShowForm(false)} />
              <AppButton title="Add" onPress={() => { addItem(); setShowForm(false); }} />
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
            <Text style={styles.modalLabel}>Completed items</Text>
            <FlatList
              data={deletedItems}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyTitle}>{item.text}</Text>
                  </View>
                  <View style={styles.buttonRow}>
                    <AppButton title="Restore" onPress={() => restoreItem(item.id)} />
                    <AppButton title="Delete" onPress={() => deleteForever(item.id)} />
                  </View>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No completed items</Text>}
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
            <Text style={styles.modalLabel}>Sort items by:</Text>
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

export default TodoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#121212' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  screenTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
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
  modalLabel: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
});
