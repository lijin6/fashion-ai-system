import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 引入权限钩子

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuth(); // 获取全局登录状态
  const location = useLocation();
  const navigate = useNavigate();

  // 监听滚动
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 智能处理“开始识别”及锚点跳转
  const handleScrollTo = (id: string) => {
    if (location.pathname === '/') {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-slate-200/20 py-3' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Logo 部分 */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-200 group-hover:rotate-6 transition-all">
            F
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-800">FashionAI</span>
        </Link>
        
        {/* 中间菜单 */}
        <div className="hidden md:flex items-center space-x-10 text-[13px] font-bold uppercase tracking-widest">
          <button onClick={() => navigate('/')} className="text-slate-500 hover:text-blue-600 transition-colors">首页</button>
          <button onClick={() => handleScrollTo('model-info')} className="text-slate-500 hover:text-blue-600 transition-colors">技术原理</button>
          <button onClick={() => handleScrollTo('dataset')} className="text-slate-500 hover:text-blue-600 transition-colors">数据集</button>
        </div>

        {/* 右侧操作区 */}
        <div className="flex items-center space-x-5">
          {isAuthenticated ? (
            /* 已登录状态：显示用户昵称和登出按钮 */
            <div className="flex items-center space-x-4 bg-slate-100/50 px-4 py-1.5 rounded-full border border-slate-200/50">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white">
                  {user?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold text-slate-700">{user}</span>
              </div>
              <div className="w-[1px] h-3 bg-slate-300"></div>
              <button 
                onClick={logout}
                className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
              >
                退出
              </button>
            </div>
          ) : (
            /* 未登录状态：显示登录链接 */
            <Link 
              to="/login" 
              className="text-sm font-extrabold text-slate-600 hover:text-blue-600 px-2 transition-colors"
            >
              登录
            </Link>
          )}

          {/* 行动按钮 */}
          <button 
            onClick={() => handleScrollTo('predict')}
            className="bg-slate-900 text-white px-7 py-3 rounded-full text-sm font-bold hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-95 hover:-translate-y-0.5"
          >
            开始识别
          </button>
        </div>
      </div>
    </nav>
  );
};