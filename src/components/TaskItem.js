import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Checkbox from 'expo-checkbox';

function colorFor(level) {
  const ratio = (level - 1) / 4;
  const r = Math.round(Math.min(255, 510 * ratio));
  const g = Math.round(Math.min(255, 510 * (1 - ratio)));
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

export default function TaskItem({ task, onComplete, onPress }) {
  const [checked, setChecked] = React.useState(false);
  const anim = React.useRef(new Animated.Value(0)).current;
  const urgency = computeUrgency(task);

  React.useEffect(() => {
    if (checked) {
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onComplete());
    }
  }, [checked]);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <Animated.View
        style={[
          styles.row,
          {
            opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
            transform: [
              {
                translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -100] }),
              },
            ],
          },
        ]}
      >
        <Checkbox style={styles.checkbox} value={checked} onValueChange={setChecked} />
        <View style={styles.info}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.duration}>{task.duration}</Text>
          {task.dueDate && (
            <Text style={styles.dueDate}>Due {task.dueDate.slice(0, 10)}</Text>
          )}
        </View>
        <View style={styles.urgency}>
          {[1, 2, 3, 4, 5].map((l) => (
            <View
              key={l}
              style={[
                styles.dot,
                { backgroundColor: l <= urgency ? colorFor(urgency) : '#333' },
              ]}
            />
          ))}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingVertical: 12,
    paddingRight: 8,
    paddingLeft: 16,
    borderRadius: 8,
    marginVertical: 6,
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
  dueDate: {
    fontSize: 12,
    color: '#aaa',
  },
  urgency: {
    marginLeft: 8,
    flexDirection: 'row',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
  },
});
