import { NextRequest, NextResponse } from 'next/server';
import { DeploymentService, type DeploymentConfig } from '../../../lib/deployment-service';

export async function POST(request: NextRequest) {
  try {
    const config: DeploymentConfig = await request.json();

    // Validate the configuration
    const validationErrors = DeploymentService.validateConfig(config);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid configuration', 
          details: validationErrors 
        },
        { status: 400 }
      );
    }

    // Deploy the portfolio
    const result = await DeploymentService.deploy(config);

    if (result.success) {
      return NextResponse.json({
        success: true,
        url: result.url,
        provider: result.provider,
        message: 'Deployment completed successfully'
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error || 'Deployment failed',
          provider: result.provider
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Deployment API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return available deployment providers
  const providers = DeploymentService.getProviders();
  
  return NextResponse.json({
    success: true,
    providers
  });
}

// Test connectivity to deployment providers
export async function PUT(request: NextRequest) {
  try {
    const { provider } = await request.json();
    
    if (!provider) {
      return NextResponse.json(
        { success: false, error: 'Provider is required' },
        { status: 400 }
      );
    }

    const isConnected = await DeploymentService.testConnection(provider);
    
    return NextResponse.json({
      success: true,
      provider,
      connected: isConnected
    });

  } catch (error) {
    console.error('Connection test error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Connection test failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}