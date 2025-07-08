const express = require('express');
const router = express.Router();
const Story = require('../models/Story');

// Middleware to handle common Mongoose errors (e.g., CastError for invalid IDs)
const handleMongooseError = (res, err, message) => {
    if (err.name === 'CastError') {
        return res.status(400).json({ error: 'Invalid story ID format' });
    }
    res.status(500).json({ error: message || 'An unexpected error occurred' });
};

// GET stories
// - If `all=true`, returns all stories (approved, rejected, pending).
// - Otherwise, returns only approved stories by default.
// - Can filter by division and district.
router.get('/', async (req, res) => {
    try {
        const { division, district, all } = req.query;

        const filter = {}; // Start with an empty filter

        // If 'all' is not true, only show approved stories
        if (all !== 'true') {
            filter.isAdminApproved = true;
            filter.isRejected = { $ne: true }; // Ensure it's not rejected
        }

        if (division) {
            filter.division = division;
        }
        if (district) {
            filter.district = district;
        }

        const stories = await Story.find(filter).sort({ submittedAt: -1 });
        res.json(stories);
    } catch (err) {
        console.error('Error fetching stories:', err); // Log the actual error
        handleMongooseError(res, err, 'Failed to fetch stories');
    }
});

// POST story (submit form)
router.post('/', async (req, res) => {
    const { title, content, division, district, coordinates, source } = req.body;

    if (!title || !content || !district || !division) { // Added division as required
        return res.status(400).json({ error: 'Title, content, division, and district are required.' });
    }

    try {
        const story = new Story({
            title,
            content,
            division,
            district,
            source,
            coordinates,
            isAdminApproved: false, // Newly submitted stories are pending approval
            isRejected: false,     // And not rejected
            submittedAt: new Date() // Add a timestamp for sorting
        });

        await story.save();
        res.status(201).json({ message: 'Story submitted successfully', story });
    } catch (err) {
        console.error('Error submitting story:', err);
        handleMongooseError(res, err, 'Failed to submit story');
    }
});

// GET unapproved stories (admin) - This route is technically redundant if `all=true` handles it
// However, it's fine to keep for specific admin view if needed.
router.get('/unapproved', async (req, res) => {
    try {
        const stories = await Story.find({ isAdminApproved: false, isRejected: false }).sort({ submittedAt: -1 });
        res.json(stories);
    } catch (err) {
        console.error('Error fetching unapproved stories:', err);
        handleMongooseError(res, err, 'Failed to fetch unapproved stories');
    }
});


// PUT: Update story content (for editing rejected stories or any story)
// This is crucial for the "Edit & Approve" functionality.
router.put('/:id', async (req, res) => {
    const { title, content, division, district, source, coordinates, isAdminApproved, isRejected } = req.body;
    try {
        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        if (content !== undefined) updateFields.content = content;
        if (division !== undefined) updateFields.division = division;
        if (district !== undefined) updateFields.district = district;
        if (source !== undefined) updateFields.source = source;
        if (coordinates !== undefined) updateFields.coordinates = coordinates;
        if (isAdminApproved !== undefined) updateFields.isAdminApproved = isAdminApproved;
        if (isRejected !== undefined) updateFields.isRejected = isRejected;


        const story = await Story.findByIdAndUpdate(
            req.params.id,
            { $set: updateFields }, // Use $set to update only provided fields
            { new: true, runValidators: true } // Return the updated doc and run schema validators
        );

        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        res.json({ message: 'Story updated successfully', story });
    } catch (err) {
        console.error('Error updating story:', err);
        // Mongoose validation errors for `runValidators: true` will be here
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: err.message });
        }
        handleMongooseError(res, err, 'Failed to update story');
    }
});

// PATCH: Approve story by ID (admin)
// Sets isAdminApproved to true and isRejected to false
router.patch('/:id/approved', async (req, res) => {
    try {
        const story = await Story.findByIdAndUpdate(
            req.params.id,
            { isAdminApproved: true, isRejected: false }, // Explicitly set isRejected to false
            { new: true }
        );

        if (!story) return res.status(404).json({ error: 'Story not found' });

        res.json({ message: 'Story approved', story });
    } catch (err) {
        console.error('Error approving story:', err);
        handleMongooseError(res, err, 'Failed to approve story');
    }
});

// PATCH: Reject story by ID (admin)
// Sets isRejected to true and isAdminApproved to false
router.patch('/:id/rejected', async (req, res) => {
    try {
        const story = await Story.findByIdAndUpdate(
            req.params.id,
            { isRejected: true, isAdminApproved: false }, // Explicitly set isAdminApproved to false
            { new: true }
        );

        if (!story) return res.status(404).json({ error: 'Story not found' });

        res.json({ message: 'Story rejected', story });
    } catch (err) {
        console.error('Error rejecting story:', err);
        handleMongooseError(res, err, 'Failed to reject story');
    }
});

// DELETE story by ID (admin)
router.delete('/:id', async (req, res) => {
    try {
        const result = await Story.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Story not found' });
        }
        res.json({ message: 'Story deleted' });
    } catch (err) {
        console.error('Error deleting story:', err);
        handleMongooseError(res, err, 'Failed to delete story');
    }
});

// GET /api/districts-with-stories?division=<divisionId>
router.get('/districts-with-stories', async (req, res) => {
    try {
        const { division } = req.query;

        if (!division) {
            return res.status(400).json({ error: 'Division ID is required.' });
        }

        const districts = await Story.aggregate([
            { $match: { isAdminApproved: true, isRejected: { $ne: true }, division: division } },
            { $group: { _id: '$district' } }, // Group by district to get unique districts
            { $project: { _id: 1 } } // Only return the district ID
        ]);

        // Map the results to an array of district IDs
        const districtIds = districts.map(d => d._id);
        res.json(districtIds); // Send back an array of district IDs
    } catch (error) {
        console.error('Error fetching districts with stories:', error);
        res.status(500).json({ error: 'Server error: Failed to fetch districts with stories' });
    }
});

module.exports = router;