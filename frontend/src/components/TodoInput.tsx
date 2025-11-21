import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text, Platform } from 'react-native';
import { spacing, fontSize, isWeb } from '../utils/responsive';

interface Props {
  onSubmit(text: string): Promise<void> | void;
}

export const TodoInput: React.FC<Props> = ({ onSubmit }) => {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!text.trim() || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(text);
      setText('');
    } catch (error) {
      // Error is handled by the parent component
      console.error('Error adding todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { gap: spacing.sm, marginBottom: spacing.md }]}>
      <TextInput
        style={[styles.input, { fontSize: fontSize.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}
        placeholder="Add a task"
        placeholderTextColor="#999"
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleAdd}
        returnKeyType="done"
      />
      <TouchableOpacity
        style={[
          styles.button,
          { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
          isSubmitting && styles.buttonDisabled,
        ]}
        onPress={handleAdd}
        activeOpacity={0.7}
        disabled={isSubmitting}
      >
        <Text style={[styles.buttonText, { fontSize: fontSize.sm }]}>
          {isSubmitting ? 'Adding...' : 'Add'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 10,
    backgroundColor: '#fff',
    ...(Platform.OS === 'web' && {
      outlineStyle: 'none',
    }),
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
    paddingHorizontal: spacing.lg,
    ...(isWeb && {
      cursor: 'pointer',
    }),
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
