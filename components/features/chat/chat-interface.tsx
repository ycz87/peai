"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Send, Bot, User, AlertCircle, RefreshCw, Copy, RotateCcw } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface ErrorState {
  hasError: boolean
  message: string
  canRetry: boolean
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是AI助手，很高兴为你服务。有什么问题可以问我？',
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ErrorState>({ hasError: false, message: '', canRetry: false })
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value)
    adjustTextareaHeight()
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [inputValue])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)
    setError({ hasError: false, message: '', canRetry: false })

    try {
      // 模拟API调用失败的情况（可以替换为实际的AI API调用）
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // 模拟偶发性网络错误
          if (Math.random() > 0.8) {
            reject(new Error('网络连接失败，请重试'))
          } else {
            resolve(null)
          }
        }, 1000)
      })

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `我收到了你的消息："${userMessage.content}"。这是一个模拟回复，实际使用时可以接入真实的AI服务。`,
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发送消息时出现错误'
      setError({ 
        hasError: true, 
        message: errorMessage, 
        canRetry: true 
      })
      
      // 移除用户消息，因为发送失败
      setMessages(prev => prev.slice(0, -1))
      setInputValue(userMessage.content) // 恢复输入内容
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetry = () => {
    if (error.canRetry && inputValue.trim()) {
      handleSendMessage()
    }
  }

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error('Failed to copy message:', err)
    }
  }

  const handleRegenerateMessage = async (messageIndex: number) => {
    if (messageIndex === 0 || isLoading) return
    
    const userMessage = messages[messageIndex - 1]
    if (userMessage.role !== 'user') return

    setIsLoading(true)
    setError({ hasError: false, message: '', canRetry: false })

    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          if (Math.random() > 0.8) {
            reject(new Error('重新生成失败，请重试'))
          } else {
            resolve(null)
          }
        }, 1000)
      })

      const newAiMessage: Message = {
        id: Date.now().toString(),
        content: `重新生成的回复：${userMessage.content}。这是一个不同的AI回复示例。`,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[messageIndex] = newAiMessage
        return newMessages
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '重新生成失败'
      setError({ 
        hasError: true, 
        message: errorMessage, 
        canRetry: false 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey || e.metaKey) {
        // Ctrl+Enter or Cmd+Enter: 发送消息
        e.preventDefault()
        handleSendMessage()
      } else if (!e.shiftKey) {
        // 单独Enter: 发送消息
        e.preventDefault()
        handleSendMessage()
      }
      // Shift+Enter: 允许换行，不阻止默认行为
    }
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* 消息列表 */}
      <div 
        className="flex-1 overflow-y-auto px-3 sm:px-4 py-2 space-y-3 sm:space-y-4"
        role="log"
        aria-live="polite"
        aria-label="聊天对话记录"
        tabIndex={0}
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
            role="article"
            aria-label={`${message.role === 'user' ? '用户' : 'AI助手'}消息`}
            tabIndex={0}
            onMouseEnter={() => setHoveredMessageId(message.id)}
            onMouseLeave={() => setHoveredMessageId(null)}
          >
            <Avatar className="w-8 h-8 flex-shrink-0">
              <div className="w-full h-full flex items-center justify-center bg-muted">
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
            </Avatar>
            <div className={`flex flex-col gap-1 flex-1 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
              <Card
                className={`max-w-[85%] sm:max-w-[80%] md:max-w-[75%] p-0 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <CardContent className="px-3 py-2">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
              
              {/* 消息操作按钮 */}
              <div className={`flex gap-1 mt-1 transition-opacity ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${hoveredMessageId === message.id ? 'opacity-100' : 'opacity-0'}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyMessage(message.content, message.id)}
                  className="h-6 px-2 text-xs"
                  aria-label="复制消息"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  {copiedMessageId === message.id ? '已复制' : '复制'}
                </Button>
                
                {message.role === 'assistant' && index > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRegenerateMessage(index)}
                    disabled={isLoading}
                    className="h-6 px-2 text-xs"
                    aria-label="重新生成回复"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" />
                    重新生成
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Bot className="w-4 h-4" />
              </div>
            </Avatar>
            <Card className="bg-muted p-0">
              <CardContent className="px-3 py-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* 错误状态显示 */}
        {error.hasError && (
          <div className="flex gap-3 items-center">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <div className="w-full h-full flex items-center justify-center bg-destructive/10">
                <AlertCircle className="w-4 h-4 text-destructive" />
              </div>
            </Avatar>
            <Card className="bg-destructive/10 border-destructive/20 p-0">
              <CardContent className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-destructive">{error.message}</p>
                  {error.canRetry && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRetry}
                      className="h-auto p-1 text-destructive hover:text-destructive/80"
                      aria-label="重试发送消息"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* 输入框 */}
      <div className="border-t p-3 sm:p-4 flex-shrink-0" role="form" aria-label="消息输入区域">
        <div className="flex gap-2 items-end">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="输入你的问题..."
            disabled={isLoading}
            className="flex-1 min-h-[44px] max-h-[120px] text-base sm:text-sm resize-none"
            aria-label="消息输入框"
            aria-describedby="input-help-text"
            rows={1}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            aria-label="发送消息"
            type="submit"
            className="min-h-[44px] min-w-[44px]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p id="input-help-text" className="text-xs text-muted-foreground mt-2 hidden sm:block">
          按 Enter 发送消息，Shift + Enter 换行，Ctrl + Enter 也可发送
        </p>
      </div>
    </div>
  )
}