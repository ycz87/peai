import { auth } from "@/auth"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"

export default async function Page() {
  const session = await auth()

  if (!session) {
    redirect("/login")
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
                  <BreadcrumbLink href="#">
                    PEAI Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Welcome Section */}
          <Card>
            <CardHeader>
              <CardTitle>Welcome back, {session.user?.name || 'User'}!</CardTitle>
              <CardDescription>
                You're signed in as {session.user?.email}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="h-12 w-12 rounded-full"
                  />
                )}
                <div>
                  <p className="text-sm text-muted-foreground">
                    User ID: {session.user?.id || 'N/A'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Session expires: {session.expires ? new Date(session.expires).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Grid */}
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Card className="aspect-video">
              <CardHeader>
                <CardTitle className="text-lg">AI Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Coming soon: Advanced AI-powered analytics and insights.
                </p>
              </CardContent>
            </Card>
            
            <Card className="aspect-video">
              <CardHeader>
                <CardTitle className="text-lg">Data Processing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Real-time data processing and transformation tools.
                </p>
              </CardContent>
            </Card>
            
            <Card className="aspect-video">
              <CardHeader>
                <CardTitle className="text-lg">Machine Learning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Deploy and manage your ML models with ease.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <Card className="min-h-[100vh] flex-1 md:min-h-min">
            <CardHeader>
              <CardTitle>Main Dashboard Content</CardTitle>
              <CardDescription>
                Your AI-powered workspace for data insights and analytics.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">
                    Welcome to your AI Dashboard
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start exploring your data and creating intelligent insights.
                  </p>
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent text-xl font-bold">
                    Powered by Auth0 & Auth.js
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
