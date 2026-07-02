import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { processCopilotQuery } from '../../utils/copilotEngine';
import styles from './EngagementCopilot.module.css';

const SUGGESTED_QUESTIONS = [
  { label: 'Blocked Projects', query: 'What projects are blocked?' },
  { label: 'High Risk', query: 'Which engagement is most at risk?' },
  { label: 'Team Workload', query: 'Who has the highest workload?' },
  { label: 'Near Completion', query: 'Which projects are near completion?' },
  { label: 'Needs Attention', query: 'What needs attention this week?' },
];

const formatContent = (text) =>
  text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  );

export default function EngagementCopilot({ engagements }) {
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
          <img src="/301104_301104_joule_gradient.svg" alt="Joule" className={styles.jouleIcon} />
          <div className={styles.copilotTitleGroup}>
            <h2>Joule Work</h2>
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
                <img src="/301104_da-2_white.png" alt="Joule" style={{ width: 30, height: 30, objectFit: 'contain' }} />
              </div>
              <h3>How can I help you today?</h3>
              <p>Ask Joule about your engagements, risks, workload, or portfolio status.</p>
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
                    <img src="/301104_da-2_white.png" alt="Joule" style={{ width: 14, height: 14, objectFit: 'contain' }} />
                  </div>
                  <div className={styles.assistantBubble}>{formatContent(msg.content)}</div>
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className={styles.message}>
              <div className={styles.assistantMessage}>
                <div className={styles.assistantAvatar}>
                  <img src="/301104_da-2_white.png" alt="Joule" style={{ width: 14, height: 14, objectFit: 'contain' }} />
                </div>
          <div className={styles.assistantBubble}>Joule is analyzing portfolio data...</div>
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
