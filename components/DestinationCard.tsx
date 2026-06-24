import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DestinationCard({ title }: { title: string }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    margin: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
