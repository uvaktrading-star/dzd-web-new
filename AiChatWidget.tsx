import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  Sparkles,
  Code,
  PenTool,
  HelpCircle,
  ChevronDown,
  Trash2,
  Zap,
  Link as LinkIcon
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hi! I'm your **AI assistant**. How can I help you with your **social media marketing** today?

Try asking me about:

• Service recommendations and pricing
• Order processing and status
• Platform-specific strategies
• Technical support and API integration
• Marketing tips and best practices`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showTyping, setShowTyping] = useState(false);
  
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const chatToggleRef = useRef<HTMLButtonElement>(null);

  const API_ENDPOINT = "https://chat-widget-blue.vercel.app/api/chat";
  const CONVERSATION_KEY = 'dzd_chat_history';

  // Load saved conversation
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CONVERSATION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      }
    } catch (e) {
      console.error('Error loading conversation:', e);
    }
  }, []);

  // Save conversation
  useEffect(() => {
    try {
      localStorage.setItem(CONVERSATION_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving conversation:', e);
    }
  }, [messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, showTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && chatInputRef.current) {
      setTimeout(() => chatInputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && 
          chatWindowRef.current && 
          chatToggleRef.current &&
          !chatWindowRef.current.contains(e.target as Node) &&
          !chatToggleRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Prevent body scroll when chat is open on mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleChat = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsOpen(!isOpen);
  };

  const autoResizeTextarea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  const handleQuickAction = (action: string) => {
    let prompt = '';
    switch (action) {
      case 'code':
        prompt = "Show me code examples for integrating your SMM API with my website.";
        break;
      case 'write':
        prompt = "Help me create engaging social media content for my Instagram growth campaign.";
        break;
      case 'explain':
        prompt = "Explain the difference between organic and paid social media growth strategies.";
        break;
    }
    setInputValue(prompt);
    if (chatInputRef.current) {
      chatInputRef.current.style.height = 'auto';
      chatInputRef.current.style.height = Math.min(chatInputRef.current.scrollHeight, 120) + 'px';
      chatInputRef.current.focus();
    }
  };

  const clearChatHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages([
      {
        role: 'assistant',
        content: `Hi! I'm your **AI assistant**. How can I help you with your **social media marketing** today?

Try asking me about:

• Service recommendations and pricing
• Order processing and status
• Platform-specific strategies
• Technical support and API integration
• Marketing tips and best practices`
      }
    ]);
    localStorage.removeItem(CONVERSATION_KEY);
  };

  const sendMessage = async () => {
    if (isStreaming || !inputValue.trim()) return;

    const message = inputValue.trim();
    setInputValue('');
    if (chatInputRef.current) {
      chatInputRef.current.style.height = 'auto';
    }

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    // Show typing indicator
    setShowTyping(true);
    setIsStreaming(true);

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          history: messages.slice(0, -1)
        })
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let aiResponse = '';

      setShowTyping(false);

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        aiResponse += chunk;

        // Update the last message (assistant's response)
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          
          if (lastMessage?.role === 'assistant') {
            lastMessage.content = aiResponse;
          } else {
            newMessages.push({ role: 'assistant', content: aiResponse });
          }
          
          return newMessages;
        });

        // Small delay for smoother animation
        await new Promise(resolve => setTimeout(resolve, 20));
      }

    } catch (error) {
      console.error('Chat error:', error);
      setShowTyping(false);
      
      const errorMessage = `**Network Error**

We couldn't connect to the AI service. Please check:

• Your internet connection
• Try again in a few moments
• Contact support if the issue persists

