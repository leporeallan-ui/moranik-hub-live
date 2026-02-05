import express from 'express';

const DATABASE_PASSWORD = 'moranik2024'; // Change this password as needed

const databaseAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Database password required',
      message: 'Please provide database password in Authorization header'
    });
  }
  
  // Extract password from Basic Auth
  const base64Credentials = authHeader.split(' ')[1];
  if (!base64Credentials) {
    return res.status(401).json({
      success: false,
      error: 'Invalid authorization format'
    });
  }
  
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');
  
  if (password !== DATABASE_PASSWORD) {
    return res.status(401).json({
      success: false,
      error: 'Invalid database password',
      message: 'Please check your password and try again'
    });
  }
  
  // Password is correct, proceed
  req.dbAuthenticated = true;
  next();
};

export default databaseAuth;
