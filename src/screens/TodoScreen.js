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

const TodoScreen = forwardRef((props, ref) => {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortMode, setSortMode] = useState('added');

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
    setText('');
  };

  const toggleItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  const renderItem = ({ item }) => (
    <TodoItem item={item} onToggle={() => toggleItem(item.id)} />
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.screenTitle}>Todo</Text>
        <AppButton
          style={styles.sortHeaderButton}
          textStyle={styles.sortHeaderButtonText}
          title={`Sort: ${sortMode === 'alpha' ? 'A-Z' : 'Added latest'}`}
          onPress={() => setShowSortModal(true)}
        />
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
              title="Added latest"
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
  modalLabel: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
});
