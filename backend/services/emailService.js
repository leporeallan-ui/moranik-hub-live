import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// For development, we'll use a mock email service
// In production, replace with real email credentials
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },
});

// Mock email service for development
const mockEmail = async (to, subject, html) => {
  console.log('📧 Email would be sent to:', to);
  console.log('Subject:', subject);
  console.log('HTML:', html);
  return { success: true, messageId: 'mock-' + Date.now() };
};

// Use mock email in development
export const sendEmail = async (to, subject, html) => {
  try {
    // For development, use mock email
    if (process.env.NODE_ENV !== 'production') {
      return await mockEmail(to, subject, html);
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER || 'noreply@marketplace.com',
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

// Generate verification token
export const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
};
