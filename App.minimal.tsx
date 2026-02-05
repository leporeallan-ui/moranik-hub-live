import React, { useState } from 'react';

const MinimalApp: React.FC = () => {
  console.log('MinimalApp component rendering...');
  
  const [activeView] = useState('landing');
  
  console.log('MinimalApp state initialized');

  const renderLanding = () => {
    console.log('Rendering landing page...');
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0f0f0f', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Moranik Hub</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>Excellence in Tech & Entertainment</p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ 
            padding: '40px', 
            backgroundColor: '#1a1a1a', 
            border: '2px solid #cc0000',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💻</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Moranik TECH</h2>
            <p style={{ color: '#ccc' }}>Software Solutions & Development</p>
          </div>
          
          <div style={{ 
            padding: '40px', 
            backgroundColor: '#1a1a1a', 
            border: '2px solid #cc0000',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎵</div>
            <h2 style={{ fontSize: '2rem', marginBottom: '10px' }}>Moranik ENT.</h2>
            <p style={{ color: '#ccc' }}>Music & Creative Content</p>
          </div>
        </div>
        
        <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '10px' }}>
          <p>✅ React is working</p>
          <p>✅ Backend API: http://192.168.100.179:5000</p>
          <p>✅ Frontend: https://moranik-hub-live.vercel.app</p>
          <p>🔧 Testing connection...</p>
        </div>
      </div>
    );
  };

  console.log('About to render MinimalApp...');
  return renderLanding();
};

export default MinimalApp;
