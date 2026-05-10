const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  let html = fs.readFileSync(path.join(__dirname, '../../index.html'), 'utf8');
  
  html = html.split('__SUPABASE_URL__').join(process.env.SUPABASE_URL || '');
  html = html.split('__SUPABASE_KEY__').join(process.env.SUPABASE_KEY || '');
  html = html.split('__APP_PASSWORD__').join(process.env.APP_PASSWORD || '');

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: html,
  };
};