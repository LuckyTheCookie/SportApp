import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, useTheme, IconButton, List } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Statistic {
  date: string;
  duration: number;
  type: 'timer' | 'chrono';
}

const StatistiquesScreen = () => {
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [expandedDates, setExpandedDates] = useState<{ [key: string]: boolean }>({});
  const { colors } = useTheme();

  useEffect(() => {
    loadStatistics();
  }, []);

  const loadStatistics = async () => {
    try {
      const storedStats = await AsyncStorage.getItem('sportStatistics');
      if (storedStats) {
        const parsedStats = JSON.parse(storedStats);
        setStatistics(parsedStats.reverse()); // Reverse to show most recent first
        const today = new Date().toISOString().split('T')[0];
        setExpandedDates({ [today]: true }); // Expand today's date by default
      }
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const deleteStatistic = async (index: number) => {
    Alert.alert(
      "Confirmation",
      "Voulez-vous vraiment supprimer cette session ?",
      [
        {
          text: "Annuler",
          style: "cancel"
        },
        {
          text: "Supprimer",
          onPress: async () => {
            const updatedStats = statistics.filter((_, i) => i !== index);
            setStatistics(updatedStats);
            await AsyncStorage.setItem('sportStatistics', JSON.stringify(updatedStats));
          }
        }
      ]
    );
  };

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}m ${seconds}s`;
  };

  const toggleExpandDate = (date: string) => {
    setExpandedDates((prev) => ({ ...prev, [date]: !prev[date] }));
  };

  const groupedStatistics = statistics.reduce((acc: { [key: string]: Statistic[] }, stat) => {
    const date = stat.date.split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(stat);
    return acc;
  }, {});

  return (
    <ScrollView style={styles.container}>
      <Title style={styles.title}>Vos performances</Title>
      {Object.keys(groupedStatistics).map((date) => (
        <List.Accordion
          key={date}
          title={new Date(date).toLocaleDateString()}
          expanded={expandedDates[date]}
          onPress={() => toggleExpandDate(date)}
          style={{ backgroundColor: colors.surface }}
        >
          {groupedStatistics[date].map((stat, index) => (
            <Card key={index} style={[styles.card, { backgroundColor: colors.surface }]}>
              <Card.Content style={styles.cardContent}>
                <View>
                  <Paragraph>Type: {stat.type === 'timer' ? 'Minuteur' : 'Chronomètre'}</Paragraph>
                  <Paragraph>Durée: {formatDuration(stat.duration)}</Paragraph>
                </View>
                <IconButton
                  icon="delete"
                  size={20}
                  onPress={() => deleteStatistic(index)}
                  style={styles.deleteButton}
                />
              </Card.Content>
            </Card>
          ))}
        </List.Accordion>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212', // Dark background color
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    marginBottom: 15,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 10,
  },
});

export default StatistiquesScreen;
