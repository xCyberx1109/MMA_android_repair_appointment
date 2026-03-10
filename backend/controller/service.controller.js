const Service = require("../models/Service.model");

exports.getAllServices = async (req, res) => {
  try {

    const services = await Service.find();

    res.status(200).json(services);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// GET service by id
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CREATE service
exports.createService = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    const service = new Service({
      name,
      description,
      price
    });

    const saved = await service.save();
    res.status(201).json(saved);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE service
exports.updateService = async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE service
exports.deleteService = async (req, res) => {
  try {

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    service.is_active = !service.is_active;
    await service.save();

    res.json({
      message: "Service status updated",
      service
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};