import React, { useRef, useState } from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { StatusBar, View, Text, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FloatingActionButton from './components/FloatingActionButton';
import AppButton from './components/AppButton';
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
  const [taskSortMode, setTaskSortMode] = useState('priority');
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
          <View style={styles.titleRow}>
            <Text style={styles.screenTitle}>{active}</Text>
            {active === 'Tasks' && (
              <AppButton
                style={styles.sortHeaderButton}
                textStyle={styles.sortHeaderButtonText}
                title={`Sort: ${
                  taskSortMode === 'priority'
                    ? 'Priority'
                    : taskSortMode === 'alpha'
                    ? 'A-Z'
                    : 'Added latest'
                }`}
                onPress={() => tasksRef.current?.openSort()}
              />
            )}
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Tab.Navigator tabBarPosition="bottom" swipeEnabled>
            <Tab.Screen name="Tasks">
              {() => (
                <TasksScreen
                  ref={tasksRef}
                  sortMode={taskSortMode}
                  onChangeSortMode={setTaskSortMode}
                />
              )}
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  appName: {
    color: '#bb86fc',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  screenTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  sortHeaderButton: {
    backgroundColor: 'transparent',
    borderColor: '#bb86fc',
    borderWidth: 1,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  sortHeaderButtonText: {
    color: '#bb86fc',
    fontSize: 14,
  },
});
