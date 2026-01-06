# Debugging Guide - Cloud Resource Management Dashboard

## 🚀 Quick Start

### 1. Start Development Server
```bash
npm run dev
```
The server will start at: **http://localhost:3000**

### 2. Access the Application
- **Main Dashboard**: http://localhost:3000
- **ECS Create Page**: http://localhost:3000/resources/ecs/create
- **ECS List Page**: http://localhost:3000/resources/ecs
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register

## 🔍 Common Issues & Solutions

### Issue 1: Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Issue 2: Module Not Found Errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue 3: TypeScript Errors
```bash
# Check for type errors
npm run type-check

# Fix auto-fixable issues
npm run lint -- --fix
```

### Issue 4: Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

## 🐛 Debugging Tools

### 1. Browser DevTools
- **Open**: Press `F12` or `Ctrl+Shift+I` (Linux/Windows) / `Cmd+Option+I` (Mac)
- **Console Tab**: Check for JavaScript errors
- **Network Tab**: Monitor API calls
- **React DevTools**: Install React DevTools extension for component inspection

### 2. Next.js Debug Mode
```bash
# Run with debug logging
NODE_OPTIONS='--inspect' npm run dev
```

### 3. Check Logs
- **Terminal**: Check the terminal where `npm run dev` is running
- **Browser Console**: Check for client-side errors
- **Network Tab**: Check API response status codes

## 📋 Debugging Checklist

### ✅ Before Debugging
- [ ] Dependencies installed (`npm install`)
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linting errors (`npm run lint`)
- [ ] Server is running (`npm run dev`)
- [ ] Browser console is open

### ✅ Common Checks
- [ ] Check browser console for errors
- [ ] Check Network tab for failed API calls
- [ ] Verify environment variables are set
- [ ] Check if backend services are running (if applicable)
- [ ] Clear browser cache and hard refresh (`Ctrl+Shift+R`)

## 🔧 Environment Variables

Create `.env.local` file (optional - defaults are in `next.config.js`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

## 📝 Key Files for Debugging

### ECS Form Issues
- **Form Engine**: `src/hooks/useFormEngine.ts`
- **ECS Form Hook**: `src/app/servers/create/hooks/useECSServerForm.ts`
- **Main Form Component**: `src/components/server-form/ECSServerForm.tsx`
- **Page**: `src/app/resources/ecs/create/page.tsx`

### Context Issues
- **Project Context**: `src/contexts/ProjectContext.tsx`
- **Identity Context**: `src/contexts/IdentityContext.tsx`
- **Providers**: `src/app/providers.tsx`

### API Issues
- **API Client**: `src/services/api.ts`
- **Auth API**: `src/services/authApi.ts`

## 🎯 Debugging Specific Features

### ECS Form Not Loading
1. Check browser console for errors
2. Verify `ProjectProvider` is wrapping the app (check `src/app/layout.tsx`)
3. Check if `useProject` hook is being called correctly
4. Verify form data structure matches expected types

### Form Validation Errors
1. Check `errors` object in form state
2. Verify validation rules in JSON schemas
3. Check field dependencies are correctly configured

### API Calls Failing
1. Check Network tab in DevTools
2. Verify API base URL is correct
3. Check CORS settings if calling external APIs
4. Verify authentication tokens if required

## 🛠️ Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run type-check       # Check TypeScript types

# Debugging
npm run dev -- --turbo   # Use Turbopack (faster)
npm run build -- --debug # Build with debug info
```

## 📚 Additional Resources

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **Tailwind CSS Docs**: https://tailwindcss.com/docs

## 🆘 Still Having Issues?

1. **Check the terminal output** for compilation errors
2. **Check browser console** for runtime errors
3. **Verify all dependencies** are installed
4. **Clear Next.js cache**: `rm -rf .next`
5. **Restart the dev server**

---

**Note**: The dev server is running in the background. Check your terminal for the actual URL and any error messages.

