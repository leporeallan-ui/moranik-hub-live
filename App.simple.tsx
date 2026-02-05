import React from 'react';

const SimpleApp: React.FC = () => {
  return (
    <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
      <h1>Simple Test App</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ marginTop: '20px', padding: '10px', border: '1px solid red' }}>
        <p>Backend API Test: {process.env.NODE_ENV}</p>
      </div>
    </div>
  );
};

export default SimpleApp;
