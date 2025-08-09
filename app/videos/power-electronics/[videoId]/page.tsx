"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect, useState, useCallback, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { BilibiliPlayer } from "@/components/features/video-player/bilibili-player"
import { VideoPartsSidebar } from "@/components/features/video-player/video-parts-sidebar"
import { VideoPlayerErrorBoundary } from "@/components/features/video-player/video-player-error-boundary"
import { ArrowLeft, Clock, Calendar, Menu, X } from "lucide-react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import type { Video } from "@/types"
import powerElectronicsVideos from "@/data/power-electronics-videos.json"

/**
 * Type guard to validate if an object is a valid Video
 * @param obj - Object to validate
 * @returns true if obj is a valid Video
 */
function isValidVideo(obj: any): obj is Video {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.title === 'string' &&
    typeof obj.bvid === 'string' &&
    typeof obj.cover === 'string' &&
    typeof obj.duration === 'string' &&
    Array.isArray(obj.parts) &&
    obj.parts.every((part: any) => 
      typeof part.page === 'number' &&
      typeof part.title === 'string' &&
      typeof part.duration === 'string'
    )
  )
}

/**
 * Safely finds a video by ID with proper type checking
 * @param videoId - The video ID to search for
 * @returns The video if found and valid, undefined otherwise
 */
function findVideoById(videoId: string): Video | undefined {
  if (!videoId || typeof videoId !== 'string') {
    console.warn('Invalid video ID provided:', videoId)
    return undefined
  }

  try {
    const foundVideo = powerElectronicsVideos.find(v => v.id === videoId)
    if (!foundVideo) {
      console.warn('Video not found with ID:', videoId)
      return undefined
    }

    if (!isValidVideo(foundVideo)) {
      console.error('Found video has invalid structure:', foundVideo)
      return undefined
    }

    return foundVideo
  } catch (error) {
    console.error('Error finding video:', error)
    return undefined
  }
}

