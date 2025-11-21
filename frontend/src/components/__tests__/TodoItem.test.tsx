import React from 'react';
import renderer from 'react-test-renderer';
import { TodoItem } from '../TodoItem';

const baseTodo = { id: '1', text: 'Test Item', completed: false };

it('renders todo item snapshot', () => {
  const tree = renderer
    .create(
      <TodoItem
        todo={baseTodo}
        onToggle={jest.fn()}
        onRemove={jest.fn()}
      />,
    )
    .toJSON();

  expect(tree).toMatchSnapshot();
});
