import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Paragraph, Button, IconButton, Text } from 'react-native-paper';
import Animated, { FadeIn } from 'react-native-reanimated';

const MedicationList = ({ medications, onLogDose, onEdit, onDelete, onViewHistory }) => {
  if (!medications || medications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No medications added yet. Add one to get started.
        </Text>
      </View>
    );
  }

  const renderItem = ({ item, index }) => (
    <Animated.View entering={FadeIn.delay(index * 100).duration(500)}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title style={styles.title}>{item.name}</Title>
            <View style={styles.actions}>
              <IconButton
                icon="pencil"
                size={20}
                color="#757575"
                onPress={() => onEdit(item)}
              />
              <IconButton
                icon="delete"
                size={20}
                color="#FF6F61"
                onPress={() => onDelete(item.id)}
              />
            </View>
          </View>
          
          <Paragraph style={styles.dosage}>Dosage: {item.dosage}</Paragraph>
          <Paragraph style={styles.frequency}>
            Frequency: {item.frequency === 'custom' ? item.customFrequency : item.frequency}
          </Paragraph>
          
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => onLogDose(item.id)}
              style={styles.logButton}
              labelStyle={styles.buttonLabel}
            >
              Mark Given
            </Button>
            <Button
              mode="outlined"
              onPress={() => onViewHistory(item.id)}
              style={styles.historyButton}
              labelStyle={styles.buttonLabel}
            >
              View History
            </Button>
          </View>
        </Card.Content>
      </Card>
    </Animated.View>
  );

  return (
    <FlatList
      data={medications}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#26A69A',
    fontSize: 18,
  },
  actions: {
    flexDirection: 'row',
  },
  dosage: {
    fontSize: 14,
    marginBottom: 4,
  },
  frequency: {
    fontSize: 14,
    marginBottom: 12,
    color: '#757575',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  logButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#26A69A',
  },
  historyButton: {
    flex: 1,
    marginLeft: 8,
    borderColor: '#26A69A',
  },
  buttonLabel: {
    fontSize: 12,
  },
  emptyContainer: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  emptyText: {
    color: '#757575',
    textAlign: 'center',
  },
});

export default MedicationList;
