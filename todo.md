# Auth.js + Auth0 Integration TODO

## Progress Tracker
完成一项请在对应的 `[ ]` 中添加 `x` 变成 `[x]`

## 1. Dependencies & Environment Setup
- [ ] Install `next-auth` (Auth.js v5) package
- [ ] Install Auth0 adapter for Auth.js
- [ ] Create `.env.local` file
- [ ] Add `AUTH_SECRET` environment variable
- [ ] Add `AUTH0_CLIENT_ID` environment variable
- [ ] Add `AUTH0_CLIENT_SECRET` environment variable
- [ ] Add `AUTH0_ISSUER_BASE_URL` environment variable
- [ ] Configure Auth0 application settings

## 2. Auth.js Configuration
- [ ] Create `auth.ts` configuration file
- [ ] Configure Auth0 provider
- [ ] Set up session callbacks
- [ ] Set up JWT callbacks
- [ ] Configure redirect URLs
- [ ] Set session strategy

## 3. API Routes
- [ ] Create `/api/auth/[...nextauth]/route.ts` file
- [ ] Set up Auth.js request handlers
- [ ] Configure sign-in endpoint
- [ ] Configure sign-out endpoint
- [ ] Configure callback handling

## 4. Middleware Protection
- [ ] Create `middleware.ts` file
- [ ] Protect `/dashboard` route
- [ ] Set up automatic redirect to `/login`
- [ ] Allow public access to home page
- [ ] Allow public access to `/login` page
- [ ] Configure matcher patterns

## 5. Session Provider Setup
- [ ] Import `SessionProvider` in root layout
- [ ] Wrap application with session provider
- [ ] Configure client-side session access
- [ ] Add session provider props

## 6. Login Form Updates
- [ ] Update login form component
- [ ] Remove email/password input fields
- [ ] Replace with Auth0 sign-in button
- [ ] Update social provider buttons
- [ ] Connect buttons to Auth.js sign-in
- [ ] Handle authentication loading states

## 7. Dashboard Protection
- [ ] Add session check in dashboard page
- [ ] Handle unauthenticated state
- [ ] Display user information from Auth0
- [ ] Update sidebar with user data
- [ ] Add loading states for session
- [ ] Handle session errors

## 8. Navigation Updates
- [ ] Update main page routing logic
- [ ] Redirect authenticated users to dashboard
- [ ] Add sign-out functionality
- [ ] Update nav-user component with session data
- [ ] Update app-sidebar with user info
- [ ] Handle authentication state changes

## 9. TypeScript Integration
- [ ] Add Auth.js type definitions
- [ ] Extend session interface for Auth0 data
- [ ] Update component prop types
- [ ] Add user interface definitions
- [ ] Fix any TypeScript errors
- [ ] Update import statements

## 10. Testing & Validation
- [ ] Test login flow
- [ ] Test logout flow
- [ ] Test protected route access
- [ ] Test redirect behavior
- [ ] Test session persistence
- [ ] Verify Auth0 integration
- [ ] Test error handling scenarios

---

## Notes
- 确保在 Auth0 控制台中正确配置回调 URL
- 测试所有功能在开发和生产环境中都能正常工作
- 检查所有环境变量是否正确设置
- 验证用户会话在页面刷新后是否保持