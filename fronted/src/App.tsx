import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

/**
 * 受保护路由组件
 * 如果用户未登录，访问此路由将重定向到 /login
 */
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/**
 * 访客路由组件
 * 如果用户已登录，访问登录/注册页将直接跳回首页
 */
const GuestRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

function AppContent() {
  return (
    <MainLayout>
      <Routes>
        {/* 1. 首页：所有人可访问，但内部功能可根据 Auth 状态微调 */}
        <Route path="/" element={<Home />} />

        {/* 2. 访客路由：已登录用户不可再访问登录/注册页 */}
        <Route 
          path="/login" 
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          } 
        />

        {/* 3. 未来扩展：如果你有“个人中心”或“历史记录”页面，可以使用 ProtectedRoute */}
        {/* <Route 
          path="/history" 
          element={
            <ProtectedRoute>
              <HistoryPage />
            </ProtectedRoute>
          } 
        /> 
        */}

        {/* 4. 404 兜底：捕获所有不存在的路径，重定向到首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

function App() {
  return (
    <Router>
      {/* AuthProvider 必须包裹在 Router 内部，因为它使用了 useNavigate */}
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;