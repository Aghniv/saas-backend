const { Note } = require('../models');

// Middleware to check if tenant has reached the free plan limit
const checkNotesLimit = async (req, res, next) => {
  try {
    // Skip check for note updates and deletions
    if (req.method !== 'POST') {
      return next();
    }
    
    const tenant = req.tenant;
    
    // If tenant is on pro plan, no limit applies
    if (tenant.subscriptionPlan === 'pro') {
      return next();
    }
    
    // Count existing notes for this tenant
    const noteCount = await Note.count({
      where: { tenantId: tenant.id }
    });
    
    // Free plan limit is 3 notes
    if (noteCount >= 3) {
      return res.status(403).json({
        message: 'Free plan limit reached. Please upgrade to Pro for unlimited notes.',
        limitReached: true
      });
    }
    
    next();
  } catch (error) {
    console.error('Subscription middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  checkNotesLimit
};