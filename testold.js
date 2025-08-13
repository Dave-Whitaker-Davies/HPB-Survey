// Constants
const SHEET_ID = '1mXMF-Ha1Imjhx-ol5iSvfnYmZiW9adSbwPRChav1kQ0';

// Helper function to create CORS response
function createCORSResponse(content, mimeType = ContentService.MimeType.JSON) {
  return ContentService
    .createTextOutput(content)
    .setMimeType(mimeType)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    .setHeader('Access-Control-Max-Age', '86400');
}

// Helper function to get sheet
function getSheet() {
  return SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
}

// Handle GET requests (required for web app)
function doGet(e) {
  console.log('GET request received');
  return createCORSResponse(JSON.stringify({
    status: 'ready',
    message: 'Survey API is ready to receive POST requests',
    timestamp: new Date().toISOString()
  }));
}

// Handle POST requests (form submissions)
function doPost(e) {
  console.log('POST request received');
  
  try {
    // Check if postData exists
    if (!e.postData || !e.postData.contents) {
      throw new Error('No POST data received');
    }
    
    const data = JSON.parse(e.postData.contents);
    console.log('Parsed data:', JSON.stringify(data));
    
    const sheet = getSheet();
    
    // Create row data matching your existing column structure
    const row = [
      new Date(),     // Timestamp
      data.name || '', // Name
      data.programme || '', // Programme
    ];
    
    // Add all 12 questions (before/after pairs)
    for (let i = 1; i <= 12; i++) {
      row.push(data[`q${i}_before`] || '');
      row.push(data[`q${i}_after`] || '');
    }
    
    // Add the row to your sheet
    sheet.appendRow(row);
    
    // Log successful submission
    console.log('Survey data saved:', data.name, data.programme);
    
    return createCORSResponse(JSON.stringify({
      status: 'success',
      message: 'Survey data saved successfully',
      timestamp: new Date().toISOString()
    }));
      
  } catch (error) {
    // Log the error with more detail
    console.error('Error saving survey data:', error.toString());
    console.error('Error stack:', error.stack);
    
    return createCORSResponse(JSON.stringify({
      status: 'error', 
      message: 'Failed to save data: ' + error.toString(),
      timestamp: new Date().toISOString()
    }));
  }
}

// Handle preflight OPTIONS requests for CORS
function doOptions(e) {
  console.log('OPTIONS request received');
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    .setHeader('Access-Control-Max-Age', '86400');
}

// Test function to verify your sheet connection
function testSheetConnection() {
  try {
    const sheet = getSheet();
    console.log('Sheet name:', sheet.getName());
    console.log('Sheet URL:', sheet.getParent().getUrl());
    
    // Add a test row
    const testRow = [
      new Date(),
      'Test User',
      'P31',
      1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2
    ];
    
    sheet.appendRow(testRow);
    console.log('Test data added successfully!');
    
  } catch (error) {
    console.error('Sheet connection failed:', error.toString());
    console.error('Error stack:', error.stack);
  }
}