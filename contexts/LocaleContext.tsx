import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useContext, useEffect, useState } from 'react'

export const DEFAULT_LOCALE = 'en-US-WA'
const STORAGE_KEY = 'bootbarn.selectedLocale'

type LocaleContextValue = {
  locale: string
  setLocale: (locale: string) => void
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<string>(DEFAULT_LOCALE)

  // Restore the previously chosen locale (if any) on mount.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) setLocaleState(stored)
      })
      .catch(() => {})
  }, [])

  const setLocale = (next: string) => {
    setLocaleState(next)
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {})
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
