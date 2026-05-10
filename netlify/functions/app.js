const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // In Netlify, __dirname = /var/task/netlify/functions
    // So go up 2 levels to reach repo root
    const htmlPath = path.resolve(__dirname, '..', '..', 'index.html');
    
    if (!fs.existsSync(htmlPath)) {
      // Debug: show what files exist near __dirname
      const parent = path.resolve(__dirname, '..', '..');
      const files = fs.existsSync(parent) ? fs.readdirSync(parent) : ['parent not found'];
      return {
        statusCode: 500,
        body: 'index.html not found at: ' + htmlPath + '\n__dirname: ' + __dirname + '\nFiles at root: ' + files.join(', ')
      };
    }

    let html = fs.readFileSync(htmlPath, 'utf8');
    html = html.split('__SUPABASE_URL__').join(process.env.SUPABASE_URL || '');
    html = html.split('__SUPABASE_KEY__').join(process.env.SUPABASE_KEY || '');
    html = html.split('__APP_PASSWORD__').join(process.env.APP_PASSWORD || '');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' },
      body: html,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: 'Error: ' + err.message + '\n__dirname: ' + __dirname
    };
  }
};