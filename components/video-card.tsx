"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, memo, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Clock, ChevronDown, ChevronUp } from "lucide-react"
import { VideoPartButton } from "@/components/video-part-button"
import type { VideoCardProps } from "@/types"

export const VideoCard = memo(function VideoCard({ video }: VideoCardProps) {
  const [showAllParts, setShowAllParts] = useState(false)
  
  // Memoize visible parts calculation
  const { visibleParts, hasMoreParts } = useMemo(() => {
    const hasMore = video.parts.length > 4
    const visible = showAllParts ? video.parts : video.parts.slice(0, 4)
    return { visibleParts: visible, hasMoreParts: hasMore }
  }, [video.parts, showAllParts])

  // Memoize toggle handler
  const handleToggle = useMemo(() => {
    return (e: React.MouseEvent) => {
      e.preventDefault()
      setShowAllParts(!showAllParts)
    }
  }, [showAllParts])

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 p-0 gap-0"
          role="article"
          aria-label={`视频: ${video.title}`}>
      {/* 主视频卡片区域 */}
      <Link href={`/videos/power-electronics/${video.id}`} 
            className="block group"
            aria-label={`观看视频: ${video.title}, 时长: ${video.duration}`}>
        <div className="relative aspect-video bg-muted">
          {/* 视频封面 */}
          <Image
            src={video.cover}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* 播放按钮悬浮效果 */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
               aria-hidden="true">
            <div className="bg-white/90 rounded-full p-3">
              <Play className="w-6 h-6 text-gray-800" />
            </div>
          </div>
          
          {/* 时长标签 */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
               aria-label={`视频时长: ${video.duration}`}>
            <Clock className="w-3 h-3" aria-hidden="true" />
            <span>{video.duration}</span>
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm leading-tight text-foreground group-hover:text-blue-600 transition-colors duration-200">
            {video.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-2" aria-label={`B站视频ID: ${video.bvid}`}>
            B站视频 · {video.bvid}
          </p>
        </CardContent>
      </Link>

      {/* 分P按钮区域 */}
      {video.parts.length > 1 && (
        <CardContent className="pt-0 p-4 border-t bg-muted/20"
                     role="region"
                     aria-label="视频分部列表">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground">
                视频分P ({video.parts.length}个)
              </span>
              {hasMoreParts && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleToggle}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleToggle(e)
                    }
                  }}
                  className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
                  aria-expanded={showAllParts}
                  aria-label={showAllParts ? `收起视频分部列表` : `显示全部${video.parts.length}个视频分部`}
                >
                  {showAllParts ? (
                    <>
                      收起 <ChevronUp className="w-3 h-3 ml-1" />
                    </>
                  ) : (
                    <>
                      显示全部 <ChevronDown className="w-3 h-3 ml-1" />
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-1">
              {visibleParts.map((part) => (
                <VideoPartButton
                  key={part.page}
                  part={part}
                  videoId={video.id}
                />
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
})