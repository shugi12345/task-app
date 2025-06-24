jest.mock('expo', () => ({ registerRootComponent: jest.fn() }));
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');
jest.mock('@react-native-community/slider', () => 'Slider');
jest.mock('expo-checkbox', () => 'Checkbox');
import { registerRootComponent } from 'expo';
import * as widget from '../src/widgets/HomeWidget';

test('index registers root and widget', () => {
  const spy = jest.spyOn(widget, 'registerWidget').mockImplementation(() => {});
  require('../index');
  expect(registerRootComponent).toHaveBeenCalled();
  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});
