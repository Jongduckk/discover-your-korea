import { useEffect, useRef, useState } from 'react';
import { Cloud, Scene, Skyline } from './Artwork';
import { SpotPhoto, PhotoCredits } from './DestinationPhotos';
import { destinationOrder, destinations, letters, questions, quizExpressions, siteConfig, sortingSteps, type Answer, type Expression } from './content';
import { calculateDestination, initialState, restoreState, SESSION_KEY, type QuizState } from './quiz';

function Sparkle({ className = '' }: { className?: string }) { return <span className={`sparkle ${className}`} aria-hidden="true">✦</span>; }

function Brand({ compact = false }: { compact?: boolean }) {
  return <div className={`brand ${compact ? 'compact' : ''}`}>
    {siteConfig.logo ? <img src={siteConfig.logo} alt="IGB" className="brand-logo" /> : <span className="brand-initials">IGB<span className="brand-dot">.</span></span>}
    <span className="brand-divider"/><span className="brand-name">Institute for<br/>Global Business</span>
  </div>;
}

function Character({ expression, className = '', priority = false }: { expression: Expression; className?: string; priority?: boolean }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [expression]);
  return <div className={`character ${className}`}>
    {failed ? <div className="character-fallback"><Sparkle/><span>The Magical Gat</span></div> : <img src={`./assets/characters/${expression}.webp`} alt={`The Magical Gat, ${expression}`} width="440" height="440" onError={() => setFailed(true)} fetchPriority={priority ? 'high' : 'auto'}/>}
  </div>;
}

function Ambient() {
  return <div className="ambient" aria-hidden="true"><div className="ambient-glow"/><Cloud className="cloud cloud-one"/><Cloud className="cloud cloud-two"/><div className="star-field">{Array.from({length: 17}, (_, i) => <i key={i} style={{left: `${(i * 47 + 7) % 100}%`, top: `${(i * 31 + 11) % 91}%`, animationDelay: `${i * -.42}s`}}/>)}</div><div className="lattice lattice-one"/><div className="lattice lattice-two"/></div>;
}

function Welcome({ onStart }: { onStart: () => void }) {
  return <div className="welcome page-enter">
    <div className="welcome-hero">
      <section className="hero-copy">
        <h1 tabIndex={-1}>Discover<br/>Your <em>Seoul</em><span className="title-star" aria-hidden="true">✧</span></h1>
        <p className="hero-subtitle">Let the magic choose<br className="desktop-break"/> your Seoul adventure.</p>
        <div className="welcome-action"><button className="primary-button" onClick={onStart}>Start the Sorting <Sparkle/><span aria-hidden="true">↗</span></button><p className="time-note"><span aria-hidden="true">◷</span> 5 questions <span className="dot">·</span> About 1 minute</p></div>
      </section>
      <div className="hero-art">
        <div className="orbit orbit-outer"/><div className="orbit orbit-inner"/>
        <div className="moon-halo"/><Cloud className="art-cloud cloud-left"/><Cloud className="art-cloud cloud-right"/>
        <Sparkle className="art-star star-one"/><Sparkle className="art-star star-two"/><Sparkle className="art-star star-three"/>
        <Character expression="rocket" className="hero-character float" priority/>
      </div>
    </div>
    <section className="destination-preview" aria-labelledby="destinations-heading">
      <div className="section-intro"><span className="small-rule"/><h2 id="destinations-heading">Five destinations. <em>Where will you belong?</em></h2><span className="small-rule"/></div>
      <div className="destination-grid">{destinationOrder.map(code => { const d=destinations[code]; return <div className="destination-tile" key={code} style={{'--destination-color': d.color} as React.CSSProperties}><div className="tile-art"><Scene code={code}/></div><div className="tile-caption"><h3>{d.short}</h3></div></div>; })}</div>
    </section>
  </div>;
}

