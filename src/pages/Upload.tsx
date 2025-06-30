import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { 
  Upload as UploadIcon, 
  FileText, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Mic,
  Play,
  Pause
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { PDFParser } from '../lib/pdf-parser';
import { azureOpenAI, elevenLabs } from '../lib/ai-services';
import toast from 'react-hot-toast';

interface UploadedFile {
  file: File;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  content?: string;
  summary?: string;
  audioUrl?: string;
  documentId?: string;
}

export function Upload() {
  const { user } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        status: 'uploading' as const,
        progress: 0,
      }));

      setUploadedFiles((prev) => [...prev, ...newFiles]);

      // Process each file
      newFiles.forEach((uploadedFile, index) => {
        processFile(uploadedFile, uploadedFiles.length + index);
      });
    },
    [uploadedFiles.length]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const processFile = async (uploadedFile: UploadedFile, index: number) => {
    try {
      // Update status to processing
      updateFileStatus(index, 'processing', 25);

      // Extract text from PDF
      const content = await PDFParser.extractText(uploadedFile.file);
      updateFileStatus(index, 'processing', 50);

      // Save to database
      const { data: document, error: dbError } = await supabase
        .from('documents')
        .insert({
          user_id: user?.id,
          title: uploadedFile.file.name.replace('.pdf', ''),
          filename: uploadedFile.file.name,
          content: content,
          file_size: uploadedFile.file.size,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      updateFileStatus(index, 'processing', 75, { content, documentId: document.id });

      // Generate AI summary
      const summary = await azureOpenAI.generateSummary(content);
      
      // Generate voice narration
      const audioBlob = await elevenLabs.generateSpeech(summary);
      const audioUrl = URL.createObjectURL(audioBlob);

      // Save summary to database
      await supabase.from('summaries').insert({
        document_id: document.id,
        content: summary,
        voice_url: audioUrl,
      });

      updateFileStatus(index, 'completed', 100, { 
        content, 
        summary, 
        audioUrl, 
        documentId: document.id 
      });

      toast.success('PDF processed successfully!');
    } catch (error) {
      console.error('Error processing file:', error);
      updateFileStatus(index, 'error', 0);
      toast.error('Failed to process PDF');
    }
  };

  const updateFileStatus = (
    index: number,
    status: UploadedFile['status'],
    progress: number,
    additionalData?: Partial<UploadedFile>
  ) => {
    setUploadedFiles((prev) =>
      prev.map((file, i) =>
        i === index
          ? { ...file, status, progress, ...additionalData }
          : file
      )
    );
  };

  const playAudio = (audioUrl: string, fileId: string) => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying(null);
    }

    if (isPlaying === fileId) {
      setIsPlaying(null);
      return;
    }

    const audio = new Audio(audioUrl);
    audio.onended = () => {
      setIsPlaying(null);
      setCurrentAudio(null);
    };
    
    audio.play();
    setCurrentAudio(audio);
    setIsPlaying(fileId);
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusText = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'processing':
        return 'Processing with AI...';
      case 'completed':
        return 'Completed';
      case 'error':
        return 'Error';
    }
  };

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
              Upload Your Learning Materials
            </h1>
            <p className="text-lg text-slate-600">
              Upload PDF files to transform them into interactive learning experiences with AI summaries and voice narration
            </p>
          </div>

          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-8"
          >
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                isDragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4">
                  <UploadIcon className="w-8 h-8 text-white" />
                </div>
                
                {isDragActive ? (
                  <p className="text-xl text-blue-600 font-medium">
                    Drop your PDF files here...
                  </p>
                ) : (
                  <>
                    <p className="text-xl text-slate-700 font-medium mb-2">
                      Drag & drop PDF files here, or click to select
                    </p>
                    <p className="text-slate-500">
                      Maximum file size: 10MB • Supported format: PDF
                    </p>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Processing Files</h2>
              <div className="space-y-4">
                {uploadedFiles.map((uploadedFile, index) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-medium text-slate-900 truncate">
                            {uploadedFile.file.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(uploadedFile.status)}
                            <span className="text-sm text-slate-600">
                              {getStatusText(uploadedFile.status)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-slate-500 mb-4">
                          <span>{PDFParser.formatFileSize(uploadedFile.file.size)}</span>
                          <span>•</span>
                          <span>{uploadedFile.progress}% complete</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadedFile.progress}%` }}
                          />
                        </div>

                        {/* Summary and Audio */}
                        {uploadedFile.status === 'completed' && uploadedFile.summary && (
                          <div className="bg-slate-50 p-4 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-slate-900">AI Summary</h4>
                              {uploadedFile.audioUrl && (
                                <button
                                  onClick={() => playAudio(uploadedFile.audioUrl!, `${index}`)}
                                  className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                >
                                  <Mic className="w-4 h-4" />
                                  {isPlaying === `${index}` ? (
                                    <>
                                      <Pause className="w-4 h-4" />
                                      <span>Pause</span>
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-4 h-4" />
                                      <span>Listen</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                            <p className="text-slate-700 leading-relaxed">
                              {uploadedFile.summary}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}