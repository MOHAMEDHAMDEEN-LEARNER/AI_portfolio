'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { AuthUtils } from '../../lib/auth-utils';
import { DatabaseUtils } from '../../lib/database-utils';
import Button from './Button';

interface DebugInfo {
  supabaseUrl: boolean;
  supabaseKey: boolean;
  connectionTest: { success: boolean; error?: string } | null;
  sessionInfo: any;
  databaseTest: { exists: boolean; error?: string; canInsert?: boolean; canSelect?: boolean } | null;
}

export default function AuthDebugger() {  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    supabaseUrl: false,
    supabaseKey: false,
    connectionTest: null,
    sessionInfo: null,
    databaseTest: null
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check environment variables
    setDebugInfo(prev => ({
      ...prev,
      supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    }));

    // Get current session info
    const getSessionInfo = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        setDebugInfo(prev => ({
          ...prev,
          sessionInfo: { session: !!session, error: error?.message, user: session?.user?.email }
        }));
      } catch (err) {
        setDebugInfo(prev => ({
          ...prev,
          sessionInfo: { error: 'Failed to get session', details: err }
        }));
      }
    };

    getSessionInfo();
  }, []);

  const testConnection = async () => {
    const result = await AuthUtils.testConnection();
    setDebugInfo(prev => ({ ...prev, connectionTest: result }));
  };
  const testDatabase = async () => {
    const result = await DatabaseUtils.testUserProfilesTable();
    setDebugInfo(prev => ({ ...prev, databaseTest: result }));
  };

  const testSignOut = async () => {
    try {
      console.log('Testing signout...');
      const result = await AuthUtils.safeSignOut();
      console.log('Signout test result:', result);
      alert(`Signout test: ${result.success ? 'Success' : 'Failed - ' + result.error}`);
    } catch (error) {
      console.error('Signout test error:', error);
      alert(`Signout test failed with error: ${error}`);
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1"
        >
          Debug Auth
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-sm">Auth Debugger</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span>Supabase URL:</span>
          <span className={debugInfo.supabaseUrl ? 'text-green-600' : 'text-red-600'}>
            {debugInfo.supabaseUrl ? '✓' : '✗'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>Supabase Key:</span>
          <span className={debugInfo.supabaseKey ? 'text-green-600' : 'text-red-600'}>
            {debugInfo.supabaseKey ? '✓' : '✗'}
          </span>
        </div>
        
        <div className="border-t pt-2">
          <div className="mb-2">
            <strong>Session:</strong>
            <pre className="text-xs bg-gray-100 p-1 rounded mt-1">
              {JSON.stringify(debugInfo.sessionInfo, null, 2)}
            </pre>
          </div>        </div>
        
        <div className="border-t pt-2">
          <Button
            onClick={testDatabase}
            className="w-full mb-2 bg-purple-600 hover:bg-purple-700 text-white text-xs"
          >
            Test Database
          </Button>
          
          {debugInfo.databaseTest && (
            <div className={`p-2 rounded text-xs ${debugInfo.databaseTest.exists ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {debugInfo.databaseTest.exists ? '✓ DB Table OK' : `✗ DB: ${debugInfo.databaseTest.error}`}
              {debugInfo.databaseTest.exists && (
                <div className="mt-1">
                  <div>Select: {debugInfo.databaseTest.canSelect ? '✓' : '✗'}</div>
                  <div>Insert: {debugInfo.databaseTest.canInsert ? '✓' : '✗'}</div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="border-t pt-2">
          <Button
            onClick={testConnection}
            className="w-full mb-2 bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            Test Connection
          </Button>
          
          {debugInfo.connectionTest && (
            <div className={`p-2 rounded text-xs ${debugInfo.connectionTest.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {debugInfo.connectionTest.success ? '✓ Connected' : `✗ ${debugInfo.connectionTest.error}`}
            </div>
          )}
        </div>
        
        <div className="border-t pt-2">
          <Button
            onClick={testSignOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-xs"
          >
            Test SignOut
          </Button>
        </div>
      </div>
    </div>
  );
}
