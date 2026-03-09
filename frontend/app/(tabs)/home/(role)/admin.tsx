import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, Button, Chip } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";

type Request = {
  _id: string;
  title: string;
  address: string;
  status?: string;

  customerId?: {
    name: string;
  };

  serviceId?: {
    name: string;
  };
};

type DashboardResponse = {
  pendingRequests: Request[];
  acceptedRequests: Request[];
  inProgressRequests: Request[];
  completedRequests: Request[];
};

export default function AdminHome() {

  const router = useRouter();

  const [pending, setPending] = useState<Request[]>([]);
  const [accepted, setAccepted] = useState<Request[]>([]);
  const [inProgress, setInProgress] = useState<Request[]>([]);
  const [completed, setCompleted] = useState<Request[]>([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {

      const token = await AsyncStorage.getItem("token");

      const res = await axios.get<DashboardResponse>(
        "http://localhost:5000/api/requests/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPending(res.data.pendingRequests);
      setAccepted(res.data.acceptedRequests);
      setInProgress(res.data.inProgressRequests);
      setCompleted(res.data.completedRequests);

    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("role");
    router.replace("/auth/login");
  };

  const getStatusColor = (status?: string) => {
    if (status === "pending") return "#f59e0b";
    if (status === "accepted") return "#3b82f6";
    if (status === "in_progress") return "#6366f1";
    if (status === "completed") return "#10b981";
    return "gray";
  };

  const renderCard = (item: Request) => (
    <Card key={item._id} style={styles.card}>
      <Card.Content>

        <View style={styles.rowTop}>

          <Text style={styles.requestTitle}>
            {item.title}
          </Text>

          {item.status && (
            <Chip
              style={{
                backgroundColor: getStatusColor(item.status)
              }}
              textStyle={{ color: "white" }}
            >
              {item.status}
            </Chip>
          )}

        </View>

        <Text style={styles.info}>
          👤 Customer: {item.customerId?.name}
        </Text>

        <Text style={styles.info}>
          🔧 Service: {item.serviceId?.name}
        </Text>

        <Text style={styles.info}>
          📍 Address: {item.address}
        </Text>

      </Card.Content>

      {item.status === "pending" && (
        <Card.Actions>
          <Button mode="contained">
            Assign Repairman
          </Button>
        </Card.Actions>
      )}

    </Card>
  );

  return (
    <ScrollView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>Admin Dashboard</Text>

        <Button mode="outlined" onPress={handleLogout}>
          Logout
        </Button>
      </View>
      {/* Stats */}
      <View style={styles.statsContainer}>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Ionicons name="time-outline" size={28} color="#f59e0b" />
            <Text style={styles.statNumber}>{pending.length}</Text>
            <Text>Pending</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Ionicons name="checkmark-done-outline" size={28} color="#3b82f6" />
            <Text style={styles.statNumber}>{accepted.length}</Text>
            <Text>Accepted</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Ionicons name="construct-outline" size={28} color="#8b5cf6" />
            <Text style={styles.statNumber}>{inProgress.length}</Text>
            <Text>In Progress</Text>
          </Card.Content>
        </Card>

        <Card style={styles.statCard}>
          <Card.Content style={styles.statContent}>
            <Ionicons name="checkmark-circle-outline" size={28} color="#10b981" />
            <Text style={styles.statNumber}>{completed.length}</Text>
            <Text>Completed</Text>
          </Card.Content>
        </Card>

      </View>


      <Text style={styles.section}>Pending Requests</Text>
      {pending.map(renderCard)}

      <Text style={styles.section}>Accepted</Text>
      {accepted.map(renderCard)}

      <Text style={styles.section}>In Progress</Text>
      {inProgress.map(renderCard)}

      <Text style={styles.section}>Completed</Text>
      {completed.map(renderCard)}

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

  section: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 10
  },

  card: {
    marginBottom: 14,
    borderRadius: 14
  },

  rowTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10
  },

  requestTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1
  },

  info: {
    fontSize: 14,
    color: "#555",
    marginTop: 2
  },

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20
  },

  statCard: {
    width: "48%",
    marginBottom: 12,
    borderRadius: 14
  },

  statContent: {
    alignItems: "center"
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 4
  },


});
