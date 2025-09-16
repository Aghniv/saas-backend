const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Tenant } = require('../models');

// Register a new user
const register = async (req, res) => {
  try {
    const { email, password, role, tenantId } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Check if tenant exists
    const tenant = await Tenant.findByPk(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: role || 'member',
      tenantId
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, tenantId: newUser.tenantId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        tenantId: newUser.tenantId
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user exists
    const user = await User.findOne({
      where: { email },
      include: [{ model: Tenant }]
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, tenantId: user.tenantId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        tenant: {
          id: user.Tenant.id,
          name: user.Tenant.name,
          slug: user.Tenant.slug,
          subscriptionPlan: user.Tenant.subscriptionPlan
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Tenant }]
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        tenant: {
          id: user.Tenant.id,
          name: user.Tenant.name,
          slug: user.Tenant.slug,
          subscriptionPlan: user.Tenant.subscriptionPlan
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Invite a new user (admin only)
const inviteUser = async (req, res) => {
  try {
    const { email, role } = req.body;
    
    // Only admins can invite users
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Requires admin role' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Generate a temporary password
    const tempPassword = 'password';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);
    
    // Create new user with admin's tenant
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: role || 'member',
      tenantId: req.user.tenantId
    });
    
    res.status(201).json({
      message: 'User invited successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        tenantId: newUser.tenantId
      }
    });
  } catch (error) {
    console.error('Invite user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  inviteUser
};