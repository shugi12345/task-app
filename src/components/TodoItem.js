import React from 'react';
import { Animated, StyleSheet, TextInput, View } from 'react-native';
import Checkbox from 'expo-checkbox';

export default function TodoItem({ item, onToggle }) {
  const [checked, setChecked] = React.useState(false);
  const anim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (checked) {
      Animated.timing(anim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onToggle());
    }
  }, [checked]);

  return (
    <Animated.View
      style={[
        styles.item,
        {
          opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
          transform: [
            { translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [0, -100] }) },
          ],
        },
      ]}
    >
      <Checkbox
        style={styles.checkbox}
        value={checked}
        onValueChange={setChecked}
      />
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
    paddingRight: 8,
    paddingLeft: 16,
    backgroundColor: '#1e1e1e',
    marginVertical: 6,
    borderRadius: 8,
  },
  itemTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  itemText: {
    fontSize: 16,
    color: '#fff',
  },
  checkbox: {
    width: 20,
    height: 20,
  },
});
