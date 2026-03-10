import { ScrollView, StyleSheet, View, Modal, TextInput, Platform } from "react-native";
import { Card, Text, Button, Chip } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import axios from "axios";
import DateTimePicker from "@react-native-community/datetimepicker";
import { commonStyles } from "../../../../styles/commonStyle";

type Request = {
  _id: string;
  title: string;
  address: string;
  status: string;
  createdAt: string;
  scheduleDate?: string;

  serviceId?: {
    name: string;
    price: number;
  };

  repairmanId?: {
    name: string;
  };
};

export default function CustomerHome() {

  const router = useRouter();

  const [requests, setRequests] = useState<Request[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editScheduleDate, setEditScheduleDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");


  useFocusEffect(
    useCallback(() => {
      fetchMyRequests();
    }, [])
  );

  const fetchMyRequests = async () => {
    try {

      const token = await AsyncStorage.getItem("token");

      const res = await axios.get(
        "http://localhost:5000/api/requests/customer/my",
        {
          headers: { Authorization: `Bearer ${token}` }
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

  const openEditModal = (request: Request) => {

    setSelectedRequest(request);

    setEditTitle(request.title);
    setEditAddress(request.address);

    if (request.scheduleDate) {
      setEditScheduleDate(new Date(request.scheduleDate));
    } else {
      setEditScheduleDate(new Date());
    }

    setModalVisible(true);
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {

    setShowDatePicker(false);

    if (selectedDate) {
      setEditScheduleDate(selectedDate);
    }
  };


  const updateRequest = async () => {

    try {

      const token = await AsyncStorage.getItem("token");

      await axios.put(
        `http://localhost:5000/api/requests/${selectedRequest?._id}`,
        {
          title: editTitle,
          address: editAddress,
          scheduleDate: editScheduleDate
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setModalVisible(false);

      fetchMyRequests();

    } catch (err) {
      console.log(err);
    }
  };

  const getStatusColor = (status?: string) => {
    if (status === "pending") return "#f59e0b";
    if (status === "assigned") return "#3b82f6";
    if (status === "in_progress") return "#6366f1";
    if (status === "completed") return "#10b981";
    if (status === "cancelled") return "#ef4444";
    return "gray";
  };

  const formatDate = (date?: string) => {
    if (!date) return "Not scheduled";

    const d = new Date(date);

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };
  const formatLocalDateTime = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16);
  };

  const formatStatus = (status?: string) => {
    if (!status) return "";

    return status
      .replace("_", " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());
  };


  return (
    <ScrollView style={commonStyles.container}>

      <View style={commonStyles.header}>
        <Text style={commonStyles.title}>My Requests</Text>

        <Button mode="outlined" onPress={handleLogout}>
          Logout
        </Button>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", marginBottom: 15 }}>

        <Chip
          selected={statusFilter === "all"}
          onPress={() => setStatusFilter("all")}
          style={{ marginRight: 5, marginBottom: 5 }}
        >
          All
        </Chip>

        <Chip
          selected={statusFilter === "pending"}
          onPress={() => setStatusFilter("pending")}
          style={{ marginRight: 5, marginBottom: 5 }}
        >
          Pending
        </Chip>

        <Chip
          selected={statusFilter === "assigned"}
          onPress={() => setStatusFilter("assigned")}
          style={{ marginRight: 5, marginBottom: 5 }}
        >
          Assigned
        </Chip>

        <Chip
          selected={statusFilter === "in_progress"}
          onPress={() => setStatusFilter("in_progress")}
          style={{ marginRight: 5, marginBottom: 5 }}
        >
          In Progress
        </Chip>
        <Chip
          selected={statusFilter === "cancelled"}
          onPress={() => setStatusFilter("cancelled")}
          style={{ marginRight: 5, marginBottom: 5 }}
        >
          Cancelled
        </Chip>
        <Chip
          selected={statusFilter === "completed"}
          onPress={() => setStatusFilter("completed")}
          style={{ marginRight: 5, marginBottom: 5 }}
        >
          Completed
        </Chip>

      </View>
      {requests
        .filter((item) =>
          statusFilter === "all" ? true : item.status === statusFilter
        )
        .map((item) => (
          <Card key={item._id} style={commonStyles.card}>

            <Card.Content>

              <View style={commonStyles.rowTop}>
                <Text style={commonStyles.requestTitle}>
                  {item.title}
                </Text>

                <Chip
                  style={[
                    commonStyles.statusChip,
                    { backgroundColor: getStatusColor(item.status) }
                  ]}
                  textStyle={{ color: "white" }}
                >
                  {item.status}
                </Chip>
              </View>

              <Text style={commonStyles.info}>
                🔧 Service: {item.serviceId?.name}
              </Text>

              <Text style={commonStyles.info}>
                📍 Address: {item.address}
              </Text>

              <Text style={commonStyles.info}>
                📅 Schedule: {formatDate(item.scheduleDate)}
              </Text>

              <Text style={commonStyles.info}>
                👨‍🔧 Repairman: {item.repairmanId?.name || "Waiting assignment"}
              </Text>
              <Text style={commonStyles.info}>
                💵 Price: {item.serviceId?.price || ""}
              </Text>
              {item.status === "pending" && (
                <Button
                  mode="contained"
                  style={{ marginTop: 10 }}
                  onPress={() => openEditModal(item)}
                >
                  Edit Request
                </Button>
              )}

            </Card.Content>

          </Card>
        ))}

      {/* MODAL EDIT */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <View style={commonStyles.modalContainer}>

          <View style={commonStyles.modalContent}>

            <Text style={commonStyles.modalTitle}>
              Edit Request
            </Text>

            {/* Title */}
            <TextInput
              style={commonStyles.input}
              placeholder="Title"
              value={editTitle}
              onChangeText={setEditTitle}
            />

            {/* Address */}
            <TextInput
              style={commonStyles.input}
              placeholder="Address"
              value={editAddress}
              onChangeText={setEditAddress}
            />

            {/* Schedule Date */}
            <Text style={commonStyles.label}>Schedule Date</Text>

            {Platform.OS === "web" ? (
              <View>
                <Text style={commonStyles.label}>Schedule Date</Text>

                <input
                  type="datetime-local"
                  title="Schedule Date"
                  aria-label="Schedule Date"
                  style={commonStyles.webDate}
                  value={formatLocalDateTime(editScheduleDate)}
                  onChange={(e) => setEditScheduleDate(new Date(e.target.value))}
                />
              </View>

            ) : (
              <>
                <View style={commonStyles.dateButton}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowDatePicker(true)}
                  >
                    {editScheduleDate.toLocaleString()}
                  </Button>
                </View>
                {showDatePicker && (
                  <DateTimePicker
                    value={editScheduleDate}
                    mode="datetime"
                    minimumDate={new Date()}
                    display="default"
                    onChange={(event, date) => {
                      setShowDatePicker(false);
                      if (date) setEditScheduleDate(date);
                    }}
                  />
                )}
              </>
            )}

            <View style={commonStyles.modalButtons}>

              <Button
                mode="outlined"
                onPress={() => setModalVisible(false)}
              >
                Cancel
              </Button>

              <Button
                mode="contained"
                onPress={updateRequest}
              >
                Save
              </Button>

            </View>
          </View>

        </View>
      </Modal>
    </ScrollView>
  );
}
