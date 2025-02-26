import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Text, Button, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { deletePet } from '../services/petService';
import { calculateAge } from '../utils/dateUtils';

const DeletePetScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { pet } = route.params;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  
  const handleDelete = async () => {
    try {
      setLoading(true);
      await deletePet(pet.id, pet.photoURL);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error deleting pet:', error);
      setError('Failed to delete pet. Please try again.');
      setSnackbarVisible(true);
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Pet</Text>
      
      <View style={styles.petContainer}>
        {pet.photoURL ? (
          <Image source={{ uri: pet.photoURL }} style={styles.petImage} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
        
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petInfo}>{calculateAge(pet.birthDate)}</Text>
        <Text style={styles.petInfo}>
          {pet.weight} {pet.weightUnit}
        </Text>
      </View>
      
      <Text style={styles.warningText}>
        Are you sure you want to delete {pet.name}? This action cannot be undone.
      </Text>
      
      {loading ? (
        <ActivityIndicator size="large" color="#FF6F61" style={styles.loader} />
      ) : (
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleDelete}
            style={styles.deleteButton}
            labelStyle={styles.buttonLabel}
          >
            Delete Pet
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.cancelButton}
            labelStyle={styles.cancelButtonLabel}
          >
            Cancel
          </Button>
        </View>
      )}
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Retry',
          onPress: handleDelete,
        }}
      >
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6F61',
    marginBottom: 24,
  },
  petContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  petImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0F2F1',
    marginBottom: 16,
  },
  petName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#26A69A',
    marginBottom: 8,
  },
  petInfo: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 4,
  },
  warningText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#FF6F61',
  },
  loader: {
    marginTop: 24,
  },
  buttonContainer: {
    width: '100%',
  },
  deleteButton: {
    backgroundColor: '#FF6F61',
    marginBottom: 12,
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
  },
  cancelButton: {
    borderColor: '#757575',
    paddingVertical: 8,
  },
  cancelButtonLabel: {
    fontSize: 16,
    color: '#757575',
  },
});

export default DeletePetScreen;
