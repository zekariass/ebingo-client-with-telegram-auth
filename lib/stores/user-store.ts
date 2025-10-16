// import i18n from "@/i18n"
// import { UserProfile } from "../types"
// import { create } from "zustand"
// import { supabaseBrowser } from "../supabase/client";


// const supabase = supabaseBrowser();


// export interface UserState {
//     user: UserProfile | null
//     loading?: boolean
//     error?: string | null
//     setUser: (user: UserProfile | null) => void
//     resetUser: () => void
//     fetchUserProfile: () => Promise<UserProfile | null>
//     setLoading?: (loading: boolean) => void
//     setError?: (error: string | null) => void

//     // Password Reset Methods
//     changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
//     sendResetLink: (email: string) => Promise<{ success: boolean; error?: string }>;
//     resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;                    
//  }

// export const userStore = create<UserState>()(
//     (set, get) => ({
//     user: null,
//     setUser: (user) => set({ user }),
//     resetUser: () => set({ user: null }),
//     fetchUserProfile: async () => {
//         // If user is already set, return without fetching from db
//         if (get().user) return get().user
//         try {

//             set({ loading: true, error: null });
//             const response = await fetch(`/${i18n.language}/api/auth/me`);
//             if (!response.ok) {
//                 set({ loading: false, error: 'Failed to fetch user profile' });
//                 throw new Error('Failed to fetch user profile');
//             }
//             const result = await response.json();
//             const { data } = result;
//             set({ loading: false });
//             set({ user: data });
//             return data;
//         }
//         catch (error) {
//             set({ loading: false, error: error instanceof Error ? error.message : 'Unknown error' });
//             console.error('Error fetching user profile:', error);
//             return null;
//         }
//     },


//         // Change password (when logged in)
//     changePassword: async (currentPassword, newPassword) => {
//         set({ loading: true, error: null });
//         try {
//         const {
//             data: { user },
//             error: userError,
//         } = await supabase.auth.getUser();

//         if (userError || !user) {
//             return { success: false, error: 'Not authenticated' };
//         }

//         // Reauthenticate
//         const { error: signInError } = await supabase.auth.signInWithPassword({
//             email: user.email!,
//             password: currentPassword,
//         });
//         if (signInError) {
//             return { success: false, error: 'Incorrect current password' };
//         }

//         // Update password
//         const { error } = await supabase.auth.updateUser({ password: newPassword });
//         if (error) throw error;

//         return { success: true };
//         } catch (err: any) {
//         return { success: false, error: err.message || 'Unexpected error' };
//         } finally {
//         set({ loading: false });
//         }
//     },

//     // Forgot password (send email)
//     sendResetLink: async (email) => {
//         set({ loading: true, error: null });
//         try {
//         const { error } = await supabase.auth.resetPasswordForEmail(email, {
//             redirectTo: `${window.location.origin}/${i18n.language}/reset-password`,
//         });
//         if (error) throw error;
//         return { success: true };
//         } catch (err: any) {
//         return { success: false, error: err.message || 'Could not send reset link' };
//         } finally {
//         set({ loading: false });
//         }
//     },

//     // Reset password (after clicking email link)
//     resetPassword: async (newPassword) => {
//         set({ loading: true, error: null });
//             try {
//                 const { error } = await supabase.auth.updateUser({ password: newPassword });
//                 if (error) throw error;
//                 return { success: true };
//                 } catch (err: any) {
//                 return { success: false, error: err.message || 'Could not reset password' };
//             } finally {
//             set({ loading: false });
//         }
//     },
// }));


// =========================================


// import i18n from "@/i18n";
// import { UserProfile } from "../types";
// import { create } from "zustand";
// import { supabaseBrowser } from "../supabase/client";

// const supabase = supabaseBrowser();

// export interface UserState {
//   user: UserProfile | null;
//   loading: boolean;
//   error: string | null;

//   // Core actions
//   setUser: (user: UserProfile | null) => void;
//   resetUser: () => void;
//   fetchUserProfile: () => Promise<UserProfile | null>;

//   // Password actions
//   changePassword: (
//     currentPassword: string,
//     newPassword: string
//   ) => Promise<{ success: boolean; error?: string }>;
//   sendResetLink: (email: string) => Promise<{ success: boolean; error?: string }>;
//   resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
// }

