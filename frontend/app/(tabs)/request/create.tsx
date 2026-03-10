import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Button,
    
} from "react-native";

import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { commonStyles } from "../../../styles/commonStyle";

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
    const formatLocalDateTime = (date: Date) => {
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60000);
        return localDate.toISOString().slice(0, 16);
    };

    return (
        <View style={commonStyles.container}>

            <Text style={commonStyles.title}>Create Service Request</Text>

            {/* Title */}
            <Text style={commonStyles.label}>Title</Text>
            <TextInput
                style={commonStyles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter title"
            />
            {errors.title && <Text style={commonStyles.error}>{errors.title}</Text>}

            {/* Description */}
            <Text style={commonStyles.label}>Description</Text>
            <TextInput
                style={[commonStyles.input, commonStyles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter description"
                multiline
            />
            {errors.description && <Text style={commonStyles.error}>{errors.description}</Text>}

            {/* Address */}
            <Text style={commonStyles.label}>Address</Text>
            <TextInput
                style={commonStyles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Enter address"
            />
            {errors.address && <Text style={commonStyles.error}>{errors.address}</Text>}

            {/* Service */}
            <Text style={commonStyles.label}>Service</Text>
            <View style={commonStyles.pickerWrapper}>
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

            {errors.serviceId && <Text style={commonStyles.error}>{errors.serviceId}</Text>}

            {/* Date */}
            <Text style={commonStyles.label}>Schedule Date</Text>

            {Platform.OS === "web" ? (
                <input
                    type="datetime-local"
                    title="Schedule Date"
                    style={commonStyles.webDate}
                    value={formatLocalDateTime(scheduleDate)}
                    onChange={(e) => setScheduleDate(new Date(e.target.value))}
                />
            ) : (
                <>
                    <View style={commonStyles.dateButton}>
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

            {errors.scheduleDate && <Text style={commonStyles.error}>{errors.scheduleDate}</Text>}

            {/* Button */}
            <View style={commonStyles.buttonWrapper}>
                <Button
                    title="Create Request"
                    onPress={createRequest}
                />
            </View>

        </View>
    );
}


