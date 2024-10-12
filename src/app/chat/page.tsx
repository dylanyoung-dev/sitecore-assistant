'use client';

import { CodeBlock } from '@/components/CodeBlock/CodeBlock';
import { Button } from '@/components/ui/button';
import { useChat } from 'ai/react';
import { ArrowUpRight, Brain, ChevronRight, CircleUser, Code, Loader, PanelRightClose } from 'lucide-react';
import { FC, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatPageProps {}

const ChatPage: FC<ChatPageProps> = () => {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const triggerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowWelcome(false);
    handleSubmit();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      triggerSubmit(event as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const toggleEditor = () => {
    setIsEditorOpen(!isEditorOpen);
  };

  return (
    <div className="chat-container p-4 flex h-screen relative">
      <div className={`messages-container ${isEditorOpen ? 'w-2/3' : 'w-full'} flex-col items-center flex`}>
        {showWelcome && (
          <div
            className={`welcome-box w-full max-w-4xl mb-4 p-10 rounded-lg bg-gray-100 transition-opacity duration-500`}
          >
            <h1 className="text-xl font-bold mb-4">Welcome to the Sitecore Assistant Chat</h1>
            <p className="text-md">
              This chat is designed to assist you with creating Sitecore assets in the Sitecore SaaS products. Whether
              you have questions, need guidance, or want to start a conversation, feel free to reach out. Our chat is
              powered by advanced AI to provide you with the best possible support.
            </p>
          </div>
        )}

        <div className="messages w-full flex-grow max-w-2xl mb-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className="relative w-full mb-4">
              <div className="border absolute top-0 left-0 p-2 rounded-md">
                {msg.role === 'user' ? (
                  <CircleUser className="h-6 w-6 text-gray-500" />
                ) : (
                  <Brain className="h-6 w-6 text-green-500" />
                )}
              </div>
              <div className="message bg-gray-100 p-4 rounded-lg border ml-16">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ node, ...props }) => <table className="my-2 border border-gray-300" {...props} />,
                    thead: ({ node, ...props }) => <thead {...props} />,
                    tbody: ({ node, ...props }) => <tbody {...props} />,
                    tr: ({ node, ...props }) => <tr {...props}>{props.children}</tr>,
                    th: ({ node, ...props }) => <th {...props} />,
                    td: ({ node, ...props }) => <td {...props} />,
                    code: ({ node, ...props }) => {
                      const language = props.className?.replace('language-', '') || '';
                      return !(props as any).inline ? (
                        <div className="my-4">
                          <CodeBlock code={String(props.children).trim()} language={language} />
                        </div>
                      ) : (
                        <code className="bg-gray-100 p-1 rounded-md">{props.children}</code>
                      );
                    },
                    ol: ({ children }) => <ol className="pl-4 list-disc my-4">{children}</ol>,
                    ul: ({ children }) => <ul className="pl-4 my-4">{children}</ul>,
                    li: ({ children }) => <li className="mb-2 ml-4">{children}</li>,
                    p: ({ children }) => <p>{children}</p>,
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {error && <div className="bg-red-100 p-2 rounded-lg border text-red-700">{error.message}</div>}
        </div>

        <form
          onSubmit={handleSubmit}
          className="chat-form w-full max-w-4xl sticky bottom-0 bg-gray-100 p-4 rounded-lg border"
        >
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="chat-input w-full p-2 rounded mb-2 h-50 border-none bg-gray-100 resize-none focus:outline-none"
            placeholder="Ask the Sitecore Assistant to help you create assets in Sitecore..."
          ></textarea>
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <Button
                className="flex items-center p-2 rounded-lg bg-gray-100 border text-gray-700 hover:bg-gray-200"
                onClick={() => {
                  handleInputChange({
                    target: { value: 'Create a personalized experience' },
                  } as React.ChangeEvent<HTMLTextAreaElement>);
                  triggerSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
                }}
              >
                Create a personalize experience <ArrowUpRight className="h-4 w-4 mr-1" />
              </Button>
              <Button
                className="flex items-center p-2 rounded-lg bg-gray-100 border text-gray-700 hover:bg-gray-200"
                onClick={() => {
                  handleInputChange({
                    target: { value: 'Create content in XM Cloud' },
                  } as React.ChangeEvent<HTMLTextAreaElement>);
                  triggerSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
                }}
              >
                Create content in XM Cloud <ArrowUpRight className="h-4 w-4 mr-1" />
              </Button>
              <Button
                className="flex items-center p-2 rounded-lg bg-gray-100 border text-gray-700 hover:bg-gray-200"
                onClick={() => {
                  handleInputChange({
                    target: { value: 'Get a List of Experiences' },
                  } as React.ChangeEvent<HTMLTextAreaElement>);
                  triggerSubmit(new Event('submit') as unknown as React.FormEvent<HTMLFormElement>);
                }}
              >
                Get a List of Experiences <ArrowUpRight className="h-4 w-4 mr-1" />
              </Button>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className={`chat-submit p-2 rounded-lg border ${
                  isLoading ? 'bg-gray-300 text-gray-600' : 'bg-gray-700 text-white hover:bg-gray-600'
                }`}
                onClick={() => triggerSubmit}
                disabled={isLoading}
              >
                {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <ChevronRight className="h-4 w-4 " />}
              </button>
              <button
                type="button"
                onClick={toggleEditor}
                className="ml-1 p-2 rounded-lg border bg-gray-700 text-white"
              >
                <Code className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
      {isEditorOpen && (
        <div className="editor-view fixed top-0 right-0 h-full w-1/3 bg-white shadow-lg">
          <div className="p-4 relative h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-4">Editor View</h2>
              <textarea className="w-full h-96 p-2 border rounded"></textarea>
              <div className="flex justify-end">
                <Button className="mt-4 px-4 py-2 rounded-lg border bg-gray-700 text-white">Update</Button>
              </div>
            </div>
            <div className="flex justify-start">
              <Button onClick={toggleEditor} className="p-2 text-white bg-gray-700 border">
                <PanelRightClose className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;
