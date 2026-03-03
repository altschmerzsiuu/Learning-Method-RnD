/**
 * ============================================
 * xplay Quiz - Google Apps Script Backend
 * WITH BANK SOAL INTEGRATION
 * ============================================
 * 
 * SETUP BANK SOAL:
 * Di sheet "Bank Soal", buat kolom:
 * A: Soal | B: Pilihan A | C: Pilihan B | D: Pilihan C | E: Pilihan D | F: Jawaban Benar
 * 
 * Kolom F diisi huruf jawaban yang benar (A, B, C, atau D)
 */

// Global config
var CONFIG = {
  SHEET_DATA_SISWA: "Data Siswa",
  SHEET_BANK_SOAL: "Bank Soal",
  TOTAL_QUESTIONS: 20  // Jumlah soal yang akan ditampilkan
};

// ============================================
// MAIN HANDLERS
// ============================================

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    
    switch(data.action) {
      case "saveStudent":
        return handleSaveStudent(data);
      case "getQuestions":
        return handleGetQuestions(data);
      case "submitAnswers":
        return handleSubmitAnswers(data);
      default:
        return createResponse({ success: false, error: "Action tidak valid" });
    }
    
  } catch (error) {
    return createResponse({ success: false, error: error.toString() });
  }
}

function doGet(e) {
  return createResponse({ 
    success: true, 
    message: "xplay Quiz API is running!",
    timestamp: formatTimestamp(new Date())
  });
}

// ============================================
// ACTION HANDLERS
// ============================================

// Save student data
function handleSaveStudent(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_DATA_SISWA);
  
  if (!sheet) {
    return createResponse({ success: false, error: "Sheet 'Data Siswa' tidak ditemukan!" });
  }
  
  var timestamp = formatTimestamp(new Date());
  var rowId = sheet.getLastRow() + 1;
  
  sheet.appendRow([
    timestamp,
    data.nama,
    data.kelas,
    data.sekolah,
    "",  // Nilai
    "",  // Benar
    ""   // Total
  ]);
  
  return createResponse({ success: true, rowId: rowId, message: "Data siswa tersimpan!" });
}

// Get randomized questions
function handleGetQuestions(data) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_BANK_SOAL);
  
  if (!sheet) {
    return createResponse({ success: false, error: "Sheet 'Bank Soal' tidak ditemukan!" });
  }
  
  // Get all questions (skip header row)
  var dataRange = sheet.getDataRange();
  var values = dataRange.getValues();
  var allQuestions = [];
  
  for (var i = 1; i < values.length; i++) {
    if (values[i][0] && values[i][0] !== "") {
      allQuestions.push({
        id: i,
        soal: values[i][0],
        pilihan_a: values[i][1],
        pilihan_b: values[i][2],
        pilihan_c: values[i][3],
        pilihan_d: values[i][4],
        jawaban: values[i][5]  // Will NOT be sent to client
      });
    }
  }
  
  // Shuffle all questions
  shuffleArray(allQuestions);
  
  // Take only the required number of questions
  var selectedQuestions = allQuestions.slice(0, CONFIG.TOTAL_QUESTIONS);
  
  // Create quiz session with shuffled options
  var quizSession = [];
  var answerKey = {};  // Store correct answers for this session
  
  for (var j = 0; j < selectedQuestions.length; j++) {
    var q = selectedQuestions[j];
    var questionNum = j + 1;
    
    // Create options array with original positions
    var options = [
      { text: q.pilihan_a, originalPosition: "A" },
      { text: q.pilihan_b, originalPosition: "B" },
      { text: q.pilihan_c, originalPosition: "C" },
      { text: q.pilihan_d, originalPosition: "D" }
    ];
    
    // Shuffle options
    shuffleArray(options);
    
    // Find new position of correct answer
    var correctAnswer = q.jawaban.toUpperCase();
    var newCorrectPosition = "";
    var newLabels = ["A", "B", "C", "D"];
    
    for (var k = 0; k < options.length; k++) {
      if (options[k].originalPosition === correctAnswer) {
        newCorrectPosition = newLabels[k];
        break;
      }
    }
    
    // Store answer key (question id -> correct answer in new position)
    answerKey[q.id] = newCorrectPosition;
    
    // Prepare question for client (WITHOUT correct answer)
    quizSession.push({
      num: questionNum,
      id: q.id,
      soal: q.soal,
      options: [
        { label: "A", text: options[0].text },
        { label: "B", text: options[1].text },
        { label: "C", text: options[2].text },
        { label: "D", text: options[3].text }
      ]
    });
  }
  
  // Generate session ID and store answer key in cache
  var sessionId = generateSessionId();
  storeAnswerKey(sessionId, answerKey);
  
  return createResponse({
    success: true,
    sessionId: sessionId,
    questions: quizSession,
    totalQuestions: quizSession.length
  });
}

// Submit and validate answers
function handleSubmitAnswers(data) {
  var sessionId = data.sessionId;
  var answers = data.answers;  // { questionId: selectedAnswer }
  
  // Retrieve answer key
  var answerKey = getAnswerKey(sessionId);
  
  if (!answerKey) {
    return createResponse({ success: false, error: "Session tidak valid atau sudah expired" });
  }
  
  // Calculate score
  var correct = 0;
  var total = Object.keys(answerKey).length;
  var details = [];
  
  for (var questionId in answerKey) {
    var correctAns = answerKey[questionId];
    var userAns = answers[questionId] || "";
    var isCorrect = userAns.toUpperCase() === correctAns;
    
    if (isCorrect) {
      correct++;
    }
    
    details.push({
      questionId: parseInt(questionId),
      userAnswer: userAns,
      correctAnswer: correctAns,
      isCorrect: isCorrect
    });
  }
  
  var score = Math.round((correct / total) * 100);
  
  // Update score in Data Siswa sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_DATA_SISWA);
  if (sheet && data.nama) {
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    
    for (var i = values.length - 1; i >= 1; i--) {
      var rowNama = String(values[i][1]).trim().toLowerCase();
      var inputNama = String(data.nama).trim().toLowerCase();
      
      if (rowNama === inputNama && (values[i][4] === "" || values[i][4] === null)) {
        sheet.getRange(i + 1, 5).setValue(score);
        sheet.getRange(i + 1, 6).setValue(correct);
        sheet.getRange(i + 1, 7).setValue(total);
        break;
      }
    }
  }
  
  // Clear session after use
  clearAnswerKey(sessionId);
  
  return createResponse({
    success: true,
    score: score,
    correct: correct,
    total: total,
    details: details
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

function generateSessionId() {
  return Utilities.getUuid();
}

// Store answer key in Cache Service (expires in 30 minutes)
function storeAnswerKey(sessionId, answerKey) {
  var cache = CacheService.getScriptCache();
  cache.put(sessionId, JSON.stringify(answerKey), 1800); // 30 minutes
}

function getAnswerKey(sessionId) {
  var cache = CacheService.getScriptCache();
  var data = cache.get(sessionId);
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

function clearAnswerKey(sessionId) {
  var cache = CacheService.getScriptCache();
  cache.remove(sessionId);
}

function formatTimestamp(date) {
  var day = String(date.getDate()).padStart(2, '0');
  var month = String(date.getMonth() + 1).padStart(2, '0');
  var year = date.getFullYear();
  var hours = String(date.getHours()).padStart(2, '0');
  var minutes = String(date.getMinutes()).padStart(2, '0');
  var seconds = String(date.getSeconds()).padStart(2, '0');
  
  return day + '/' + month + '/' + year + ' ' + hours + ':' + minutes + ':' + seconds;
}

function createResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
