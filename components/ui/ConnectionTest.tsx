'use client';

import React, { useState } from 'react';
import Button from './Button';
import { AuthUtils } from '../../lib/auth-utils';

export default function ConnectionTest() {
  const [testResult, setTestResult] = useState<{ success: boolean; error?: string } | null>(null);
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    
    const result = await AuthUtils.testConnection();
    setTestResult(result);
    setTesting(false);
  };

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-semibold text-yellow-800 mb-2">
        Connection Test
      </h3>
      <p className="text-yellow-700 mb-4">
        If you're experiencing signout issues, test your Supabase connection:
      </p>
      
      <Button 
        onClick={handleTest} 
        disabled={testing}
        className="bg-yellow-600 hover:bg-yellow-700 text-white mb-3"
      >
        {testing ? 'Testing...' : 'Test Connection'}
      </Button>
      
      {testResult && (
        <div className={`p-3 rounded ${testResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <strong>{testResult.success ? '✅ Connection Successful' : '❌ Connection Failed'}</strong>
          {testResult.error && <p className="mt-1 text-sm">{testResult.error}</p>}
        </div>
      )}
    </div>
  );
}