function Quiz({ state, busy, onAnswer, onBack }: { state: QuizState; busy: boolean; onAnswer: (answer: Answer) => void; onBack: () => void }) {
  const q = questions[state.current];
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), [state.current]);
  return <section className="quiz-layout page-enter">
    <div className="quiz-top"><button className="back-button" onClick={onBack} disabled={busy}><span aria-hidden="true">←</span> Back</button><span className="question-count">QUESTION <strong>{state.current + 1}</strong> / 5</span><span className="quiz-top-star"><Sparkle/></span></div>
    <div className="progress-track" role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={5} aria-valuenow={state.current}><div style={{width: `${(state.current + 1) * 20}%`}}><Sparkle/></div></div>
    <div className="quiz-content" key={state.current}>
      <div className="quiz-guide"><div className="quiz-character-wrap"><div className="quiz-halo"/><Character expression={quizExpressions[state.current]}/><Sparkle className="quiz-spark"/></div><h1 className="quiz-title" ref={heading} tabIndex={-1}>{q.text}</h1></div>
      <div className="answers-area"><div className="answer-list" role="group" aria-label={q.text}>{q.options.map((option, i) => <button className={`answer-button ${state.answers[state.current] === letters[i] ? 'selected' : ''}`} key={letters[i]} onClick={() => onAnswer(letters[i])} disabled={busy} aria-pressed={state.answers[state.current] === letters[i]}><span className="answer-emoji" aria-hidden="true">{option[0]}</span><span className="answer-text">{option[1]}</span><span className="answer-letter" aria-hidden="true">{state.answers[state.current] === letters[i] ? '✓' : letters[i]}</span></button>)}</div></div>
    </div>
    <div className="quiz-step-dots" aria-hidden="true">{questions.map((_,i)=><span key={i} className={i<=state.current ? 'active' : ''}/>)}</div>
  </section>;
}

function Sorting({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const timers = sortingSteps.slice(1).map((_,i) => window.setTimeout(() => setStep(i+1), (i+1)*650));
    const finish = window.setTimeout(onComplete, reduced ? 400 : 2700);
    return () => {timers.forEach(clearTimeout); clearTimeout(finish);};
  }, [onComplete, reduced]);
  return <section className="sorting-screen page-enter" aria-live="polite" aria-busy="true"><div className="sorting-art"><div className="sorting-ring"/><div className="sorting-ring ring-two"/><Cloud className="sorting-cloud"/><Character expression={sortingSteps[step].expression} className="sorting-character float"/><Sparkle className="sorting-star"/></div><h1 key={step}>{sortingSteps[step].text}</h1><div className="sorting-dots" aria-hidden="true">{sortingSteps.map((_,i)=><span key={i} className={i<=step?'active':''}/>)}</div></section>;
}

