import React from 'react';
import renderer, { act } from 'react-test-renderer';
import AppButton from '../src/components/AppButton';
import FloatingActionButton from '../src/components/FloatingActionButton';
import TaskItem from '../src/components/TaskItem';
import TodoItem from '../src/components/TodoItem';
import UrgencyPicker from '../src/components/UrgencyPicker';

jest.mock('expo-checkbox', () => 'Checkbox');

const sampleTask = {
  title: 'Test',
  duration: '1h',
  urgency: 3,
  created: '2023-01-01T00:00:00Z',
  dueDate: '2023-01-03T00:00:00Z',
};

describe('Component snapshots', () => {
  test('AppButton', () => {
    let tree;
    act(() => {
      tree = renderer.create(<AppButton title="OK" onPress={() => {}} />);
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test('FloatingActionButton', () => {
    let tree;
    act(() => {
      tree = renderer.create(<FloatingActionButton onPress={() => {}} />);
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test('TaskItem', () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <TaskItem task={sampleTask} onComplete={() => {}} onPress={() => {}} />
      );
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test('TodoItem', () => {
    let tree;
    act(() => {
      tree = renderer.create(
        <TodoItem item={{ id: '1', text: 'Do', animateIn: false }} onToggle={() => {}} />
      );
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });

  test('UrgencyPicker', () => {
    let tree;
    act(() => {
      tree = renderer.create(<UrgencyPicker value={3} onChange={() => {}} />);
    });
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
