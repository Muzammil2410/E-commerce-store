/**
 * Auth routes - register, login (seller/buyer/employee + hardcoded admin)
 */
const express = require('express');
const authService = require('../services/auth.service');

const router = express.Router();

/**
 * POST /api/auth/register
 * Body: { name, email, password, role } where role is seller | buyer | employee
 */
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const result = await authService.registerUser({ name, email, password, role });
    console.log('[Auth] Register success:', { email: result.user.email, role: result.user.role });
    res.status(201).json({
      message: 'Registration successful',
      user: result.user,
      token: result.token,
    });
  } catch (err) {
    console.log('[Auth] Register failure:', err.message);
    res.status(400).json({ message: err.message || 'Registration failed' });
  }
});

/**
 * POST /api/auth/login
 * Body: { email, password, role? } - role optional; if provided, must match DB role
 * Admin: hardcoded credentials (admin@zizla.com / admin123, admin@company.com / admin123) still return JWT
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const result = await authService.loginUser({ email, password, role });
    console.log('[Auth] Login success:', { email: result.user.email, role: result.user.role });
    console.log('[Auth] Role from token:', result.user.role);
    res.status(200).json({
      message: 'Login successful',
      user: result.user,
      token: result.token,
    });
  } catch (err) {
    console.log('[Auth] Login failure:', err.message);
    res.status(401).json({ message: err.message || 'Login failed' });
  }
});

module.exports = router;
