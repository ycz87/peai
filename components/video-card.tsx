"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Clock } from "lucide-react"
import type { VideoCardProps } from "@/types"

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/videos/power-electronics/${video.id}`} className="block group">
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-105">
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
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-white/90 rounded-full p-3">
              <Play className="w-6 h-6 text-gray-800" />
            </div>
          </div>
          
          {/* 时长标签 */}
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {video.duration}
          </div>
        </div>
        
        <CardContent className="p-4">
          <h3 className="font-semibold text-sm leading-tight text-foreground group-hover:text-blue-600 transition-colors duration-200">
            {video.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-2">
            B站视频 · {video.bvid}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}