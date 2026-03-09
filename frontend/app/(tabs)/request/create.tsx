import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet
} from "react-native";

import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Service {
    _id: string;
    name: string;
    description: string;
    price: number;
}

export default function CreateRequest() {

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");

    const [services, setServices] = useState<Service[]>([]);
    const [serviceId, setServiceId] = useState("");

    const [scheduleDate, setScheduleDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [customerId, setCustomerId] = useState("");

    const [errors, setErrors] = useState<any>({});

    useEffect(() => {
        fetchServices();
        getUserId();
    }, []);

    const fetchServices = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/services");
            setServices(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const getUserId = async () => {
        try {
            const id = await AsyncStorage.getItem("UserId");
            if (id) setCustomerId(id);
        } catch (error) {
            console.log(error);
        }
    };

    const validate = () => {

        const newErrors: any = {};
        const now = new Date();

        if (!title.trim()) newErrors.title = "Title is required";
        if (!description.trim()) newErrors.description = "Description is required";
        if (!address.trim()) newErrors.address = "Address is required";
        if (!serviceId) newErrors.serviceId = "Please select a service";

        if (scheduleDate < now) {
            newErrors.scheduleDate = "Schedule date cannot be in the past";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const createRequest = async () => {

        if (!validate()) return;

        try {

            await axios.post(
                "http://localhost:5000/api/requests/create",
                {
                    customerId,
                    serviceId,
                    title,
                    description,
                    address,
                    scheduleDate: scheduleDate.toISOString()
                }
            );

            alert("Request created successfully");

            setTitle("");
            setDescription("");
            setAddress("");
            setServiceId("");

        } catch (error: any) {

            alert(error.response?.data?.message || "Create request failed");

        }
    };

    return (
        <View style={styles.container}>

            <Text style={styles.title}>Create Service Request</Text>

            {/* Title */}
            <Text style={styles.label}>Title</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter title"
            />
            {errors.title && <Text style={styles.error}>{errors.title}</Text>}

            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                multiline
            />
            {errors.description && <Text style={styles.error}>{errors.description}</Text>}

            {/* Address */}
            <Text style={styles.label}>Address</Text>
            <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter address"
            />
            {errors.address && <Text style={styles.error}>{errors.address}</Text>}

            {/* Service */}
            <Text style={styles.label}>Service</Text>
            <View style={styles.pickerWrapper}>
                <Picker
                    selectedValue={serviceId}
                    onValueChange={(itemValue) => setServiceId(itemValue)}
                >
                    <Picker.Item label="Select service" value="" />
                    {services.map((service) => (
                        <Picker.Item
                            key={service._id}
                            label={service.name}
                            value={service._id}
                        />
                    ))}
                </Picker>
            </View>

            {errors.serviceId && <Text style={styles.error}>{errors.serviceId}</Text>}

            {/* Date */}
            <Text style={styles.label}>Schedule Date</Text>

            {Platform.OS === "web" ? (
                <input
                    type="datetime-local"
                    title="Schedule Date"
                    style={styles.webDate}
                    value={scheduleDate.toISOString().slice(0, 16)}
                    onChange={(e) => setScheduleDate(new Date(e.target.value))}
                />
            ) : (
                <>
                    <View style={styles.dateButton}>
                        <Button
                            title={scheduleDate.toLocaleString()}
                            onPress={() => setShowDatePicker(true)}
                        />
                    </View>

                    {showDatePicker && (
                        <DateTimePicker
                            value={scheduleDate}
                            mode="datetime"
                            minimumDate={new Date()}
                            display="default"
                            onChange={(event, date) => {
                                setShowDatePicker(false);
                                if (date) setScheduleDate(date);
                            }}
                        />
                    )}
                </>
            )}

            {errors.scheduleDate && <Text style={styles.error}>{errors.scheduleDate}</Text>}

            {/* Button */}
            <View style={styles.buttonWrapper}>
                <Button
                    title="Create Request"
                    onPress={createRequest}
                />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f5f5f5"
    },

    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center"
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        marginTop: 10
    },

    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        borderRadius: 8,
        marginTop: 5,
        backgroundColor: "#fff"
    },

    textArea: {
        height: 80
    },

    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        marginTop: 5,
        backgroundColor: "#fff"
    },

    webDate: {
        padding: 10,
        marginTop: 5,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#ddd"
    },

    dateButton: {
        marginTop: 5
    },

    buttonWrapper: {
        marginTop: 25
    },

    error: {
        color: "#ff3b30",
        marginTop: 4,
        fontSize: 13
    }

});
