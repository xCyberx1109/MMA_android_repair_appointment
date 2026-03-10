const Request = require("../models/Request.model.js");
const User = require("../models/User.model.js");
const Service = require("../models/Service.model.js");

exports.getAdminDashboard = async (req, res) => {
    try {

        const [
            pendingRequests,
            assignedRequests,
            inProgressRequests,
            completedRequests,
            cancelledRequests
        ] = await Promise.all([

            Request.find({ status: "pending" })
                .populate("customerId", "name email")
                .populate("serviceId", "name")
                .sort({ createdAt: -1 }),

            Request.find({ status: "assigned" })
                .populate("customerId", "name email")
                .populate("serviceId", "name")
                .populate("repairmanId", "name")
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
                assigned: assignedRequests.length,
                inProgress: inProgressRequests.length,
                completed: completedRequests.length,
                cancelled: cancelledRequests.length
            },

            pendingRequests,
            assignedRequests,
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

exports.getMyRequests = async (req, res) => {
    try {

        const customerId = req.user.id;

        const requests = await Request.find({ customerId })
            .populate("serviceId", "name price")
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

exports.createRequest = async (req, res) => {
    try {

        const {
            customerId,
            serviceId,
            title,
            description,
            address,
            scheduleDate
        } = req.body;

        // kiểm tra dữ liệu bắt buộc
        if (!customerId || !serviceId || !scheduleDate) {
            return res.status(400).json({
                message: "customerId, serviceId and scheduleDate are required"
            });
        }

        // kiểm tra customer tồn tại
        const customer = await User.findById(customerId);
        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        // kiểm tra service tồn tại
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({
                message: "Service not found"
            });
        }

        // tạo request
        const newRequest = new Request({
            customerId,
            serviceId,
            title,
            description,
            address,
            scheduleDate
        });

        const savedRequest = await newRequest.save();

        res.status(201).json({
            message: "Request created successfully",
            data: savedRequest
        });

    } catch (error) {

        res.status(500).json({
            message: "Server error",
            error: error.message
        });

    }
};

exports.getAvailableRepairmen = async (req, res) => {
    try {

        const repairmen = await User.find({ role: "repairman" });

        const available = [];

        for (const r of repairmen) {

            const count = await Request.countDocuments({
                repairmanId: r._id,
                status: { $in: ["assigned", "working"] }
            });

            if (count < 3) {
                available.push(r);
            }
        }

        res.json(available);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.assignRepairman = async (req, res) => {
    try {

        const requestId = req.params.id;
        const { repairmanId } = req.body;

        const count = await Request.countDocuments({
            repairmanId,
            status: { $in: ["assigned", "in_progress"] }
        });

        if (count >= 3) {
            return res.status(400).json({
                message: "Repairman already has 3 tasks"
            });
        }

        const request = await Request.findByIdAndUpdate(
            requestId,
            {
                repairmanId,
                status: "assigned"
            },
            { new: true }
        );

        res.json(request);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateRequestStatus = async (req, res) => {
    try {
        const requestId = req.params.id;
        const { status } = req.body;

        const validStatus = [
            "pending",
            "assigned",
            "in_progress",
            "completed",
            "cancelled"
        ];
        if (!validStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const request = await Request.findByIdAndUpdate(
            requestId,
            { status },
            { returnDocument: "after", runValidators: true }
        );
        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        res.json({
            message: "Status updated",
            request
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


exports.updateRequest = async (req, res) => {
    try {

        const { title, address } = req.body;

        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ message: "Request not found" });
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                message: "Only pending request can be edited"
            });
        }

        request.title = title || request.title;
        request.address = address || request.address;

        await request.save();

        res.json(request);

    } catch (err) {
        res.status(500).json(err);
    }
};
