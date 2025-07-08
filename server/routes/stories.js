const express = require('express');
const router = express.Router();
const Story = require('../models/Story');

// ✅ GET stories (approved by default)
router.get('/', async (req, res) => {
  try {
    const { division, district, all } = req.query;

    const filter = all === 'true' ? {} : { isAdminApproved: true };

    if (division) filter.division = division;
    if (district) filter.district = district;

    const stories = await Story.find(filter).sort({ submittedAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch stories' });
  }
});

// ✅ POST story (submit form)
router.post('/', async (req, res) => {

  const { title, content, division, district, coordinates, source } = req.body;

  if (!title || !content || !district) {
    return res.status(400).json({ error: 'Title, content, and district are required.' });
  }

  try {
    const story = new Story({
      title,
      content,
      division,
      district,
      source,
      coordinates,
      isAdminApproved: false,
    });

    await story.save();
    res.status(201).json({ message: 'Story submitted successfully', story });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Failed to submit story' });
  }
});

// ✅ GET unapproved stories (admin)
router.get('/unapproved', async (req, res) => {
  try {
    const stories = await Story.find({ isAdminApproved: false }).sort({ submittedAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch unapproved stories' });
  }
});

// ✅ PATCH: approve story by ID (admin)
router.patch('/:id/approve', async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { isAdminApproved: true },
      { new: true }
    );

    if (!story) return res.status(404).json({ error: 'Story not found' });

    res.json({ message: 'Story approved', story });
  } catch (err) {
    res.status(400).json({ error: 'Failed to approve story' });
  }
});
router.delete('/:id', async (req, res) => {
  await Story.findByIdAndDelete(req.params.id);
  res.json({ message: 'Story deleted' });
});

// ✅ PATCH alias: /rejected (for frontend compatibility)
router.patch('/:id/rejected', async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { isAdminApproved: false, isRejected: true },
      { new: true }
    );

    if (!story) return res.status(404).json({ error: 'Story not found' });

    res.json({ message: 'Story rejected (alias)', story });
  } catch (err) {
    res.status(400).json({ error: 'Failed to reject story' });
  }
});


// ✅ PATCH alias: /approved (for frontend compatibility)
router.patch('/:id/approved', async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { isAdminApproved: true },
      { new: true }
    );

    if (!story) return res.status(404).json({ error: 'Story not found' });

    res.json({ message: 'Story approved (alias)', story });
  } catch (err) {
    res.status(400).json({ error: 'Failed to approve story' });
  }
});

// ✅ PATCH alias: /rejected (for frontend compatibility)
router.patch('/:id/rejected', async (req, res) => {
  try {
    const story = await Story.findByIdAndUpdate(
      req.params.id,
      { isAdminApproved: false },
      { new: true }
    );

    if (!story) return res.status(404).json({ error: 'Story not found' });

    res.json({ message: 'Story rejected (alias)', story });
  } catch (err) {
    res.status(400).json({ error: 'Failed to reject story' });
  }
});


// GET /api/divisions-with-stories
router.get("/divisions-with-stories", async (req, res) => {
  try {
    const stories = await Story.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: "$division", count: { $sum: 1 } } }
    ]);

    res.json(stories); // example: [{ _id: "Khulna", count: 5 }]
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;