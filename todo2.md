# B站视频分P功能实现计划

## 当前代码分析
- ✅ `VideoCard` 组件：基本视频卡片，链接到播放页面
- ✅ `BilibiliPlayer` 组件：已支持 `page` 参数（分P功能）
- ✅ 视频数据：存储在 `power-electronics-videos.json`
- ❌ **缺少分P数据结构和UI组件**

## 实现步骤

### 1. 数据结构扩展
- 扩展 `Video` 接口，添加 `parts` 字段（分P信息数组）
- 创建 `VideoPart` 接口定义分P数据结构
- 更新 `power-electronics-videos.json`，为每个视频添加分P数据
- 更新相关TypeScript类型定义

### 2. 视频卡片组件增强
- 修改 `VideoCard` 组件，在卡片底部添加分P按钮区域
- 实现分P按钮网格布局（如果分P较多则显示"更多"）
- 分P按钮直接链接到 `/videos/power-electronics/{videoId}?page={pageNum}`
- 优化样式和交互效果

### 3. 视频播放页面增强  
- 添加右侧分P选择边栏组件 `VideoPartsSidebar`
- 实现响应式布局：播放器+内容区域 + 右侧边栏
- 支持URL查询参数 `page` 来指定当前分P
- 实现分P切换时的播放器更新和URL同步

### 4. 新增组件和功能
- 创建 `VideoPartsSidebar` 组件显示分P列表
- 创建 `VideoPartButton` 组件用于分P按钮
- 实现分P切换的状态管理
- 添加分P导航功能（上一P/下一P）

## 技术实现细节

### 数据结构设计
```typescript
interface VideoPart {
  page: number
  title: string
  duration: string
}

interface Video {
  id: string
  title: string
  bvid: string
  cover: string
  duration: string
  description?: string
  parts: VideoPart[] // 新增分P数组
}
```

### URL参数处理
- 使用 Next.js 的 `useSearchParams` 获取 `page` 参数
- 默认播放第1个分P（page=1）
- 分P切换时更新URL：`router.push(..., { scroll: false })`

### 响应式布局
- 桌面端：播放器区域 + 右侧边栏（3:1布局）
- 移动端：播放器全宽 + 下方分P选择区域
- 使用 Tailwind CSS 响应式类实现

### 交互优化
- 分P按钮hover效果和当前分P高亮
- 视频卡片分P按钮限制显示（如超过6个显示"更多"）
- 支持键盘导航（可选功能）

**预期效果：**
- 视频列表页：每个卡片下方显示分P快速跳转按钮
- 视频播放页：右侧边栏显示所有分P，支持切换
- URL支持：`/videos/power-electronics/1?page=2` 直接播放第2个分P

## 实施任务清单

### 阶段一：数据结构和类型定义
- [x] 1. 扩展Video接口和创建VideoPart接口，添加分P数据结构
- [x] 2. 更新power-electronics-videos.json文件，为每个视频添加分P数据

### 阶段二：组件开发
- [x] 3. 创建VideoPartButton组件，用于分P按钮显示
- [x] 4. 修改VideoCard组件，在卡片底部添加分P按钮区域
- [x] 5. 创建VideoPartsSidebar组件，显示分P列表

### 阶段三：页面集成和功能实现
- [x] 6. 修改视频播放页面，添加右侧分P边栏和响应式布局
- [x] 7. 实现URL查询参数支持和分P切换功能

### 阶段四：测试和优化
- [ ] 8. 测试所有功能，确保分P切换和导航正常工作

## 注意事项
- 保持与现有UI风格一致
- 确保移动端适配良好
- 处理分P数据为空的边界情况
- 优化加载性能，避免不必要的重渲染