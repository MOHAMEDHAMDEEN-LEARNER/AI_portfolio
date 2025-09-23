import { NextRequest, NextResponse } from 'next/server';
import { PortfolioGenerator } from '@/lib/portfolio-generator';
import { type PortfolioData } from '@/lib/portfolio-service';

export async function POST(request: NextRequest) {
  try {
    const portfolioData: PortfolioData = await request.json();

    // Validate required data
    if (!portfolioData.name || !portfolioData.email) {
      return NextResponse.json(
        { error: 'Portfolio name and email are required' },
        { status: 400 }
      );
    }

    // Generate portfolio files
    const template = 'modern-professional'; // You can make this configurable
    const files = PortfolioGenerator.generatePortfolioFiles(portfolioData, template);

    // For now, return the first file (index.html) as a simple download
    // In a real implementation, you would use JSZip to create a ZIP file
    const indexFile = files.find(f => f.path === 'index.html');
    if (!indexFile) {
      throw new Error('Failed to generate index.html');
    }

    // Return the HTML file
    const fileName = `${portfolioData.name.toLowerCase().replace(/\s+/g, '-')}-portfolio.html`;
    
    return new NextResponse(indexFile.content, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error('Portfolio download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate portfolio download' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Portfolio Download API',
    version: '1.0.0',
    endpoints: {
      POST: 'Generate and download portfolio HTML file',
    },
    note: 'Currently returns single HTML file. ZIP functionality requires jszip package.',
    requirements: {
      name: 'string (required)',
      email: 'string (required)',
      summary: 'string',
      skills: 'string[]',
      experiences: 'object[]',
      projects: 'object[]',
      education: 'object[]',
      linkedin_url: 'string',
      github_url: 'string',
      phone: 'string'
    }
  });
}