const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // Read index.html - path relative to repo root
    const htmlPath = path.join(__dirname, '..', '..', 'index.html');
    let html = fs.readFileSync(htmlPath, 'utf8');

    // Replace placeholders with env variables
    const SUPABASE_URL = process.env.SUPABASE_URL || '';
    const SUPABASE_KEY = process.env.SUPABASE_KEY || '';
    const APP_PASSWORD = process.env.APP_PASSWORD || '';

    html = html.split('__SUPABASE_URL__').join(SUPABASE_URL);
    html = html.split('__SUPABASE_KEY__').join(SUPABASE_KEY);
    html = html.split('__APP_PASSWORD__').join(APP_PASSWORD);

    return {
      statusCode: 200,
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      },
      body: html,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Error loading app: ' + err.message + ' | path tried: ' + path.join(__dirname, '..', '..', 'index.html'),
    };
  }
};