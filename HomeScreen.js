import React from 'react';
import { SafeAreaView, StyleSheet, Image } from 'react-native';
import { Button, Text, Card } from 'react-native-paper';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card} elevation={3}>
        <Card.Content style={{ alignItems: 'center' }}>
          <Image
            source={{ uri: 'https://img.icons8.com/color/96/000000/todo-list.png' }}
            style={styles.logo}
          />
          <Text variant="titleLarge" style={styles.title}>
            Welcome!
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            A modern, material To-Do app for your daily tasks.
          </Text>
          <Button
            mode="contained"
            style={styles.button}
            onPress={() => navigation.navigate('Tasks')}
            icon="arrow-right"
            contentStyle={{ flexDirection: 'row-reverse' }}
          >
            Go to Tasks
          </Button>
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f6f6f6' },
  card: { width: '85%', borderRadius: 18, paddingVertical: 24 },
  logo: { width: 72, height: 72, marginBottom: 12 },
  title: { marginBottom: 8, color: '#3949ab', fontWeight: 'bold' },
  subtitle: { marginBottom: 24, color: '#636e72', textAlign: 'center' },
  button: { borderRadius: 24, backgroundColor: '#3949ab', marginTop: 8 },
});

