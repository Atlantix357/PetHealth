import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, ActivityIndicator, Snackbar } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import AddPetForm from '../components/AddPetForm';
import { updatePet } from '../services/petService';

const EditPetScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { pet } = route.params;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  
  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await updatePet(pet.id, data, data.photoURL);
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error updating pet:', error);
      setError('Failed to update pet. Please try again.');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Edit {pet.name}</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#26A69A" />
            <Text style={styles.loadingText}>Updating pet information...</Text>
          </View>
        ) : (
          <AddPetForm
            onSubmit={handleSubmit}
            initialValues={pet}
            isEditing={true}
          />
        )}
      </ScrollView>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: 'Retry',
          onPress: () => handleSubmit(pet),
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#26A69A',
    margin: 16,
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
});

export default EditPetScreen;
