import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Share } from 'react-native';
import { Text, Button, IconButton, Tabs, Tab, Portal, Modal, Snackbar } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import { calculateAge } from '../utils/dateUtils';
import WeightChart from '../components/WeightChart';
import FeedingTimeline from '../components/FeedingTimeline';
import MedicationList from '../components/MedicationList';
import AddWeightForm from '../components/AddWeightForm';
import AddFeedingForm from '../components/AddFeedingForm';
import AddMedicationForm from '../components/AddMedicationForm';
import { BannerAdComponent, useInterstitialAd } from '../services/adService';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';

const PetDetailsScreen = ({ navigation }) => {
  const route = useRoute();
  const { pet } = route.params;
  
  const [activeTab, setActiveTab] = useState(0);
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [feedingModalVisible, setFeedingModalVisible] = useState(false);
  const [medicationModalVisible, setMedicationModalVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  const { showInterstitialAd } = useInterstitialAd();
  
  // Mock data for demo
  const [weights, setWeights] = useState([
    { id: '1', weight: 10.5, weightUnit: 'kg', date: '2023-01-01' },
    { id: '2', weight: 11.2, weightUnit: 'kg', date: '2023-02-01' },
    { id: '3', weight: 11.8, weightUnit: 'kg', date: '2023-03-01' },
  ]);
  
  const [feedings, setFeedings] = useState([
    { id: '1', foodType: 'Dry Kibble', quantity: 100, unit: 'grams', time: '08:00', completed: true },
    { id: '2', foodType: 'Wet Food', quantity: 50, unit: 'grams', time: '18:00', completed: false },
  ]);
  
  const [medications, setMedications] = useState([
    { id: '1', name: 'Heartworm', dosage: '1 tablet', frequency: 'Monthly', time: '09:00' },
  ]);
  
  const handleAddWeight = (weightData) => {
    const newWeight = {
      id: Date.now().toString(),
      ...weightData,
    };
    setWeights([...weights, newWeight]);
    setWeightModalVisible(false);
    showInterstitialAd();
    
    setSnackbarMessage('Weight added successfully');
    setSnackbarVisible(true);
  };
  
  const handleAddFeeding = (feedingData) => {
    const newFeeding = {
      id: Date.now().toString(),
      ...feedingData,
      completed: false,
    };
    setFeedings([...feedings, newFeeding]);
    setFeedingModalVisible(false);
    
    setSnackbarMessage('Feeding schedule added successfully');
    setSnackbarVisible(true);
  };
  
  const handleAddMedication = (medicationData) => {
    const newMedication = {
      id: Date.now().toString(),
      ...medicationData,
    };
    setMedications([...medications, newMedication]);
    setMedicationModalVisible(false);
    
    setSnackbarMessage('Medication added successfully');
    setSnackbarVisible(true);
  };
  
  const handleMarkFeedingComplete = (id, completed) => {
    const updatedFeedings = feedings.map(feeding => 
      feeding.id === id ? { ...feeding, completed } : feeding
    );
    setFeedings(updatedFeedings);
    
    if (completed) {
      showInterstitialAd();
      setSnackbarMessage('Feeding marked as completed');
      setSnackbarVisible(true);
    }
  };
  
  const handleLogMedication = (id) => {
    // In a real app, this would log the medication administration
    showInterstitialAd();
    setSnackbarMessage('Medication logged successfully');
    setSnackbarVisible(true);
  };
  
  const handleSharePet = async () => {
    try {
      // In a real app, this would generate a shareable image
      await Share.share({
        message: `Check out my pet ${pet.name} on PetPulse! They are ${calculateAge(pet.birthDate)} old.`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <ScrollView>
        <Animated.View 
          style={styles.header}
          entering={FadeIn.duration(500)}
        >
          {pet.photoURL ? (
            <Image source={{ uri: pet.photoURL }} style={styles.petImage} />
          ) : (
            <View style={styles.placeholderImage}>
              <IconButton
                icon="paw"
                size={50}
                color="#26A69A"
              />
            </View>
          )}
          
          <View style={styles.petInfo}>
            <Text style={styles.petName}>{pet.name}</Text>
            <Text style={styles.petAge}>{calculateAge(pet.birthDate)}</Text>
            <Text style={styles.petWeight}>
              {pet.weight} {pet.weightUnit}
            </Text>
            
            <Button
              mode="contained"
              icon="share"
              onPress={handleSharePet}
              style={styles.shareButton}
            >
              Share Pet Card
            </Button>
          </View>
        </Animated.View>
        
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          style={styles.tabs}
        >
          <Tab label="Weight" value={0} />
          <Tab label="Feeding" value={1} />
          <Tab label="Medication" value={2} />
        </Tabs>
        
        {activeTab === 0 && (
          <View style={styles.tabContent}>
            <WeightChart weightEntries={weights} />
            
            <Button
              mode="contained"
              icon="plus"
              onPress={() => setWeightModalVisible(true)}
              style={styles.addButton}
            >
              Add Weight
            </Button>
          </View>
        )}
        
        {activeTab === 1 && (
          <View style={styles.tabContent}>
            <FeedingTimeline
              feedings={feedings}
              onMarkComplete={handleMarkFeedingComplete}
              onEdit={() => {}}
              onDelete={() => {}}
            />
            
            <Button
              mode="contained"
              icon="plus"
              onPress={() => setFeedingModalVisible(true)}
              style={styles.addButton}
            >
              Add Feeding
            </Button>
          </View>
        )}
        
        {activeTab === 2 && (
          <View style={styles.tabContent}>
            <MedicationList
              medications={medications}
              onLogDose={handleLogMedication}
              onEdit={() => {}}
              onDelete={() => {}}
              onViewHistory={() => {}}
            />
            
            <Button
              mode="contained"
              icon="plus"
              onPress={() => setMedicationModalVisible(true)}
              style={styles.addButton}
            >
              Add Medication
            </Button>
          </View>
        )}
      </ScrollView>
      
      <Portal>
        <Modal
          visible={weightModalVisible}
          onDismiss={() => setWeightModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Animated.View entering={SlideInUp.duration(300)}>
            <Text style={styles.modalTitle}>Add Weight</Text>
            <AddWeightForm onSubmit={handleAddWeight} />
          </Animated.View>
        </Modal>
        
        <Modal
          visible={feedingModalVisible}
          onDismiss={() => setFeedingModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Animated.View entering={SlideInUp.duration(300)}>
            <Text style={styles.modalTitle}>Add Feeding Schedule</Text>
            <AddFeedingForm onSubmit={handleAddFeeding} />
          </Animated.View>
        </Modal>
        
        <Modal
          visible={medicationModalVisible}
          onDismiss={() => setMedicationModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Animated.View entering={SlideInUp.duration(300)}>
            <Text style={styles.modalTitle}>Add Medication</Text>
            <AddMedicationForm onSubmit={handleAddMedication} />
          </Animated.View>
        </Modal>
      </Portal>
      
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
      
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
  header: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  petImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 16,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  petInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#26A69A',
    marginBottom: 4,
  },
  petAge: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 4,
  },
  petWeight: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 12,
  },
  shareButton: {
    backgroundColor: '#26A69A',
    marginTop: 8,
  },
  tabs: {
    backgroundColor: 'white',
  },
  tabContent: {
    padding: 16,
    paddingBottom: 80,
  },
  addButton: {
    backgroundColor: '#26A69A',
    marginTop: 16,
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
  adContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingVertical: 4,
  },
});

export default PetDetailsScreen;
