import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Award,
  Play,
  RotateCcw,
  Loader2,
  Trophy
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase, Document, Quiz as QuizType, QuizQuestion, QuizResult } from '../lib/supabase';
import { azureOpenAI } from '../lib/ai-services';
import toast from 'react-hot-toast';

interface QuizState {
  currentQuestionIndex: number;
  answers: Record<string, number>;
  timeStarted: Date | null;
  isCompleted: boolean;
}

export function Quiz() {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    answers: {},
    timeStarted: null,
    isCompleted: false
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [previousResults, setPreviousResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    if (user) {
      fetchDocuments();
      fetchPreviousResults();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Failed to load documents');
    }
  };

  const fetchPreviousResults = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*, quizzes(title, document_id, documents(title))')
        .eq('user_id', user?.id)
        .order('completed_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPreviousResults(data || []);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
    }
  };

  const generateQuiz = async (document: Document) => {
    setIsGenerating(true);
    try {
      // Check if quiz already exists for this document
      const { data: existingQuiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('document_id', document.id)
        .single();

      if (quizError && quizError.code !== 'PGRST116') throw quizError;

      if (existingQuiz) {
        setQuiz(existingQuiz);
        resetQuizState();
        return;
      }

      // Generate new quiz using AI
      const questions = await azureOpenAI.generateQuiz(document.content, 5);
      
      if (questions.length === 0) {
        throw new Error('Failed to generate quiz questions');
      }

      // Save quiz to database
      const { data: newQuiz, error: createError } = await supabase
        .from('quizzes')
        .insert({
          document_id: document.id,
          title: `Quiz: ${document.title}`,
          questions: questions
        })
        .select()
        .single();

      if (createError) throw createError;

      setQuiz(newQuiz);
      resetQuizState();
      toast.success('Quiz generated successfully!');
    } catch (error) {
      console.error('Error generating quiz:', error);
      toast.error('Failed to generate quiz');
    } finally {
      setIsGenerating(false);
    }
  };

  const resetQuizState = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: {},
      timeStarted: new Date(),
      isCompleted: false
    });
    setQuizResult(null);
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setQuizState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answerIndex
      }
    }));
  };

  const nextQuestion = () => {
    if (quiz && quizState.currentQuestionIndex < quiz.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };

  const previousQuestion = () => {
    if (quizState.currentQuestionIndex > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };

  const completeQuiz = async () => {
    if (!quiz || !quizState.timeStarted) return;

    let correctAnswers = 0;
    quiz.questions.forEach((question: QuizQuestion) => {
      const userAnswer = quizState.answers[question.id];
      if (userAnswer === question.correct_answer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    try {
      // Save quiz result
      const { data: result, error } = await supabase
        .from('quiz_results')
        .insert({
          quiz_id: quiz.id,
          user_id: user?.id,
          score: score,
          answers: quizState.answers
        })
        .select()
        .single();

      if (error) throw error;

      setQuizResult(result);
      setQuizState(prev => ({ ...prev, isCompleted: true }));
      
      // Refresh previous results
      fetchPreviousResults();

      toast.success(`Quiz completed! Score: ${score}%`);
    } catch (error) {
      console.error('Error saving quiz result:', error);
      toast.error('Failed to save quiz result');
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (!selectedDocument) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                AI Quiz Generator
              </h1>
              <p className="text-lg text-slate-600">
                Test your knowledge with AI-generated quizzes from your documents
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Document Selection */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Select Document</h2>
                <div className="space-y-4">
                  {documents.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => setSelectedDocument(doc)}
                      className="w-full p-4 text-left bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900">{doc.title}</h3>
                          <p className="text-sm text-slate-500">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  {documents.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No documents found</p>
                      <p className="text-sm text-slate-400 mt-2">
                        Upload a document first to generate quizzes
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Previous Results */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Recent Quiz Results</h2>
                <div className="space-y-4">
                  {previousResults.map((result) => (
                    <div key={result.id} className="p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-slate-900 text-sm">Quiz Result</h3>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBgColor(result.score)} ${getScoreColor(result.score)}`}>
                          {result.score}%
                        </div>
                      </div>
                      <p className="text-xs text-slate-500">
                        {new Date(result.completed_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                  
                  {previousResults.length === 0 && (
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500">No quiz results yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-2xl font-bold text-slate-900 mb-4">
                Generate Quiz for "{selectedDocument.title}"
              </h1>
              
              <p className="text-slate-600 mb-8">
                I'll create personalized quiz questions based on the content of your document using AI.
              </p>

              <button
                onClick={() => generateQuiz(selectedDocument)}
                disabled={isGenerating}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Generating Quiz...
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Generate Quiz
                  </>
                )}
              </button>

              <button
                onClick={() => setSelectedDocument(null)}
                className="block mx-auto mt-4 text-slate-600 hover:text-slate-800 text-sm"
              >
                Back to document selection
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (quizState.isCompleted && quizResult) {
    const correctAnswers = quiz.questions.filter((q: QuizQuestion) => 
      quizState.answers[q.id] === q.correct_answer
    ).length;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
              <div className={`w-16 h-16 ${getScoreBgColor(quizResult.score)} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                <Award className={`w-8 h-8 ${getScoreColor(quizResult.score)}`} />
              </div>
              
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                Quiz Completed!
              </h1>
              
              <div className="mb-8">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(quizResult.score)}`}>
                  {quizResult.score}%
                </div>
                <p className="text-slate-600">
                  You got {correctAnswers} out of {quiz.questions.length} questions correct
                </p>
              </div>

              <div className="space-y-4 mb-8">
                {quiz.questions.map((question: QuizQuestion, index: number) => {
                  const userAnswer = quizState.answers[question.id];
                  const isCorrect = userAnswer === question.correct_answer;
                  
                  return (
                    <div key={question.id} className="p-4 bg-slate-50 rounded-xl text-left">
                      <div className="flex items-start space-x-3">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 mb-2">{question.question}</p>
                          <p className="text-sm text-slate-600">
                            Your answer: {question.options[userAnswer]} {!isCorrect && '❌'}
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-green-600">
                              Correct answer: {question.options[question.correct_answer]} ✅
                            </p>
                          )}
                          {question.explanation && (
                            <p className="text-sm text-slate-500 mt-2 italic">
                              {question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={resetQuizState}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Retake Quiz
                </button>
                <button
                  onClick={() => {
                    setSelectedDocument(null);
                    setQuiz(null);
                    setQuizState({
                      currentQuestionIndex: 0,
                      answers: {},
                      timeStarted: null,
                      isCompleted: false
                    });
                  }}
                  className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Back to Documents
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[quizState.currentQuestionIndex];
  const progress = ((quizState.currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-slate-900">{quiz.title}</h1>
                <div className="flex items-center space-x-2 text-slate-600">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">
                    Question {quizState.currentQuestionIndex + 1} of {quiz.questions.length}
                  </span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h2 className="text-lg font-medium text-slate-900 mb-6">
                {currentQuestion.question}
              </h2>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                      quizState.answers[currentQuestion.id] === index
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        quizState.answers[currentQuestion.id] === index
                          ? 'border-purple-500 bg-purple-500'
                          : 'border-slate-300'
                      }`}>
                        {quizState.answers[currentQuestion.id] === index && (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={previousQuestion}
                disabled={quizState.currentQuestionIndex === 0}
                className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-xl border border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              {quizState.currentQuestionIndex === quiz.questions.length - 1 ? (
                <button
                  onClick={completeQuiz}
                  disabled={!quizState.answers[currentQuestion.id] && quizState.answers[currentQuestion.id] !== 0}
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Quiz
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  disabled={!quizState.answers[currentQuestion.id] && quizState.answers[currentQuestion.id] !== 0}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}