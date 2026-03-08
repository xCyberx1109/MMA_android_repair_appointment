import { ScrollView, StyleSheet } from "react-native";
import { Card, Text, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function RepairmanHome() {

  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("role");

    router.replace("/auth/login");
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Technician Dashboard 🔧</Text>
      <Button
        mode="outlined"
        onPress={handleLogout}
      >
        Logout
      </Button>
      <Text style={styles.section}>Today's Jobs</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Water Leak Repair</Text>
          <Text>Customer: Minh</Text>
          <Text>Time: 09:00</Text>
          <Text>Address: Thanh Xuan</Text>
        </Card.Content>

        <Card.Actions>
          <Button mode="contained">Start Job</Button>
        </Card.Actions>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium">Pipe Broken</Text>
          <Text>Customer: Lan</Text>
          <Text>Time: 13:30</Text>
        </Card.Content>
      </Card>

      <Text style={styles.section}>Job Summary</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text>Jobs Today: 3</Text>
          <Text>Completed: 1</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  section: {
    fontSize: 18,
    marginVertical: 10,
    fontWeight: "600",
  },

  card: {
    marginBottom: 12,
  },
});
