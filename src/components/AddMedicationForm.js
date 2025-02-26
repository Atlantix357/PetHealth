import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, RadioButton, Text, HelperText } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatTime } from '../utils/dateUtils';

const AddMedicationForm = ({ onSubmit, initialValues = {}, isEditing = false }) => {
  const [name, setName] = useState(initialValues.name || '');
  const [dosage, setDosage] = useState(initialValues.dosage || '');
  const [frequency, setFrequency] = useState(initialValues.frequency || 'Daily');
  const [customFrequency, setCustomFrequency] = useState(initialValues.customFrequency || '');
  const [time, setTime] = useState(initialValues.time ? new Date(`1970-01-01T${initialValues.time}`) : new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState({});
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!name || name.length < 2 || name.length > 50) {
      newErrors.name = 'Name must be between 2 and 50 characters';
    }
    
    if (!dosage || dosage.length < 2 || dosage.length > 50) {
      newErrors.dosage = 'Dosage must be between 2 and 50 characters';
    }
    
    if (frequency === 'Custom' && (!customFrequency || customFrequency.length < 2)) {
      newErrors.customFrequency = 'Please specify custom frequency';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = () => {
    if (validateForm()) {
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      
      onSubmit({
        name,
        dosage,
        frequency,
        customFrequency: frequency === 'Custom' ? customFrequency : '',
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
        label="Medication Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        error={!!errors.name}
        maxLength={50}
      />
      {errors.name && <HelperText type="error">{errors.name}</HelperText>}
      
      <TextInput
        label="Dosage (e.g., 1 tablet, 5ml)"
        value={dosage}
        onChangeText={setDosage}
        style={styles.input}
        error={!!errors.dosage}
        maxLength={50}
      />
      {errors.dosage && <HelperText type="error">{errors.dosage}</HelperText>}
      
      <Text style={styles.label}>Frequency</Text>
      <RadioButton.Group onValueChange={value => setFrequency(value)} value={frequency}>
        <View style={styles.radioButton}>
          <RadioButton value="Daily" color="#26A69A" />
          <Text>Daily</Text>
        </View>
        <View style={styles.radioButton}>
          <RadioButton value="Weekly" color="#26A69A" />
          <Text>Weekly</Text>
        </View>
        <View style={styles.radioButton}>
          <RadioButton value="Custom" color="#26A69A" />
          <Text>Custom</Text>
        </View>
      </RadioButton.Group>
      
      {frequency === 'Custom' && (
        <>
          <TextInput
            label="Specify Frequency"
            value={customFrequency}
            onChangeText={setCustomFrequency}
            style={styles.input}
            error={!!errors.customFrequency}
          />
          {errors.customFrequency && <HelperText type="error">{errors.customFrequency}</HelperText>}
        </>
      )}
      
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
        {isEditing ? 'Update Medication' : 'Add Medication'}
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
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#757575',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  submitButton: {
    marginTop: 16,
    backgroundColor: '#26A69A',
    paddingVertical: 8,
  },
});

export default AddMedicationForm;
