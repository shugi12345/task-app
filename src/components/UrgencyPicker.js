import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

function colorFor(level) {
  const hue = 120 - (level - 1) * 30; // 1 -> green, 5 -> red
  return `hsl(${hue}, 100%, 50%)`;
}

export default function UrgencyPicker({ value, onChange }) {
  return (
    <View style={styles.row}>
      {[1,2,3,4,5].map(l => (
        <Pressable
          key={l}
          onPress={() => onChange(l)}
          style={[
            styles.circle,
            { backgroundColor: l <= value ? colorFor(value) : '#555' },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 2,
  },
});
