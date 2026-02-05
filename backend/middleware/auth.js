import express from 'express';

const DATABASE_PASSWORD = null; // Disabled - no password required

const databaseAuth = (req, res, next) => {
  // Password protection disabled - allow all access
  req.dbAuthenticated = true;
  next();
};

export default databaseAuth;
