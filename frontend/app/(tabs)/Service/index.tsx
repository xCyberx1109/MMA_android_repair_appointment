import { useEffect, useState } from "react";
import { View, ScrollView, Alert } from "react-native";
import { TextInput, Button, Card, Text, Modal, Portal, Chip } from "react-native-paper";
import axios from "axios";
import { Platform } from "react-native";
import { commonStyles } from "../../../styles/commonStyle";

type Service = {
    _id: string;
    name: string;
    description: string;
    price: number;
    is_active: boolean;
};

export default function ServiceScreen() {

    const API = "http://localhost:5000/api/services";

    const [services, setServices] = useState<Service[]>([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    const [editingId, setEditingId] = useState<string | null>(null);

    const [visible, setVisible] = useState(false);

    /* =================
        GET SERVICES
    ================= */

    const loadServices = async () => {
        try {
            const res = await axios.get<Service[]>(API);
            setServices(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadServices();
    }, []);

    /* =================
        CREATE
    ================= */

    const addService = async () => {

        if (!name || !price) {
            Alert.alert("Error", "Name và price bắt buộc");
            return;
        }

        try {

            await axios.post(API, {
                name,
                description,
                price: Number(price)
            });

            closeModal();
            loadServices();

        } catch (error) {
            console.log(error);
        }
    };

    /* =================
        UPDATE
    ================= */

    const updateService = async () => {

        if (!editingId) return;

        try {

            await axios.put(`${API}/${editingId}`, {
                name,
                description,
                price: Number(price)
            });

            closeModal();
            loadServices();

        } catch (error) {
            console.log(error);
        }
    };

    /* =================
        TOGGLE STATUS
    ================= */

    const toggleService = async (id: string, status: boolean) => {

        const message = status
            ? "Disable this service?"
            : "Enable this service?";

        if (Platform.OS === "web") {

            const confirm = window.confirm(message);

            if (!confirm) return;

            try {
                await axios.put(`${API}/${id}/status`);
                await loadServices();
            } catch (error) {
                console.log(error);
            }

        } else {

            Alert.alert(
                "Confirm",
                message,
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "OK",
                        onPress: async () => {
                            try {
                                await axios.put(`${API}/${id}/status`);
                                await loadServices();
                            } catch (error) {
                                console.log(error);
                            }
                        }
                    }
                ]
            );

        }
    };

    /* =================
        MODAL
    ================= */

    const openAddModal = () => {
        clearForm();
        setVisible(true);
    };

    const openEditModal = (service: Service) => {

        setName(service.name);
        setDescription(service.description);
        setPrice(service.price.toString());
        setEditingId(service._id);

        setVisible(true);
    };

    const closeModal = () => {
        setVisible(false);
        clearForm();
    };

    const clearForm = () => {
        setName("");
        setDescription("");
        setPrice("");
        setEditingId(null);
    };

    return (
        <ScrollView style={commonStyles.container}>

            {/* Add Button */}
            <Button
                mode="contained"
                onPress={openAddModal}
                style={{ marginBottom: 15 }}
            >
                Add Service
            </Button>

            {/* Service List */}
            {services.map((service) => (
                <Card key={service._id} style={commonStyles.card}>
                    <Card.Content>

                        <Text style={commonStyles.requestTitle}>
                            {service.name}
                        </Text>

                        <Text style={commonStyles.info}>
                            {service.description}
                        </Text>

                        <Text style={commonStyles.info}>
                            💵 {service.price.toLocaleString()} VND
                        </Text>

                        {/* STATUS */}
                        {/* STATUS */}
                        <Chip
                            style={[
                                {
                                    position: "absolute",
                                    top: 5,
                                    right: 5
                                },
                                service.is_active
                                    ? commonStyles.statusActive
                                    : commonStyles.statusInactive
                            ]}
                            textStyle={
                                service.is_active
                                    ? commonStyles.statusTextActive
                                    : commonStyles.statusTextInactive
                            }
                        >
                            {service.is_active ? "Active" : "Disabled"}
                        </Chip>
                        <View style={[commonStyles.rowTop, { marginTop: 15 }]}>
                            <Button
                                mode="contained"
                                onPress={() => openEditModal(service)}
                            >
                                Edit
                            </Button>

                            <Button
                                mode="contained"
                                buttonColor={service.is_active ? "#e53935" : "#43a047"}
                                onPress={() =>
                                    toggleService(service._id, service.is_active)
                                }
                            >
                                {service.is_active ? "Disable" : "Enable"} 
                            </Button>

                        </View>

                    </Card.Content>
                </Card>
            ))}

            {/* Modal */}
            <Portal>
                <Modal
                    visible={visible}
                    onDismiss={closeModal}
                    contentContainerStyle={commonStyles.modal}
                >

                    <Text style={commonStyles.modalTitle}>
                        {editingId ? "Edit Service" : "Add Service"}
                    </Text>

                    <TextInput
                        label="Name"
                        value={name}
                        onChangeText={setName}
                        style={commonStyles.input}
                    />

                    <TextInput
                        label="Description"
                        value={description}
                        onChangeText={setDescription}
                        style={commonStyles.input}
                    />

                    <TextInput
                        label="Price"
                        value={price}
                        onChangeText={(text) => setPrice(text.replace(/[^0-9]/g, ""))}
                        keyboardType="numeric"
                        style={commonStyles.input}
                    />

                    <View style={commonStyles.modalButtons}>

                        <Button onPress={closeModal}>
                            Cancel
                        </Button>

                        <Button
                            mode="contained"
                            onPress={editingId ? updateService : addService}
                        >
                            {editingId ? "Update" : "Create"}
                        </Button>

                    </View>

                </Modal>
            </Portal>

        </ScrollView>
    );
}
