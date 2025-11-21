import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { TodoScreen } from './src/screens/TodoScreen';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <TodoScreen />
    </>
  );
}
