import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button, Surface, useTheme, Modal, Portal } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Confetti from 'react-native-confetti';
import motivationalPhrases from '../data/motivationalPhrases.json';
import Sound from 'react-native-sound';

const ChronometreScreen = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [motivationalPhrase, setMotivationalPhrase] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const { colors } = useTheme();
  let confettiRef: Confetti | null = null;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
        if (time % 30 === 0) { // Change phrase every 30 seconds
          setMotivationalPhrase(motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)]);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const toggleChrono = () => setIsRunning(!isRunning);
  const resetChrono = () => {
    setIsRunning(false);
    setTime(0);
  };

  const saveStats = async () => {
    try {
      const currentStats = await AsyncStorage.getItem('sportStatistics');
      const stats = currentStats ? JSON.parse(currentStats) : [];
      stats.push({
        date: new Date().toISOString(),
        duration: time,
        type: 'chrono'
      });
      await AsyncStorage.setItem('sportStatistics', JSON.stringify(stats));
    } catch (error) {
      console.error('Error saving statistics:', error);
    }
  };

  const playSound = () => {
    const sound = new Sound(require('../assets/finish.wav'), (error) => {
      if (error) {
        console.error('Error loading sound:', error);
        return;
      }
      sound.play(() => {
        sound.release();
      });
    });
  };

  const showCompletionModal = () => {
    if (confettiRef) {
      confettiRef.startConfetti();
    }
    playSound();
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      resetChrono();
    }, 3000);
  };

  const handleValidate = () => {
    saveStats();
    showCompletionModal();
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.chronoText, { color: colors.primary }]}>{formatTime(time)}</Text>
      <Text style={styles.motivationalText}>{motivationalPhrase}</Text>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={toggleChrono} style={styles.button}>
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        <Button mode="outlined" onPress={resetChrono} style={styles.button}>
          Reset
        </Button>
        {isRunning && (
          <Button mode="contained" onPress={handleValidate} style={[styles.button, styles.validateButton]}>
            Valider
          </Button>
        )}
      </View>

      <Portal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Bravo la séance est terminée !</Text>
          </View>
        </Modal>
      </Portal>

      <Confetti ref={(node) => (confettiRef = node)} />
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
  surfaceContainer: {
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    alignItems: 'center',
  },
  chronoText: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  motivationalText: {
    fontSize: 18,
    marginTop: 20,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  button: {
    margin: 10,
  },
  validateButton: {
    backgroundColor: 'green',
  },
  modalContent: {
    backgroundColor: '#0f0f0f', // Darker surface color
    padding: 20,
    alignItems: 'center',
    borderRadius: 10,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChronometreScreen;
