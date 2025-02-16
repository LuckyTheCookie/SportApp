import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingScreen = () => {
  const [name, setName] = useState('');
  const { colors } = useTheme();
  const navigation = useNavigation();

  const handleSaveName = async () => {
    try {
      await AsyncStorage.setItem('userName', name);
      navigation.navigate('Timer' as never);
    } catch (error) {
      console.error('Error saving name:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.greeting, { color: colors.primary }]}>👋 Salut, comment t'appelles-tu ?</Text>
      <TextInput
        style={styles.input}
        placeholder="Entrez votre prénom"
        value={name}
        onChangeText={setName}
      />
      <Button mode="contained" onPress={handleSaveName} disabled={!name}>
        Valider
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#121212', // Dark background color
  },
  greeting: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: '80%',
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#121212',
    color: 'white',
  },
});

export default OnboardingScreen;
