"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { memo, useMemo } from "react"
import type { VideoPartButtonProps } from "@/types"

export const VideoPartButton = memo(function VideoPartButton({ 
  part, 
  videoId, 
  isActive = false, 
  onClick 
}: VideoPartButtonProps) {
  // Memoize the href to avoid recreating on every render
  const href = useMemo(() => 
    `/videos/power-electronics/${videoId}?page=${part.page}`, 
    [videoId, part.page]
  )

  // Memoize the content to prevent unnecessary re-renders
  const content = useMemo(() => (
    <div
      className={cn(
        "group relative p-4 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden",
        isActive 
          ? "bg-gradient-to-r from-primary/10 to-purple-600/10 border-primary/30 shadow-sm" 
          : "bg-card hover:bg-accent/30 border-border/50 hover:border-border hover:shadow-sm"
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault()
          onClick()
        }
      }}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? "button" : undefined}
      aria-pressed={onClick && isActive ? true : undefined}
      aria-label={`观看第${part.page}部分: ${part.title}, 时长: ${part.duration}`}
    >
      {/* 激活状态指示器 */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-purple-600 rounded-r-full" />
      )}
      
      <div className="flex flex-col gap-3">
        {/* 标题行 */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold transition-colors",
              isActive 
                ? "bg-primary text-primary-foreground" 
                : "bg-accent text-muted-foreground group-hover:bg-accent/80 group-hover:text-foreground"
            )}
             aria-hidden="true"
            >
              P{part.page}
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md",
                isActive ? "bg-primary/20 text-primary" : "bg-accent/50 text-muted-foreground"
              )}
               aria-label={`时长: ${part.duration}`}
              >
                <Clock className="w-3 h-3" aria-hidden="true" />
                {part.duration}
              </div>
            </div>
          </div>
          
          {/* 播放状态指示器 */}
          {isActive && (
            <div className="flex items-center gap-1" aria-label="当前正在播放">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" aria-hidden="true" />
            </div>
          )}
        </div>
        
        {/* 课程标题 */}
        <div className="pl-11">
          <h3 className={cn(
            "text-sm font-medium leading-tight line-clamp-2 transition-colors",
            isActive ? "text-primary" : "text-foreground group-hover:text-foreground"
          )}>
            {part.title}
          </h3>
        </div>
      </div>
      
      {/* 悬停效果 */}
      {!isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
      )}
    </div>
  ), [part, isActive, onClick])

  // 如果提供了onClick，返回按钮，否则返回Link包装的按钮
  if (onClick) {
    return content
  }

  return (
    <Link 
      href={href}
      className="block"
    >
      {content}
    </Link>
  )
})