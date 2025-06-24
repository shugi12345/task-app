jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');
jest.mock('@react-native-community/slider', () => 'Slider');
jest.mock('expo-checkbox', () => 'Checkbox');

import { colorFor, computeUrgency, formatDate } from '../src/components/TaskItem';
import { formatDuration, parseDuration, formatDurationWithZeros } from '../src/screens/TasksScreen';

describe('Task utilities', () => {
  test('colorFor generates gradient', () => {
    expect(colorFor(1)).toBe('rgb(0, 255, 0)');
    expect(colorFor(3)).toBe('rgb(255, 255, 0)');
    expect(colorFor(5)).toBe('rgb(255, 0, 0)');
  });

  test('formatDate formats yyyy-mm-dd', () => {
    const date = '2023-05-07T00:00:00Z';
    expect(formatDate(date)).toBe('07/05/2023');
  });

  test('computeUrgency increases as deadline approaches', () => {
    jest.useFakeTimers().setSystemTime(new Date('2023-01-02T00:00:00Z'));
    const task = {
      urgency: 2,
      created: '2023-01-01T00:00:00Z',
      dueDate: '2023-01-03T00:00:00Z',
    };
    expect(computeUrgency(task)).toBe(3);
    jest.useRealTimers();
  });

  test('computeUrgency without due date', () => {
    const task = { urgency: 4 };
    expect(computeUrgency(task)).toBe(4);
  });
});

describe('Duration helpers', () => {
  test('parseDuration works with hours and minutes', () => {
    expect(parseDuration('1h 30m')).toBe(90);
    expect(parseDuration('45m')).toBe(45);
    expect(parseDuration('bad')).toBe(0);
  });

  test('formatDuration returns compact string', () => {
    expect(formatDuration(90)).toBe('1h 30m');
    expect(formatDuration(45)).toBe('45m');
    expect(formatDuration(0)).toBe('0m');
  });

  test('formatDurationWithZeros pads minutes', () => {
    expect(formatDurationWithZeros(90)).toBe('1h 30m');
    expect(formatDurationWithZeros(5)).toBe('05m');
    expect(formatDurationWithZeros(65)).toBe('1h 05m');
  });
});
