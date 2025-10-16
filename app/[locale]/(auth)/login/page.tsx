// 'use client';

// import { Button } from '@/components/ui/button';
// import { useSession } from '@/hooks/use-session';
// import i18n from '@/i18n';
// import { ArrowLeft, ArrowLeftFromLine, ArrowLeftIcon } from 'lucide-react';
// import Link from 'next/link';
// import { useState } from 'react';

// export default function LoginPage() {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);

//     const {user, session} = useSession();

//     if (user) {
//         window.location.href = "/"
//     }

//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');

//         try {
//             const res = await fetch(`/${i18n.language}/api/auth/login`, {
//                 method: 'POST',
//                 body: JSON.stringify({ email, password }),
//                 headers: { 'Content-Type': 'application/json' },
//             });

//             const data = await res.json();

//             if (!res.ok) {
//                 setError(data.error || 'Login failed');
//             } else {
//                 // Redirect to dashboard or home
//                 window.location.href = '/';
//             }
//         } catch (err) {
//             setError('Something went wrong. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center px-4">
//             <div className="max-w-md w-full border shadow-lg shadow-md rounded-xl p-8 space-y-6">
//                 <div className="relative flex items-center justify-center">
//                     <Link href="/" className="absolute left-3 flex items-center gap-1 text-white">
//                         <ArrowLeftIcon className="text-blue-500"/>
//                         <span className="text-blue-500">Home</span>
//                     </Link>

//                     <h1 className="text-2xl font-bold text-white">Bingo</h1>
//                 </div>

//                 <p className="text-sm text-white text-center">
//                     Enter your credentials to access the games
//                 </p>

//                 <form onSubmit={handleLogin} className="flex flex-col gap-4">
//                     <label className="flex flex-col text-white">
//                         <span className="mb-1 font-medium">Email</span>
//                         <input
//                             type="email"
//                             placeholder="you@example.com"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                             required
//                             className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                         />
//                     </label>

//                     <label className="flex flex-col text-white">
//                         <span className="mb-1 font-medium">Password</span>
//                         <input
//                             type="password"
//                             placeholder="••••••••"
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                             className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
//                         />
//                     </label>

//                     <Button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full py-3  text-white font-semibold rounded-lg disabled:opacity-50 transition cursor-pointer"
//                     >
//                         {loading ? 'Logging in…' : 'Login'}
//                     </Button>

//                     {error && (
//                         <p className="text-red-500 text-center text-sm mt-2">{error}</p>
//                     )}
//                 </form>

//                 <p className="text-sm text-white text-center">
//                     Don’t have an account?{' '}
//                     <a
//                         href="/signup"
//                         className="text-blue-600 hover:underline font-medium"
//                     >
//                         Sign up
//                     </a>
//                 </p>
                
//             </div>
//         </div>
//     );
// }




// ============================

// 'use client';

// import { Button } from '@/components/ui/button';
// import { useSession } from '@/hooks/use-session';
// import i18n from '@/i18n';
// import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
// import Link from 'next/link';
// import { useState } from 'react';

// export default function LoginPage() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false); // 👈 added
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const { user } = useSession();

//   if (user) {
//     window.location.href = '/';
//   }

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const res = await fetch(`/${i18n.language}/api/auth/login`, {
//         method: 'POST',
//         body: JSON.stringify({ email, password }),
//         headers: { 'Content-Type': 'application/json' },
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || 'Login failed');
//       } else {
//         window.location.href = '/';
//       }
//     } catch (err) {
//       setError('Something went wrong. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4">
//       <div className="max-w-md w-full border shadow-lg rounded-xl p-8 space-y-6 bg-slate-900">
//         <div className="relative flex items-center justify-center">
//           <Link href="/" className="absolute left-3 flex items-center gap-1 text-white">
//             <ArrowLeftIcon className="text-blue-500" />
//             <span className="text-blue-500">Home</span>
//           </Link>

//           <h1 className="text-2xl font-bold text-white">Bingo</h1>
//         </div>

//         <p className="text-sm text-white text-center">
//           Enter your credentials to access the games
//         </p>

//         <form onSubmit={handleLogin} className="flex flex-col gap-4">
//           {/* Email */}
//           <label className="flex flex-col text-white">
//             <span className="mb-1 font-medium">Email</span>
//             <input
//               type="email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-slate-800 text-white"
//             />
//           </label>

//           {/* Password with toggle */}
//           <label className="flex flex-col text-white relative">
//             <span className="mb-1 font-medium">Password</span>
//             <input
//               type={showPassword ? 'text' : 'password'}
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-slate-800 text-white pr-10"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword((prev) => !prev)}
//               className="absolute right-3 top-10 text-gray-400 hover:text-gray-200 transition"
//               aria-label={showPassword ? 'Hide password' : 'Show password'}
//             >
//               {showPassword ? (
//                 <EyeOffIcon className="h-5 w-5" />
//               ) : (
//                 <EyeIcon className="h-5 w-5" />
//               )}
//             </button>
//           </label>

//           <Button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 text-white font-semibold rounded-lg disabled:opacity-50 transition cursor-pointer"
//           >
//             {loading ? 'Logging in…' : 'Login'}
//           </Button>

//           {error && (
//             <p className="text-red-500 text-center text-sm mt-2">{error}</p>
//           )}
//         </form>

//         <p className="text-sm text-white text-center">
//           Don’t have an account?{' '}
//           <a
//             href="/signup"
//             className="text-blue-500 hover:underline font-medium"
//           >
//             Sign up
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }


// ============================================



'use client';

import { Button } from '@/components/ui/button';
import { useSession } from '@/hooks/use-session';
import i18n from '@/i18n';
import { ArrowLeftIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useSession();

  if (user) {
    window.location.href = '/';
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/${i18n.language}/api/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        window.location.href = '/';
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full border shadow-lg rounded-xl p-8 space-y-6 bg-slate-900">
        {/* Header */}
        <div className="relative flex items-center justify-center">
          <Link href="/" className="absolute left-3 flex items-center gap-1 text-white">
            <ArrowLeftIcon className="text-blue-500" />
            <span className="text-blue-500">Home</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Bingo</h1>
        </div>

        <p className="text-sm text-white text-center">
          Enter your credentials to access the games
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email */}
          <label className="flex flex-col text-white">
            <span className="mb-1 font-medium">Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-slate-800 text-white"
            />
          </label>

          {/* Password with toggle */}
          <label className="flex flex-col text-white relative">
            <span className="mb-1 font-medium">Password</span>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-slate-800 text-white pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-10 text-gray-400 hover:text-gray-200 transition"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
            </button>
          </label>

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white font-semibold rounded-lg disabled:opacity-50 transition cursor-pointer"
          >
            {loading ? 'Logging in…' : 'Login'}
          </Button>

          {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}
        </form>

        {/* Forgot Password Link */}
        <div className="text-center mt-2">
          <Link href="/forgot-password" className="text-blue-500 hover:underline text-sm">
            Forgot Password?
          </Link>
        </div>

        {/* Signup Link */}
        <p className="text-sm text-white text-center mt-2">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
