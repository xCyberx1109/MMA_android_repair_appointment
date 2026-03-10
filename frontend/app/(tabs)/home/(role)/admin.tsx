import { ScrollView, StyleSheet, View } from "react-native";
import { Card, Text, Button, Chip, Modal, Portal } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { commonStyles } from "../../../../styles/commonStyle";

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

  repairmanId?: {
    name: string;
  };
};

type DashboardResponse = {
  pendingRequests: Request[];
  assignedRequests: Request[];
  inProgressRequests: Request[];
  completedRequests: Request[];
  cancelledRequests: Request[];
};

export default function AdminHome() {

  const router = useRouter();

  const [pending, setPending] = useState<Request[]>([]);
  const [assigned, setAssigned] = useState<Request[]>([]);
  const [inProgress, setInProgress] = useState<Request[]>([]);
  const [completed, setCompleted] = useState<Request[]>([]);
  const [cancelled, setCancelled] = useState<Request[]>([]);

  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [visible, setVisible] = useState(false);

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
      setAssigned(res.data.assignedRequests);
      setInProgress(res.data.inProgressRequests);
      setCompleted(res.data.completedRequests);
      setCancelled(res.data.cancelledRequests);

    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("role");
    router.replace("/auth/login");
  };

  const formatStatus = (status?: string) => {
    if (!status) return "";

    return status
      .replace("_", " ")
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status?: string) => {
    if (status === "pending") return "#f59e0b";
    if (status === "assigned") return "#3b82f6";
    if (status === "in_progress") return "#6366f1";
    if (status === "completed") return "#10b981";
    if (status === "cancelled") return "#ef4444";
    return "gray";
  };

  const fetchAvailableRepairmen = async () => {
    try {

      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/requests/repairman/available",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      return res.data;

    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const assignRepairman = async (requestId: string) => {
    try {

      const token = await AsyncStorage.getItem("token");

      const available = await fetchAvailableRepairmen();

      if (available.length === 0) {
        alert("No repairman available");
        return;
      }

      const repairmanId = available[0]._id;

      await axios.put(
        `http://localhost:5000/api/requests/${requestId}/assign`,
        { repairmanId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Repairman assigned");

      fetchDashboard();

    } catch (err) {
      console.log(err);
      alert("Assign failed");
    }
  };

  const updateStatus = async (id: string, status: string) => {

    const token = await AsyncStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/requests/${id}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchDashboard();
  };

  const openDetail = (request: Request) => {
    setSelectedRequest(request);
    setVisible(true);
  };

  const closeDetail = () => {
    setVisible(false);
    setSelectedRequest(null);
  };

  const renderCard = (item: Request) => (
    <Card
      key={item._id}
      style={commonStyles.card}
      onPress={() => openDetail(item)}
    >
      <Card.Content>

        <View style={commonStyles.rowTop}>

          <Text style={commonStyles.requestTitle}>
            {item.title}
          </Text>

          {item.status && (
            <Chip
              style={{
                backgroundColor: getStatusColor(item.status)
              }}
              textStyle={{ color: "white" }}
            >
              {formatStatus(item.status)}
            </Chip>
          )}

        </View>

        <Text style={commonStyles.info}>
          👤 Customer: {item.customerId?.name}
        </Text>

        <Text style={commonStyles.info}>
          🔧 Service: {item.serviceId?.name}
        </Text>

        <Text style={commonStyles.info}>
          📍 Address: {item.address}
        </Text>

        {item.status === "assigned" && (
          <Text style={commonStyles.info}>
            👨‍🔧 Assigned to: {item.repairmanId?.name}
          </Text>
        )}

      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={commonStyles.container}>

      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>Admin Dashboard</Text>

        <Button mode="outlined" onPress={handleLogout}>
          Logout
        </Button>
      </View>

      <View style={commonStyles.statsContainer}>

        <Card style={commonStyles.statCard}>
          <Card.Content style={commonStyles.statContent}>
            <Ionicons name="time-outline" size={28} color="#f59e0b" />
            <Text style={commonStyles.statNumber}>{pending.length}</Text>
            <Text>Pending</Text>
          </Card.Content>
        </Card>

        <Card style={commonStyles.statCard}>
          <Card.Content style={commonStyles.statContent}>
            <Ionicons name="checkmark-done-outline" size={28} color="#3b82f6" />
            <Text style={commonStyles.statNumber}>{assigned.length}</Text>
            <Text>Assigned</Text>
          </Card.Content>
        </Card>

        <Card style={commonStyles.statCard}>
          <Card.Content style={commonStyles.statContent}>
            <Ionicons name="construct-outline" size={28} color="#8b5cf6" />
            <Text style={commonStyles.statNumber}>{inProgress.length}</Text>
            <Text>In Progress</Text>
          </Card.Content>
        </Card>

        <Card style={commonStyles.statCard}>
          <Card.Content style={commonStyles.statContent}>
            <Ionicons name="close-circle-outline" size={28} color="#ef4444" />
            <Text style={commonStyles.statNumber}>{cancelled.length}</Text>
            <Text>Cancelled</Text>
          </Card.Content>
        </Card>

        <Card style={commonStyles.statCard}>
          <Card.Content style={commonStyles.statContent}>
            <Ionicons name="checkmark-circle-outline" size={28} color="#10b981" />
            <Text style={commonStyles.statNumber}>{completed.length}</Text>
            <Text>Completed</Text>
          </Card.Content>
        </Card>

      </View>

      <Text style={commonStyles.section}>Pending Requests</Text>
      {pending.map(renderCard)}

      <Text style={commonStyles.section}>Assigned</Text>
      {assigned.map(renderCard)}

      <Text style={commonStyles.section}>In Progress</Text>
      {inProgress.map(renderCard)}

      <Text style={commonStyles.section}>Cancelled</Text>
      {cancelled.map(renderCard)}

      <Text style={commonStyles.section}>Completed</Text>
      {completed.map(renderCard)}

      <Portal>
        <Modal
          visible={visible}
          onDismiss={closeDetail}
          contentContainerStyle={commonStyles.modal}
        >

          {selectedRequest && (

            <View>

              <Text style={commonStyles.modalTitle}>
                {selectedRequest.title}
              </Text>

              <Text style={commonStyles.info}>
                👤 Customer: {selectedRequest.customerId?.name}
              </Text>

              <Text style={commonStyles.info}>
                🔧 Service: {selectedRequest.serviceId?.name}
              </Text>

              <Text style={commonStyles.info}>
                📍 Address: {selectedRequest.address}
              </Text>

              <Text style={commonStyles.info}>
                Status: {formatStatus(selectedRequest.status)}
              </Text>

              {selectedRequest.status === "pending" && (

                <View style={commonStyles.modalButtons}>

                  <Button
                    mode="contained"
                    onPress={async () => {
                      await updateStatus(selectedRequest._id, "cancelled");
                      closeDetail();
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    mode="contained"
                    onPress={async () => {
                      await assignRepairman(selectedRequest._id);
                      closeDetail();
                    }}
                  >
                    Assign
                  </Button>

                </View>
              )}

              <Button
                style={{ marginTop: 10 }}
                onPress={closeDetail}
              >
                Close
              </Button>

            </View>

          )}

        </Modal>
      </Portal>

    </ScrollView>
  );
}

