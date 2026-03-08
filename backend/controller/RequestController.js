const Request = require("../models/Request.model.js");
const User = require("../models/User.model.js");
const Service = require("../models/Service.model.js");

exports.getAdminDashboard = async (req, res) => {
    try {

        const [
            pendingRequests,
            acceptedRequests,
            inProgressRequests,
            completedRequests,
            cancelledRequests
        ] = await Promise.all([

            Request.find({ status: "pending" })
                .populate("customerId", "name email")
                .populate("serviceId", "name")
                .sort({ createdAt: -1 }),

            Request.find({ status: "accepted" })
                .populate("customerId", "name email")
                .populate("serviceId", "name")
                .sort({ createdAt: -1 }),

            Request.find({ status: "in_progress" })
                .populate("customerId", "name email")
                .populate("serviceId", "name")
                .sort({ createdAt: -1 }),

            Request.find({ status: "completed" })
                .populate("customerId", "name email")
                .populate("serviceId", "name")
                .sort({ createdAt: -1 }),

            Request.find({ status: "cancelled" })
                .populate("customerId", "name email")
                .populate("serviceId", "name")
                .sort({ createdAt: -1 })

        ]);

        res.json({
            counts: {
                pending: pendingRequests.length,
                accepted: acceptedRequests.length,
                inProgress: inProgressRequests.length,
                completed: completedRequests.length,
                cancelled: cancelledRequests.length
            },

            pendingRequests,
            acceptedRequests,
            inProgressRequests,
            completedRequests,
            cancelledRequests
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

exports.createRequest = async (req, res) => {

    try {

        const {
            serviceId,
            title,
            description,
            address,
            videoUrl,
            scheduleDate
        } = req.body;

        const request = new Request({
            customerId: req.user.id,
            serviceId,
            title,
            description,
            address,
            videoUrl,
            scheduleDate
        });

        await request.save();

        res.json({
            message: "Request created successfully",
            request
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};
exports.getMyRequests = async (req, res) => {
    try {

        const customerId = req.user.id;

        const requests = await Request.find({ customerId })
            .populate("serviceId", "name")
            .populate("repairmanId", "name")
            .sort({ createdAt: -1 });

        res.json(requests);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};

exports.getMyAssignedRequests = async (req, res) => {
    try {

        const repairmanId = req.user.id;

        const requests = await Request.find({ repairmanId })
            .populate("serviceId", "name")
            .populate("customerId", "name")
            .sort({ createdAt: -1 });

        res.json(requests);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};


