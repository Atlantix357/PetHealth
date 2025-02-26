import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Checkbox, IconButton } from 'react-native-paper';
import { formatTime } from '../utils/dateUtils';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';

const FeedingTimeline = ({ feedings, onMarkComplete, onEdit, onDelete }) => {
  // Sort feedings by time
  const sortedFeedings = [...feedings].sort((a, b) => {
    const timeA = new Date(`1970-01-01T${a.time}`);
    const timeB = new Date(`1970-01-01T${b.time}`);
    return timeA - timeB;
  });

  if (sortedFeedings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No feeding schedules yet. Add one to get started.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {sortedFeedings.map((feeding, index) => (
        <Animated.View 
          key={feeding.id} 
          entering={SlideInRight.delay(index * 100).duration(300)}
          style={styles.timelineItem}
        >
          <View style={styles.timeContainer}>
            <Text style={styles.time}>{formatTime(feeding.time)}</Text>
            <View style={[styles.line, { backgroundColor: index === sortedFeedings.length - 1 ? 'transparent' : '#26A69A' }]} />
          </View>
          
          <View style={styles.contentContainer}>
            <View style={styles.feedingInfo}>
              <Text style={styles.foodType}>{feeding.foodType}</Text>
              <Text style={styles.quantity}>
                {feeding.quantity} {feeding.unit}
              </Text>
            </View>
            
            <View style={styles.actions}>
              <Checkbox
                status={feeding.completed ? 'checked' : 'unchecked'}
                onPress={() => onMarkComplete(feeding.id, !feeding.completed)}
                color="#26A69A"
              />
              
              <View style={styles.iconButtons}>
                <IconButton
                  icon="pencil"
                  size={20}
                  color="#757575"
                  onPress={() => onEdit(feeding)}
                />
                <IconButton
                  icon="delete"
                  size={20}
                  color="#FF6F61"
                  onPress={() => onDelete(feeding.id)}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeContainer: {
    alignItems: 'center',
    width: 60,
  },
  time: {
    fontWeight: 'bold',
    color: '#26A69A',
  },
  line: {
    width: 2,
    height: '100%',
    backgroundColor: '#26A69A',
    marginTop: 8,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginLeft: 12,
  },
  feedingInfo: {
    marginBottom: 8,
  },
  foodType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantity: {
    color: '#757575',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconButtons: {
    flexDirection: 'row',
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

export default FeedingTimeline;
