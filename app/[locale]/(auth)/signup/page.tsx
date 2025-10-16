// "use client";

// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { signupSchema, SignupFormData } from "@/lib/validation/signup-validation";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { supabaseBrowser } from "@/lib/supabase/client";
// import { ArrowLeftIcon, CalendarIcon } from "lucide-react";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import Link from "next/link";

// const supabase = supabaseBrowser();

// const calculatePasswordStrength = (password: string) => {
//   let score = 0;
//   if (password.length >= 8) score += 1;
//   if (/[A-Z]/.test(password)) score += 1;
//   if (/[0-9]/.test(password)) score += 1;
//   if (/[^A-Za-z0-9]/.test(password)) score += 1;
//   return score;
// };

// export default function SignupForm() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [passwordStrength, setPasswordStrength] = useState(0);
//   const [emailError] = useState("");
//   const [emailAvailable] = useState(true);
//   const [nicknameAvailable] = useState(true);

//   const { register, handleSubmit, watch, control, formState: { errors } } = useForm<SignupFormData>({
//     resolver: zodResolver(signupSchema),
//     mode: "onChange",
//   });

//   const passwordValue = watch("password", "");
//   const emailValue = watch("email", "");
//   const nicknameValue = watch("nickName", "");

//   useEffect(() => {
//     setPasswordStrength(calculatePasswordStrength(passwordValue));
//   }, [passwordValue]);

