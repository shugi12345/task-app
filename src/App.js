import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
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
  return (
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator tabBarPosition="bottom" swipeEnabled>
        <Tab.Screen name="Tasks" component={TasksScreen} />
        <Tab.Screen name="Todo" component={TodoScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
