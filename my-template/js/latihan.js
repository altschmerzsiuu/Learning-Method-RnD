/* ============================================
   Latihan Page JavaScript - xplay
   Dynamic Quiz from Bank Soal
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // CONFIGURATION
  // ============================================
  const CONFIG = {
    GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbw8OIg3UFVyJt3AyqY8OGANVJ-F0wcA4FPzJJhya4XGvBur0XKUnBtuM9BeYy_p-o3HkA/exec'
  };

  // ============================================
  // STATE
  // ============================================
  let quizState = {
    sessionId: null,
    questions: [],
    answers: {},
    studentData: {
      nama: '',
      kelas: '',
      sekolah: ''
    }
  };

  // ============================================
  // API FUNCTIONS
  // ============================================
  
  /**
   * Call Google Apps Script API
   * Uses text/plain to avoid CORS preflight
   */
  async function callAPI(data) {
    try {
      console.log('📤 Sending to API:', data.action);
      
      const response = await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(data)
      });
      
      const text = await response.text();
      console.log('📥 API Response:', text);
      
      try {
        const result = JSON.parse(text);
        return result;
      } catch (parseError) {
        console.error('Parse error:', parseError);
        return { success: false, error: 'Invalid JSON response', raw: text };
      }
    } catch (error) {
      console.error('❌ API Error:', error);
      return { success: false, error: error.message };
    }
  }

  // ============================================
  // MAIN LOGIC
  // ============================================
  
  document.addEventListener('DOMContentLoaded', function() {
    
    const studentForm = document.getElementById('studentForm');
    const questionsContainer = document.getElementById('questionsContainer');
    const resultContainer = document.getElementById('resultContainer');
    const submitQuiz = document.getElementById('submitQuiz');
    const retryBtn = document.getElementById('retryBtn');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Show/hide loading
    function showLoading(message = 'Memuat...') {
      if (loadingOverlay) {
        loadingOverlay.querySelector('.loading-text').textContent = message;
        loadingOverlay.classList.add('show');
      }
    }

    function hideLoading() {
      if (loadingOverlay) {
        loadingOverlay.classList.remove('show');
      }
    }

    // ===== FORM SUBMISSION =====
    if (studentForm) {
      studentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get student data
        quizState.studentData.nama = document.getElementById('nama').value.trim();
        quizState.studentData.kelas = document.getElementById('kelas').value.trim();
        quizState.studentData.sekolah = document.getElementById('sekolah').value.trim();
        
        showLoading('Menyimpan data siswa...');
        
        // Save student data
        await callAPI({
          action: 'saveStudent',
          ...quizState.studentData
        });
        
        showLoading('Mengacak soal...');
        
        // Get randomized questions
        const result = await callAPI({
          action: 'getQuestions'
        });
        
        hideLoading();
        
        if (result.success && result.questions) {
          quizState.sessionId = result.sessionId;
          quizState.questions = result.questions;
          
          // Render questions
          renderQuestions(result.questions);
          
          // Hide form, show questions
          studentForm.style.display = 'none';
          questionsContainer.style.display = 'block';
          questionsContainer.scrollIntoView({ behavior: 'smooth' });
          
          console.log('✅ Loaded', result.questions.length, 'questions');
        } else {
          alert('Gagal memuat soal. Silakan coba lagi.');
          console.error('Failed to load questions:', result);
        }
      });
    }

    // ===== RENDER QUESTIONS DYNAMICALLY =====
    function renderQuestions(questions) {
      const questionsWrapper = document.getElementById('questionsWrapper');
      if (!questionsWrapper) return;
      
      questionsWrapper.innerHTML = '';
      
      questions.forEach((q, index) => {
        const questionHTML = `
          <div class="question-card" data-question-id="${q.id}" data-num="${q.num}">
            <div class="question-card__header">
              <div class="question-card__number">${q.num}</div>
              <p class="question-card__text">${q.soal}</p>
            </div>
            <div class="question-card__options">
              ${q.options.map(opt => `
                <label class="option" data-value="${opt.label}">
                  <span class="option__letter">${opt.label}</span>
                  <span class="option__text">${opt.text}</span>
                </label>
              `).join('')}
            </div>
            <div class="feedback feedback--correct" id="feedback-${q.id}-correct">
              ✅ Benar!
            </div>
            <div class="feedback feedback--incorrect" id="feedback-${q.id}-incorrect">
              ❌ Salah.
            </div>
          </div>
        `;
        
        questionsWrapper.insertAdjacentHTML('beforeend', questionHTML);
      });
      
      // Add click listeners to new options
      attachOptionListeners();
    }

    // Attach click listeners to dynamically created options
    function attachOptionListeners() {
      const options = document.querySelectorAll('.option');
      
      options.forEach(function(option) {
        option.addEventListener('click', function() {
          const questionCard = this.closest('.question-card');
          const questionId = questionCard.getAttribute('data-question-id');
          const selectedValue = this.getAttribute('data-value');
          const siblings = questionCard.querySelectorAll('.option');
          
          // Remove selected from siblings
          siblings.forEach(function(sib) {
            sib.classList.remove('selected');
          });
          
          // Add selected to clicked
          this.classList.add('selected');
          
          // Store answer
          quizState.answers[questionId] = selectedValue;
        });
      });
    }

    // ===== SUBMIT QUIZ =====
    if (submitQuiz) {
      submitQuiz.addEventListener('click', async function() {
        // Check if all questions answered
        const answeredCount = Object.keys(quizState.answers).length;
        const totalQuestions = quizState.questions.length;
        
        if (answeredCount < totalQuestions) {
          const unanswered = totalQuestions - answeredCount;
          if (!confirm(`Ada ${unanswered} soal yang belum dijawab. Lanjutkan submit?`)) {
            return;
          }
        }
        
        showLoading('Menghitung nilai...');
        
        // Submit answers to server for validation
        const result = await callAPI({
          action: 'submitAnswers',
          sessionId: quizState.sessionId,
          answers: quizState.answers,
          nama: quizState.studentData.nama,
          kelas: quizState.studentData.kelas,
          sekolah: quizState.studentData.sekolah
        });
        
        hideLoading();
        
        if (result.success) {
          // Show feedback on each question
          if (result.details) {
            result.details.forEach(detail => {
              const feedbackCorrect = document.getElementById(`feedback-${detail.questionId}-correct`);
              const feedbackIncorrect = document.getElementById(`feedback-${detail.questionId}-incorrect`);
              const questionCard = document.querySelector(`[data-question-id="${detail.questionId}"]`);
              
              if (questionCard) {
                const options = questionCard.querySelectorAll('.option');
                
                // Highlight correct answer
                options.forEach(opt => {
                  if (opt.getAttribute('data-value') === detail.correctAnswer) {
                    opt.classList.add('correct');
                  }
                });
                
                // Highlight user's wrong answer
                if (!detail.isCorrect && detail.userAnswer) {
                  options.forEach(opt => {
                    if (opt.getAttribute('data-value') === detail.userAnswer) {
                      opt.classList.add('incorrect');
                    }
                  });
                }
                
                // Show feedback
                if (detail.isCorrect && feedbackCorrect) {
                  feedbackCorrect.classList.add('show');
                } else if (!detail.isCorrect && feedbackIncorrect) {
                  feedbackIncorrect.classList.add('show');
                }
              }
            });
          }
          
          // Show result
          document.getElementById('resultName').textContent = quizState.studentData.nama;
          document.getElementById('resultScore').textContent = result.score;
          document.getElementById('resultCorrect').textContent = `${result.correct} dari ${result.total} soal benar`;
          
          // Message based on score
          const resultMessage = document.getElementById('resultMessage');
          if (result.score >= 80) {
            resultMessage.textContent = '🎉 Luar biasa! Kamu sangat menguasai materi!';
          } else if (result.score >= 60) {
            resultMessage.textContent = '👍 Bagus! Terus tingkatkan lagi ya!';
          } else {
            resultMessage.textContent = '💪 Jangan menyerah! Pelajari lagi materinya ya!';
          }
          
          resultContainer.classList.add('show');
          resultContainer.scrollIntoView({ behavior: 'smooth' });
          
          // Disable submit button
          submitQuiz.disabled = true;
          submitQuiz.textContent = 'Sudah Dikirim ✓';
          
          console.log('✅ Quiz submitted:', result);
        } else {
          alert('Gagal submit jawaban: ' + (result.error || 'Unknown error'));
        }
      });
    }

    // ===== RETRY QUIZ =====
    if (retryBtn) {
      retryBtn.addEventListener('click', function() {
        // Reset state
        quizState = {
          sessionId: null,
          questions: [],
          answers: {},
          studentData: {
            nama: '',
            kelas: '',
            sekolah: ''
          }
        };
        
        // Clear questions wrapper
        const questionsWrapper = document.getElementById('questionsWrapper');
        if (questionsWrapper) {
          questionsWrapper.innerHTML = '';
        }
        
        // Hide result
        resultContainer.classList.remove('show');
        
        // Reset submit button
        submitQuiz.disabled = false;
        submitQuiz.textContent = 'Selesai & Lihat Nilai';
        
        // Show form again
        studentForm.style.display = 'block';
        questionsContainer.style.display = 'none';
        
        // Clear form
        studentForm.reset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

  });
})();