//   const onSubmit = async (data: SignupFormData) => {
//     if (!emailAvailable || !nicknameAvailable) {
//       setError("Email or nickname is already taken");
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       const payload = {
//         ...data,
//         dateOfBirth: data.dateOfBirth.toISOString().split("T")[0], // YYYY-MM-DD for API
//       };

//       const res = await fetch("/api/auth/signup", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.message || "Signup failed");

//       router.push("/");
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const passwordStrengthColor = ["bg-red-500", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-500"][passwordStrength] || "bg-red-500";

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow-lg">
//       <div className="relative flex items-center justify-center">
//                     <Link href="/" className="absolute left-3 flex items-center gap-1 text-white ">
//                         <ArrowLeftIcon className="text-blue-500"/>
//                         <span className="text-blue-500">Home</span>
//                     </Link>

//                     <h1 className="text-2xl font-bold text-white">Signup</h1>
//                 </div>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         {(["firstName", "lastName", "nickName", "dateOfBirth", "phone", "email", "password"] as (keyof SignupFormData)[])
//           .map((field) => (
//             <div key={field}>
//               <label className="block font-medium capitalize mb-1">{field}</label>

//               {field === "dateOfBirth" ? (
//                 <Controller
//                   name="dateOfBirth"
//                   control={control}
//                   render={({ field }) => (
//                     <Popover>
//                       <PopoverTrigger asChild>
//                         <Button
//                           variant="outline"
//                           className={[
//                             "w-full justify-start text-left font-normal",
//                             !field.value ? "text-muted-foreground" : "",
//                             errors.dateOfBirth ? "border-red-500" : "",
//                           ].filter(Boolean).join(" ")}
//                         >
//                           <CalendarIcon className="mr-2 h-4 w-4" />
//                           {field.value instanceof Date ? field.value.toDateString() : "Pick a date"}
//                         </Button>
//                       </PopoverTrigger>

//                       <PopoverContent className="w-auto p-0" align="start">
//                         <Calendar
//                           mode="single"
//                           selected={field.value instanceof Date ? field.value : undefined}
//                           onSelect={(date: Date | undefined) => {
//                             if (date) field.onChange(date); // type-safe
//                           }}
//                           fromYear={1900}
//                           toYear={new Date().getFullYear()}
//                           captionLayout="dropdown"
//                         />
//                       </PopoverContent>
//                     </Popover>
//                   )}
//                 />
//               ) : (
//                 <input
//                   type={field === "password" ? "password" : "text"}
//                   {...register(field)}
//                   className={`w-full p-2 border rounded focus:ring focus:ring-blue-400 focus:outline-none ${errors[field] ? "border-red-500" : ""}`}
//                 />
//               )}

//               {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]?.message}</p>}

//               {field === "email" && !emailAvailable && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
//               {field === "nickName" && !nicknameAvailable && <p className="text-red-500 text-sm mt-1">Nickname is already taken</p>}

//               {field === "password" && passwordValue && (
//                 <div className="mt-1 h-2 w-full bg-gray-200 rounded">
//                   <div
//                     className={`h-2 rounded ${passwordStrengthColor}`}
//                     style={{ width: `${(passwordStrength / 4) * 100}%` }}
//                   />
//                 </div>
//               )}
//             </div>
//           ))}

//         {error && <p className="text-red-500 text-center">{error}</p>}

//         <Button
//           type="submit"
//           disabled={loading || !emailAvailable || !nicknameAvailable}
//           className="w-full text-white p-3 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
//         >
//           {loading ? "Signing up..." : "Sign Up"}
//         </Button>

//         <p className="text-sm text-white text-center">
//           Have an account?{" "}
//           <a href="/login" className="text-blue-600 hover:underline font-medium">
//             Login
//           </a>
//         </p>
//       </form>
//     </div>
//   );
// }


"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "@/lib/validation/signup-validation";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
import { ArrowLeftIcon, CalendarIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import Link from "next/link";

const supabase = supabaseBrowser();

const calculatePasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
};

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailError] = useState("");
  const [emailAvailable] = useState(true);
  const [nicknameAvailable] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // 👁️ added

  const { register, handleSubmit, watch, control, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password", "");
  const emailValue = watch("email", "");
  const nicknameValue = watch("nickName", "");

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(passwordValue));
  }, [passwordValue]);

  const onSubmit = async (data: SignupFormData) => {
    if (!emailAvailable || !nicknameAvailable) {
      setError("Email or nickname is already taken");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...data,
        dateOfBirth: data.dateOfBirth.toISOString().split("T")[0], // YYYY-MM-DD
      };

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Signup failed");

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const passwordStrengthColor =
    ["bg-red-500", "bg-red-500", "bg-orange-400", "bg-yellow-400", "bg-green-500"][passwordStrength] ||
    "bg-red-500";

  return (
    <div className="max-w-md mx-auto mb-10 mt-4 p-6 border rounded shadow-lg bg-slate-900">
      <div className="relative flex items-center justify-center">
        <Link href="/" className="absolute left-3 flex items-center gap-1 text-white">
          <ArrowLeftIcon className="text-blue-500" />
          <span className="text-blue-500">Home</span>
        </Link>

        <h1 className="text-2xl font-bold text-white">Signup</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-white">
        {(["firstName", "lastName", "nickName", "dateOfBirth", "phone", "email", "password"] as (keyof SignupFormData)[]).map((field) => (
          <div key={field} className="relative">
            <label className="block font-medium capitalize mb-1">{field}</label>

            {field === "dateOfBirth" ? (
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={[
                          "w-full justify-start text-left font-normal",
                          !field.value ? "text-muted-foreground" : "",
                          errors.dateOfBirth ? "border-red-500" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value instanceof Date ? field.value.toDateString() : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value instanceof Date ? field.value : undefined}
                        onSelect={(date: Date | undefined) => {
                          if (date) field.onChange(date);
                        }}
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            ) : field === "password" ? (
              <>
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`w-full p-2 pr-10 border rounded focus:ring focus:ring-blue-400 focus:outline-none ${
                    errors.password ? "border-red-500" : ""
                  } bg-slate-800 text-white`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-200 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </>
            ) : (
              <input
                type={field === "email" ? "email" : "text"}
                {...register(field)}
                className={`w-full p-2 border rounded focus:ring focus:ring-blue-400 focus:outline-none ${
                  errors[field] ? "border-red-500" : ""
                } bg-slate-800 text-white`}
              />
            )}

            {errors[field] && (
              <p className="text-red-500 text-sm mt-1">{errors[field]?.message}</p>
            )}

            {field === "email" && !emailAvailable && (
              <p className="text-red-500 text-sm mt-1">{emailError}</p>
            )}
            {field === "nickName" && !nicknameAvailable && (
              <p className="text-red-500 text-sm mt-1">Nickname is already taken</p>
            )}

            {field === "password" && passwordValue && (
              <div className="mt-1 h-2 w-full bg-gray-200 rounded">
                <div
                  className={`h-2 rounded ${passwordStrengthColor}`}
                  style={{ width: `${(passwordStrength / 4) * 100}%` }}
                />
              </div>
            )}
          </div>
        ))}

        {error && <p className="text-red-500 text-center">{error}</p>}

        <Button
          type="submit"
          disabled={loading || !emailAvailable || !nicknameAvailable}
          className="w-full text-white p-3 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </Button>

        <p className="text-sm text-white text-center">
          Have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline font-medium">
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
