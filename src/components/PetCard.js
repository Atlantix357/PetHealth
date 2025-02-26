import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';
import { calculateAge } from '../utils/dateUtils';
import Animated, { FadeIn } from 'react-native-reanimated';

const PetCard = ({ pet, onPress, onLongPress }) => {
  const petAge = calculateAge(pet.birthDate);
  
  return (
    <Animated.View entering={FadeIn.duration(500)}>
      <TouchableOpacity
        onPress={() => onPress(pet)}
        onLongPress={() => onLongPress(pet)}
        activeOpacity={0.7}
      >
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.imageContainer}>
              {pet.photoURL ? (
                <Image source={{ uri: pet.photoURL }} style={styles.image} />
              ) : (
                <View style={styles.placeholderImage}>
                  <IconButton
                    icon="paw"
                    size={40}
                    color="#26A69A"
                  />
                </View>
              )}
            </View>
            <View style={styles.infoContainer}>
              <Title style={styles.name}>{pet.name}</Title>
              <Paragraph style={styles.info}>{petAge}</Paragraph>
              <Paragraph style={styles.info}>
                {pet.weight} {pet.weightUnit}
              </Paragraph>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 4,
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  imageContainer: {
    marginRight: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  placeholderImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#26A69A',
  },
  info: {
    fontSize: 14,
    color: '#757575',
  },
});

export default PetCard;
