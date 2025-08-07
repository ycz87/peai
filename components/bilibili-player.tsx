"use client"

import { useState, useEffect } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import type { BilibiliPlayerProps } from "@/types"

export function BilibiliPlayer({ 
  bvid, 
  page = 1, 
  autoplay = false, 
  muted = true 
}: BilibiliPlayerProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // 构建B站播放器URL - 最简单的参数避免权限问题
  const playerUrl = `https://player.bilibili.com/player.html?bvid=${bvid}&page=${page}&as_wide=1&high_quality=1&danmaku=0${autoplay ? '&autoplay=1' : ''}${muted ? '&muted=1' : ''}`
  //const playerUrl = `https://www.bilibili.com/blackboard/newplayer.html?bvid=${bvid}`

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  useEffect(() => {
    setIsLoading(true)
    setHasError(false)
  }, [bvid])

  if (hasError) {
    return (
      <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
        <div className="text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto" />
          <p className="text-sm text-muted-foreground">视频加载失败</p>
          <button 
            onClick={() => {
              setIsLoading(true)
              setHasError(false)
            }}
            className="text-xs text-blue-600 hover:underline"
          >
            重新加载
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center z-10">
          <div className="text-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mx-auto" />
            <p className="text-sm text-muted-foreground">加载视频中...</p>
          </div>
        </div>
      )}
      <iframe
        src={playerUrl}
        className="w-full h-full border-0"
        allowFullScreen
        onLoad={handleLoad}
        onError={handleError}
        title={`Bilibili Video ${bvid}`}
      />
    </div>
  )
}