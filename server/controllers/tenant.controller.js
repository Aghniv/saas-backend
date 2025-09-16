const { Tenant } = require('../models');

// Get tenant by slug
const getTenantBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const tenant = await Tenant.findOne({ where: { slug } });
    
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    // Check if user belongs to this tenant
    if (req.user.tenantId !== tenant.id) {
      return res.status(403).json({ message: 'Access denied to this tenant' });
    }
    
    res.status(200).json({ tenant });
  } catch (error) {
    console.error('Get tenant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Upgrade tenant subscription to Pro
const upgradeToPro = async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Find tenant by slug
    const tenant = await Tenant.findOne({ where: { slug } });
    
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    // Check if user belongs to this tenant and is an admin
    if (req.user.tenantId !== tenant.id) {
      return res.status(403).json({ message: 'Access denied to this tenant' });
    }
    
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admins can upgrade subscription' });
    }
    
    // Update subscription plan to Pro
    await tenant.update({ subscriptionPlan: 'pro' });
    
    res.status(200).json({
      message: 'Subscription upgraded to Pro successfully',
      tenant: {
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        subscriptionPlan: 'pro'
      }
    });
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getTenantBySlug,
  upgradeToPro
};