import React, { useState, forwardRef, useImperativeHandle } from 'react';
import {
  View,
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

  useImperativeHandle(ref, () => ({
    openAdd: () => setShowForm(true),
  }));

  const addItem = () => {
    if (!text) return;
    setItems([...items, { id: Date.now().toString(), text }]);
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
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />

      <Modal visible={showForm} animationType="slide" transparent onRequestClose={() => setShowForm(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
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
    </View>
  );
});

export default TodoScreen;

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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
