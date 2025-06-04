import { computeUrgency } from '../src/components/TaskItem';
import { formatDuration, parseDuration, formatDurationWithZeros } from '../src/utils';

describe('utility functions', () => {
  test('formatDuration formats minutes', () => {
    expect(formatDuration(75)).toBe('1h 15m');
    expect(formatDuration(60)).toBe('1h');
    expect(formatDuration(5)).toBe('5m');
    expect(formatDuration(0)).toBe('0m');
  });

  test('parseDuration parses strings', () => {
    expect(parseDuration('1h 15m')).toBe(75);
    expect(parseDuration('45m')).toBe(45);
    expect(parseDuration('2h 05m')).toBe(125);
    expect(parseDuration('bad')).toBe(0);
  });

  test('formatDurationWithZeros includes leading zeros', () => {
    expect(formatDurationWithZeros(75)).toBe('1h 15m');
    expect(formatDurationWithZeros(5)).toBe('05m');
  });

  test('computeUrgency increases with approaching due date', () => {
    const base = new Date('2024-01-01T00:00:00Z');
    jest.useFakeTimers().setSystemTime(base);
    const task = {
      urgency: 2,
      created: new Date('2024-01-01T00:00:00Z'),
      dueDate: new Date('2024-01-11T00:00:00Z'),
    };
    expect(computeUrgency(task)).toBe(2);
    jest.setSystemTime(new Date('2024-01-06T00:00:00Z'));
    expect(computeUrgency(task)).toBeGreaterThan(2);
    jest.setSystemTime(new Date('2024-01-11T00:00:00Z'));
    expect(computeUrgency(task)).toBeGreaterThanOrEqual(5);
    jest.useRealTimers();
  });
});