function Result({ state, onRestart }: { state: QuizState; onRestart: () => void }) {
  const code = calculateDestination(state.answers), d = destinations[code];
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);
  return <div className="result-screen page-enter" style={{'--destination-color': d.color} as React.CSSProperties}>
    <section className="result-reveal"><p className="result-pretitle">You belong in…</p><h1 ref={heading} tabIndex={-1}>{d.name}</h1><div className="result-personality"><span/>{d.title}<span/></div><div className="result-hero-art"><Scene code={code}/><div className="result-art-overlay"/><p>“{d.tagline}”</p><Character expression="confident" className="result-character" priority/></div></section>
    <section className="why-card paper-card"><span className="paper-ornament" aria-hidden="true">❖</span><div><h2>Why this place?</h2><p>{d.description}</p></div></section>
    <section className="discover-section">
      <div className="result-section-heading"><h2>Your magical destinations</h2><Sparkle/></div>
      <div className="spots-grid">{d.spots.map(([name, description])=><article className="spot-card" key={name}>
        <SpotPhoto name={name} code={code}/>
        <div className="spot-copy"><h3>{name}</h3><p>{description}</p></div>
      </article>)}</div>
      <PhotoCredits names={d.spots.map(([name])=>name)}/>
    </section>
    <section className="experience-card"><Character expression="love"/><div><h2>A little Seoul inspiration</h2><ul>{d.experiences.map(e=><li key={e}><Sparkle/>{e}</li>)}</ul></div></section>
    <section className="official-section"><div><h2>Let the adventure begin.</h2><p>Plan your visit with Seoul’s official travel guide.</p></div><div className="official-links">{d.links.map(([name,url])=><a key={url} href={url} target="_blank" rel="noopener noreferrer">{name}<span aria-hidden="true">↗</span><span className="sr-only"> (Visit Seoul, opens in a new tab)</span></a>)}</div></section>
    <section className="reward-card paper-card"><div className="reward-icon" aria-hidden="true">🎁</div><div><h2>Claim Your IGB’s Picks!</h2><p>Show your result at the booth to receive your destination’s mini travel guide and a Korean snack!</p><small>Available while supplies last.</small></div></section>
    <section className="lecture-card"><Brand compact/><div><h2>Continue Your Korean Adventure!</h2><p>Keep exploring Korean culture with IGB. Discover more at our upcoming K-Culture Lecture.</p></div>{siteConfig.lectureUrl ? <a className="secondary-button" href={siteConfig.lectureUrl} target="_blank" rel="noopener noreferrer">Explore the K-Culture Lecture ↗</a> : <div className="lecture-pending"><span>Details Coming Soon</span><button className="secondary-button" disabled>Explore the K-Culture Lecture →</button></div>}</section>
    <div className="restart-section"><Character expression="laughing"/><div><h2>Another adventure awaits.</h2><button className="text-button" onClick={onRestart}>Try Again <span aria-hidden="true">↻</span></button></div></div><p className="result-disclaimer">Just for fun. Your answers stay in this browser session.</p>
  </div>;
}

export default function App() {
  const [state, setState] = useState<QuizState>(() => {try {return restoreState(sessionStorage.getItem(SESSION_KEY));} catch {return {...initialState, answers: []};}});
  const [busy, setBusy] = useState(false);
  const timer = useRef<number | null>(null), locked = useRef(false);
  useEffect(() => {try {sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));} catch {/* The quiz also works when browser storage is unavailable. */}}, [state]);
  useEffect(() => {window.scrollTo({top: 0, behavior: 'instant'});}, [state.screen, state.current]);
  useEffect(() => () => {if (timer.current !== null) clearTimeout(timer.current);}, []);
  useEffect(() => { if (state.screen !== 'quiz') return; ['thinking','confused','suspicious','confident','love','laughing'].forEach(name=>{const img=new Image(); img.src=`./assets/characters/${name}.webp`;}); }, [state.screen]);
  function start() {locked.current=false; setBusy(false); setState({screen:'quiz', current:0, answers:[]});}
  function answer(value: Answer) {
    if (locked.current) return;
    locked.current=true; setBusy(true);
    const answers=[...state.answers]; answers[state.current]=value;
    setState({...state,answers});
    timer.current=window.setTimeout(()=>{
      setState({screen:state.current===4?'sorting':'quiz',current:Math.min(4,state.current+1),answers});
      locked.current=false; setBusy(false);
    },200);
  }
  function back() {if (locked.current) return; setState({...state,screen:state.current===0?'welcome':'quiz',current:Math.max(0,state.current-1)});}
  const finishSorting = useRef(() => setState(prev=>({...prev,screen:'result'}))).current;
  return <div className={`app screen-${state.screen}`}><Ambient/><header className="site-header"><Brand/></header><main id="main-content">
    {state.screen==='welcome' && <Welcome onStart={start}/>}
    {state.screen==='quiz' && <Quiz state={state} busy={busy} onAnswer={answer} onBack={back}/>}
    {state.screen==='sorting' && <Sorting onComplete={finishSorting}/>}
    {state.screen==='result' && <Result state={state} onRestart={start}/>}
    {state.screen==='error' && <section className="error-screen"><Character expression="confused"/><h1>Oops! The Magical Gat got a little confused. Let’s try again!</h1><button className="primary-button" onClick={start}>Restart Quiz <Sparkle/></button></section>}
  </main>{state.screen!=='result'&&<Skyline/>}</div>;
}
