// api/fetch-jobs.js - Vercel Serverless Function
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Set CORS headers to allow requests from your Webflow site
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Configure this to your Webflow domain in production
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // The Workable API key from environment variable
    const apiKey = process.env.WORKABLE_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Construct the Workable API URL
    // This is an example endpoint - adjust based on Workable's API documentation
    const workableUrl = 'https://www.workable.com/spi/v3/accounts/jobs';
    
    // Make the request to Workable
    const response = await fetch(workableUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    // If Workable returns an error
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Workable API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `Error from Workable API: ${response.status}`,
        details: errorText
      });
    }

    // Successfully got data from Workable
    const data = await response.json();
    
    // Return the data to the client
    return res.status(200).json(data);
    
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch from Workable API', 
      message: error.message 
    });
  }
}