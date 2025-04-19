const Part = require('../login-register/src/models/Part');
const PC = require('../login-register/src/models/PC');
const mongoose = require('mongoose'); // Add this line


require('dotenv').config();

// Adding a new PC part to the inventory, name, type, location, and optional project tag
exports.addPart = async (req, res) => {
    try {
        const { name, location, projTag, type } = req.body;
        const part = await Part.create(req.body);

        await part.save();

        res.status(201).json({ message: 'New part added successfully.' });

    } catch (error) {
        console.error('Error adding part:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Adding a new built PC to the inventory, name, location, optional project tag
exports.addPC = async (req, res) => {
    try {
        const { GPU, CPU, RAM, Storage } = req.body;
        const newPC = await PC.create(req.body);

        await newPC.save();

        res.status(201).json({ message: 'New PC added successfully.' });


    } catch (error) {
        console.error('Error adding PC:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// In controllers/inventoryController.js
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;

        // Try to delete as part first
        let deletedItem = await Part.findByIdAndDelete(id);
        let itemType = 'part';

        // If not found, try deleting as PC
        if (!deletedItem) {
            deletedItem = await PC.findByIdAndDelete(id);
            itemType = 'pc';
        }

        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.json({
            message: `${itemType.toUpperCase()} deleted successfully`,
            itemType,
            deletedItem
        });
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.getInventorySummary = async (req, res) => {
    try {
        const summary = await Part.aggregate([
            {
                $project: {
                    _id: 1,
                    name: 1,
                    location: 1,
                    type: 1,
                    isAvailable: 1,
                    projectTag: 1,
                    specs: { $literal: null },
                    itemType: { $literal: 'part' }
                }
            },
            {
                $unionWith: {
                    coll: 'pcs',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                name: { $concat: ["Custom PC: ", "$PCID"] },
                                location: "$Location",
                                type: { $literal: 'pc' },
                                isAvailable: 1,
                                projectTag: 1,
                                specs: {
                                    $concat: [
                                        "GPU: ", "$GPU",
                                        "\nCPU: ", "$CPU",
                                        "\nRAM: ", "$RAM",
                                        "\nStorage: ", "$Storage"
                                    ]
                                },
                                itemType: { $literal: 'pc' }
                            }
                        }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        name: "$name",
                        location: "$location",
                        type: "$type"
                    },
                    totalQuantity: { $sum: 1 },
                    availableQuantity: {
                        $sum: { $cond: [{ $eq: ["$isAvailable", true] }, 1, 0] }
                    },
                    projectTags: { $addToSet: "$projectTag" },
                    itemIds: { $push: "$_id" }, // Collect all unique IDs
                    specs: { $first: "$specs" }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id.name",
                    location: "$_id.location",
                    type: "$_id.type",
                    totalQuantity: 1,
                    availableQuantity: 1,
                    projectTags: 1,
                    specs: 1,
                    itemIds: 1 // Include IDs in output
                }
            }
        ]);

        res.json(summary);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};