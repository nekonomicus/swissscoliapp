import { useState, useEffect } from 'react'
import { Home, ListChecks, TrendingUp, User, Check, Clock, Play, Pause, RotateCcw, ChevronLeft, Flame, Award, Target } from 'lucide-react'

const EXERCISES = [
  {
    id: 1,
    name: 'Seitliche Rumpfdehnung',
    duration: 60,
    sets: 3,
    description: 'Dehnung zur Korrektur der Wirbelsäulenkrümmung',
    instructions: [
      'Stehe aufrecht mit hüftbreit auseinander stehenden Füssen',
      'Hebe den Arm auf der konvexen Seite über den Kopf',
      'Beuge den Oberkörper langsam zur konkaven Seite',
      'Halte die Position für 20 Sekunden',
      'Kehre langsam zur Ausgangsposition zurück'
    ],
    category: 'Dehnung'
  },
  {
    id: 2,
    name: 'Schroth-Atmung',
    duration: 120,
    sets: 5,
    description: 'Rotationsatmung nach Schroth-Methode',
    instructions: [
      'Nimm eine korrigierte Haltung ein',
      'Atme tief in die eingesunkene Seite des Brustkorbs',
      'Stelle dir vor, wie der Brustkorb sich ausdehnt',
      'Atme langsam aus und halte die Korrektur',
      'Wiederhole die Atmung bewusst und kontrolliert'
    ],
    category: 'Atmung'
  },
  {
    id: 3,
    name: 'Katzenbuckel & Pferderücken',
    duration: 90,
    sets: 10,
    description: 'Mobilisation der Wirbelsäule',
    instructions: [
      'Beginne im Vierfüsslerstand',
      'Runde den Rücken nach oben (Katzenbuckel)',
      'Halte kurz und atme aus',
      'Senke den Bauch ab und hebe den Kopf (Pferderücken)',
      'Bewege dich fliessend zwischen beiden Positionen'
    ],
    category: 'Mobilisation'
  },
  {
    id: 4,
    name: 'Seitlage-Übung',
    duration: 60,
    sets: 2,
    description: 'Kräftigung der Rumpfmuskulatur',
    instructions: [
      'Lege dich auf die konvexe Seite',
      'Stütze den Kopf mit der unteren Hand',
      'Hebe das obere Bein langsam an',
      'Halte die Position für 5 Sekunden',
      'Senke das Bein kontrolliert ab'
    ],
    category: 'Kräftigung'
  },
  {
    id: 5,
    name: 'Beckenbodenaktivierung',
    duration: 45,
    sets: 10,
    description: 'Stabilisation des Beckens',
    instructions: [
      'Lege dich auf den Rücken mit angewinkelten Beinen',
      'Spanne den Beckenboden leicht an',
      'Drücke die Lendenwirbelsäule sanft in den Boden',
      'Halte die Spannung für 5 Sekunden',
      'Entspanne und wiederhole'
    ],
    category: 'Stabilisation'
  },
  {
    id: 6,
    name: 'Wandgleiten',
    duration: 60,
    sets: 8,
    description: 'Haltungskorrektur und Schulterblatt-Kontrolle',
    instructions: [
      'Stehe mit dem Rücken an der Wand',
      'Arme in U-Position an der Wand',
      'Gleite mit den Armen nach oben',
      'Halte Kontakt zur Wand',
      'Gleite langsam zurück nach unten'
    ],
    category: 'Haltung'
  }
]

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [completedExercises, setCompletedExercises] = useState(() => {
    const saved = localStorage.getItem('completedExercises')
    return saved ? JSON.parse(saved) : {}
  })
  const [weekProgress, setWeekProgress] = useState(() => {
    const saved = localStorage.getItem('weekProgress')
    return saved ? JSON.parse(saved) : {}
  })
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('streak')
    return saved ? parseInt(saved) : 0
  })
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [timerActive, setTimerActive] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)

  const today = new Date().toISOString().split('T')[0]
  const dayOfWeek = new Date().getDay()
  const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1

  useEffect(() => {
    localStorage.setItem('completedExercises', JSON.stringify(completedExercises))
  }, [completedExercises])

  useEffect(() => {
    localStorage.setItem('weekProgress', JSON.stringify(weekProgress))
  }, [weekProgress])

  useEffect(() => {
    localStorage.setItem('streak', streak.toString())
  }, [streak])

  useEffect(() => {
    let interval
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1)
      }, 1000)
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false)
    }
    return () => clearInterval(interval)
  }, [timerActive, timerSeconds])

  const todayCompleted = completedExercises[today] || []
  const completionPercentage = Math.round((todayCompleted.length / EXERCISES.length) * 100)

  const toggleExercise = (exerciseId) => {
    setCompletedExercises(prev => {
      const todayList = prev[today] || []
      const isCompleted = todayList.includes(exerciseId)
      
      let newList
      if (isCompleted) {
        newList = todayList.filter(id => id !== exerciseId)
      } else {
        newList = [...todayList, exerciseId]
      }

      if (newList.length === EXERCISES.length && !weekProgress[today]) {
        setWeekProgress(p => ({ ...p, [today]: true }))
        setStreak(s => s + 1)
      }

      return { ...prev, [today]: newList }
    })
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const startTimer = (duration) => {
    setTimerSeconds(duration)
    setTimerActive(true)
  }

  const renderNav = () => (
    <nav className="nav">
      <button className={`nav-item ${currentPage === 'home' ? 'active' : ''}`} onClick={() => setCurrentPage('home')}>
        <Home size={22} />
        <span>Home</span>
      </button>
      <button className={`nav-item ${currentPage === 'exercises' ? 'active' : ''}`} onClick={() => setCurrentPage('exercises')}>
        <ListChecks size={22} />
        <span>Übungen</span>
      </button>
      <button className={`nav-item ${currentPage === 'progress' ? 'active' : ''}`} onClick={() => setCurrentPage('progress')}>
        <TrendingUp size={22} />
        <span>Fortschritt</span>
      </button>
      <button className={`nav-item ${currentPage === 'profile' ? 'active' : ''}`} onClick={() => setCurrentPage('profile')}>
        <User size={22} />
        <span>Profil</span>
      </button>
    </nav>
  )

  const renderHome = () => (
    <div className="page-content">
      <header className="header">
        <div className="logo">
          <div className="logo-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M12 2v20M12 2c-2 4-2 8 0 12s-2 8 0 8M12 2c2 4 2 8 0 12s2 8 0 8" />
            </svg>
          </div>
          <h1 className="logo-text">SwissScoliApp</h1>
        </div>
        <p className="subtitle">Dein persönlicher Therapiebegleiter</p>
      </header>

      {streak > 0 && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }} className="animate-in">
          <span className="streak-badge">
            <Flame size={18} />
            {streak} Tage Serie
          </span>
        </div>
      )}

      <div className="card animate-in delay-1">
        <div className="card-header">
          <h2 className="card-title">Heute</h2>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {new Date().toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
        
        <div className="progress-ring">
          <svg width="140" height="140">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <circle className="progress-ring-bg" cx="70" cy="70" r="58" />
            <circle 
              className="progress-ring-fill" 
              cx="70" 
              cy="70" 
              r="58"
              strokeDasharray={`${2 * Math.PI * 58}`}
              strokeDashoffset={`${2 * Math.PI * 58 * (1 - completionPercentage / 100)}`}
            />
          </svg>
          <div className="progress-ring-text">
            <div className="progress-ring-percentage">{completionPercentage}%</div>
            <div className="progress-ring-label">{todayCompleted.length}/{EXERCISES.length} Übungen</div>
          </div>
        </div>

        <button className="btn btn-primary btn-block" onClick={() => setCurrentPage('exercises')}>
          <Play size={20} />
          Übungen starten
        </button>
      </div>

      <div className="card animate-in delay-2">
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>Diese Woche</h3>
        <div className="week-progress">
          {DAYS.map((day, i) => {
            const date = new Date()
            date.setDate(date.getDate() - adjustedDay + i)
            const dateStr = date.toISOString().split('T')[0]
            const isCompleted = weekProgress[dateStr]
            const isToday = i === adjustedDay

            return (
              <div key={day} className="day-dot">
                <div className={`day-circle ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}`}>
                  {isCompleted ? <Check size={16} /> : day.charAt(0)}
                </div>
                <span className="day-label">{day}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="stats-grid animate-in delay-3">
        <div className="stat-card">
          <div className="stat-value">{Object.keys(weekProgress).length}</div>
          <div className="stat-label">Tage diese Woche</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{streak}</div>
          <div className="stat-label">Tage Serie</div>
        </div>
      </div>
    </div>
  )

  const renderExercises = () => (
    <div className="page-content">
      <header className="header">
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Deine Übungen</h1>
        <p className="subtitle">{todayCompleted.length} von {EXERCISES.length} abgeschlossen</p>
      </header>

      {EXERCISES.map((exercise, i) => {
        const isCompleted = todayCompleted.includes(exercise.id)
        return (
          <div 
            key={exercise.id} 
            className={`exercise-item animate-in ${isCompleted ? 'completed' : ''}`}
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div 
              className={`exercise-checkbox ${isCompleted ? 'checked' : ''}`}
              onClick={() => toggleExercise(exercise.id)}
            >
              {isCompleted && <Check size={16} color="white" />}
            </div>
            <div className="exercise-info" onClick={() => { setSelectedExercise(exercise); setCurrentPage('detail'); }}>
              <div className="exercise-name">{exercise.name}</div>
              <div className="exercise-meta">
                <span className="exercise-duration">
                  <Clock size={14} />
                  {Math.ceil(exercise.duration / 60)} Min
                </span>
                <span>{exercise.sets} Sets</span>
                <span style={{ color: 'var(--accent-secondary)' }}>{exercise.category}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  const renderExerciseDetail = () => {
    if (!selectedExercise) return null
    const isCompleted = todayCompleted.includes(selectedExercise.id)

    return (
      <div className="page-content">
        <button 
          className="btn btn-secondary" 
          style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}
          onClick={() => setCurrentPage('exercises')}
        >
          <ChevronLeft size={20} />
          Zurück
        </button>

        <div className="exercise-detail-header">
          <div className="exercise-icon-large">
            <Target size={36} color="white" />
          </div>
          <h1 className="exercise-detail-title">{selectedExercise.name}</h1>
          <p className="exercise-detail-meta">
            {selectedExercise.sets} Sets • {Math.ceil(selectedExercise.duration / 60)} Minuten • {selectedExercise.category}
          </p>
        </div>

        <div className="video-placeholder">
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <Play size={48} />
            <p style={{ marginTop: '0.5rem' }}>Video-Anleitung</p>
          </div>
        </div>

        {timerSeconds > 0 && (
          <div className="card">
            <div className="timer-display">{formatTime(timerSeconds)}</div>
            <div className="timer-controls">
              <button className="btn btn-secondary" onClick={() => setTimerActive(!timerActive)}>
                {timerActive ? <Pause size={20} /> : <Play size={20} />}
                {timerActive ? 'Pause' : 'Fortsetzen'}
              </button>
              <button className="btn btn-secondary" onClick={() => { setTimerSeconds(selectedExercise.duration); setTimerActive(false); }}>
                <RotateCcw size={20} />
                Neustart
              </button>
            </div>
          </div>
        )}

        <div className="card">
          <h3 className="card-title" style={{ marginBottom: '0.5rem' }}>Beschreibung</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{selectedExercise.description}</p>
          
          <h3 className="card-title" style={{ marginBottom: '0.75rem' }}>Anleitung</h3>
          <ol className="instructions-list">
            {selectedExercise.instructions.map((instruction, i) => (
              <li key={i} className="instruction-item">
                <span className="instruction-number">{i + 1}</span>
                <span className="instruction-text">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => startTimer(selectedExercise.duration)}>
            <Clock size={20} />
            Timer starten
          </button>
          <button 
            className="btn btn-primary" 
            style={{ flex: 1 }}
            onClick={() => toggleExercise(selectedExercise.id)}
          >
            <Check size={20} />
            {isCompleted ? 'Erledigt ✓' : 'Als erledigt markieren'}
          </button>
        </div>
      </div>
    )
  }

  const renderProgress = () => {
    const totalDays = Object.keys(weekProgress).length
    const totalExercises = Object.values(completedExercises).reduce((sum, arr) => sum + arr.length, 0)

    return (
      <div className="page-content">
        <header className="header">
          <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Dein Fortschritt</h1>
          <p className="subtitle">Bleib dran - jede Übung zählt!</p>
        </header>

        <div className="stats-grid animate-in">
          <div className="stat-card">
            <div className="stat-value">{streak}</div>
            <div className="stat-label">Aktuelle Serie</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalDays}</div>
            <div className="stat-label">Trainingstage</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalExercises}</div>
            <div className="stat-label">Übungen total</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{totalDays > 0 ? Math.round(totalExercises / totalDays) : 0}</div>
            <div className="stat-label">Ø pro Tag</div>
          </div>
        </div>

        <div className="card animate-in delay-1">
          <div className="card-header">
            <h3 className="card-title">Erfolge</h3>
            <Award size={24} color="var(--warning)" />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { name: 'Erste Übung', desc: 'Erste Übung abgeschlossen', unlocked: totalExercises >= 1 },
              { name: '7-Tage Serie', desc: 'Eine Woche am Stück trainiert', unlocked: streak >= 7 },
              { name: 'Fleissig', desc: '50 Übungen abgeschlossen', unlocked: totalExercises >= 50 },
              { name: 'Durchhalter', desc: '30 Tage trainiert', unlocked: totalDays >= 30 },
            ].map((achievement, i) => (
              <div 
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem',
                  background: achievement.unlocked ? 'var(--success-glow)' : 'var(--bg-secondary)',
                  borderRadius: '12px',
                  opacity: achievement.unlocked ? 1 : 0.5
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: achievement.unlocked ? 'var(--success)' : 'var(--bg-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Award size={20} color={achievement.unlocked ? 'white' : 'var(--text-muted)'} />
                </div>
                <div>
                  <div style={{ fontWeight: 500 }}>{achievement.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{achievement.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderProfile = () => (
    <div className="page-content">
      <header className="header">
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'var(--gradient-1)',
          margin: '0 auto 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 8px 32px rgba(34, 211, 238, 0.3)'
        }}>
          <User size={36} color="white" />
        </div>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Mein Profil</h1>
        <p className="subtitle">SwissScoliApp Benutzer</p>
      </header>

      <div className="card animate-in">
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>Über die App</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.7 }}>
          Die SwissScoliApp wurde entwickelt, um Kinder und Jugendliche mit Skoliose bei ihrer täglichen 
          Physiotherapie zu unterstützen. Die App bietet personalisierte Übungspläne, geführte Anleitungen 
          und motivierende Fortschrittsverfolgung.
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Entwickelt in Zusammenarbeit mit der Universitätsklinik für Orthopädische Chirurgie und 
          Traumatologie, Inselspital Bern.
        </p>
      </div>

      <div className="card animate-in delay-1">
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>Einstellungen</h3>
        <button 
          className="btn btn-secondary btn-block" 
          style={{ marginBottom: '0.75rem' }}
          onClick={() => {
            if (confirm('Möchtest du wirklich alle Daten zurücksetzen?')) {
              localStorage.clear()
              setCompletedExercises({})
              setWeekProgress({})
              setStreak(0)
            }
          }}
        >
          Daten zurücksetzen
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <p>SwissScoliApp v1.0.0</p>
        <p>© 2025 Inselspital Bern</p>
      </div>
    </div>
  )

  return (
    <div className="app-container">
      {currentPage === 'home' && renderHome()}
      {currentPage === 'exercises' && renderExercises()}
      {currentPage === 'detail' && renderExerciseDetail()}
      {currentPage === 'progress' && renderProgress()}
      {currentPage === 'profile' && renderProfile()}
      {renderNav()}
    </div>
  )
}

export default App
