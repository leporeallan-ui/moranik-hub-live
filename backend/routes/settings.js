import express from 'express';
import settingsService from '../services/settingsService.js';

const router = express.Router();

// Get all settings (public)
router.get('/', (req, res) => {
  try {
    const settings = settingsService.getAll();
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve settings' });
  }
});

// Get specific category (public)
router.get('/:category', (req, res) => {
  try {
    const category = req.params.category;
    const settings = settingsService.get(category);
    
    if (!settings) {
      return res.status(404).json({ success: false, error: 'Settings category not found' });
    }
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings category error:', error);
    res.status(500).json({ success: false, error: 'Failed to retrieve settings' });
  }
});

// Update settings (public - authentication disabled)
router.put('/', (req, res) => {
  try {
    const updates = req.body;
    
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid settings data' });
    }
    
    const updated = settingsService.updateMultiple(updates);
    
    if (updated) {
      res.json({
        success: true,
        message: 'Settings updated successfully',
        data: settingsService.getAll()
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update settings' });
    }
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
});

// Update specific category (public - authentication disabled)
router.put('/:category', (req, res) => {
  try {
    const category = req.params.category;
    const updates = req.body;
    
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid settings data' });
    }
    
    const updated = settingsService.update(category, updates);
    
    if (updated) {
      res.json({
        success: true,
        message: `${category} settings updated successfully`,
        data: settingsService.get(category)
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to update settings' });
    }
  } catch (error) {
    console.error('Update settings category error:', error);
    res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
});

// Reset settings to defaults (public - authentication disabled)
router.post('/reset', (req, res) => {
  try {
    const reset = settingsService.reset();
    
    if (reset) {
      res.json({
        success: true,
        message: 'Settings reset to defaults successfully',
        data: settingsService.getAll()
      });
    } else {
      res.status(500).json({ success: false, error: 'Failed to reset settings' });
    }
  } catch (error) {
    console.error('Reset settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to reset settings' });
  }
});

// Feature status checks (public)
router.get('/features/:feature', (req, res) => {
  try {
    const feature = req.params.feature;
    const isEnabled = settingsService.isFeatureEnabled(feature);
    
    res.json({
      success: true,
      feature,
      enabled: isEnabled
    });
  } catch (error) {
    console.error('Check feature error:', error);
    res.status(500).json({ success: false, error: 'Failed to check feature status' });
  }
});

// Password requirements (public)
router.get('/password/requirements', (req, res) => {
  try {
    const requirements = settingsService.getPasswordRequirements();
    
    res.json({
      success: true,
      data: requirements
    });
  } catch (error) {
    console.error('Get password requirements error:', error);
    res.status(500).json({ success: false, error: 'Failed to get password requirements' });
  }
});

// Maintenance status (public)
router.get('/maintenance/status', (req, res) => {
  try {
    const isMaintenance = settingsService.isMaintenanceMode();
    const message = settingsService.getMaintenanceMessage();
    
    res.json({
      success: true,
      maintenance: isMaintenance,
      message: isMaintenance ? message : null
    });
  } catch (error) {
    console.error('Get maintenance status error:', error);
    res.status(500).json({ success: false, error: 'Failed to get maintenance status' });
  }
});

export default router;
