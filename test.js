// Constants
const SHEET_ID = '1mXMF-Ha1Imjhx-ol5iSvfnYmZiW9adSbwPRChav1kQ0';

// Helper function to create CORS response
function createCORSResponse(content) {
  return ContentService
    .createTextOutput(content)
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
    .setHeader('Access-Control-Max-Age', '86400');
}

// Helper function to get sheet
function getSheet() {
  try {
    return SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
  } catch (error) {
    console.error('Error accessing sheet:', error);
    throw new Error('Could not access spreadsheet. Please check the SHEET_ID.');
  }
}

// Handle GET requests
function doGet(e) {
  console.log('GET request received');
  const response = {
    status: 'ready',
    message: 'Survey API is ready to receive POST requests',
    timestamp: new Date().toISOString()
  };
  
  return createCORSResponse(JSON.stringify(response));
}

// Handle POST requests (form submissions)
function doPost(e) {
  console.log('POST request received');
  console.log('Request details:', JSON.stringify(e));
  
  try {
    let data;
    
    // Try to get data from different possible sources
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      // Data might come as parameters
      data = e.parameter;
    } else {
      throw new Error('No data received in POST request');
    }
    
    console.log('Parsed data:', JSON.stringify(data));
    
    // Validate required fields
    if (!data.name || !data.programme) {
      throw new Error('Missing required fields: name or programme');
    }
    
    const sheet = getSheet();
    
    // Create timestamp
    const timestamp = new Date();
    
    // Prepare row data
    const row = [
      timestamp,
      data.name,
      data.programme
    ];
    
    // Add all 12 questions (before/after pairs)
    for (let i = 1; i <= 12; i++) {
      const beforeKey = `q${i}_before`;
      const afterKey = `q${i}_after`;
      
      const beforeValue = data[beforeKey] ? parseInt(data[beforeKey]) : '';
      const afterValue = data[afterKey] ? parseInt(data[afterKey]) : '';
      
      row.push(beforeValue);
      row.push(afterValue);
    }
    
    
    console.log('Row data to append:', row);
    
    // Add the row to the sheet
    sheet.appendRow(row);


