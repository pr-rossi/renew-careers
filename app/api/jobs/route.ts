import { NextResponse } from 'next/server';
import axios from 'axios';

// Define TypeScript interface for Workable job
interface WorkableJob {
  id: string;
  title: string;
  department: string;
  location: string;
  shortlink: string;
  description: string;
  requirements: string;
  benefits: string;
  published: string;
}

// Configure CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Replace with your Webflow domain in production
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Main GET handler for fetching jobs
export async function GET() {
  try {
    // Your Workable API configuration
    const workableSubdomain = process.env.WORKABLE_SUBDOMAIN;
    const workableApiKey = process.env.WORKABLE_API_KEY;

    if (!workableSubdomain || !workableApiKey) {
      return NextResponse.json(
        { error: 'Missing API configuration' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Make request to Workable API
    const response = await axios.get(
      `https://renewhome.workable.com/spi/v3/jobs`,
      {
        headers: {
          'Authorization': `Bearer ${workableApiKey}`,
          'Content-Type': 'application/json'
        },
        params: {
          state: 'published' // Only get published jobs
        }
      }
    );

    // Transform the response to include only necessary data
    const jobs = response.data.jobs.map((job: WorkableJob) => ({
      id: job.id,
      title: job.title,
      department: job.department,
      location: job.location,
      shortlink: job.shortlink,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits,
      published: job.published
    }));

    // Return the jobs data with CORS headers
    return NextResponse.json({ jobs }, { headers: corsHeaders });
    
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500, headers: corsHeaders }
    );
  }
} 