export default function VideoPlayerPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const isMobile = useIsMobile()
  const videoId = params.videoId as string
  
  // Memoize expensive calculations
  const pageFromUrl = useMemo(() => 
    parseInt(searchParams.get("page") || "1", 10), 
    [searchParams]
  )
  const [currentPage, setCurrentPage] = useState(pageFromUrl)
  const [showMobileSidebar, setShowMobileSidebar] = useState(false)
  
  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
    }
  }, [session, status, router])

  // 根据ID找到对应的视频 - 使用安全的类型检查
  const video = findVideoById(videoId)

  // Memoize the updateUrlWithPage callback to prevent unnecessary re-renders
  const updateUrlWithPage = useCallback((page: number) => {
    const url = new URL(window.location.href)
    if (page === 1) {
      url.searchParams.delete("page")
    } else {
      url.searchParams.set("page", page.toString())
    }
    router.replace(url.pathname + url.search, { scroll: false })
  }, [router])

  // 确保分P有效 - 添加额外的安全检查
  useEffect(() => {
    if (video?.parts && Array.isArray(video.parts) && video.parts.length > 0) {
      const validPage = Math.max(1, Math.min(pageFromUrl, video.parts.length))
      if (validPage !== pageFromUrl) {
        updateUrlWithPage(validPage)
      }
      setCurrentPage(validPage)
    } else if (video) {
      // 如果视频存在但没有有效的parts，设置默认值
      console.warn('Video found but has no valid parts:', video.id)
      setCurrentPage(1)
    }
  }, [video, pageFromUrl, updateUrlWithPage])

  // Memoize the handlePartSelect callback
  const handlePartSelect = useCallback((page: number) => {
    setCurrentPage(page)
    updateUrlWithPage(page)
    if (isMobile) {
      setShowMobileSidebar(false)
    }
  }, [isMobile, updateUrlWithPage])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return null
  }
  
  if (!video) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">视频不存在</h1>
              <Button onClick={() => router.back()}>返回</Button>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  }

  const currentPart = useMemo(() => {
    if (!video?.parts || !Array.isArray(video.parts) || video.parts.length === 0) {
      return null
    }
    return video.parts.find(part => part.page === currentPage) || video.parts[0]
  }, [video, currentPage])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb className="flex-1">
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">
                    PEAI Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">视频观看</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/videos/power-electronics">电力电子技术</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{video.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            {/* 移动端分P菜单按钮 */}
            {isMobile && video.parts.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileSidebar(true)}
                className="ml-2 bg-card hover:bg-accent/50 border-border/50 hover:border-border transition-all"
              >
                <Menu className="w-4 h-4 mr-2" />
                <div className="flex flex-col items-start text-xs">
                  <span>P{currentPage}</span>
                  <span className="text-muted-foreground">{video.parts.length}个部分</span>
                </div>
              </Button>
            )}
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
          {/* 主内容区域 - 现在占据全宽 */}
          <div className="flex-1 flex flex-col gap-8 p-6 overflow-y-auto">
            {/* 返回按钮 - 更精致的设计 */}
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                返回视频列表
              </Button>
              
              {/* 视频进度指示器 */}
              {video.parts.length > 1 && (
                <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-card rounded-full border shadow-sm">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-muted-foreground">第 {currentPage} 部分</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    共 {video.parts.length} 部分
                  </div>
                </div>
              )}
            </div>

            {/* 视频播放器和基本信息 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 左侧：视频播放器和描述 */}
              <div className="lg:col-span-2 space-y-6">
                {/* 播放器容器 - 增强视觉效果 */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-600/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur"></div>
                  <div className="relative bg-card rounded-lg overflow-hidden shadow-lg border">
                    <VideoPlayerErrorBoundary
                      onError={(error, errorInfo) => {
                        console.error('Video player error:', error, errorInfo)
                        // You could send this to an error tracking service
                      }}
                    >
                      <BilibiliPlayer 
                        bvid={video.bvid} 
                        page={currentPage}
                        autoplay={false}
                      />
                    </VideoPlayerErrorBoundary>
                  </div>
                </div>

                {/* 视频信息卡片 */}
                <div className="bg-card rounded-xl p-6 shadow-sm border space-y-6">
                  <div className="space-y-3">
                    <div>
                      <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
                        {video.title}
                      </h1>
                      {video.parts.length > 1 && currentPart && (
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <h2 className="text-sm font-medium text-primary">
                              P{currentPage}: {currentPart.title}
                            </h2>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* 元数据信息 - 更现代的布局 */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-3 py-2 bg-accent/50 rounded-lg">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">时长</span>
                      <span className="text-sm text-muted-foreground">{currentPart?.duration || video.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-accent/50 rounded-lg">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">BV号</span>
                      <span className="text-sm text-muted-foreground font-mono">{video.bvid}</span>
                    </div>
                    {video.parts.length > 1 && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-lg border border-primary/20">
                        <div className="w-4 h-4 flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                        </div>
                        <span className="text-sm font-medium text-primary">
                          第{currentPage}部分 / 共{video.parts.length}部分
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* 描述文本 - 改进排版 */}
                  <div className="pt-4 border-t border-border/50">
                    <h3 className="text-sm font-semibold text-foreground mb-3">课程介绍</h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-muted-foreground leading-relaxed text-base">
                        {video.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧：分P控制和列表（桌面端） */}
              {!isMobile && video.parts.length > 1 && (
                <div className="lg:col-span-1">
                  <div className="sticky top-6">
                    <VideoPartsSidebar
                      video={video}
                      currentPage={currentPage}
                      onPartSelect={handlePartSelect}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 移动端分P列表 */}
            {isMobile && video.parts.length > 1 && (
              <div className="mt-4">
                <VideoPartsSidebar
                  video={video}
                  currentPage={currentPage}
                  onPartSelect={handlePartSelect}
                />
              </div>
            )}
          </div>
        </div>

        {/* 移动端分P弹层 - 增强视觉效果 */}
        {isMobile && showMobileSidebar && (
          <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md">
            <div className="fixed right-0 top-0 h-full w-80 max-w-full bg-card border-l shadow-xl">
              <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-primary/5 to-purple-600/5">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">视频分P</h3>
                  <p className="text-sm text-muted-foreground mt-1">选择要观看的部分</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileSidebar(false)}
                  className="hover:bg-accent/50 rounded-full w-8 h-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="p-4 h-[calc(100vh-5rem)] overflow-y-auto">
                <VideoPartsSidebar
                  video={video}
                  currentPage={currentPage}
                  onPartSelect={handlePartSelect}
                />
              </div>
            </div>
          </div>
        )}
      </SidebarInset>
    </SidebarProvider>
  )
}