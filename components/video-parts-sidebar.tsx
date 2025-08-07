"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VideoPartButton } from "@/components/video-part-button"
import { ChevronLeft, ChevronRight, List } from "lucide-react"
import type { VideoPartsSidebarProps } from "@/types"

export function VideoPartsSidebar({ 
  video, 
  currentPage, 
  onPartSelect 
}: VideoPartsSidebarProps) {
  const currentPartIndex = video.parts.findIndex(part => part.page === currentPage)
  const hasPreviousPart = currentPartIndex > 0
  const hasNextPart = currentPartIndex < video.parts.length - 1

  const handlePreviousPart = () => {
    if (hasPreviousPart) {
      onPartSelect(video.parts[currentPartIndex - 1].page)
    }
  }

  const handleNextPart = () => {
    if (hasNextPart) {
      onPartSelect(video.parts[currentPartIndex + 1].page)
    }
  }

  return (
    <div className="space-y-6">
      {/* 视频信息卡片 - 更现代的设计 */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/5 to-purple-600/5 p-6 border-b">
          <CardTitle className="text-lg font-bold leading-tight mb-3">{video.title}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1 px-2 py-1 bg-background/50 rounded-md">
              <span className="font-mono text-xs">{video.bvid}</span>
            </div>
          </div>
          {video.description && (
            <p className="text-sm text-muted-foreground leading-relaxed mt-3 line-clamp-3">
              {video.description}
            </p>
          )}
        </div>
      </Card>

      {/* 分P控制和列表 */}
      <Card className="flex-1 overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-base flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-primary/10 rounded-md">
                <List className="w-4 h-4 text-primary" />
              </div>
              <span>课程目录</span>
            </div>
            <div className="text-xs text-muted-foreground bg-accent/50 px-2 py-1 rounded-full">
              {video.parts.length}个部分
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 分P导航控制 - 增强视觉效果 */}
          <div className="flex items-center justify-between gap-3 p-4 bg-gradient-to-r from-accent/30 to-accent/50 rounded-xl border">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPart}
              disabled={!hasPreviousPart}
              className="flex-1 bg-background/50 hover:bg-background/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              上一部分
            </Button>
            
            <div className="flex flex-col items-center gap-1 px-4">
              <span className="text-xs text-muted-foreground font-medium">当前进度</span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-bold text-primary">{currentPage}</span>
                <span className="text-xs text-muted-foreground">/</span>
                <span className="text-sm font-medium text-muted-foreground">{video.parts.length}</span>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPart}
              disabled={!hasNextPart}
              className="flex-1 bg-background/50 hover:bg-background/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              下一部分
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* 进度条 */}
          <div className="px-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>学习进度</span>
              <span>{Math.round((currentPage / video.parts.length) * 100)}%</span>
            </div>
            <div className="w-full bg-accent/30 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentPage / video.parts.length) * 100}%` }}
              />
            </div>
          </div>

          {/* 分P列表 - 增强滚动区域 */}
          <div className="relative">
            <div className="h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-accent/50 scrollbar-track-transparent hover:scrollbar-thumb-accent/70">
              <div className="space-y-2 pr-2">
                {video.parts.map((part, index) => (
                  <VideoPartButton
                    key={part.page}
                    part={part}
                    videoId={video.id}
                    isActive={part.page === currentPage}
                    onClick={() => onPartSelect(part.page)}
                  />
                ))}
              </div>
            </div>
            
            {/* 渐变遮罩效果 */}
            <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-card to-transparent pointer-events-none" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}