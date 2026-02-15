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
  List,
  ListOrdered,
  Quote,
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
  const MAX_HISTORY_LENGTH = 20;

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

      {/* Chat Window */}
      <div
        ref={chatWindowRef}
        className={`absolute bottom-16 right-0 w-[380px] md:w-[450px] h-[650px] bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden transition-all duration-200 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-0 pointer-events-none'
        }`}
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm">
                <Bot size={20} />
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-600 rounded-full"></div>
            </div>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-1">
                AI Assistant <Sparkles size={12} className="text-yellow-300" />
              </h3>
              <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                Online • DzD Marketing
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={clearChatHistory}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
              title="Clear chat"
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={toggleChat}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div
          ref={chatMessagesRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-[#020617]"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 #e2e8f0' }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-start gap-2 max-w-[90%]">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
                    <Bot size={14} />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider ml-1">
                      AI Assistant
                    </span>
                    <div className="prose prose-sm dark:prose-invert max-w-none bg-white dark:bg-[#0f172a] rounded-2xl rounded-tl-none p-4 shadow-sm border border-slate-200 dark:border-white/5">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                        components={{
                          // Headers
                          h1: ({ node, ...props }) => (
                            <h1 className="text-xl font-black text-slate-900 dark:text-white mt-4 mb-2 pb-1 border-b border-slate-200 dark:border-white/10" {...props} />
                          ),
                          h2: ({ node, ...props }) => (
                            <h2 className="text-lg font-black text-slate-900 dark:text-white mt-3 mb-2" {...props} />
                          ),
                          h3: ({ node, ...props }) => (
                            <h3 className="text-base font-black text-blue-600 dark:text-blue-400 mt-3 mb-1" {...props} />
                          ),
                          h4: ({ node, ...props }) => (
                            <h4 className="text-sm font-black text-slate-700 dark:text-slate-300 mt-2 mb-1 uppercase tracking-wider" {...props} />
                          ),
                          
                          // Paragraphs
                          p: ({ node, ...props }) => (
                            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3 last:mb-0" {...props} />
                          ),
                          
                          // Text formatting
                          strong: ({ node, ...props }) => (
                            <strong className="font-black text-blue-600 dark:text-blue-400" {...props} />
                          ),
                          em: ({ node, ...props }) => (
                            <em className="italic text-slate-700 dark:text-slate-300" {...props} />
                          ),
                          
                          // Lists
                          ul: ({ node, ...props }) => (
                            <ul className="list-disc list-outside ml-4 mb-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300" {...props} />
                          ),
                          ol: ({ node, ...props }) => (
                            <ol className="list-decimal list-outside ml-4 mb-3 space-y-1.5 text-sm text-slate-600 dark:text-slate-300" {...props} />
                          ),
                          li: ({ node, ...props }) => (
                            <li className="text-sm leading-relaxed pl-1 marker:text-blue-600" {...props} />
                          ),
                          
                          // Tables
                          table: ({ node, ...props }) => (
                            <div className="overflow-x-auto my-3 rounded-xl border border-slate-200 dark:border-white/10">
                              <table className="w-full text-sm divide-y divide-slate-200 dark:divide-white/10" {...props} />
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
                            <th className="px-3 py-2 text-left text-xs font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider" {...props} />
                          ),
                          td: ({ node, ...props }) => (
                            <td className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400" {...props} />
                          ),
                          
                          // Code blocks
                          code: ({ node, inline, className, children, ...props }) => {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline ? (
                              <pre className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl overflow-x-auto my-3 border border-slate-200 dark:border-white/5">
                                <code className="text-xs font-mono text-slate-800 dark:text-slate-200" {...props}>
                                  {children}
                                </code>
                              </pre>
                            ) : (
                              <code className="bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-md text-xs font-mono" {...props}>
                                {children}
                              </code>
                            );
                          },
                          pre: ({ node, ...props }) => (
                            <pre className="bg-slate-100 dark:bg-slate-800/50 p-3 rounded-xl overflow-x-auto my-3 border border-slate-200 dark:border-white/5 text-xs font-mono" {...props} />
                          ),
                          
                          // Blockquotes
                          blockquote: ({ node, ...props }) => (
                            <blockquote className="border-l-4 border-blue-600 pl-4 py-1 my-3 text-sm italic text-slate-600 dark:text-slate-400 bg-blue-50 dark:bg-blue-950/30 rounded-r-xl" {...props} />
                          ),
                          
                          // Links
                          a: ({ node, ...props }) => (
                            <a className="text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1" target="_blank" rel="noopener noreferrer" {...props}>
                              {props.children} <LinkIcon size={12} />
                            </a>
                          ),
                          
                          // Horizontal rule
                          hr: ({ node, ...props }) => (
                            <hr className="my-4 border-t border-slate-200 dark:border-white/10" {...props} />
                          ),
                          
                          // Line breaks
                          br: ({ node, ...props }) => (
                            <br className="mb-2" {...props} />
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
                <div className="flex flex-col gap-1 items-end max-w-[80%]">
                  <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
                    You
                  </span>
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl rounded-br-none p-3 shadow-lg">
                    <p className="text-sm text-white whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {showTyping && (
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <Bot size={14} />
              </div>
              <div className="bg-white dark:bg-[#0f172a] rounded-2xl rounded-tl-none p-4 shadow-sm border border-slate-200 dark:border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-3 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-white/5">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleQuickAction('code')}
              className="h-8 px-3 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5"
            >
              <Code size={12} /> Code Help
            </button>
            <button
              onClick={() => handleQuickAction('write')}
              className="h-8 px-3 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5"
            >
              <PenTool size={12} /> Writing
            </button>
            <button
              onClick={() => handleQuickAction('explain')}
              className="h-8 px-3 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5"
            >
              <HelpCircle size={12} /> Explain
            </button>
            <button
              onClick={clearChatHistory}
              className="h-8 px-3 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 flex items-center gap-1.5 ml-auto"
            >
              <Trash2 size={12} /> Clear
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-[#0f172a] border-t border-slate-200 dark:border-white/5">
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
                className="w-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none max-h-32"
                disabled={isStreaming}
              />
              <button
                onClick={sendMessage}
                disabled={isStreaming || !inputValue.trim()}
                className="absolute right-2 bottom-2 w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Zap size={10} className="text-blue-600" /> Powered by DzD AI Labs
            </p>
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-wider">
              Shift + Enter
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
