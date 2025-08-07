"use client"

import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BilibiliPlayer } from "@/components/bilibili-player"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
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

export default function VideoPlayerPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const videoId = params.videoId as string
  
  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
    }
  }, [session, status, router])

  // 根据ID找到对应的视频
  const video = powerElectronicsVideos.find(v => v.id === videoId)

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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
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
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* 返回按钮 */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              返回视频列表
            </Button>
          </div>

          {/* 视频播放器 */}
          <div className="mb-6">
            <BilibiliPlayer bvid={video.bvid} />
          </div>

          {/* 视频信息 */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">{video.title}</h1>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                时长: {video.duration}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                BV号: {video.bvid}
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                {video.description}
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}