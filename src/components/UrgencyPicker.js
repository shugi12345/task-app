import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';

function colorFor(level) {
  const ratio = (level - 1) / 4; // 0 -> green, 1 -> red
  const r = Math.round(255 * ratio);
  const g = Math.round(200 * (1 - ratio));
  return `rgb(${r}, ${g}, 0)`;
}

export default function UrgencyPicker({ value, onChange }) {
  return (
    <View style={styles.row}>
      {[1,2,3,4,5].map(l => (
        <Pressable key={l} onPress={() => onChange(l)} style={[styles.circle, {backgroundColor: l <= value ? colorFor(l) : '#555'}]} />
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
