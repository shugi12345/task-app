import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import Checkbox from 'expo-checkbox';

function formatDate(d) {
  const date = new Date(d);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

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
  const anim = React.useRef(new Animated.Value(task.animateIn ? -1 : 0)).current;
  const heightAnim = React.useRef(new Animated.Value(0)).current;
  const marginAnim = React.useRef(new Animated.Value(6)).current;
  const [measured, setMeasured] = React.useState(false);
  const urgency = computeUrgency(task);

  React.useEffect(() => {
    if (task.animateIn && measured) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (measured) {
      anim.setValue(0);
    }
  }, [measured]);

  React.useEffect(() => {
    if (checked && measured) {
      Animated.parallel([
        Animated.timing(anim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(heightAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(marginAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => onComplete());
    }
  }, [checked, measured]);

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
      <Animated.View
        onLayout={(e) => {
          if (!measured) {
            heightAnim.setValue(e.nativeEvent.layout.height);
            setMeasured(true);
          }
        }}
        style={[
          styles.row,
          {
            opacity: anim.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 1, 0] }),
            transform: [
              {
                translateX: anim.interpolate({
                  inputRange: [-1, 0, 1],
                  outputRange: [-100, 0, -100],
                }),
              },
            ],
            height: heightAnim,
            marginVertical: marginAnim,
            overflow: 'hidden',
          },
        ]}
      >
        <TouchableOpacity onPress={() => setChecked(!checked)} style={styles.checkboxWrapper}>
          <Checkbox style={styles.checkbox} value={checked} onValueChange={setChecked} />
        </TouchableOpacity>
        <View style={styles.info}>
          <Text style={styles.title}>{task.title}</Text>
          <Text style={styles.duration}>{task.duration}</Text>
          {task.dueDate && (
            <Text style={styles.dueDate}>Due {formatDate(task.dueDate)}</Text>
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
    marginLeft: 16,
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
  checkboxWrapper: {
    padding: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
  },
});
