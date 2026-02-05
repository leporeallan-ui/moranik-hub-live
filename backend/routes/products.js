import express from 'express';
import { softwareService, musicService, novelsService, analyticsService } from '../services/databaseService.js';

const router = express.Router();

// Software routes
router.get('/software', (req, res) => {
  try {
    const software = softwareService.getAll();
    res.json({
      success: true,
      data: software,
      count: software.length
    });
  } catch (error) {
    console.error('Get software error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve software' });
  }
});

router.get('/software/:id', (req, res) => {
  try {
    const software = softwareService.getById(req.params.id);
    if (!software) {
      return res.status(404).json({ success: false, error: 'Software not found' });
    }
    res.json({ success: true, data: software });
  } catch (error) {
    console.error('Get software error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve software' });
  }
});

router.post('/software', (req, res) => {
  try {
    const { name, description, category, price, version, uploadedBy } = req.body;
    
    if (!name || !description || !category || !price || !uploadedBy) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const newSoftware = softwareService.create({
      name,
      description,
      category,
      price: parseFloat(price),
      version,
      uploadedBy,
      fileUrl: req.body.fileUrl || '',
      downloadUrl: req.body.downloadUrl || ''
    });

    if (newSoftware) {
      // Update analytics
      analyticsService.incrementViews();
      
      res.status(201).json({
        success: true,
        message: 'Software uploaded successfully',
        data: newSoftware
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to upload software' });
    }
  } catch (error) {
    console.error('Upload software error:', error);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
});

router.put('/software/:id', (req, res) => {
  try {
    const software = softwareService.getById(req.params.id);
    if (!software) {
      return res.status(404).json({ success: false, error: 'Software not found' });
    }

    const updatedSoftware = softwareService.update(req.params.id, req.body);
    if (updatedSoftware) {
      res.json({
        success: true,
        message: 'Software updated successfully',
        data: updatedSoftware
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update software' });
    }
  } catch (error) {
    console.error('Update software error:', error);
    res.status(500).json({ success: false, error: 'Update failed' });
  }
});

router.delete('/software/:id', (req, res) => {
  try {
    const software = softwareService.getById(req.params.id);
    if (!software) {
      return res.status(404).json({ success: false, error: 'Software not found' });
    }

    const deleted = softwareService.delete(req.params.id);
    if (deleted) {
      res.json({ success: true, message: 'Software deleted successfully' });
    } else {
      res.status(500).json({ success: false, error: 'Failed to delete software' });
    }
  } catch (error) {
    console.error('Delete software error:', error);
    res.status(500).json({ success: false, error: 'Delete failed' });
  }
});

// Music routes
router.get('/music', (req, res) => {
  try {
    const music = musicService.getAll();
    res.json({
      success: true,
      data: music,
      count: music.length
    });
  } catch (error) {
    console.error('Get music error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve music' });
  }
});

router.get('/music/:id', (req, res) => {
  try {
    const music = musicService.getById(req.params.id);
    if (!music) {
      return res.status(404).json({ success: false, error: 'Music not found' });
    }
    res.json({ success: true, data: music });
  } catch (error) {
    console.error('Get music error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve music' });
  }
});

router.post('/music', (req, res) => {
  try {
    const { title, artist, album, duration, uploadedBy } = req.body;
    
    if (!title || !artist || !uploadedBy) {
      return res.status(400).json({ success: false, error: 'Title, artist, and uploadedBy are required' });
    }

    const newMusic = musicService.create({
      title,
      artist,
      album: album || 'Unknown Album',
      duration: parseInt(duration) || 0,
      uploadedBy,
      fileUrl: req.body.fileUrl || '',
      streamUrl: req.body.streamUrl || ''
    });

    if (newMusic) {
      // Update analytics
      analyticsService.incrementViews();
      
      res.status(201).json({
        success: true,
        message: 'Music uploaded successfully',
        data: newMusic
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to upload music' });
    }
  } catch (error) {
    console.error('Upload music error:', error);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
});

// Novels routes
router.get('/novels', (req, res) => {
  try {
    const novels = novelsService.getAll();
    res.json({
      success: true,
      data: novels,
      count: novels.length
    });
  } catch (error) {
    console.error('Get novels error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve novels' });
  }
});

router.get('/novels/:id', (req, res) => {
  try {
    const novel = novelsService.getById(req.params.id);
    if (!novel) {
      return res.status(404).json({ success: false, error: 'Novel not found' });
    }
    res.json({ success: true, data: novel });
  } catch (error) {
    console.error('Get novel error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve novel' });
  }
});

router.post('/novels', (req, res) => {
  try {
    const { title, author, genre, description, uploadedBy } = req.body;
    
    if (!title || !author || !uploadedBy) {
      return res.status(400).json({ success: false, error: 'Title, author, and uploadedBy are required' });
    }

    const newNovel = novelsService.create({
      title,
      author,
      genre: genre || 'Fiction',
      description,
      uploadedBy,
      fileUrl: req.body.fileUrl || ''
    });

    if (newNovel) {
      // Update analytics
      analyticsService.incrementViews();
      
      res.status(201).json({
        success: true,
        message: 'Novel uploaded successfully',
        data: newNovel
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to upload novel' });
    }
  } catch (error) {
    console.error('Upload novel error:', error);
    res.status(500).json({ success: false, error: 'Upload failed' });
  }
});

// Analytics route
router.get('/analytics', (req, res) => {
  try {
    const stats = analyticsService.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve analytics' });
  }
});

// User-specific content
router.get('/my-software/:userId', (req, res) => {
  try {
    const software = softwareService.getByUserId(req.params.userId);
    res.json({
      success: true,
      data: software,
      count: software.length
    });
  } catch (error) {
    console.error('Get user software error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve user software' });
  }
});

router.get('/my-music/:userId', (req, res) => {
  try {
    const music = musicService.getByUserId(req.params.userId);
    res.json({
      success: true,
      data: music,
      count: music.length
    });
  } catch (error) {
    console.error('Get user music error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve user music' });
  }
});

router.get('/my-novels/:userId', (req, res) => {
  try {
    const novels = novelsService.getByUserId(req.params.userId);
    res.json({
      success: true,
      data: novels,
      count: novels.length
    });
  } catch (error) {
    console.error('Get user novels error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve user novels' });
  }
});

export default router;
