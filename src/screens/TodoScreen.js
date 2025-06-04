import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, Modal } from 'react-native';
import Checkbox from 'expo-checkbox';
import FloatingActionButton from '../components/FloatingActionButton';

export default function TodoScreen() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [showForm, setShowForm] = useState(false);

  const addItem = () => {
    if (!text) return;
    setItems([...items, { id: Date.now().toString(), text }]);
    setText('');
  };

  const toggleItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Checkbox value={false} onValueChange={() => toggleItem(item.id)} />
      <View style={styles.itemTextContainer}>
        <TextInput value={item.text} editable={false} style={styles.itemText} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
      <FloatingActionButton onPress={() => setShowForm(true)} />

      <Modal visible={showForm} animationType="slide" transparent>
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
              <Button title="Add" color="#bb86fc" onPress={() => { addItem(); setShowForm(false); }} />
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
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
  },
});
