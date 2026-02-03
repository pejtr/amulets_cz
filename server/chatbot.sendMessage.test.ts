import { describe, it, expect, beforeAll } from 'vitest';
import { createChatbotSession, addChatbotMessage, getChatbotMessagesBySession, getAllChatbotVariants } from './db';

describe('Chatbot sendMessage - Message Saving', () => {
  let testSessionId: number;
  let testVariantId: number;

  beforeAll(async () => {
    // Get first variant
    const variants = await getAllChatbotVariants();
    testVariantId = variants[0].id;

    // Create test session
    const session = await createChatbotSession({
      sessionId: `test_session_${Date.now()}`,
      visitorId: `test_visitor_${Date.now()}`,
      variantId: testVariantId,
      sourcePage: '/test',
      referrer: 'test',
      device: 'desktop',
      browser: 'chrome',
    });

    if (session && 'id' in session) {
      testSessionId = session.id;
    } else {
      throw new Error('Failed to create test session');
    }
  });

  it('should save user message to database', async () => {
    // Save user message
    const result = await addChatbotMessage({
      sessionId: testSessionId,
      variantId: testVariantId,
      role: 'user',
      content: 'Test user message',
    });

    expect(result).toBeTruthy();
  });

  it('should save assistant response to database', async () => {
    // Save assistant response
    const result = await addChatbotMessage({
      sessionId: testSessionId,
      variantId: testVariantId,
      role: 'assistant',
      content: 'Test assistant response',
    });

    expect(result).toBeTruthy();
  });

  it('should retrieve saved messages from database', async () => {
    // Add a few more messages
    await addChatbotMessage({
      sessionId: testSessionId,
      variantId: testVariantId,
      role: 'user',
      content: 'Another user message',
    });

    await addChatbotMessage({
      sessionId: testSessionId,
      variantId: testVariantId,
      role: 'assistant',
      content: 'Another assistant response',
    });

    // Retrieve messages
    const messages = await getChatbotMessagesBySession(testSessionId);
    
    expect(messages).toBeTruthy();
    expect(messages.length).toBeGreaterThanOrEqual(4); // At least 4 messages (2 from previous tests + 2 new)
    
    // Check message structure
    const firstMessage = messages[0];
    expect(firstMessage).toHaveProperty('sessionId');
    expect(firstMessage).toHaveProperty('role');
    expect(firstMessage).toHaveProperty('content');
    expect(firstMessage.sessionId).toBe(testSessionId);
  });

  it('should count messages correctly for analytics', async () => {
    // Create new session for clean count
    const newSession = await createChatbotSession({
      sessionId: `test_count_session_${Date.now()}`,
      visitorId: `test_visitor_${Date.now()}`,
      variantId: testVariantId,
      sourcePage: '/test',
      referrer: 'test',
      device: 'desktop',
      browser: 'chrome',
    });

    const newSessionId = newSession && 'id' in newSession ? newSession.id : 0;

    // Add 3 user messages and 3 assistant responses
    for (let i = 0; i < 3; i++) {
      await addChatbotMessage({
        sessionId: newSessionId,
        variantId: testVariantId,
        role: 'user',
        content: `User message ${i + 1}`,
      });

      await addChatbotMessage({
        sessionId: newSessionId,
        variantId: testVariantId,
        role: 'assistant',
        content: `Assistant response ${i + 1}`,
      });
    }

    // Retrieve and count
    const messages = await getChatbotMessagesBySession(newSessionId);
    expect(messages.length).toBe(6); // 3 user + 3 assistant
    
    // Count by role
    const userMessages = messages.filter(m => m.role === 'user');
    const assistantMessages = messages.filter(m => m.role === 'assistant');
    
    expect(userMessages.length).toBe(3);
    expect(assistantMessages.length).toBe(3);
  });
});
