'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '../../lib/auth-guard';
import { useAuth } from '../../lib/auth-context';
import { PortfolioService, type PortfolioData } from '../../lib/portfolio-service';
import ModernPortfolioTemplate from '../../components/ModernPortfolioTemplate';
import SamplePortfolioPreview from '../../components/SamplePortfolioPreview';
import Button from '../../components/ui/Button';
import Link from 'next/link';

export default function PortfolioViewPage() {
  const { user } = useAuth();
  const [portfolios, setPortfolios] = useState<PortfolioData[]>([]);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      if (!user) return;

      try {
        setLoading(true);
        // Fetch complete data for the user's portfolio
        const portfolioData = await PortfolioService.getPortfolioByUserId(user.id);
        
        if (portfolioData) {
          setPortfolios([portfolioData]);
          setSelectedPortfolio(portfolioData);
        } else {
          setPortfolios([]);
        }
      } catch (err) {
        console.error('Error fetching portfolios:', err);
        setError('Failed to load portfolios');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [user]);

  const renderPortfolioTemplate = (portfolio: PortfolioData) => {
    switch (portfolio.template_id) {
      case 'modern-professional':
      case 'modern-minimal':
        return <ModernPortfolioTemplate data={portfolio} />;
      case 'aesthetic-portfolio':
        return <SamplePortfolioPreview />;
      default:
        return (
          <div className="p-8 text-center bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Template Not Found</h3>
            <p className="text-gray-600">The template &quot;{portfolio.template_id}&quot; is not available.</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your portfolios...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Portfolios</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/generate">
              <Button>Create New Portfolio</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (portfolios.length === 0) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="text-blue-500 text-4xl mb-4">📄</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Portfolios Found</h2>
            <p className="text-gray-600 mb-6">You haven&apos;t created any portfolios yet. Get started by creating your first portfolio!</p>
            <Link href="/generate">
              <Button>Create Your First Portfolio</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">My Portfolios</h1>
                <p className="text-sm text-gray-500">Manage and view your generated portfolios</p>
              </div>
              <div className="flex space-x-4">
                <Link href="/generate">
                  <Button variant="outline">Create New</Button>
                </Link>
                <Link href="/">
                  <Button variant="outline">Back to Home</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Portfolio List Sidebar */}
            <div className="lg:col-span-1">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Portfolios</h3>
              <div className="space-y-3">
                {portfolios.map((portfolio) => (
                  <div
                    key={portfolio.id}
                    onClick={() => setSelectedPortfolio(portfolio)}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedPortfolio?.id === portfolio.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <h4 className="font-medium text-gray-900">{portfolio.name}</h4>
                    <p className="text-sm text-gray-500 capitalize">{portfolio.template_id.replace('-', ' ')}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Template: {portfolio.template_id}
                    </p>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs mt-2 ${
                      portfolio.status === 'completed' 
                        ? 'bg-green-100 text-green-800'
                        : portfolio.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {portfolio.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Portfolio Preview */}
            <div className="lg:col-span-3">
              {selectedPortfolio && (
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">{selectedPortfolio.name}</h2>
                        <p className="text-gray-500 capitalize">
                          {selectedPortfolio.template_id.replace('-', ' ')} Template
                        </p>
                      </div>
                      <div className="flex space-x-3">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Share</Button>
                        <Button size="sm">Download PDF</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-[600px] overflow-auto">
                    {renderPortfolioTemplate(selectedPortfolio)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}