import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useTodos } from "../hooks/useTodos";
import { TodoInput } from "../components/TodoInput";
import { TodoList } from "../components/TodoList";
import {
  getPadding,
  fontSize,
  spacing,
  maxContentWidth,
  isWeb,
} from "../utils/responsive";

export const TodoScreen: React.FC = () => {
  const { todos, loading, error, addTodo, toggleTodo, removeTodo, refresh } =
    useTodos();

  const padding = getPadding();

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.content,
          { padding, maxWidth: isWeb ? maxContentWidth : "100%" },
        ]}
      >
        <Text
          style={[
            styles.heading,
            { fontSize: fontSize.xxl, marginBottom: spacing.lg },
          ]}
        >
          Todo List
        </Text>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={[styles.errorText, { fontSize: fontSize.sm }]}>
              {error}
            </Text>
            <TouchableOpacity onPress={refresh} style={styles.retryButton}>
              <Text style={[styles.retryText, { fontSize: fontSize.xs }]}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <TodoInput onSubmit={addTodo} />

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text
              style={[
                styles.loadingText,
                { fontSize: fontSize.sm, marginTop: spacing.md },
              ]}
            >
              Loading todos...
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            <TodoList todos={todos} onToggle={toggleTodo} onRemove={removeTodo} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    ...(Platform.OS === "web" && {
      alignItems: "center",
    }),
  },
  content: {
    flex: 1,
    width: "100%",
    ...(Platform.OS === "web" && {
      alignSelf: "center",
    }),
  },
  heading: {
    fontWeight: "700",
    color: "#1a1a1a",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  loadingText: {
    color: "#8a8a8a",
  },
  listContainer: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: "#ffe5e5",
    padding: spacing.md,
    borderRadius: 10,
    marginBottom: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffcccc",
  },
  errorText: {
    color: "#d7263d",
    flex: 1,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
    minWidth: 80,
    alignItems: "center",
  },
  retryText: {
    color: "#fff",
    fontWeight: "600",
  },
});
