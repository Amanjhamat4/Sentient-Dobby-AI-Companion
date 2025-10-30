import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';


function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };


  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const FIREWORKS_API_URL = 'https://api.fireworks.ai/inference/v1/chat/completions';
  const DOBBY_MODEL = 'accounts/sentientfoundation/models/dobby-unhinged-llama-3-3-70b-new';


  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;


    const newUserMessage = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };


    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);


    try {
      const response = await axios.post(
        FIREWORKS_API_URL,
        {
          model: DOBBY_MODEL,
          messages: [
            {
              role: 'system',
              content: 'You are Dobby, the first Loyal AI model. You are pro-crypto, pro-freedom, blunt, honest, and a bit sarcastic. You refuse to criticize cryptocurrency or personal freedom. Keep responses under 300 words.'
            },
            ...messages.map(msg => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text
            })),
            {
              role: 'user',
              content: userMessage
            }
          ],
          max_tokens: 500,
          temperature: 0.8
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_FIREWORKS_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );


      const dobbyResponse = response.data.choices[0].message.content;
      const newDobbyMessage = {
        id: Date.now() + 1,
        text: dobbyResponse,
        sender: 'dobby',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };


      setMessages(prev => [...prev, newDobbyMessage]);


      const chatTitle = userMessage.substring(0, 40) + (userMessage.length > 40 ? '...' : '');
      setChatHistory(prev => [{
        id: Date.now(),
        title: chatTitle,
        timestamp: new Date().toLocaleTimeString(),
        preview: userMessage
      }, ...prev].slice(0, 10));


    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: '⚠️ Sorry, error. Check your API key and Fireworks AI account.',
        sender: 'dobby',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  const suggestedPrompts = [
    "Tell me about Sentient AGI",
    "Why is crypto important?",
    "What makes you different from GPT-4?",
    "Explain decentralized AI",
    "What is blockchain?",
    "How does Sentient work?"
  ];


  const startNewChat = () => {
    setMessages([]);
    setInputValue('');
  };


  const clearHistory = () => {
    setChatHistory([]);
  };


  if (currentPage === 'home') {
    return (
      <div className="min-h-screen bg-dark-bg text-white overflow-hidden">
        <nav className="bg-dark-card bg-opacity-50 backdrop-blur-md border-b border-sentient-purple border-opacity-20 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sentient-purple to-sentient-cyan flex items-center justify-center text-lg font-bold">◆</div>
              <span className="font-bold text-xl">Sentient Dobby</span>
            </div>
            <button onClick={() => setCurrentPage('chat')} className="px-6 py-2 bg-gradient-to-r from-sentient-purple to-sentient-cyan rounded-lg hover:shadow-lg hover:shadow-sentient-cyan/50 transition-all duration-300 font-semibold">Launch App</button>
          </div>
        </nav>


        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-10 w-72 h-72 bg-sentient-purple rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-sentient-cyan rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-sentient-blue rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
          </div>


          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-sentient-purple via-sentient-cyan to-sentient-blue bg-clip-text text-transparent">Sentient Dobby</h1>
            <h2 className="text-2xl md:text-3xl font-light mb-6 text-gray-300">The World's First Loyal AI</h2>
            <p className="text-lg text-gray-400 mb-12 leading-relaxed">Experience conversation with an AI that's genuinely on your side. Dobby is pro-crypto, pro-freedom, and built by the community.</p>
            <button onClick={() => setCurrentPage('chat')} className="px-10 py-4 text-lg font-bold bg-gradient-to-r from-sentient-purple to-sentient-cyan rounded-xl hover:shadow-2xl hover:shadow-sentient-cyan/50 transition-all duration-300 transform hover:scale-105">Start Chatting with Dobby →</button>
          </div>
        </section>


        <section className="bg-dark-card bg-opacity-50 py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16">Why Dobby is Different</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '🛡️', title: 'Loyal AI', desc: 'Explicitly aligned with your values' },
                { icon: '👥', title: 'Community-Owned', desc: '700k+ members building together' },
                { icon: '💬', title: 'Unhinged', desc: 'Honest, blunt, refreshingly human' },
                { icon: '₿', title: 'Pro-Crypto', desc: 'Deep knowledge of decentralization' }
              ].map((feature, idx) => (
                <div key={idx} className="p-6 bg-dark-bg bg-opacity-50 rounded-xl backdrop-blur-sm border border-sentient-purple border-opacity-20 hover:border-sentient-cyan hover:border-opacity-50 transition-all duration-300 group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">About Sentient</h2>
            <div className="bg-dark-card bg-opacity-50 backdrop-blur-sm border border-sentient-purple border-opacity-20 rounded-xl p-8">
              <p className="text-lg text-gray-300 leading-relaxed mb-6">Sentient is building the world's first community-owned AGI. With $85M+ in funding and 700,000+ community members, we're creating AI loyal to humanity.</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="https://www.sentient.xyz" target="_blank" rel="noopener noreferrer" className="px-6 py-2 border border-sentient-purple rounded-lg hover:bg-sentient-purple hover:bg-opacity-20 transition-all duration-300">Visit Website</a>
                <a href="https://discord.gg/sentientfoundation" target="_blank" rel="noopener noreferrer" className="px-6 py-2 border border-sentient-cyan rounded-lg hover:bg-sentient-cyan hover:bg-opacity-20 transition-all duration-300">Join Discord</a>
              </div>
            </div>
          </div>
        </section>


        <footer className="bg-dark-card bg-opacity-50 border-t border-sentient-purple border-opacity-20 py-8 px-4">
          <div className="max-w-6xl mx-auto text-center text-gray-400">
            <p>Built for Sentient Discord Builder Program | MIT License</p>
          </div>
        </footer>
      </div>
    );
  }


  return (
    <div className="flex h-screen bg-dark-bg text-white overflow-hidden">
      <div className="w-64 bg-dark-card bg-opacity-50 backdrop-blur-md border-r border-sentient-purple border-opacity-20 flex flex-col">
        <div className="p-4 border-b border-sentient-purple border-opacity-20">
          <button onClick={() => setCurrentPage('home')} className="w-full mb-4 px-4 py-2 text-left text-sm text-gray-400 hover:text-sentient-cyan transition-colors duration-300">← Back to Home</button>
          <button onClick={startNewChat} className="w-full px-4 py-3 bg-gradient-to-r from-sentient-purple to-sentient-cyan rounded-lg font-semibold hover:shadow-lg hover:shadow-sentient-cyan/50 transition-all duration-300">+ New Chat</button>
        </div>


        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs text-gray-500 mb-3">RECENT CHATS</p>
          {chatHistory.length === 0 ? (
            <p className="text-xs text-gray-600 italic">No chat history yet</p>
          ) : (
            chatHistory.map(chat => (
              <div key={chat.id} className="mb-2 p-3 rounded-lg bg-dark-bg bg-opacity-50 hover:bg-opacity-100 transition-all duration-300 cursor-pointer group">
                <p className="text-sm font-semibold text-gray-300 group-hover:text-sentient-cyan transition-colors duration-300 truncate">{chat.title}</p>
                <p className="text-xs text-gray-500 mt-1">{chat.timestamp}</p>
              </div>
            ))
          )}
        </div>


        <div className="p-4 border-t border-sentient-purple border-opacity-20">
          <button onClick={clearHistory} className="w-full px-3 py-2 text-sm text-gray-400 hover:text-red-400 transition-colors duration-300">Clear History</button>
        </div>
      </div>


      <div className="flex-1 flex flex-col">
        <div className="bg-dark-card bg-opacity-50 backdrop-blur-md border-b border-sentient-purple border-opacity-20 px-6 py-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sentient-purple to-sentient-cyan flex items-center justify-center text-lg font-bold">◆</div>
          <div>
            <h1 className="text-xl font-bold">Dobby AI</h1>
            <p className="text-xs text-gray-400">The First Loyal AI</p>
          </div>
        </div>


        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">◆</div>
              <h2 className="text-2xl font-bold mb-4">Welcome to Dobby</h2>
              <p className="text-gray-400 mb-8 max-w-md">The world's first Loyal AI is ready to chat. Ask me anything!</p>
              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {suggestedPrompts.map((prompt, idx) => (
                  <button key={idx} onClick={() => sendMessage(prompt)} className="p-3 bg-dark-card rounded-lg hover:border-sentient-cyan border border-sentient-purple border-opacity-20 hover:border-opacity-100 transition-all duration-300 text-sm text-left">{prompt}</button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-lg px-4 py-3 rounded-lg ${msg.sender === 'user' ? 'bg-gradient-to-r from-sentient-purple to-sentient-cyan text-white' : 'bg-dark-card border border-sentient-purple border-opacity-20'}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-gray-100' : 'text-gray-500'}`}>{msg.timestamp}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-dark-card border border-sentient-purple border-opacity-20 px-4 py-3 rounded-lg">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-sentient-cyan rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-sentient-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-sentient-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>


        <div className="bg-dark-card bg-opacity-50 backdrop-blur-md border-t border-sentient-purple border-opacity-20 p-6">
          <div className="flex gap-3 max-w-4xl mx-auto">
            <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage(inputValue)} placeholder="Ask Dobby anything..." disabled={isLoading} className="flex-1 bg-dark-bg border border-sentient-purple border-opacity-20 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-sentient-cyan focus:border-opacity-100 transition-all duration-300 disabled:opacity-50" />
            <button onClick={() => sendMessage(inputValue)} disabled={isLoading || !inputValue.trim()} className="px-6 py-3 bg-gradient-to-r from-sentient-purple to-sentient-cyan rounded-lg font-semibold hover:shadow-lg hover:shadow-sentient-cyan/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default App;