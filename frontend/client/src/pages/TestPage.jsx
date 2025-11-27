import React from 'react';
import Navigation from '../components/Navigation';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-gray-600">This is a test page to verify the navigation works.</p>
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Navigation Test</h2>
          <p>If you can see this page, the routing is working correctly.</p>
        </div>
      </div>
    </div>
  );
};

export default TestPage;