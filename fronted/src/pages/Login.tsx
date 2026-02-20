import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // 使用 Context 中的 login 方法保存 Token 和用户名
        login(data.access_token, data.username);
      } else {
        setError(data.detail || '登录失败，请检查账号密码');
      }
    } catch (err) {
      setError('无法连接到服务器，请检查后端是否开启');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-16">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 p-10 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">欢迎回来</h2>
              <p className="text-slate-500 mt-2 font-medium">请登录您的 FashionAI 账号</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 animate-shake">
                ⚠️ {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                  邮箱地址
                </label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 placeholder:text-slate-300" 
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2 ml-1">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">
                    密码
                  </label>
                  <button type="button" className="text-xs font-bold text-blue-600 hover:text-blue-700">忘记密码?</button>
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none text-slate-800 placeholder:text-slate-300" 
                  placeholder="••••••••"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all active:scale-[0.98] mt-4 disabled:bg-slate-400"
              >
                {loading ? '正在验证...' : '登录'}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-50 text-center">
              <p className="text-slate-500 text-sm">
                还没有账号? 
                <Link to="/register" className="text-blue-600 font-bold ml-2 hover:underline">
                  立即创建
                </Link>
              </p>
            </div>
          </div>
        </div>
        <p className="text-center text-slate-400 text-xs mt-8">
          登录即表示您同意我们的 <button className="underline">服务协议</button> 和 <button className="underline">隐私政策</button>
        </p>
      </div>
    </div>
  );
};

export default Login;