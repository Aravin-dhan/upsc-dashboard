'use client';

import ChatBot from '@/components/ai/ChatBot';

export default function AIAssistantPage() {
  return (
    <div className="h-full max-w-6xl mx-auto">
      <div className="h-full min-h-[calc(100vh-8rem)]">
        <ChatBot />
      </div>
    </div>
  );
}
