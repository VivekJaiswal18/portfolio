import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  SiRust,
  SiCplusplus,
  SiTypescript,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiMongodb,
  SiPostgresql,
  SiTailwindcss,
  SiDocker,
  SiGithub,
  SiX,
  SiTelegram,
  SiYoutube,
} from 'react-icons/si'
import { FaLinkedinIn } from 'react-icons/fa'
import {
  HiOutlineHome,
  HiOutlineSquares2X2,
  HiOutlineFolder,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlineMoon,
  HiOutlineSun,
  HiArrowUpRight,
  HiOutlineMagnifyingGlass,
  HiOutlinePaperAirplane,
  HiOutlineBolt,
  HiOutlineClock,
} from 'react-icons/hi2'
import { FiMail } from 'react-icons/fi'
import './App.css'

const profileImage = '/profile_avatar.jpg'

function App() {
  const [theme, setTheme] = useState('dark')
  const [hoveredToolbar, setHoveredToolbar] = useState(-1)
  const [activeToolbar, setActiveToolbar] = useState(0)
  const [activeYear, setActiveYear] = useState(new Date().getFullYear())
  const [contributionData, setContributionData] = useState({ days: [], total: 0 })
  const [contribLoading, setContribLoading] = useState(true)
  const [githubStats, setGithubStats] = useState({
    repos: 38,
    followers: 0,
    mergedPRs: 0,
    stars: 13,
  })
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState('')
  const [paletteIndex, setPaletteIndex] = useState(0)
  const paletteInputRef = useRef(null)

  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const istTime = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Kolkata',
  })

  const years = [2026, 2025, 2024, 2023, 2022]
  const GITHUB_USER = 'VivekJaiswal18'

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const profileRes = await fetch(`https://api.github.com/users/${GITHUB_USER}`)
        if (profileRes.ok) {
          const profile = await profileRes.json()
          if (!cancelled) {
            setGithubStats((prev) => ({
              ...prev,
              repos: profile.public_repos ?? prev.repos,
              followers: profile.followers ?? prev.followers,
            }))
          }
        }
      } catch {}

      try {
        const prRes = await fetch(
          `https://api.github.com/search/issues?q=author:${GITHUB_USER}+type:pr+is:merged`,
        )
        if (prRes.ok) {
          const data = await prRes.json()
          if (!cancelled) {
            setGithubStats((prev) => ({ ...prev, mergedPRs: data.total_count ?? 0 }))
          }
        }
      } catch {}
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setContribLoading(true)
    const currentYear = new Date().getFullYear()
    const yearParam = activeYear === currentYear ? 'last' : activeYear
    ;(async () => {
      try {
        const res = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=${yearParam}`,
        )
        if (!res.ok) throw new Error('chart fetch failed')
        const data = await res.json()
        if (cancelled) return
        const days = data.contributions || []
        const total =
          typeof data.total === 'object'
            ? Object.values(data.total).reduce((a, b) => a + b, 0)
            : data.total || 0
        setContributionData({ days, total })
      } catch {
        if (!cancelled) setContributionData({ days: [], total: 0 })
      } finally {
        if (!cancelled) setContribLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activeYear])

  const contributionWeeks = useMemo(() => {
    const weeks = []
    let current = []
    contributionData.days.forEach((day) => {
      const d = new Date(day.date)
      const dow = d.getUTCDay()
      if (current.length === 0 && dow !== 0) {
        for (let i = 0; i < dow; i++) current.push(null)
      }
      current.push(day)
      if (dow === 6) {
        weeks.push(current)
        current = []
      }
    })
    if (current.length) {
      while (current.length < 7) current.push(null)
      weeks.push(current)
    }
    return weeks
  }, [contributionData])

  const chartMonths = useMemo(() => {
    if (!contributionWeeks.length) {
      return ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    }
    const seen = new Set()
    const labels = []
    contributionWeeks.forEach((week) => {
      const firstDay = week.find(Boolean)
      if (!firstDay) return
      const m = new Date(firstDay.date).toLocaleString('en-US', { month: 'short' }).toLowerCase()
      if (!seen.has(m)) {
        seen.add(m)
        labels.push(m)
      }
    })
    return labels
  }, [contributionWeeks])

  const skills = [
    { Icon: SiRust, label: 'rust', tone: 'rust' },
    { Icon: SiCplusplus, label: 'c++', tone: 'cplusplus' },
    { Icon: SiTypescript, label: 'typescript', tone: 'typescript' },
    { Icon: SiJavascript, label: 'javascript', tone: 'javascript' },
    { Icon: SiReact, label: 'react', tone: 'react' },
    { Icon: SiNodedotjs, label: 'node.js', tone: 'node' },
    { Icon: SiMongodb, label: 'mongodb', tone: 'mongo' },
    { Icon: SiPostgresql, label: 'postgres', tone: 'postgres' },
    { Icon: SiTailwindcss, label: 'tailwind', tone: 'tailwind' },
    { Icon: SiDocker, label: 'docker', tone: 'docker' },
    { Icon: SiGithub, label: 'github', tone: 'github' },
  ]

  const featuredWork = [
    {
      title: 'refactor auth service with deterministic token validation',
      meta: 'org/repo • #291',
    },
    {
      title: 'fix: queue processor race condition with bounds checking',
      meta: 'org/repo • #180',
    },
    {
      title: 'feat: added better defaults for project bootstrap inputs',
      meta: 'org/repo • #79',
    },
  ]

  const writings = [
    'why architecture clarity matters in growing products',
    'practical backend performance tuning guide',
    'lessons from shipping multiple production mern apps',
  ]

  const experiences = [
    {
      period: 'mar 2026 - now',
      role: 'co-founder',
      org: 'yourproduct.com',
      desc: 'leading product direction and building full-stack features with performance-focused architecture.',
    },
    {
      period: 'feb 2025 - mar 2026',
      role: 'full-stack engineer',
      org: 'startup team',
      desc: 'shipped APIs, dashboards, and core workflows used in production by active users.',
    },
    {
      period: 'aug 2023 - jan 2025',
      role: 'frontend developer',
      org: 'product studio',
      desc: 'worked on component systems, accessibility, and frontend architecture for multiple clients.',
    },
  ]

  const githubSnapshot = {
    username: 'VivekJaiswal18',
    name: 'Vivek Jaiswal',
    repositories: 38,
    stars: 13,
    pinned: ['Clob', 'Tipsy', 'ProbX', 'surfpool', 'Solana-Validator', 'json-schema-org/website'],
    x: '@_vivekjaiswal18',
  }

  const contactLinks = [
    {
      Icon: FiMail,
      label: 'email',
      handle: 'vivekjaiswalfrl@gmail.com',
      href: 'mailto:vivekjaiswalfrl@gmail.com',
    },
    {
      Icon: SiX,
      label: 'x.com',
      handle: '@_vivekjaiswal18',
      href: 'https://x.com/_vivekjaiswal18',
    },
    {
      Icon: SiTelegram,
      label: 'telegram',
      handle: '@vivekjaiswal18',
      href: 'https://t.me/vivekjaiswal18',
    },
    {
      Icon: SiGithub,
      label: 'github',
      handle: '@VivekJaiswal18',
      href: 'https://github.com/VivekJaiswal18',
    },
    {
      Icon: FaLinkedinIn,
      label: 'linkedin',
      handle: '/in/vivekjaiswal',
      href: 'https://linkedin.com/in/vivek-jaiswal-5bab22219',
    }
  ]

  const toolbarItems = [
    { Icon: HiOutlineHome, label: 'home', href: '#home' },
    { Icon: HiOutlineSquares2X2, label: 'stack', href: '#skills' },
    { Icon: HiOutlineFolder, label: 'proof of work', href: '#proof-of-work' },
    { Icon: HiOutlineUser, label: 'experience', href: '#experience' },
    { Icon: HiOutlineEnvelope, label: 'contact', href: '#contact' },
    { Icon: theme === 'dark' ? HiOutlineMoon : HiOutlineSun, label: 'theme', href: '#footer' },
  ]

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const closePalette = useCallback(() => {
    setPaletteOpen(false)
    setPaletteQuery('')
    setPaletteIndex(0)
  }, [])

  const openPalette = useCallback(() => {
    setPaletteOpen(true)
    setPaletteIndex(0)
  }, [])

  const navigationItems = useMemo(
    () => [
      { id: 'home', label: 'home', desc: 'go to home page', href: '#home' },
      { id: 'skills', label: 'skill / stack', desc: 'view tools and stack', href: '#skills' },
      {
        id: 'featured',
        label: 'featured work',
        desc: 'view selected projects and contributions',
        href: '#featured-work',
      },
      {
        id: 'proof-of-work',
        label: 'proof of work',
        desc: 'view github contributions and stats',
        href: '#proof-of-work',
      },
      {
        id: 'experience',
        label: 'experience',
        desc: 'view career timeline',
        href: '#experience',
      },
      { id: 'contact', label: 'contact', desc: 'view social and contact links', href: '#contact' },
    ],
    [],
  )

  const commonItems = useMemo(
    () => [
      {
        id: 'send-email',
        label: 'send email',
        desc: 'open mail composer',
        run: () => {
          window.location.href = 'mailto:vivekjaiswalfrl@gmail.com'
        },
      },
    ],
    [theme],
  )

  const actionItems = useMemo(
    () => [
      {
        id: 'copy-email',
        label: 'copy email',
        desc: 'vivekjaiswalfrl@gmail.com',
        run: () => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText('vivekjaiswalfrl@gmail.com').catch(() => {})
          }
        },
      },
      {
        id: 'toggle-theme',
        label: 'toggle theme',
        desc: theme === 'dark' ? 'switch to light mode' : 'switch to dark mode',
        run: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
      },
      {
        id: 'open-github',
        label: 'open github',
        desc: '@VivekJaiswal18',
        run: () => window.open(`https://github.com/${GITHUB_USER}`, '_blank', 'noopener'),
      },
      {
        id: 'open-x',
        label: 'open x.com',
        desc: '@_vivekjaiswal18',
        run: () => window.open('https://x.com/_vivekjaiswal18', '_blank', 'noopener'),
      },
      {
        id: 'open-linkedin',
        label: 'open linkedin',
        desc: '/in/vivekjaiswal18',
        run: () => window.open('https://linkedin.com/in/vivekjaiswal18', '_blank', 'noopener'),
      },
      {
        id: 'open-telegram',
        label: 'open telegram',
        desc: '@vivekjaiswal18',
        run: () => window.open('https://t.me/vivekjaiswal18', '_blank', 'noopener'),
      },
    ],
    [theme],
  )

  const filterByQuery = (items) => {
    const q = paletteQuery.trim().toLowerCase()
    if (!q) return items
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || item.desc.toLowerCase().includes(q),
    )
  }

  const filteredCommon = useMemo(
    () => filterByQuery(commonItems),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paletteQuery, commonItems],
  )

  const filteredNavigation = useMemo(
    () => filterByQuery(navigationItems),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paletteQuery, navigationItems],
  )

  const filteredActions = useMemo(
    () => filterByQuery(actionItems),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [paletteQuery, actionItems],
  )

  const flatPaletteItems = useMemo(
    () => [...filteredCommon, ...filteredNavigation, ...filteredActions],
    [filteredCommon, filteredNavigation, filteredActions],
  )

  const selectPaletteItem = useCallback(
    (item) => {
      if (!item) return
      closePalette()
      setTimeout(() => {
        if (item.run) {
          item.run()
        } else if (item.href) {
          const target = document.querySelector(item.href)
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 50)
    },
    [closePalette],
  )

  useEffect(() => {
    const handler = (event) => {
      const isCmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
      if (isCmdK) {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      } else if (event.key === 'Escape' && paletteOpen) {
        event.preventDefault()
        closePalette()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [paletteOpen, closePalette])

  useEffect(() => {
    if (paletteOpen) {
      const id = setTimeout(() => paletteInputRef.current?.focus(), 30)
      return () => clearTimeout(id)
    }
  }, [paletteOpen])

  useEffect(() => {
    if (paletteIndex >= flatPaletteItems.length) {
      setPaletteIndex(Math.max(0, flatPaletteItems.length - 1))
    }
  }, [flatPaletteItems, paletteIndex])

  return (
    <main className="page" id="home">
      <header className="topbar">
        <p className="topbar-left">EST. 2003</p>
        <div className="topbar-right">
          <span className="clock" aria-label="Current time in IST">
            <HiOutlineClock className="clock-icon" />
            <span className="clock-time">{istTime}</span>
            <span className="clock-tz">GMT+5:30</span>
          </span>
          <button
            aria-label="Open command palette"
            className="search-pill"
            onClick={openPalette}
            type="button"
          >
            <HiOutlineMagnifyingGlass className="search-pill-icon" />
            <span className="search-pill-label">search</span>
            <span className="search-pill-kbd">
              <span>⌘</span>
              <span>K</span>
            </span>
          </button>
        </div>
      </header>

      <section className="hero">
        <img className="avatar" src={profileImage} alt="Profile placeholder" />
        <h1 className="hero-name">
           vivekjaiswal18 <span className="verified">{/*●*/}</span> 
        </h1>
        <p className="hero-role">full-stack developer // co-founder @ your-startup</p>
        <p className="hero-copy">
          hey, i&apos;m vivek, Backend and systems-focused engineer with experience 
          building rust-based high-performance low-latency trading infrastructure. 
          Strong background in concurrency, real-time systems, and blockchain-based 
          execution environments.
          {/* a full-stack engineer building scalable products  
          and robust backend systems. i work across modern web stacks with a
          strong focus on clean architecture and performance. */}
        </p>
        <p className="hero-copy">
          currently exploring distributed systems, full stack, backend reliability, and
          better developer experience.
        </p>
        <div className="github-mini">
          <p>
            github: <strong>{githubSnapshot.username}</strong> ({githubSnapshot.name})
          </p>
          <p>
            repos {githubSnapshot.repositories} · stars {githubSnapshot.stars} · x {githubSnapshot.x}
          </p>
        </div>
      </section>

      <section className="block" id="skills">
        <h2 className="section-title">skill / stack <span>S</span></h2>
        <div className="stack-icons">
          {skills.map((skill) => {
            const { Icon } = skill
            return (
              <span
                key={skill.label}
                className={`stack-icon tooltip-anchor icon-${skill.tone}`}
                data-label={skill.label}
              >
                <Icon />
              </span>
            )
          })}
        </div>
      </section>

      <section className="block" id="featured-work">
        <h2 className="section-title">featured work <span>F</span></h2>
        <p className="section-description">
          selected highlights from my contributions and projects
        </p>
        <div className="tabs">
          <button className="tab active" type="button">
            pull requests
          </button>
          <button className="tab" type="button">
            projects
          </button>
        </div>
        <div className="featured-list">
          {featuredWork.map((item) => (
            <article className="featured-item" key={item.title}>
              <a href="/">{item.title}</a>
              <p>
                ↳ {item.meta} <span className="badge">merged</span>
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="block" id="proof-of-work">
        <h2 className="section-title">proof of work <span>P</span></h2>
        <div className="pow-stats">
          <p>
            <span className="pow-label">projects</span>
            <span className="pow-value">
              <strong>{githubStats.repos}</strong>
              <HiArrowUpRight className="pow-arrow" />
            </span>
          </p>
          <p>
            <span className="pow-label">merged pull requests</span>
            <span className="pow-value">
              <strong>{githubStats.mergedPRs}</strong>
              <HiArrowUpRight className="pow-arrow" />
            </span>
          </p>
          <p>
            <span className="pow-label">followers</span>
            <span className="pow-value">
              <strong>{githubStats.followers}</strong>
              <HiArrowUpRight className="pow-arrow" />
            </span>
          </p>
          <p>
            <span className="pow-label">stars earned</span>
            <span className="pow-value">
              <strong>{githubStats.stars}</strong>
              <HiArrowUpRight className="pow-arrow" />
            </span>
          </p>
        </div>
        <div className="chart-wrap">
          <div className="months months-flex">
            {chartMonths.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>
          <div className="contribution-strip">
            {contributionWeeks.length === 0 && contribLoading ? (
              <span className="chart-loading">loading github contributions…</span>
            ) : null}
            {contributionWeeks.map((week, wIdx) => (
              <div className="week-col" key={wIdx}>
                {week.map((day, dIdx) => (
                  <span
                    key={dIdx}
                    className={`dot ${day ? `lv${day.level ?? 0}` : 'lv0'}`}
                    title={day ? `${day.count} contributions on ${day.date}` : ''}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="contribution-meta">
          <p>
            {contributionData.total
              ? `${contributionData.total.toLocaleString()} contributions ${
                  activeYear === new Date().getFullYear() ? 'in the last year' : `in ${activeYear}`
                }`
              : 'live github contributions'}
          </p>
          <p className="legend">
            less
            <span className="legend-dot lv0" />
            <span className="legend-dot lv1" />
            <span className="legend-dot lv2" />
            <span className="legend-dot lv3" />
            <span className="legend-dot lv4" />
            more
          </p>
        </div>
        <div className="year-tabs">
          {years.map((year) => (
            <button
              className={`year-tab ${activeYear === year ? 'active' : ''}`}
              key={year}
              onClick={() => setActiveYear(year)}
              type="button"
            >
              {year}
            </button>
          ))}
        </div>
        <div className="github-pinned">
          <p className="pinned-title">pinned repositories</p>
          <div className="pinned-list">
            {githubSnapshot.pinned.map((repo) => (
              <span key={repo}>{repo}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="experience">
        <h2 className="section-title">experience <span>E</span></h2>
        <p className="section-description">
          throughout my career i&apos;ve worked on meaningful projects across web
          product development and engineering systems.
        </p>
        <div className="timeline">
          {experiences.map((item) => (
            <article className="timeline-item" key={item.role}>
              <p className="period">{item.period}</p>
              <h3>
                {item.role} <span>{item.org}</span>
              </h3>
              <p>{item.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/*
      <section className="block" id="writings">
        <h2 className="section-title">writings <span>W</span></h2>
        <div className="writing-list">
          {writings.map((item) => (
            <a className="writing-item" href="/" key={item}>
              <span>{item}</span>
              <HiArrowUpRight />
            </a>
          ))}
        </div>
      </section>
      */}

      <section className="block" id="contact">
        <h2 className="section-title">contact <span>C</span></h2>
        <div className="contact-list">
          {contactLinks.map(({ Icon, label, handle, href }) => (
            <a className="contact-row" href={href} key={label} target="_blank" rel="noreferrer">
              <span className="contact-left">
                <Icon className="contact-icon" />
                <span className="contact-label">{label}</span>
              </span>
              <span className="contact-right">
                <span className="contact-handle">{handle}</span>
                <HiArrowUpRight className="contact-arrow" />
              </span>
            </a>
          ))}
        </div>
        <div className='m-20'>
        <p className="footer-copyright">© 2026 vivekjaiswal18</p>
        </div>
      </section>

      <div className="footer-fullbleed" id="footer">
        <section className="footer-brandmark" aria-hidden="true">
          <p>vivekjaiswal18</p>
        </section>

      </div>

      <nav className="dock" aria-label="Bottom toolbar">
        {toolbarItems.map((item, index) => {
          const { Icon } = item
          return (
            <a
              key={item.label}
              className={`toolbar-btn tooltip-anchor ${
                activeToolbar === index ? 'active' : ''
              }`}
              data-label={item.label}
              href={item.href}
              onClick={(event) => {
                setActiveToolbar(index)
                if (item.label === 'theme') {
                  event.preventDefault()
                  setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
                }
              }}
              onMouseEnter={() => setHoveredToolbar(index)}
              onMouseLeave={() => setHoveredToolbar(-1)}
              style={{
                transform:
                  hoveredToolbar === -1
                    ? undefined
                    : `translate(${(index - hoveredToolbar) * 4}px, ${
                        index === hoveredToolbar
                          ? -10
                          : Math.abs(index - hoveredToolbar) === 1
                          ? -3
                          : 0
                      }px) scale(${
                        index === hoveredToolbar
                          ? 1.32
                          : Math.abs(index - hoveredToolbar) === 1
                          ? 1.08
                          : Math.abs(index - hoveredToolbar) === 2
                          ? 0.96
                          : 0.92
                      })`,
              }}
            >
              <Icon />
            </a>
          )
        })}
      </nav>

      {paletteOpen ? (
        <div
          className="palette-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) closePalette()
          }}
        >
          <div className="palette" role="dialog" aria-modal="true" aria-label="Command palette">
            <div className="palette-input-wrap">
              <HiOutlineMagnifyingGlass className="palette-input-icon" />
              <input
                ref={paletteInputRef}
                className="palette-input"
                type="text"
                placeholder="type a command or search..."
                value={paletteQuery}
                onChange={(event) => {
                  setPaletteQuery(event.target.value)
                  setPaletteIndex(0)
                }}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown') {
                    event.preventDefault()
                    setPaletteIndex((idx) =>
                      Math.min(idx + 1, Math.max(0, flatPaletteItems.length - 1)),
                    )
                  } else if (event.key === 'ArrowUp') {
                    event.preventDefault()
                    setPaletteIndex((idx) => Math.max(idx - 1, 0))
                  } else if (event.key === 'Enter') {
                    event.preventDefault()
                    selectPaletteItem(flatPaletteItems[paletteIndex])
                  }
                }}
              />
            </div>
            <ul className="palette-list">
              {filteredCommon.length ? (
                <li className="palette-section-title">common</li>
              ) : null}
              {filteredCommon.map((item, index) => {
                const flatIndex = index
                return (
                  <li
                    key={item.id}
                    className={`palette-item ${paletteIndex === flatIndex ? 'active' : ''}`}
                    onMouseEnter={() => setPaletteIndex(flatIndex)}
                    onClick={() => selectPaletteItem(item)}
                  >
                    <HiOutlineBolt className="palette-item-icon" />
                    <span className="palette-item-text">
                      <span className="palette-item-title">{item.label}</span>
                      <span className="palette-item-desc">{item.desc}</span>
                    </span>
                  </li>
                )
              })}

              {filteredNavigation.length ? (
                <li className="palette-section-title">navigation</li>
              ) : null}
              {filteredNavigation.map((item, index) => {
                const flatIndex = filteredCommon.length + index
                return (
                  <li
                    key={item.id}
                    className={`palette-item ${paletteIndex === flatIndex ? 'active' : ''}`}
                    onMouseEnter={() => setPaletteIndex(flatIndex)}
                    onClick={() => selectPaletteItem(item)}
                  >
                    <HiOutlinePaperAirplane className="palette-item-icon" />
                    <span className="palette-item-text">
                      <span className="palette-item-title">{item.label}</span>
                      <span className="palette-item-desc">{item.desc}</span>
                    </span>
                  </li>
                )
              })}

              {filteredActions.length ? (
                <li className="palette-section-title">actions</li>
              ) : null}
              {filteredActions.map((item, index) => {
                const flatIndex = filteredCommon.length + filteredNavigation.length + index
                return (
                  <li
                    key={item.id}
                    className={`palette-item ${paletteIndex === flatIndex ? 'active' : ''}`}
                    onMouseEnter={() => setPaletteIndex(flatIndex)}
                    onClick={() => selectPaletteItem(item)}
                  >
                    <HiOutlineBolt className="palette-item-icon" />
                    <span className="palette-item-text">
                      <span className="palette-item-title">{item.label}</span>
                      <span className="palette-item-desc">{item.desc}</span>
                    </span>
                  </li>
                )
              })}

              {!flatPaletteItems.length ? (
                <li className="palette-empty">no matching commands.</li>
              ) : null}
            </ul>
            <div className="palette-footer">
              <span>
                <kbd>↑↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> select
              </span>
              <span>
                <kbd>esc</kbd> close
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  )
}

export default App
