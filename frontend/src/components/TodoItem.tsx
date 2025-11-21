import React from 'react';
import { StyleSheet, Text, View, Switch, TouchableOpacity, Platform } from 'react-native';
import { Todo } from '../types/todo';
import { spacing, fontSize, isWeb } from '../utils/responsive';

interface Props {
  todo: Todo;
  onToggle(id: string): void;
  onRemove(id: string): void;
}

export const TodoItem: React.FC<Props> = ({ todo, onToggle, onRemove }) => {
  return (
    <View style={[styles.container, { padding: spacing.md, marginBottom: spacing.sm }]}>
      <View style={styles.content}>
        <Switch
          accessibilityLabel={todo.completed ? 'Mark incomplete' : 'Mark complete'}
          value={todo.completed}
          onValueChange={() => onToggle(todo.id)}
          trackColor={{ false: '#e0e0e0', true: '#e0e0e0' }}
          thumbColor="#ffffff"
          ios_backgroundColor="#e0e0e0"
        />
        <Text
          style={[
            styles.text,
            { fontSize: fontSize.sm, flex: 1, marginLeft: spacing.md },
            todo.completed && styles.completed,
          ]}
          numberOfLines={2}
        >
          {todo.text}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => onRemove(todo.id)}
        activeOpacity={0.6}
        style={styles.deleteButton}
        accessibilityRole="button"
        accessibilityLabel="Delete todo"
      >
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    minHeight: 60,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    ...(Platform.OS === 'web' && {
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.md,
  },
  text: {
    color: '#1a1a1a',
    lineHeight: 22,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#8a8a8a',
  },
  deleteButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    ...(isWeb && {
      cursor: 'pointer',
    }),
  },
  deleteIcon: {
    fontSize: 20,
  },
});
