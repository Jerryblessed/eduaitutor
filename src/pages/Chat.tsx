import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  FileText,
  Loader2,
  Mic,
  MicOff
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase, Document, Conversation, ChatMessage } from '../lib/supabase';
import { azureOpenAI } from '../lib/ai-services';
import toast from 'react-hot-toast';

export function Chat() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const documentId = searchParams.get('doc');
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  useEffect(() => {
    if (documentId && documents.length > 0) {
      const doc = documents.find(d => d.id === documentId);
      if (doc) {
        setSelectedDocument(doc);
        loadConversation(doc.id);
      }
    }
  }, [documentId, documents]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
        toast.error('Speech recognition failed');
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

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

  const loadConversation = async (docId: string) => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('document_id', docId)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setConversationId(data.id);
        setMessages(data.messages || []);
      } else {
        // Create new conversation
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert({
            document_id: docId,
            user_id: user?.id,
            messages: []
          })
          .select()
          .single();

        if (createError) throw createError;
        setConversationId(newConversation.id);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedDocument || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Get AI response
      const chatMessages = newMessages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

      const aiResponse = await azureOpenAI.chatWithDocument(
        chatMessages,
        selectedDocument.content
      );

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);

      // Save to database
      if (conversationId) {
        await supabase
          .from('conversations')
          .update({
            messages: updatedMessages,
            updated_at: new Date().toISOString()
          })
          .eq('id', conversationId);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              AI Chat Assistant
            </h1>
            <p className="text-lg text-slate-600">
              Ask questions about your uploaded documents and get intelligent responses
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Document Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 sticky top-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Your Documents</h2>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <button
                      key={doc.id}
                      onClick={() => {
                        setSelectedDocument(doc);
                        loadConversation(doc.id);
                      }}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        selectedDocument?.id === doc.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{doc.title}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                  
                  {documents.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 text-sm">No documents found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-100 h-[600px] flex flex-col">
                {selectedDocument ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-6 border-b border-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{selectedDocument.title}</h3>
                          <p className="text-sm text-slate-600">AI Assistant ready to help</p>
                        </div>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-6 overflow-y-auto">
                      <div className="space-y-6">
                        {messages.length === 0 && (
                          <div className="text-center py-12">
                            <Bot className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-slate-700 mb-2">
                              Start a conversation
                            </h3>
                            <p className="text-slate-500">
                              Ask me anything about "{selectedDocument.title}"
                            </p>
                          </div>
                        )}

                        {messages.map((message) => (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex items-start space-x-3 ${
                              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.role === 'user' 
                                ? 'bg-blue-500' 
                                : 'bg-gradient-to-r from-purple-500 to-pink-500'
                            }`}>
                              {message.role === 'user' ? (
                                <User className="w-4 h-4 text-white" />
                              ) : (
                                <Bot className="w-4 h-4 text-white" />
                              )}
                            </div>
                            <div className={`max-w-[80%] p-4 rounded-2xl ${
                              message.role === 'user'
                                ? 'bg-blue-500 text-white'
                                : 'bg-slate-100 text-slate-900'
                            }`}>
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              <p className={`text-xs mt-2 ${
                                message.role === 'user' ? 'text-blue-100' : 'text-slate-500'
                              }`}>
                                {new Date(message.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </motion.div>
                        ))}

                        {isLoading && (
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                              <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-slate-100 p-4 rounded-2xl">
                              <div className="flex items-center space-x-2">
                                <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                                <span className="text-sm text-slate-600">AI is thinking...</span>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        <div ref={messagesEndRef} />
                      </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-6 border-t border-slate-200">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="relative">
                            <input
                              type="text"
                              value={inputMessage}
                              onChange={(e) => setInputMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              placeholder="Ask a question about the document..."
                              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors pr-12"
                              disabled={isLoading}
                            />
                            <button
                              onClick={isListening ? stopListening : startListening}
                              className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-lg transition-colors ${
                                isListening 
                                  ? 'text-red-600 bg-red-100 hover:bg-red-200' 
                                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={handleSendMessage}
                          disabled={!inputMessage.trim() || isLoading}
                          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {isLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Send className="w-4 h-4" />
                          )}
                          <span>Send</span>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-700 mb-2">
                        Select a document to start chatting
                      </h3>
                      <p className="text-slate-500">
                        Choose a document from the sidebar to begin asking questions
                      </p>
                    </div>
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