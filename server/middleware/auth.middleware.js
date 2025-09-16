const jwt = require('jsonwebtoken');
const { User, Tenant } = require('../models');

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user with decoded id
    const user = await User.findByPk(decoded.id, {
      include: [{ model: Tenant }]
    });
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user and tenant to request object
    req.user = user;
    req.tenant = user.Tenant;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  
  return res.status(403).json({ message: 'Requires admin role' });
};

// Middleware to enforce tenant isolation
const enforceTenantIsolation = (req, res, next) => {
  // Tenant ID from the authenticated user
  const userTenantId = req.user.tenantId;
  
  // Tenant ID from request params or body
  const requestTenantId = req.params.tenantId || req.body.tenantId;
  
  // If request specifies a tenant ID, ensure it matches the user's tenant
  if (requestTenantId && parseInt(requestTenantId) !== userTenantId) {
    return res.status(403).json({ message: 'Access denied to this tenant\'s data' });
  }
  
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  enforceTenantIsolation
};