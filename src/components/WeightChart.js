import React from 'react';
import { View, Dimensions, StyleSheet, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { formatDate } from '../utils/dateUtils';

const WeightChart = ({ weightEntries }) => {
  // Need at least 2 entries to show a chart
  if (!weightEntries || weightEntries.length < 2) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Add more weights to see trends.
        </Text>
      </View>
    );
  }

  // Sort entries by date
  const sortedEntries = [...weightEntries].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Prepare data for the chart
  const labels = sortedEntries.map(entry => formatDate(entry.date));
  const data = sortedEntries.map(entry => parseFloat(entry.weight));

  const chartData = {
    labels,
    datasets: [
      {
        data,
        color: (opacity = 1) => `rgba(38, 166, 154, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Weight'],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weight History</Text>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(38, 166, 154, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#26A69A',
          },
        }}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#26A69A',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  emptyContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    margin: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    padding: 16,
  },
});

export default WeightChart;
