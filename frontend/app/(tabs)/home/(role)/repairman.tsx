import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, Button, Chip } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";

type Request = {
  _id: string;
  title: string;
  address: string;
  status: string;
  scheduleDate?: string;

  customerId?: {
    name: string;
  };

  serviceId?: {
    name: string;
  };
};

export default function RepairmanHome() {

  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {

      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/requests/repairman/my",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setRequests(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("role");
    router.replace("/auth/login");
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not scheduled";

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const getStatusColor = (status: string) => {
    if (status === "pending") return "#f59e0b";
    if (status === "accepted") return "#3b82f6";
    if (status === "in_progress") return "#6366f1";
    if (status === "completed") return "#10b981";
    return "gray";
  };

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>My Jobs 🔧</Text>

        <Button mode="outlined" onPress={handleLogout}>
          Logout
        </Button>
      </View>

      {requests.map((item) => (
        <Card key={item._id} style={styles.card}>

          <Card.Content>

            <View style={styles.rowTop}>
              <Text style={styles.jobTitle}>
                {item.title}
              </Text>

              <Chip
                style={{
                  backgroundColor: getStatusColor(item.status)
                }}
                textStyle={{ color: "white" }}
              >
                {item.status}
              </Chip>

            </View>

            <Text style={styles.info}>
              🔧 Service: {item.serviceId?.name}
            </Text>

            <Text style={styles.info}>
              👤 Customer: {item.customerId?.name}
            </Text>

            <Text style={styles.info}>
              📅 Schedule: {formatDate(item.scheduleDate)}
            </Text>

            <Text style={styles.info}>
              📍 Address: {item.address}
            </Text>

          </Card.Content>

        </Card>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    padding: 16,
    backgroundColor: "#f5f5f5"
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20
  },

  title: {
    fontSize: 26,
    fontWeight: "bold"
  },

  card: {
    marginBottom: 15,
    borderRadius: 14
  },

  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },

  jobTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1
  },

  info: {
    fontSize: 14,
    color: "#555",
    marginTop: 2
  }

});
