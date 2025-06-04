import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';

function computeUrgency(task) {
  if (!task.dueDate) return task.urgency;
  const due = new Date(task.dueDate);
  const created = new Date(task.created);
  const now = new Date();
  const total = due - created;
  const remaining = due - now;
  if (total <= 0) return task.urgency;
  const progress = 1 - remaining / total;
  return Math.min(5, task.urgency + Math.floor(progress * (5 - task.urgency)));
}

export default function TaskItem({ task, onComplete }) {
  const [checked, setChecked] = React.useState(false);
  const urgency = computeUrgency(task);
  return (
    <View style={styles.row}>
      <Checkbox value={checked} onValueChange={(v) => { setChecked(v); if (v) onComplete(); }} />
      <View style={styles.info}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.duration}>{task.duration}</Text>
      </View>
      <View style={styles.urgency}>
        <Text>{'\u2B24'.repeat(urgency)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  info: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  duration: {
    fontSize: 12,
    color: '#666',
  },
  urgency: {
    marginLeft: 8,
  },
});
