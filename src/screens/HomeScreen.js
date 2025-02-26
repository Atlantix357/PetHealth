import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { FAB, Portal, Modal, Text, Button, ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import PetCard from '../components/PetCard';
import AddPetForm from '../components/AddPetForm';
import { getPets } from '../services/petService';
import { BannerAdComponent, useInterstitialAd } from '../services/adService';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const HomeScreen = ({ navigation }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  
  const { showInterstitialAd } = useInterstitialAd();
  
  const fetchPets = async () => {
    try {
      const petsData = await getPets();
      setPets(petsData);
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      fetchPets();
    }, [])
  );
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchPets();
  };
  
  const handlePetPress = (pet) => {
    navigation.navigate('PetDetails', { pet });
  };
  
  const handlePetLongPress = (pet) => {
    setSelectedPet(pet);
    setActionModalVisible(true);
  };
  
  const handleEditPet = () => {
    setActionModalVisible(false);
    setTimeout(() => {
      navigation.navigate('EditPet', { pet: selectedPet });
    }, 300);
  };
  
  const handleDeletePet = () => {
    setActionModalVisible(false);
    setTimeout(() => {
      navigation.navigate('DeletePet', { pet: selectedPet });
    }, 300);
  };
  
  const handleAddPet = () => {
    setModalVisible(true);
  };
  
  const handleAddPetSubmit = (petData) => {
    setModalVisible(false);
    navigation.navigate('AddPet', { petData });
    showInterstitialAd();
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#26A69A" />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={pets}
        renderItem={({ item }) => (
          <PetCard
            pet={item}
            onPress={handlePetPress}
            onLongPress={handlePetLongPress}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#26A69A']} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No pets added yet. Tap the + button to add your first pet!
            </Text>
          </View>
        }
      />
      
      <FAB
        style={styles.fab}
        icon="plus"
        color="#ffffff"
        onPress={handleAddPet}
      />
      
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Animated.View entering={SlideInUp.duration(300)}>
            <Text style={styles.modalTitle}>Add New Pet</Text>
            <AddPetForm onSubmit={handleAddPetSubmit} />
          </Animated.View>
        </Modal>
        
        <Modal
          visible={actionModalVisible}
          onDismiss={() => setActionModalVisible(false)}
          contentContainerStyle={styles.actionModalContainer}
        >
          <Animated.View entering={FadeIn.duration(200)}>
            <Text style={styles.actionModalTitle}>
              {selectedPet ? selectedPet.name : 'Pet'} Options
            </Text>
            <Button
              mode="contained"
              icon="pencil"
              onPress={handleEditPet}
              style={[styles.actionButton, { backgroundColor: '#26A69A' }]}
            >
              Edit Pet
            </Button>
            <Button
              mode="contained"
              icon="delete"
              onPress={handleDeletePet}
              style={[styles.actionButton, { backgroundColor: '#FF6F61' }]}
            >
              Delete Pet
            </Button>
            <Button
              mode="outlined"
              onPress={() => setActionModalVisible(false)}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </Animated.View>
        </Modal>
      </Portal>
      
      <View style={styles.adContainer}>
        <BannerAdComponent />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  emptyText: {
    textAlign: 'center',
    color: '#757575',
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 50,
    backgroundColor: '#26A69A',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#26A69A',
    textAlign: 'center',
  },
  actionModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  actionModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionButton: {
    marginVertical: 8,
  },
  cancelButton: {
    marginTop: 8,
    borderColor: '#757575',
  },
  adContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 4,
  },
});

export default HomeScreen;
