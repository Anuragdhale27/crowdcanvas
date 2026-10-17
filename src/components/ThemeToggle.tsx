import { useEffect, useState } from 'react'
import { Icon } from './Icon'

type Theme = 'dark' | 'light'

function initialTheme(): Theme {
  try {
    return localStorage.getItem('crowdcanvas-theme') === 'light' ? 'light' : 'dark'
  } catch {
    return 'dark'
  }
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
  }, [theme])
  const dark = theme === 'dark'
  const toggle = () => {
    const next: Theme = dark ? 'light' : 'dark'
    setTheme(next)
    try { localStorage.setItem('crowdcanvas-theme', next) } catch { /* storage unavailable */ }
  }
  return (
    <button className="themebtn" type="button" onClick={toggle} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <Icon name={dark ? 'sun' : 'moon'} />
      <span>{dark ? 'Light mode' : 'Dark mode'}</span>
    </button>
  )
}
