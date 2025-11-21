import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
import { Todo } from '../types/todo';
import { TodoItem } from './TodoItem';
import { spacing, fontSize } from '../utils/responsive';

interface Props {
  todos: Todo[];
  onToggle(id: string): void;
  onRemove(id: string): void;
}

export const TodoList: React.FC<Props> = ({ todos, onToggle, onRemove }) => {
  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => item.id}
      contentContainerStyle={[styles.list]}
      renderItem={({ item }) => (
        <TodoItem todo={item} onToggle={onToggle} onRemove={onRemove} />
      )}
      ListEmptyComponent={
        <View style={[styles.empty, { paddingVertical: spacing.xl }]}>
          <Text style={[styles.emptyText, { fontSize: fontSize.sm }]}>
            No tasks yet. Add one above!
          </Text>
        </View>
      }
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flexGrow: 1,
    paddingTop: spacing.sm,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#8a8a8a',
    textAlign: 'center',
  },
});
