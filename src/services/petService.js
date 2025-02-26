import { db, storage, auth } from './firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Get user's pets
export const getPets = async () => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    // Try to get from AsyncStorage first (for offline support)
    const cachedPets = await AsyncStorage.getItem(`pets_${user.uid}`);
    if (cachedPets) {
      return JSON.parse(cachedPets);
    }

    // If not in cache or online, fetch from Firestore
    const petsRef = collection(db, 'users', user.uid, 'pets');
    const petsSnapshot = await getDocs(petsRef);
    
    const pets = petsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Cache the result
    await AsyncStorage.setItem(`pets_${user.uid}`, JSON.stringify(pets));
    
    return pets;
  } catch (error) {
    console.error('Error getting pets:', error);
    throw error;
  }
};

// Add a new pet
export const addPet = async (petData, photoUri) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    let photoURL = null;
    
    // Upload photo if provided
    if (photoUri) {
      const response = await fetch(photoUri);
      const blob = await response.blob();
      
      const photoRef = ref(storage, `users/${user.uid}/pets/${Date.now()}`);
      await uploadBytes(photoRef, blob);
      
      photoURL = await getDownloadURL(photoRef);
    }
    
    // Add pet to Firestore
    const petsRef = collection(db, 'users', user.uid, 'pets');
    const newPet = {
      ...petData,
      photoURL,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(petsRef, newPet);
    
    // Update local cache
    const pets = await getPets();
    const updatedPets = [...pets, { id: docRef.id, ...newPet }];
    await AsyncStorage.setItem(`pets_${user.uid}`, JSON.stringify(updatedPets));
    
    return { id: docRef.id, ...newPet };
  } catch (error) {
    console.error('Error adding pet:', error);
    throw error;
  }
};

// Update a pet
export const updatePet = async (petId, petData, photoUri) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    let photoURL = petData.photoURL;
    
    // Upload new photo if provided
    if (photoUri && photoUri !== photoURL) {
      // Delete old photo if exists
      if (photoURL) {
        const oldPhotoRef = ref(storage, photoURL);
        try {
          await deleteObject(oldPhotoRef);
        } catch (error) {
          console.log('Error deleting old photo:', error);
        }
      }
      
      // Upload new photo
      const response = await fetch(photoUri);
      const blob = await response.blob();
      
      const photoRef = ref(storage, `users/${user.uid}/pets/${Date.now()}`);
      await uploadBytes(photoRef, blob);
      
      photoURL = await getDownloadURL(photoRef);
    }
    
    // Update pet in Firestore
    const petRef = doc(db, 'users', user.uid, 'pets', petId);
    const updatedPet = {
      ...petData,
      photoURL,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(petRef, updatedPet);
    
    // Update local cache
    const pets = await getPets();
    const updatedPets = pets.map(pet => 
      pet.id === petId ? { id: petId, ...updatedPet } : pet
    );
    await AsyncStorage.setItem(`pets_${user.uid}`, JSON.stringify(updatedPets));
    
    return { id: petId, ...updatedPet };
  } catch (error) {
    console.error('Error updating pet:', error);
    throw error;
  }
};

// Delete a pet
export const deletePet = async (petId, photoURL) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    // Delete photo if exists
    if (photoURL) {
      const photoRef = ref(storage, photoURL);
      try {
        await deleteObject(photoRef);
      } catch (error) {
        console.log('Error deleting photo:', error);
      }
    }
    
    // Delete pet from Firestore
    const petRef = doc(db, 'users', user.uid, 'pets', petId);
    await deleteDoc(petRef);
    
    // Update local cache
    const pets = await getPets();
    const updatedPets = pets.filter(pet => pet.id !== petId);
    await AsyncStorage.setItem(`pets_${user.uid}`, JSON.stringify(updatedPets));
    
    return true;
  } catch (error) {
    console.error('Error deleting pet:', error);
    throw error;
  }
};

// Add weight entry
export const addWeightEntry = async (petId, weightData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const weightsRef = collection(db, 'users', user.uid, 'pets', petId, 'weights');
    const newWeight = {
      ...weightData,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(weightsRef, newWeight);
    
    return { id: docRef.id, ...newWeight };
  } catch (error) {
    console.error('Error adding weight entry:', error);
    throw error;
  }
};

