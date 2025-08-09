"use client"

import { auth } from "@/auth"
import { AppSidebar } from "@/components/layout/app-sidebar"
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
import { VideoCard } from "@/components/features/video-player/video-card"
import { redirect } from "next/navigation"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  TrendingUp,
  Zap,
  Award,
  PlayCircle
} from "lucide-react"
import type { Video } from "@/types"
import powerElectronicsVideos from "@/data/power-electronics-videos.json"

export default function PowerElectronicsVideosPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-muted-foreground">Loading course content...</span>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  // Calculate course statistics
  const totalVideos = powerElectronicsVideos.length
  const totalParts = powerElectronicsVideos.reduce((acc, video) => acc + video.parts.length, 0)
  const totalDuration = powerElectronicsVideos.reduce((acc, video) => {
    const [hours, minutes] = video.duration.split(':').map(Number)
    return acc + hours * 60 + minutes
  }, 0)
  const totalHours = Math.floor(totalDuration / 60)
  const totalMins = totalDuration % 60

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Enhanced Header with gradient background */}
        <header className="relative flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4 bg-blue-200"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard" className="text-blue-700 hover:text-blue-800 font-medium">
                    PEAI Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-blue-400" />
                <BreadcrumbItem>
                  <BreadcrumbLink href="#" className="text-blue-600 hover:text-blue-700">视频观看</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block text-blue-400" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-blue-800 font-semibold">电力电子技术</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col">
          {/* Hero Course Header Section */}
          <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5"></div>
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }}></div>
            </div>
            
            <div className="relative px-6 py-12 md:py-16">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center mb-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-full p-3 mr-4">
                    <Zap className="w-8 h-8" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="bg-yellow-400/90 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      专业课程
                    </span>
                    <span className="bg-white/10 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      高质量
                    </span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  电力电子技术
                  <span className="block text-xl md:text-2xl font-normal text-blue-100 mt-2">
                    Power Electronics Technology
                  </span>
                </h1>
                
                <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-3xl leading-relaxed">
                  深入学习电力电子技术的基础理论、器件特性和实际应用。从基础概念到实际工程应用，
                  掌握现代电力电子系统设计的核心技术。
                </p>

                {/* Course Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
                    <BookOpen className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                    <div className="text-2xl font-bold">{totalVideos}</div>
                    <div className="text-sm text-blue-200">章节视频</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
                    <PlayCircle className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                    <div className="text-2xl font-bold">{totalParts}</div>
                    <div className="text-sm text-blue-200">视频小节</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                    <div className="text-2xl font-bold">{totalHours}h {totalMins}m</div>
                    <div className="text-sm text-blue-200">总时长</div>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300">
                    <Users className="w-8 h-8 mx-auto mb-2 text-blue-200" />
                    <div className="text-2xl font-bold">1.2k+</div>
                    <div className="text-sm text-blue-200">学习人数</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Decorative bottom wave */}
            <div className="absolute bottom-0 left-0 right-0">
              <svg viewBox="0 0 1440 120" className="w-full h-8 fill-current text-background">
                <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,112C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
            </div>
          </div>

          {/* Course Content Section */}
          <div className="px-6 py-8 bg-gradient-to-b from-background to-gray-50/50">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">课程内容</h2>
                  <p className="text-muted-foreground">系统学习电力电子技术各个核心模块</p>
                </div>
                <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>推荐按顺序学习</span>
                </div>
              </div>

              {/* Enhanced Video Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {powerElectronicsVideos.map((video, index) => (
                  <div key={video.id} className="group">
                    {/* Chapter Number Badge */}
                    <div className="flex items-center mb-3">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full mr-3">
                        第 {index + 1} 章
                      </div>
                      <div className="h-px bg-gradient-to-r from-blue-200 to-transparent flex-1"></div>
                    </div>
                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}