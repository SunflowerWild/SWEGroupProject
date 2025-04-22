const Part = require('../login-register/src/models/Part');
const PC = require('../login-register/src/models/PC');
const mongoose = require('mongoose'); // Add this line
const User = require('../login-register/src/models/User'); // Import the User model
const sendEmail = require('../login-register/src/utils/emailService'); // Import the sendEmail utility



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

// Delete an item by its unique ID
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.body;

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

// Display full inventory
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

// Checkout an item by its unique ID or find the next available one
exports.checkoutItem = async (req, res) => {
    try {
        const { id, type, location } = req.body; // Accept type and location for fallback search
        const userEmail = req.user?.email || req.body.email; // Get the user's email from req.user or req.body

        let part;

        // If an ID is provided, try to find the item by ID
        if (id) {
            part = await Part.findById(id);
        }

        // If no ID is provided or the item is unavailable, find the next available item of the same type and location
        if (!part || !part.isAvailable) {
            part = await Part.findOne({ type, location, isAvailable: true });
        }

        if (!part) {
            return res.status(404).json({ message: 'No available items found for checkout.' });
        }

        // Mark the item as checked out
        part.checkedOut = true;
        part.isAvailable = false;
        await part.save();

        // Retrieve all admin users
        const admins = await User.find({ isAdmin: true }, 'email'); // Get only the email field
        const adminEmails = admins.map(admin => admin.email);

        // Prepare the email content
        const emailSubject = `Item Checked Out: ${part.name || 'Unnamed Item'}`;
        const emailBody = `
            The following item has been checked out:
            - Name: ${part.name || 'Unnamed Item'}
            - Type: ${part.type || 'Unknown'}
            - Location: ${part.location || 'Unknown'}
            - Checked out by: ${userEmail}
        `;

        // Send email to all admins
        for (const adminEmail of adminEmails) {
            await sendEmail(adminEmail, emailSubject, emailBody);
        }

        // Send email to the user checking out the item
        await sendEmail(userEmail, emailSubject, emailBody);

        res.json({
            message: `Item checked out successfully`,
            part,
        });
    } catch (error) {
        console.error('Error checking out item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Return an item by its unique ID
exports.returnItem = async (req, res) => {
    try {
        const { id } = req.body;
        const adminEmail = req.user.email; // Get the admin's email from req.user

        // Try to find the item as a part first
        let part = await Part.findById(id);
        let itemType = 'part';

        // If not found, try to find it as a PC
        if (!part) {
            part = await PC.findById(id);
            itemType = 'pc';
        }

        if (!part) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if the item is already available
        if (part.isAvailable) {
            return res.status(400).json({ message: 'Item is already available' });
        }

        // Mark the item as returned
        part.checkedOut = false;
        part.isAvailable = true;
        await part.save();

        // Retrieve all admin users
        const admins = await User.find({ isAdmin: true }, 'email'); // Get only the email field
        const adminEmails = admins.map(admin => admin.email);

        // Prepare the email content
        const emailSubject = `Item Returned: ${part.name || 'Unnamed Item'}`;
        const emailBody = `
            The following item has been returned:
            - Name: ${part.name || 'Unnamed Item'}
            - Type: ${itemType}
            - Location: ${part.location || 'Unknown'}
            - Verified by: ${adminEmail}
        `;

        // Send email to all admins
        for (const adminEmail of adminEmails) {
            await sendEmail(adminEmail, emailSubject, emailBody);
        }

        // Send email to the user who returned the item
        await sendEmail(adminEmail, emailSubject, emailBody);

        res.json({
            message: `${itemType.toUpperCase()} returned successfully`,
            itemType,
            part,
        });
    } catch (error) {
        console.error('Error returning item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};