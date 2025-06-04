import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';

function colorFor(level) {
  const ratio = (level - 1) / 4;
  const r = Math.round(255 * ratio);
  const g = Math.round(200 * (1 - ratio));
  return `rgb(${r}, ${g}, 0)`;
}

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
        {[1,2,3,4,5].map(l => (
          <View
            key={l}
            style={[
              styles.dot,
              { backgroundColor: l <= urgency ? colorFor(urgency) : '#333' },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomColor: '#333',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  info: {
    flex: 1,
    marginLeft: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  duration: {
    fontSize: 12,
    color: '#aaa',
  },
  urgency: {
    marginLeft: 8,
    flexDirection: 'row',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 1,
  },
});
