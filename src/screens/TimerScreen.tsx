import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, IconButton, Surface, useTheme, Button, Menu, Modal, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Confetti from 'react-native-confetti';
import Sound from 'react-native-sound';
import motivationalPhrases from '../data/motivationalPhrases.json';

const TimerScreen = () => {
  const [duration, setDuration] = useState(30 * 60); // 30 minutes par défaut
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isActive, setIsActive] = useState(false);
  const [motivationalPhrase, setMotivationalPhrase] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const { colors } = useTheme();
  const navigation = useNavigation();
  let confettiRef: Confetti | null = null;

  useEffect(() => {
    const loadUserName = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        if (name) {
          setUserName(name);
        } else {
          navigation.navigate('Onboarding' as never);
        }
      } catch (error) {
        console.error('Error loading user name:', error);
      }
    };
    loadUserName();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime > 0) {
            if (prevTime % 30 === 0) {
              setMotivationalPhrase(motivationalPhrases[Math.floor(Math.random() * motivationalPhrases.length)].replace('{name}', userName));
            }
            return prevTime - 1;
          } else {
            clearInterval(interval);
            setIsActive(false);
            saveStats();
            showCompletionModal();
            return 0;
          }
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      saveStats();
      showCompletionModal();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
  };

  const saveStats = async () => {
    try {
      const currentStats = await AsyncStorage.getItem('sportStatistics');
      const stats = currentStats ? JSON.parse(currentStats) : [];
      stats.push({
        date: new Date().toISOString(),
        duration: duration - timeLeft,
        type: 'timer'
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

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDurationChange = (newDuration: number) => {
    if (isActive) {
      Alert.alert(
        "Attention",
        "Cela va réinitialiser votre progression",
        [
          {
            text: "Annuler",
            style: "cancel"
          },
          {
            text: "OK",
            onPress: () => {
              setDuration(newDuration);
              setTimeLeft(newDuration);
              setIsActive(false);
            }
          }
        ]
      );
    } else {
      setDuration(newDuration);
      setTimeLeft(newDuration);
    }
    setMenuVisible(false);
  };

  const showCompletionModal = () => {
    if (confettiRef) {
      confettiRef.startConfetti();
    }
    playSound();
    setModalVisible(true);
    setTimeout(() => {
      setModalVisible(false);
      resetTimer();
    }, 3000);
  };

  const handleLongPressName = () => {
    navigation.navigate('Onboarding' as never);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onLongPress={handleLongPressName}>
        <Text style={[styles.userName, { color: colors.primary }]}>Bonjour, {userName}!</Text>
      </TouchableOpacity>
        <Text style={[styles.timerText, { color: colors.primary }]}>{formatTime(timeLeft)}</Text>
        <Text style={styles.motivationalText}>{motivationalPhrase}</Text>
      
      <View style={styles.controlsContainer}>
        <IconButton
          icon={isActive ? "pause" : "play"}
          size={50}
          onPress={toggleTimer}
          style={styles.mainButton}
        />
        <IconButton
          icon="restart"
          size={40}
          onPress={resetTimer}
        />
      </View>
      
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <Button onPress={() => setMenuVisible(true)}>
            Plus de timers
          </Button>
        }
      >
        <Menu.Item onPress={() => handleDurationChange(5)} title="DEBUG" />
        <Menu.Item onPress={() => handleDurationChange(15 * 60)} title="15 min" />
        <Menu.Item onPress={() => handleDurationChange(30 * 60)} title="30 min" />
        <Menu.Item onPress={() => handleDurationChange(45 * 60)} title="45 min" />
      </Menu>

      <View style={styles.navigationButtons}>
        <Button
          icon={({ size, color }) => (
            <Icon name="timer-outline" size={size} color={color} />
          )}
          onPress={() => navigation.navigate('Chronometre' as never)}
        >
          Chrono
        </Button>
        <Button
          icon={({ size, color }) => (
            <Icon name="chart-line" size={size} color={color} />
          )}
          onPress={() => navigation.navigate('Statistiques' as never)}
        >
          Stats
        </Button>
        <Button
          icon={({ size, color }) => (
            <Icon name="cog-outline" size={size} color={color} />
          )}
          onPress={() => navigation.navigate('Reglages' as never)}
        >
          Settings
        </Button>
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
  userName: {
    fontSize: 18,
    position: 'relative',
    margin: 20,
  },
  timerSurface: {
    padding: 20,
    borderRadius: 10,
    elevation: 4,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#1E1E1E', // Darker surface color
  },
  timerText: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text color
  },
  motivationalText: {
    fontSize: 18,
    marginTop: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#BB86FC', // Light purple text color
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainButton: {
    marginHorizontal: 20,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 20,
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

export default TimerScreen;
