const bcrypt = require('bcryptjs');
const { sequelize, Tenant, User } = require('../models');

// Initialize database with test data
const initializeDatabase = async () => {
  try {
    // Sync database models
    await sequelize.sync({ force: true });
    console.log('Database synchronized');
    
    // Create test tenants
    const acmeTenant = await Tenant.create({
      name: 'Acme Corporation',
      slug: 'acme',
      subscriptionPlan: 'free'
    });
    
    const globexTenant = await Tenant.create({
      name: 'Globex Corporation',
      slug: 'globex',
      subscriptionPlan: 'free'
    });
    
    console.log('Test tenants created');
    
    // Hash password for test users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password', salt);
    
    // Create test users for Acme
    await User.create({
      email: 'admin@acme.test',
      password: hashedPassword,
      role: 'admin',
      tenantId: acmeTenant.id
    });
    
    await User.create({
      email: 'user@acme.test',
      password: hashedPassword,
      role: 'member',
      tenantId: acmeTenant.id
    });
    
    // Create test users for Globex
    await User.create({
      email: 'admin@globex.test',
      password: hashedPassword,
      role: 'admin',
      tenantId: globexTenant.id
    });
    
    await User.create({
      email: 'user@globex.test',
      password: hashedPassword,
      role: 'member',
      tenantId: globexTenant.id
    });
    
    console.log('Test users created');
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  } finally {
    process.exit();
  }
};

// Run initialization
initializeDatabase();