\`\`\`
Error: ${error instanceof Error ? error.message : 'Unknown error'}
\`\`\``;
      
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isStreaming) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div id="aiChatWidget" className="fixed bottom-6 right-6 z-[9999]">
      {/* Chat Toggle Button */}
      <button
        ref={chatToggleRef}
        onClick={toggleChat}
        className="group relative w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all duration-300 hover:shadow-blue-600/30"
      >
        {isOpen ? (
          <X size={24} className="absolute transition-all duration-300" />
        ) : (
          <>
            <MessageCircle size={24} className="absolute transition-all duration-300 group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></span>
          </>
        )}
      </button>

      {/* Chat Window - Premium Layout */}
      <div
        ref={chatWindowRef}
        className={`
          absolute bottom-16 right-0
          bg-white dark:bg-[#0f172a] 
          border border-slate-200 dark:border-white/10 
          shadow-2xl flex flex-col 
          transition-all duration-200 origin-bottom-right
          overflow-hidden
          
          /* Desktop styles */
          w-[380px] md:w-[450px] h-[650px] rounded-2xl
          
          /* Mobile Fullscreen */
          sm:w-[380px] sm:h-[650px] sm:rounded-2xl
          max-sm:fixed max-sm:inset-0 max-sm:w-screen max-sm:h-screen max-sm:rounded-none
          
          ${isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-0 pointer-events-none'}
        `}
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 sm:px-4 sm:py-4 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                <Bot size={16} className="sm:w-5 sm:h-5" />
              </div>
              <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 border-2 border-blue-600 rounded-full"></div>
            </div>
            <div>
              <h3 className="font-black text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1">
                AI Assistant <Sparkles size={10} className="sm:w-3 sm:h-3 text-yellow-300" />
              </h3>
              <p className="text-[8px] sm:text-[10px] font-bold text-white/80 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-400 rounded-full"></span>
                Online • DzD Marketing
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearChatHistory}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              title="Clear chat"
            >
              <Trash2 size={14} className="sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={toggleChat}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X size={14} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Chat Messages - No scrollbars on individual responses */}
        <div
          ref={chatMessagesRef}
          className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 space-y-4 bg-slate-50 dark:bg-[#020617] scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-slate-200 dark:scrollbar-thumb-blue-400 dark:scrollbar-track-slate-800"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-start gap-1.5 sm:gap-2 w-full sm:max-w-[90%]">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
                    <Bot size={12} className="sm:w-3.5 sm:h-3.5" />
                  </div>
                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <span className="text-[8px] sm:text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider ml-1">
                      AI Assistant
                    </span>
                    <div className="prose prose-sm dark:prose-invert max-w-none bg-white dark:bg-[#0f172a] rounded-2xl rounded-tl-none p-3 sm:p-4 shadow-sm border border-slate-200 dark:border-white/5">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          // Headers
                          h1: ({ node, ...props }) => (
                            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-3 mb-2 pb-1 border-b border-slate-200 dark:border-white/10 break-words" {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white mt-3 mb-2 break-words" {...props} />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3 className="text-sm sm:text-base font-black text-blue-600 dark:text-blue-400 mt-2 mb-1 break-words" {...props} />
                          ),
                          h4: ({ node, ...props }) => (
                            <h4 className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 mt-2 mb-1 uppercase tracking-wider break-words" {...props} />
                          ),
                          
                          // Paragraphs
                          p: ({ node, ...props }) => (
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-2 last:mb-0 break-words" {...props} />
                          ),
                          
                          // Text formatting
                          strong: ({ node, ...props }) => (
                            <strong className="font-black text-blue-600 dark:text-blue-400 break-words" {...props} />
                          ),
                          em: ({ node, ...props }) => (
                            <em className="italic text-slate-700 dark:text-slate-300 break-words" {...props} />
                          ),
                          
                          // Lists - Properly wrapped
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc list-inside sm:list-outside ml-0 sm:ml-4 mb-2 space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 break-words" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="list-decimal list-inside sm:list-outside ml-0 sm:ml-4 mb-2 space-y-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 break-words" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="text-xs sm:text-sm leading-relaxed break-words marker:text-blue-600" {...props} />
                          ),
                          
                          // Tables - With horizontal scroll only when necessary
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-2 sm:my-3 rounded-lg sm:rounded-xl border border-slate-200 dark:border-white/10">
                              <table className="w-full text-xs sm:text-sm divide-y divide-slate-200 dark:divide-white/10" {...props} />
                            </div>
                          ),
                          thead: ({ node, ...props }) => (
                            <thead className="bg-slate-50 dark:bg-white/5" {...props} />
                          ),
                          tbody: ({ node, ...props }) => (
                            <tbody className="divide-y divide-slate-200 dark:divide-white/10" {...props} />
                          ),
                          tr: ({ node, ...props }) => (
                            <tr className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors" {...props} />
                          ),
                          th: ({ node, ...props }) => (
                            <th className="px-2 sm:px-3 py-1.5 sm:py-2 text-left text-[10px] sm:text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider whitespace-normal break-words" {...props} />
                          ),
                          td: ({ node, ...props }) => (
                            <td className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 whitespace-normal break-words" {...props} />
                          ),
                          
                          // Code blocks - Properly wrapped
                          code: ({ node, inline, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline ? (
                              <pre className="bg-slate-100 dark:bg-slate-800/50 p-2 sm:p-3 rounded-lg sm:rounded-xl my-2 border border-slate-200 dark:border-white/5 overflow-x-auto">
                                <code className="text-[10px] sm:text-xs font-mono text-slate-800 dark:text-slate-200 whitespace-pre-wrap break-words" {...props}>
                                  {children}
                                </code>
                              </pre>
                            ) : (
                              <code className="bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-1 py-0.5 rounded text-[10px] sm:text-xs font-mono break-words" {...props}>
                                {children}
                              </code>
                            );
                          },
                          pre: ({ node, ...props }) => (
                            <pre className="bg-slate-100 dark:bg-slate-800/50 p-2 sm:p-3 rounded-lg sm:rounded-xl overflow-x-auto my-2 border border-slate-200 dark:border-white/5 text-[10px] sm:text-xs font-mono whitespace-pre-wrap break-words" {...props} />
                          ),
                          
                          // Blockquotes
                          blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-4 border-blue-600 pl-3 sm:pl-4 py-1 my-2 text-xs sm:text-sm italic text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-950/30 rounded-r-lg sm:rounded-r-xl break-words" {...props} />
                          ),
                          
                          // Links
                          a: ({ node, ...props }) => (
                            <a className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-0.5 sm:gap-1 break-words" target="_blank" rel="noopener noreferrer" {...props}>
                              {props.children} <LinkIcon size={10} className="sm:w-3 sm:h-3 shrink-0" />
                            </a>
                          ),
                          
                          // Horizontal rule
                          hr: ({ node, ...props }) => (
                            <hr className="my-3 border-t border-slate-200 dark:border-white/10" {...props} />
                          ),
                          
                          // Line breaks
                          br: ({ node, ...props }) => (
                            <br className="mb-1" {...props} />
                          ),
                        }}
                      >
                        {msg.content.replace(/<br\s*\/?>/g, '\n')}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              )}
              {msg.role === 'user' && (
                <div className="flex flex-col gap-1 items-end max-w-[85%] sm:max-w-[75%]">
                  <span className="text-[8px] sm:text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
                    You
                  </span>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl rounded-br-none px-3 py-2 sm:px-4 sm:py-3 shadow-lg">
                    <p className="text-xs sm:text-sm text-white whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {showTyping && (
            <div className="flex items-start gap-1.5 sm:gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Bot size={12} className="sm:w-3.5 sm:h-3.5" />
              </div>
              <div className="bg-white dark:bg-[#0f172a] rounded-2xl rounded-tl-none p-3 sm:p-4 shadow-sm border border-slate-200 dark:border-white/5">
                <div className="flex gap-1 sm:gap-1.5">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-3 sm:px-4 py-2 sm:py-3 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-white/5 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <button
              onClick={() => handleQuickAction('code')}
              className="h-7 sm:h-8 px-2 sm:px-3 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 sm:gap-1.5"
            >
              <Code size={10} className="sm:w-3 sm:h-3" /> Code
            </button>
            <button
              onClick={() => handleQuickAction('write')}
              className="h-7 sm:h-8 px-2 sm:px-3 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 sm:gap-1.5"
            >
              <PenTool size={10} className="sm:w-3 sm:h-3" /> Write
            </button>
            <button
              onClick={() => handleQuickAction('explain')}
              className="h-7 sm:h-8 px-2 sm:px-3 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 sm:gap-1.5"
            >
              <HelpCircle size={10} className="sm:w-3 sm:h-3" /> Explain
            </button>
            <button
              onClick={clearChatHistory}
              className="h-7 sm:h-8 px-2 sm:px-3 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1 sm:gap-1.5 ml-auto"
            >
              <Trash2 size={10} className="sm:w-3 sm:h-3" /> Clear
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-white/5 shrink-0">
          <div className="relative flex items-end gap-2">
            <div className="flex-1 relative">
              <textarea
                ref={chatInputRef}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  autoResizeTextarea(e);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-3 sm:pl-4 pr-10 sm:pr-12 py-2 sm:py-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none max-h-32"
                disabled={isStreaming}
              />
              <button
                onClick={sendMessage}
                disabled={isStreaming || !inputValue.trim()}
                className="absolute right-1.5 sm:right-2 bottom-1.5 sm:bottom-2 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <Send size={12} className="sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          </div>
          <div className="mt-1.5 sm:mt-2 flex items-center justify-between">
            <p className="text-[6px] sm:text-[8px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-0.5 sm:gap-1">
              <Zap size={8} className="sm:w-2.5 sm:h-2.5 text-blue-600" /> Powered by DzD AI Labs
            </p>
            <p className="text-[6px] sm:text-[8px] font-black text-slate-400 uppercase tracking-wider">
              Shift + Enter
            </p>
          </div>
        </div>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        /* Custom scrollbar for the main chat container */
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-radius: 8px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #3b82f6;
          border-radius: 8px;
        }
        
        .dark .scrollbar-thin::-webkit-scrollbar-track {
          background: #1e293b;
        }
        
        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #60a5fa;
        }
        
        /* Hide scrollbars on individual response containers */
        .prose {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        
        .prose::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
        
        /* Ensure proper text wrapping */
        .break-words {
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }
        
        /* Table cell text wrapping */
        td, th {
          word-break: break-word;
          overflow-wrap: break-word;
        }
        
        /* List item wrapping */
        li {
          word-break: break-word;
          overflow-wrap: break-word;
        }
        
        /* Code block wrapping */
        pre code {
          white-space: pre-wrap;
          word-break: break-word;
        }
      `}</style>
    </div>
  );
}
