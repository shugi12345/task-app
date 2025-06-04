import React from 'react';
import { Animated, StyleSheet, TextInput, View } from 'react-native';
import Checkbox from 'expo-checkbox';

export default function TodoItem({ item, onToggle }) {
  const anim = React.useRef(new Animated.Value(1)).current;

  const handleToggle = () => {
    Animated.timing(anim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onToggle());
  };

  return (
    <Animated.View style={[styles.item, { opacity: anim, transform: [{ scale: anim }] }]}>
      <Checkbox value={false} onValueChange={handleToggle} />
      <View style={styles.itemTextContainer}>
        <TextInput value={item.text} editable={false} style={styles.itemText} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#1e1e1e',
    marginVertical: 6,
    borderRadius: 8,
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
