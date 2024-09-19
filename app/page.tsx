'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef } from "react";

import { ScrollArea } from "@/components/ui/scroll-area";
import QKK from "@/components/QKK";
import { Message, ToolInvocation } from "ai";

export default function Chat() {

  const scrollToRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    scrollToRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxToolRoundtrips: 2,
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === 'showQKKModel') {
        return <QKK answer={toolCall.args} />
      }
    }
  });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  return (
    <div className="flex flex-col w-full max-w-lg py-24 mx-auto stretch h-screen">
      <ScrollArea className="h-[90vh]">
        <div className="space-y-4">
          {messages.map((m: Message) => (
            <div key={m.id} className="whitespace-pre-wrap">
              <div>
                <div className="font-bold">{m.role}</div>
                {m.content.length > 0 ? (
                  m.content
                ) : (
                  <span className="italic font-light">
                    {'calling tool: ' + m?.toolInvocations?.[0].toolName}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div ref={scrollToRef} />
      </ScrollArea>

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />


      </form>

    </div>
  );
}