// Get weight entries
export const getWeightEntries = async (petId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    // Try to get from AsyncStorage first
    const cachedWeights = await AsyncStorage.getItem(`weights_${user.uid}_${petId}`);
    if (cachedWeights) {
      return JSON.parse(cachedWeights);
    }

    const weightsRef = collection(db, 'users', user.uid, 'pets', petId, 'weights');
    const weightsSnapshot = await getDocs(weightsRef);
    
    const weights = weightsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Cache the result
    await AsyncStorage.setItem(`weights_${user.uid}_${petId}`, JSON.stringify(weights));
    
    return weights;
  } catch (error) {
    console.error('Error getting weight entries:', error);
    throw error;
  }
};

// Add feeding schedule
export const addFeedingSchedule = async (petId, feedingData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const feedingsRef = collection(db, 'users', user.uid, 'pets', petId, 'feedings');
    const newFeeding = {
      ...feedingData,
      completed: false,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(feedingsRef, newFeeding);
    
    return { id: docRef.id, ...newFeeding };
  } catch (error) {
    console.error('Error adding feeding schedule:', error);
    throw error;
  }
};

// Get feeding schedules
export const getFeedingSchedules = async (petId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    // Try to get from AsyncStorage first
    const cachedFeedings = await AsyncStorage.getItem(`feedings_${user.uid}_${petId}`);
    if (cachedFeedings) {
      return JSON.parse(cachedFeedings);
    }

    const feedingsRef = collection(db, 'users', user.uid, 'pets', petId, 'feedings');
    const feedingsSnapshot = await getDocs(feedingsRef);
    
    const feedings = feedingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Cache the result
    await AsyncStorage.setItem(`feedings_${user.uid}_${petId}`, JSON.stringify(feedings));
    
    return feedings;
  } catch (error) {
    console.error('Error getting feeding schedules:', error);
    throw error;
  }
};

// Mark feeding as complete
export const markFeedingComplete = async (petId, feedingId, completed = true) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const feedingRef = doc(db, 'users', user.uid, 'pets', petId, 'feedings', feedingId);
    await updateDoc(feedingRef, { 
      completed,
      completedAt: completed ? serverTimestamp() : null
    });
    
    // Update local cache
    const feedings = await getFeedingSchedules(petId);
    const updatedFeedings = feedings.map(feeding => 
      feeding.id === feedingId ? { ...feeding, completed, completedAt: new Date() } : feeding
    );
    await AsyncStorage.setItem(`feedings_${user.uid}_${petId}`, JSON.stringify(updatedFeedings));
    
    return true;
  } catch (error) {
    console.error('Error marking feeding as complete:', error);
    throw error;
  }
};

// Add medication
export const addMedication = async (petId, medicationData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const medicationsRef = collection(db, 'users', user.uid, 'pets', petId, 'medications');
    const newMedication = {
      ...medicationData,
      createdAt: serverTimestamp()
    };
    
    const docRef = await addDoc(medicationsRef, newMedication);
    
    return { id: docRef.id, ...newMedication };
  } catch (error) {
    console.error('Error adding medication:', error);
    throw error;
  }
};

// Get medications
export const getMedications = async (petId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    // Try to get from AsyncStorage first
    const cachedMedications = await AsyncStorage.getItem(`medications_${user.uid}_${petId}`);
    if (cachedMedications) {
      return JSON.parse(cachedMedications);
    }

    const medicationsRef = collection(db, 'users', user.uid, 'pets', petId, 'medications');
    const medicationsSnapshot = await getDocs(medicationsRef);
    
    const medications = medicationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Cache the result
    await AsyncStorage.setItem(`medications_${user.uid}_${petId}`, JSON.stringify(medications));
    
    return medications;
  } catch (error) {
    console.error('Error getting medications:', error);
    throw error;
  }
};

// Log medication administration
export const logMedicationAdministration = async (petId, medicationId, administrationData) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const administrationsRef = collection(
      db, 
      'users', 
      user.uid, 
      'pets', 
      petId, 
      'medications', 
      medicationId, 
      'administrations'
    );
    
    const newAdministration = {
      ...administrationData,
      timestamp: serverTimestamp()
    };
    
    const docRef = await addDoc(administrationsRef, newAdministration);
    
    return { id: docRef.id, ...newAdministration };
  } catch (error) {
    console.error('Error logging medication administration:', error);
    throw error;
  }
};

// Get medication administrations
export const getMedicationAdministrations = async (petId, medicationId) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');

    const administrationsRef = collection(
      db, 
      'users', 
      user.uid, 
      'pets', 
      petId, 
      'medications', 
      medicationId, 
      'administrations'
    );
    
    const administrationsSnapshot = await getDocs(administrationsRef);
    
    return administrationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting medication administrations:', error);
    throw error;
  }
};
