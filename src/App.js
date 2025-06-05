import React, { useRef, useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StatusBar, View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FloatingActionButton from './components/FloatingActionButton';
import TasksScreen from './screens/TasksScreen';
import TodoScreen from './screens/TodoScreen';

const Tab = createMaterialTopTabNavigator();
const MyTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#bb86fc',
  },
};

export default function App() {
  const navigationRef = useRef();
  const [active, setActive] = useState('Tasks');
  const tasksRef = useRef();
  const todoRef = useRef();

  const handleFab = () => {
    if (active === 'Tasks') {
      tasksRef.current?.openAdd();
    } else {
      todoRef.current?.openAdd();
    }
  };

  return (
    <NavigationContainer
      theme={MyTheme}
      ref={navigationRef}
      onStateChange={() => {
        const route = navigationRef.current.getCurrentRoute();
        setActive(route.name);
      }}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.root}>
        <View style={styles.header}>
          <Text style={styles.appName}>Task Rabbit</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Tab.Navigator tabBarPosition="bottom" swipeEnabled>
            <Tab.Screen name="Tasks">
              {() => <TasksScreen ref={tasksRef} />}
            </Tab.Screen>
            <Tab.Screen name="Todo">
              {() => <TodoScreen ref={todoRef} />}
            </Tab.Screen>
          </Tab.Navigator>
        </View>
        <FloatingActionButton onPress={handleFab} />
      </View>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#121212' },
  header: { paddingHorizontal: 20, paddingTop: 40 },
  appName: {
    color: '#bb86fc',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
