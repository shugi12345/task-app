import React from 'react';
import renderer, { act } from 'react-test-renderer';
import App from '../src/App';

jest.mock('expo-checkbox', () => 'Checkbox');
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');
jest.mock('@react-native-community/slider', () => 'Slider');

test('App renders', () => {
  let tree;
  act(() => {
    tree = renderer.create(<App />);
  });
  expect(tree.toJSON()).toBeTruthy();
});
