import React from 'react';
import renderer, { act } from 'react-test-renderer';
import TasksScreen from '../src/screens/TasksScreen';
import TodoScreen from '../src/screens/TodoScreen';

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');
jest.mock('@react-native-community/slider', () => 'Slider');
jest.mock('expo-checkbox', () => 'Checkbox');

describe('Screen snapshots', () => {
  test('TasksScreen', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<TasksScreen />);
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test('TodoScreen', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<TodoScreen />);
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
