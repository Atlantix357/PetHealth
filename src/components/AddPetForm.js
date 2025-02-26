import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, RadioButton, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { formatDate } from '../utils/dateUtils';

const AddPetForm = ({ onSubmit, initialValues = {}, isEditing = false }) => {
  const [name, setName] = useState(initialValues.name || '');
  const [birthDate, setBirthDate] = useState(initialValues.birthDate ? new Date(initialValues.birthDate) : new Date());
  const [weight, setWeight] = useState(initialValues.weight ? initialValues.weight.toString() : '');
  const [weightUnit, setWeightUnit] = useState(initialValues.weightUnit || 'kg');
  const [photo, setPhoto] = useState(initialValues.photoURL || null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!name || name.length < 2 || name.length > 50) {
      newErrors.name = 'Name must be between 2 and 50 characters';
    }
    
    if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0 || parseFloat(weight) > 500) {
      newErrors.weight = 'Weight must be between 0.1 and 500';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        name,
        birthDate: birthDate.toISOString(),
        weight: parseFloat(weight),
        weightUnit,
        photoURL: photo,
      });
    }
  };
  
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        alert('Permission to access camera roll is required!');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
    }
  };
  
  const takePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        alert('Permission to access camera is required!');
        return;
      }
      
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      
      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error taking photo:', error);
    }
  };
  
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Pet Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        error={!!errors.name}
        maxLength={50}
      />
      {errors.name && <HelperText type="error">{errors.name}</HelperText>}
      
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <View pointerEvents="none">
          <TextInput
            label="Birth Date"
            value={formatDate(birthDate)}
            style={styles.input}
            editable={false}
          />
        </View>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
      
      <View style={styles.weightContainer}>
        <TextInput
          label="Weight"
          value={weight}
          onChangeText={setWeight}
          style={styles.weightInput}
          keyboardType="numeric"
          error={!!errors.weight}
        />
        
        <View style={styles.radioContainer}>
          <RadioButton.Group onValueChange={value => setWeightUnit(value)} value={weightUnit}>
            <View style={styles.radioButton}>
              <RadioButton value="kg" color="#26A69A" />
              <Text>kg</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="lbs" color="#26A69A" />
              <Text>lbs</Text>
            </View>
          </RadioButton.Group>
        </View>
      </View>
      {errors.weight && <HelperText type="error">{errors.weight}</HelperText>}
      
      <Text style={styles.photoLabel}>Pet Photo</Text>
      <View style={styles.photoContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photoPreview} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Text style={styles.photoPlaceholderText}>No Photo</Text>
          </View>
        )}
        
        <View style={styles.photoButtons}>
          <Button
            mode="contained"
            onPress={takePhoto}
            style={[styles.photoButton, { marginRight: 8 }]}
            icon="camera"
          >
            Camera
          </Button>
          <Button
            mode="contained"
            onPress={pickImage}
            style={styles.photoButton}
            icon="image"
          >
            Gallery
          </Button>
        </View>
      </View>
      
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        {isEditing ? 'Update Pet' : 'Add Pet'}
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  weightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weightInput: {
    flex: 1,
    marginRight: 12,
    backgroundColor: 'white',
  },
  radioContainer: {
    flexDirection: 'row',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  photoLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#757575',
  },
  photoContainer: {
    marginBottom: 24,
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  photoPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#E0F2F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  photoPlaceholderText: {
    color: '#757575',
  },
  photoButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  photoButton: {
    flex: 1,
    backgroundColor: '#26A69A',
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#26A69A',
    paddingVertical: 8,
  },
});

export default AddPetForm;