// export const userStore = create<UserState>((set, get) => ({
//   user: null,
//   loading: false,
//   error: null,

//   // Simple setters
//   setUser: (user) => set({ user }),
//   resetUser: () => set({ user: null }),

//   // Fetch current user profile
//   fetchUserProfile: async () => {
//     if (get().user && get().user?.id) return;

//     try {
//       set({ loading: true, error: null });

//       const response = await fetch(`/${i18n.language}/api/auth/me`);
//       if (!response.ok) throw new Error("Failed to fetch user profile");

//       const result = await response.json();
//       const { data } = result;
//       set({ user: data, loading: false });
//       return data;
//     } catch (err: any) {
//       const message = err instanceof Error ? err.message : "Unknown error";
//       console.error("Error fetching user profile:", message);
//       set({ loading: false, error: message });
//       return null;
//     }
//   },

//   // Change password (user is logged in)
//   changePassword: async (currentPassword, newPassword) => {
//     set({ loading: true, error: null });
//     try {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         return { success: false, error: "Not authenticated" };
//       }

//       // Reauthenticate
//       const { error: signInError } = await supabase.auth.signInWithPassword({
//         email: user.email!,
//         password: currentPassword,
//       });
//       if (signInError) return { success: false, error: "Incorrect current password" };

//       // Update password
//       const { error } = await supabase.auth.updateUser({ password: newPassword });
//       if (error) throw error;

//       return { success: true };
//     } catch (err: any) {
//       console.error("Error changing password:", err);
//       return { success: false, error: err.message || "Unexpected error" };
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // Forgot password (send email link)
//   sendResetLink: async (email) => {
//     set({ loading: true, error: null });
//     try {
//       const { error } = await supabase.auth.resetPasswordForEmail(email, {
//         redirectTo: `${window.location.origin}/${i18n.language}/reset-password`,
//       });
//       if (error) throw error;
//       return { success: true };
//     } catch (err: any) {
//       console.error("Error sending reset link:", err);
//       return { success: false, error: err.message || "Could not send reset link" };
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // Reset password (after email link)
//   resetPassword: async (newPassword) => {
//     set({ loading: true, error: null });
//     try {
//       const { error } = await supabase.auth.updateUser({ password: newPassword });
//       if (error) throw error;
//       return { success: true };
//     } catch (err: any) {
//       console.error("Error resetting password:", err);
//       return { success: false, error: err.message || "Could not reset password" };
//     } finally {
//       set({ loading: false });
//     }
//   },
// }));


// =========================================


'use client';

import i18n from "@/i18n";
import { create } from "zustand";
import { supabaseBrowser } from "../supabase/client";
import type { UserProfile } from "../types";

export interface UserState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  setUser: (user: UserProfile | null) => void;
  resetUser: () => void;
  fetchUserProfile: () => Promise<UserProfile | null>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  sendResetLink: (email: string) => Promise<{ success: boolean; error?: string }>;
  resetPassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

export const userStore = create<UserState>((set, get) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),

  fetchUserProfile: async () => {
    if (get().user?.id) return get().user;

    try {
      set({ loading: true, error: null });
      const response = await fetch(`/${i18n.language}/api/auth/me`);
      if (!response.ok) throw new Error("Failed to fetch user profile");

      const { data } = await response.json();
      set({ user: data, loading: false });
      return data;
    } catch (err: any) {
      const message = err?.message ?? "Unknown error";
      console.error("Error fetching user profile:", message);
      set({ loading: false, error: message });
      return null;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    const supabase = supabaseBrowser();
    set({ loading: true, error: null });

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return { success: false, error: "Not authenticated" };

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });
      if (signInError) return { success: false, error: "Incorrect current password" };

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Unexpected error" };
    } finally {
      set({ loading: false });
    }
  },

  sendResetLink: async (email) => {
    const supabase = supabaseBrowser();
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/${i18n.language}/reset-password`,
      });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Could not send reset link" };
    } finally {
      set({ loading: false });
    }
  },

  resetPassword: async (newPassword) => {
    const supabase = supabaseBrowser();
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || "Could not reset password" };
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
