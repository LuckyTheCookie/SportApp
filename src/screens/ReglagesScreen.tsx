import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Switch, Button, RadioButton, useTheme } from 'react-native-paper';

const ReglagesScreen = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [timerDuration, setTimerDuration] = useState('30');
  const { colors } = useTheme();

  const saveSettings = () => {
    // Implement saving settings to AsyncStorage
    console.log('Settings saved');
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <Text>Mode sombre</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
      <View style={styles.settingItem}>
        <Text>Son activé</Text>
        <Switch value={soundEnabled} onValueChange={setSoundEnabled} />
      </View>
      <Text style={styles.sectionTitle}>Durée du minuteur par défaut</Text>
      <RadioButton.Group onValueChange={value => setTimerDuration(value)} value={timerDuration}>
        <View style={styles.radioItem}>
          <RadioButton value="15" />
          <Text>15 minutes</Text>
        </View>
        <View style={styles.radioItem}>
          <RadioButton value="30" />
          <Text>30 minutes</Text>
        </View>
        <View style={styles.radioItem}>
          <RadioButton value="45" />
          <Text>45 minutes</Text>
        </View>
      </RadioButton.Group>
      <Button mode="contained" onPress={saveSettings} style={styles.saveButton}>
        Sauvegarder
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButton: {
    marginTop: 30,
  },
});

export default ReglagesScreen;
