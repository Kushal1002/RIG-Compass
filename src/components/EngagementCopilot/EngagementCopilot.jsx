import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles } from 'lucide-react';
import { engagements } from '../../data/engagements';
import { processCopilotQuery } from '../../utils/copilotEngine';
import styles from './EngagementCopilot.module.css';

const SUGGESTED_QUESTIONS = [
  { label: 'Blocked Projects', query: 'What projects are blocked?' },
  { label: 'High Risk', query: 'Which engagement is most at risk?' },
  { label: 'Team Workload', query: 'Who has the highest workload?' },
  { label: 'Business AI', query: 'Show Business AI projects' },
  { label: 'Near Completion', query: 'Which projects are near completion?' },
  { label: 'Needs Attention', query: 'What needs attention this week?' },
];

export default function EngagementCopilot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (query) => {
    const text = query || input.trim();
    if (!text) return;

    const userMsg = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate processing delay
    setTimeout(() => {
      const response = processCopilotQuery(text, engagements);
      const assistantMsg = { role: 'assistant', content: response.text };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.copilotPage}>
      <div className={styles.copilotCard}>
        <div className={styles.copilotHeader}>
          <div className={styles.copilotIcon}>
            <Bot size={18} />
          </div>
          <div className={styles.copilotTitleGroup}>
            <h2>Engagement Copilot</h2>
            <p>AI-powered assistant for your engagement portfolio</p>
          </div>
        </div>

        <div className={styles.suggestedChips}>
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q.label}
              className={styles.chip}
              onClick={() => handleSend(q.query)}
            >
              {q.label}
            </button>
          ))}
        </div>

        <div className={styles.chatArea}>
          {messages.length === 0 && (
            <div className={styles.welcome}>
              <div className={styles.welcomeIcon}>
                <Sparkles size={24} />
              </div>
              <h3>How can I help you today?</h3>
              <p>Ask about your engagements, risks, workload, or portfolio status.</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={styles.message}>
              {msg.role === 'user' ? (
                <div className={styles.userMessage}>
                  <div className={styles.userBubble}>{msg.content}</div>
                </div>
              ) : (
                <div className={styles.assistantMessage}>
                  <div className={styles.assistantAvatar}>
                    <Bot size={14} />
                  </div>
                  <div className={styles.assistantBubble}>{msg.content}</div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className={styles.message}>
              <div className={styles.assistantMessage}>
                <div className={styles.assistantAvatar}>
                  <Bot size={14} />
                </div>
                <div className={styles.assistantBubble}>Analyzing portfolio data...</div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        <div className={styles.inputArea}>
          <input
            className={styles.input}
            placeholder="Ask about engagements, risks, workload..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={200}
          />
          <button
            className={styles.sendBtn}
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
          >
            <Send size={14} />
            Ask
          </button>
        </div>
      </div>
    </div>
  );
}
