import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, RadioButton, Text, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../utils/dateUtils';

const AddWeightForm = ({ onSubmit, initialValues = {}, isEditing = false }) => {
  const [weight, setWeight] = useState(initialValues.weight ? initialValues.weight.toString() : '');
  const [weightUnit, setWeightUnit] = useState(initialValues.weightUnit || 'kg');
  const [date, setDate] = useState(initialValues.date ? new Date(initialValues.date) : new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!weight || isNaN(parseFloat(weight)) || parseFloat(weight) <= 0 || parseFloat(weight) > 500) {
      newErrors.weight = 'Weight must be between 0.1 and 500';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        weight: parseFloat(weight),
        weightUnit,
        date: date.toISOString(),
      });
    }
  };
  
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
  
  return (
    <View style={styles.container}>
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
      
      <TextInput
        label="Date"
        value={formatDate(date)}
        onTouchStart={() => setShowDatePicker(true)}
        style={styles.input}
        editable={false}
      />
      
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
      
      <Button
        mode="contained"
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        {isEditing ? 'Update Weight' : 'Add Weight'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
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
  input: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#26A69A',
    paddingVertical: 8,
  },
});

export default AddWeightForm;
