import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { IconButton } from 'react-native-paper';
import AuthScreen from '../screens/AuthScreen';
import HomeScreen from '../screens/HomeScreen';
import PetDetailsScreen from '../screens/PetDetailsScreen';
import AddPetScreen from '../screens/AddPetScreen';
import EditPetScreen from '../screens/EditPetScreen';
import DeletePetScreen from '../screens/DeletePetScreen';
import { auth } from '../services/firebase';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Auth"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#26A69A',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="Main"
          component={HomeScreen}
          options={{
            title: 'PetPulse',
            headerRight: () => (
              <IconButton
                icon="logout"
                color="#ffffff"
                size={24}
                onPress={handleSignOut}
              />
            ),
          }}
        />
        
        <Stack.Screen
          name="PetDetails"
          component={PetDetailsScreen}
          options={({ route }) => ({
            title: route.params.pet.name,
          })}
        />
        
        <Stack.Screen
          name="AddPet"
          component={AddPetScreen}
          options={{
            title: 'Add Pet',
          }}
        />
        
        <Stack.Screen
          name="EditPet"
          component={EditPetScreen}
          options={{
            title: 'Edit Pet',
          }}
        />
        
        <Stack.Screen
          name="DeletePet"
          component={DeletePetScreen}
          options={{
            title: 'Delete Pet',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
