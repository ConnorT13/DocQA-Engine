import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  MessageCircle, 
  Send, 
  FileText, 
  Brain, 
  Database, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  X,
  Sparkles,
  Trash2,
  Calendar,
  File,
  HardDrive
} from 'lucide-react';

function App() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load existing uploaded files on app start
  useEffect(() => {
    loadExistingFiles();
  }, []);

  const loadExistingFiles = async () => {
    try {
      const response = await fetch('/uploaded-files');
      if (response.ok) {
        const data = await response.json();
        // Convert the uploaded_files object to array format
        const filesArray = Object.values(data.uploaded_files || {});
        setUploadedFiles(filesArray);
        if (filesArray.length > 0) {
          addMessage('system', `Loaded ${filesArray.length} previously uploaded file(s) from your library.`);
        }
      }
    } catch (error) {
      console.log('No previous files found or error loading files');
    }
  };

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        
        if (response.ok) {
          return { success: true, file, result };
        } else {
          return { success: false, file, error: result.message || 'Upload failed' };
        }
      } catch (error) {
        return { success: false, file, error: 'Network error' };
      }
    });

    const results = await Promise.all(uploadPromises);
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    if (successful.length > 0) {
      setUploadedFiles(prev => [...prev, ...successful.map(r => ({ name: r.file.name, ...r.result }))]);
      addMessage('system', `Successfully uploaded ${successful.length} file(s)!`);
    }

    if (failed.length > 0) {
      failed.forEach(f => {
        addMessage('error', `Failed to upload ${f.file.name}: ${f.error}`);
      });
    }

    setFiles([]);
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage;
    setInputMessage('');
    addMessage('user', userMessage);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('question', userMessage);

      const response = await fetch('/ask', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        addMessage('assistant', result.answer, result.chunks_used);
      } else {
        addMessage('error', 'Failed to get response from AI');
      }
    } catch (error) {
      addMessage('error', 'Network error. Please try again.');
    }

    setIsLoading(false);
  };

  const addMessage = (type, content, chunks = null) => {
    const newMessage = {
      id: Date.now(),
      type,
      content,
      timestamp: new Date(),
      chunks
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DocQA Engine
                </h1>
                <p className="text-xs text-gray-500">AI-Powered Document Q&A</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Database className="w-4 h-4" />
                <span>ChromaDB</span>
              </div>
              <div className="flex items-center space-x-1">
                <Sparkles className="w-4 h-4" />
                <span>Mistral</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Upload Section */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Card */}
            <div className="card">
              <div className="flex items-center space-x-2 mb-4">
                <Upload className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">Upload Documents</h2>
              </div>
              
              <div className="space-y-4">
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200 cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Drop files here or click to browse</p>
                  <p className="text-sm text-gray-500 mt-1">Supports TXT, PDF, DOCX (max 10MB each)</p>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".txt,.pdf,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {files.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Selected Files:</span>
                      <button
                        onClick={uploadFiles}
                        disabled={uploading}
                        className="btn-primary text-sm"
                      >
                        {uploading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Upload All
                          </>
                        )}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <HardDrive className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Document Library</h3>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <button 
                    onClick={() => setUploadedFiles([])}
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                    title="Clear all files"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-green-50 to-blue-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-sm">
                            {file.content_type?.includes('pdf') ? (
                              <File className="w-5 h-5 text-red-500" />
                            ) : file.content_type?.includes('word') ? (
                              <File className="w-5 h-5 text-blue-500" />
                            ) : (
                              <FileText className="w-5 h-5 text-gray-500" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {file.original_filename || file.name}
                            </h4>
                            
                            <div className="flex items-center space-x-3 mt-1">
                              <span className="text-xs text-gray-500">
                                {file.size ? `${(file.size / 1024).toFixed(1)} KB` : 'Size unknown'}
                              </span>
                              {file.content_type && (
                                <span className="text-xs bg-white px-2 py-1 rounded text-gray-600">
                                  {file.content_type.split('/')[1]?.toUpperCase() || 'DOC'}
                                </span>
                              )}
                            </div>
                            
                            {file.chunks && (
                              <div className="mt-2 text-xs text-gray-600">
                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                  {file.chunks.length} chunks processed
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                          title="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Total storage: {(uploadedFiles.reduce((acc, file) => acc + (file.size || 0), 0) / 1024).toFixed(1)} KB</span>
                    <span>Ready for Q&A</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Section */}
          <div className="lg:col-span-2">
            <div className="card h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-gray-200">
                <MessageCircle className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-semibold text-gray-900">Ask Questions</h2>
                {uploadedFiles.length > 0 && (
                  <span className="text-sm text-gray-500">({uploadedFiles.length} document{uploadedFiles.length !== 1 ? 's' : ''} loaded)</span>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium">Start a conversation</p>
                    <p className="text-sm">Upload documents and ask questions about them!</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.type === 'user'
                            ? 'bg-blue-600 text-white'
                            : message.type === 'error'
                            ? 'bg-red-100 text-red-800'
                            : message.type === 'system'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.type === 'user' && <MessageCircle className="w-4 h-4 mt-0.5" />}
                          {message.type === 'assistant' && <Brain className="w-4 h-4 mt-0.5" />}
                          {message.type === 'error' && <AlertCircle className="w-4 h-4 mt-0.5" />}
                          {message.type === 'system' && <CheckCircle className="w-4 h-4 mt-0.5" />}
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            {message.chunks && message.chunks.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500 mb-2">
                                  Sources ({message.chunks.length}):
                                </p>
                                <div className="space-y-1">
                                  {message.chunks.slice(0, 2).map((chunk, index) => (
                                    <div key={index} className="text-xs bg-white/50 rounded px-2 py-1">
                                      {chunk.metadata?.file_name || 'Unknown source'}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-gray-600">AI is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about your documents..."
                    className="flex-1 input-field"
                    disabled={isLoading || uploadedFiles.length === 0}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading || uploadedFiles.length === 0}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
                {uploadedFiles.length === 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Upload documents first to start asking questions
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
