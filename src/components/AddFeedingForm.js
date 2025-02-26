import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatTime } from '../utils/dateUtils';
import { Picker } from '@react-native-picker/picker';

const AddFeedingForm = ({ onSubmit, initialValues = {}, isEditing = false }) => {
  const [foodType, setFoodType] = useState(initialValues.foodType || '');
  const [quantity, setQuantity] = useState(initialValues.quantity ? initialValues.quantity.toString() : '');
  const [unit, setUnit] = useState(initialValues.unit || 'grams');
  const [time, setTime] = useState(initialValues.time ? new Date(`1970-01-01T${initialValues.time}`) : new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!foodType || foodType.length < 2 || foodType.length > 100) {
      newErrors.foodType = 'Food type must be between 2 and 100 characters';
    }
    
    if (!quantity || isNaN(parseFloat(quantity)) || parseFloat(quantity) <= 0 || parseFloat(quantity) > 1000) {
      newErrors.quantity = 'Quantity must be between 0.1 and 1000';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      
      onSubmit({
        foodType,
        quantity: parseFloat(quantity),
        unit,
        time: `${hours}:${minutes}`,
      });
    }
  };
  
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        label="Food Type"
        value={foodType}
        onChangeText={setFoodType}
        style={styles.input}
        error={!!errors.foodType}
        maxLength={100}
      />
      {errors.foodType && <HelperText type="error">{errors.foodType}</HelperText>}
      
      <View style={styles.quantityContainer}>
        <TextInput
          label="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          style={styles.quantityInput}
          keyboardType="numeric"
          error={!!errors.quantity}
        />
        
        <View style={styles.unitContainer}>
          <Picker
            selectedValue={unit}
            onValueChange={(itemValue) => setUnit(itemValue)}
            style={styles.unitPicker}
          >
            <Picker.Item label="grams" value="grams" />
            <Picker.Item label="cups" value="cups" />
            <Picker.Item label="oz" value="oz" />
          </Picker>
        </View>
      </View>
      {errors.quantity && <HelperText type="error">{errors.quantity}</HelperText>}
      
      <TextInput
        label="Time"
        value={formatTime(time)}
        onTouchStart={() => setShowTimePicker(true)}
        style={styles.input}
        editable={false}
      />
      
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
      
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        {isEditing ? 'Update Feeding' : 'Add Feeding'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  quantityInput: {
    flex: 2,
    marginRight: 8,
    backgroundColor: 'white',
  },
  unitContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    height: 56,
    justifyContent: 'center',
  },
  unitPicker: {
    height: 50,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#26A69A',
    paddingVertical: 8,
  },
});

export default AddFeedingForm;
