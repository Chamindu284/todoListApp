import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  FAB,
  Portal,
  Dialog,
  Button,
  TextInput,
  Card,
  Text,
  IconButton,
  Checkbox,
  useTheme,
} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = 'TASKS_LIST';

export default function TaskScreen() {
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [inputs, setInputs] = useState({ title: '', about: '' });
  const [editId, setEditId] = useState(null);
  const [editInputs, setEditInputs] = useState({ title: '', about: '' });
  const [deleteDialog, setDeleteDialog] = useState({ visible: false, id: null });
  const [showAdd, setShowAdd] = useState(false);

  // Load tasks on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const saved = await AsyncStorage.getItem(TASKS_KEY);
        if (saved) setTasks(JSON.parse(saved));
      } catch (e) {}
    };
    loadTasks();
  }, []);

  // Save tasks when changed
  useEffect(() => {
    AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Add new task
  const handleAddTask = () => {
    if (inputs.title.trim() && inputs.about.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: inputs.title,
          about: inputs.about,
          completed: false,
        },
      ]);
      setInputs({ title: '', about: '' });
      setShowAdd(false);
    }
  };

  // Delete
  const handleDelete = (id) => setDeleteDialog({ visible: true, id });
  const confirmDelete = () => {
    setTasks(tasks.filter((task) => task.id !== deleteDialog.id));
    setDeleteDialog({ visible: false, id: null });
  };

  // Edit
  const handleEdit = (task) => {
    setEditId(task.id);
    setEditInputs({ title: task.title, about: task.about });
  };
  const handleSaveEdit = (id) => {
    setTasks(tasks.map((task) =>
      task.id === id
        ? { ...task, title: editInputs.title, about: editInputs.about }
        : task
    ));
    setEditId(null);
    setEditInputs({ title: '', about: '' });
  };

  // Share
  const handleShare = async (task) => {
    try {
      await Share.share({
        message: `Task: ${task.title}\nAbout: ${task.about}`,
      });
    } catch {}
  };

  // Mark complete/incomplete
  const toggleCompleted = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const renderItem = ({ item }) => (
    <Card style={[styles.taskCard, item.completed && { backgroundColor: '#e0e0e0' }]} elevation={2}>
      <Card.Content style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <Checkbox
          status={item.completed ? 'checked' : 'unchecked'}
          onPress={() => toggleCompleted(item.id)}
          color={theme.colors.primary}
        />
        {editId === item.id ? (
          <View style={{ flex: 1 }}>
            <TextInput
              mode="outlined"
              label="Title"
              value={editInputs.title}
              onChangeText={text => setEditInputs(prev => ({ ...prev, title: text }))}
              style={{ marginBottom: 6 }}
            />
            <TextInput
              mode="outlined"
              label="About"
              value={editInputs.about}
              onChangeText={text => setEditInputs(prev => ({ ...prev, about: text }))}
            />
            <View style={styles.editActions}>
              <Button mode="contained" onPress={() => handleSaveEdit(item.id)} style={{ marginRight: 8 }}>
                Save
              </Button>
              <Button mode="outlined" onPress={() => setEditId(null)}>
                Cancel
              </Button>
            </View>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Text
              variant="titleMedium"
              style={[
                styles.taskTitle,
                item.completed && { textDecorationLine: 'line-through', color: '#888' },
              ]}
            >
              {item.title}
            </Text>
            <Text
              variant="bodyMedium"
              style={[
                styles.taskAbout,
                item.completed && { textDecorationLine: 'line-through', color: '#aaa' },
              ]}
            >
              {item.about}
            </Text>
            <View style={styles.actionRow}>
              <IconButton icon="delete-outline" onPress={() => handleDelete(item.id)} iconColor="#e17055" />
              <IconButton icon="share-variant" onPress={() => handleShare(item)} iconColor="#0984e3" />
              <IconButton icon="pencil-outline" onPress={() => handleEdit(item)} iconColor="#fdcb6e" />
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="headlineMedium" style={styles.heading}>Your To-Do List</Text>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
        ListEmptyComponent={
          <View style={styles.noTasksContainer}>
            <Text variant="titleMedium" style={{ color: '#b2bec3' }}>No tasks yet! 🎉</Text>
          </View>
        }
      />

      {/* Add Task Dialog */}
      <Portal>
        <Dialog visible={showAdd} onDismiss={() => setShowAdd(false)}>
          <Dialog.Title>Add New Task</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="Title"
              value={inputs.title}
              onChangeText={text => setInputs(prev => ({ ...prev, title: text }))}
              style={{ marginBottom: 12 }}
            />
            <TextInput
              mode="outlined"
              label="About"
              value={inputs.about}
              onChangeText={text => setInputs(prev => ({ ...prev, about: text }))}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAdd(false)}>Cancel</Button>
            <Button onPress={handleAddTask}>Add</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Delete Confirmation Dialog */}
      <Portal>
        <Dialog visible={deleteDialog.visible} onDismiss={() => setDeleteDialog({ visible: false, id: null })}>
          <Dialog.Title style={{ color: '#e17055' }}>Delete this task?</Dialog.Title>
          <Dialog.Actions>
            <Button onPress={confirmDelete} textColor="#e17055">Yes</Button>
            <Button onPress={() => setDeleteDialog({ visible: false, id: null })}>No</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Floating Add Button */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowAdd(true)}
        color="#fff"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  heading: { textAlign: 'center', marginVertical: 18, color: '#3949ab', fontWeight: 'bold' },
  taskCard: { marginHorizontal: 18, marginBottom: 14, borderRadius: 16 },
  taskTitle: { color: '#3949ab', fontWeight: 'bold', marginBottom: 2 },
  taskAbout: { color: '#636e72', marginBottom: 8 },
  actionRow: { flexDirection: 'row', marginTop: 6 },
  editActions: { flexDirection: 'row', marginTop: 8 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 36,
    backgroundColor: '#3949ab',
    elevation: 4,
  },
  noTasksContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
});
