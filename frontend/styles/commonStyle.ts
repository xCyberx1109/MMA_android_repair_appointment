import { StyleSheet } from "react-native";

export const commonStyles = StyleSheet.create({

    /* Layout */
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5"
    },

    centerContainer: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#f5f5f5"
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20
    },

    /* Text */
    title: {
        fontSize: 26,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20
    },

    section: {
        fontSize: 20,
        fontWeight: "600",
        marginVertical: 10
    },

    label: {
        fontSize: 15,
        fontWeight: "600",
        marginTop: 10,
        marginBottom: 4
    },

    info: {
        fontSize: 14,
        color: "#555",
        marginTop: 2
    },

    /* Error */

    error: {
        color: "#ef4444",
        marginTop: 4,
        fontSize: 12
    },

    errorText: {
        color: "#ef4444",
        textAlign: "center",
        marginBottom: 10,
        fontSize: 14
    },


    /* Cards */
    card: {
        marginBottom: 15,
        borderRadius: 14
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

    /* Row */
    rowTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10
    },

    /* Titles */
    requestTitle: {
        fontSize: 18,
        fontWeight: "600",
        flex: 1
    },

    jobTitle: {
        fontSize: 18,
        fontWeight: "600",
        flex: 1
    },

    /* Form */
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: "#fff"
    },

    textArea: {
        height: 90,
        textAlignVertical: "top"
    },

    pickerWrapper: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#fff",
        overflow: "hidden"
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

    button: {
        marginTop: 10
    },

    buttonWrapper: {
        marginTop: 25
    },

    /* Modal overlay */
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 20
    },

    /* Modal box */
    modalContent: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20
    },

    /* Simple modal (dashboard style) */
    modal: {
        backgroundColor: "white",
        padding: 20,
        margin: 20,
        borderRadius: 12
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 15
    },

    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },

    /* Stats */
    statsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginBottom: 20
    },

    statusChip: {
        height: 28
    }

});
