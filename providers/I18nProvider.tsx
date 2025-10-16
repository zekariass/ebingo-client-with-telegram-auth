// 'use client';
// import { ReactNode, useEffect } from 'react';
// import { I18nextProvider } from 'react-i18next';
// import i18n from '../i18n';

// interface I18nProviderProps {
//   children: ReactNode;
//   locale: string;
// }

// export function I18nProvider({ children, locale }: I18nProviderProps) {
//   useEffect(() => {
//     i18n.changeLanguage(locale);
//   }, [locale]);

//   return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
// }


'use client'

import { ReactNode, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'
import { usePathname, useRouter } from 'next/navigation'

interface I18nProviderProps {
  children: ReactNode
  fallbackLocale: string
}

export function I18nProvider({ children, fallbackLocale }: I18nProviderProps) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const savedLng = localStorage.getItem('i18nextLng') || fallbackLocale
    if (i18n.language !== savedLng) i18n.changeLanguage(savedLng)

    // Make sure URL reflects saved language
    const segments = pathname.split('/')
    if (segments[1] !== savedLng) {
      segments[1] = savedLng
      router.replace(segments.join('/'))
    }

    document.documentElement.lang = savedLng
    document.documentElement.dir = 'ltr'
    setMounted(true)
  }, [fallbackLocale, pathname, router])

  if (!mounted) return null

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
