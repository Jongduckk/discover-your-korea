import { useId } from 'react';
import type { DestinationCode } from './content';

export function Cloud({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 280 90" fill="none" aria-hidden="true"><path d="M4 66h209c31 0 31-37 8-37-18 0-23 22-9 22 13 0 12-18-2-24-3-30-43-30-49-8-16-14-43-4-40 17H64c-25 0-27 30-5 30h70M33 82h212c25 0 30-27 12-32M77 21h20m-10-10v20" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/><path d="M87 52h82m-39-14h26M16 79h12" stroke="currentColor" strokeWidth="1.3"/></svg>;
}

function Roof({ x = 0, y = 0, scale = 1 }: { x?: number; y?: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><path d="M12 35h106v45H12z" fill="#31464a"/><path d="M20 42h90v32H20z" fill="#bc8465"/><path d="M-3 36Q22 31 27 15h76q8 18 30 21-62 15-136 0Z" fill="#172e36" stroke="#bdac83" strokeWidth="1.5"/><path d="M21 17Q65 5 109 17M13 37h108M25 46h80" fill="none" stroke="#bca880" strokeWidth="1.3"/><path d="M32 48v27m20-27v27m23-27v27m22-27v27" stroke="#433e36" strokeWidth="4"/><path d="M9 79h110" stroke="#d4b389" strokeWidth="4"/></g>;
}

export function Scene({ code, className = '', variant = '' }: { code: DestinationCode; className?: string; variant?: string }) {
  const id = useId().replaceAll(':', '');
  const palettes = { J: ['#493c70', '#c08d8d'], M: ['#503457', '#cc9390'], H: ['#323e75', '#b38eaa'], S: ['#244d4a', '#afc3a1'], G: ['#263e62', '#a4b9d2'] };
  const [top, bottom] = palettes[code];
  return <svg className={`scene ${className}`} viewBox="0 0 500 250" role="img" aria-label={`Original illustration of ${variant || { J: 'Jongno’s palace rooftops', M: 'Namsan and the city lights', H: 'Hongdae’s creative streets', S: 'Seongsu and Seoul Forest', G: 'the Gangnam and Jamsil skyline' }[code]}`} preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id={`sky${id}`} x2="0" y2="1"><stop stopColor={top}/><stop offset="1" stopColor={bottom}/></linearGradient><linearGradient id={`land${id}`} x2="0" y2="1"><stop stopColor="#243a43"/><stop offset="1" stopColor="#172933"/></linearGradient></defs>
    <rect width="500" height="250" fill={`url(#sky${id})`}/><circle cx="370" cy="61" r="27" fill="#f4deae" opacity=".85"/>
    <g fill="#fce8c3" opacity=".7">{[[55,34],[132,62],[218,28],[290,76],[454,43],[411,106]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={i%2?1:1.7}/>)}</g>
    <path d="M0 172 70 119 133 151 220 97 304 148 384 110 500 161V250H0Z" fill="#243344" opacity=".32"/>
    {code === 'J' && <><path d="M0 205Q120 165 244 197T500 190V250H0Z" fill="#41505a"/><Roof x={22} y={136} scale={1.2}/><Roof x={182} y={117} scale={1.5}/><Roof x={367} y={155} scale={1}/></>}
    {code === 'M' && <><path d="M67 238Q178 87 304 180L396 250Z" fill="#263a48"/><path d="M225 142v-65m-9 20h18l-3 10h-12Zm8-28V48" stroke="#f3d7af" strokeWidth="3" fill="#bd9b95"/>{[0,42,91,326,365,414,460].map((x,i)=><g key={x}><rect x={x} y={183-i%3*17} width="32" height="80" fill={i%2?'#3d4055':'#222e42'}/><path d={`M${x+8} 209h4m8 0h4m-16 12h4m8 0h4`} stroke="#efcb8f" strokeWidth="4"/></g>)}</>}
    {code === 'H' && <><path d="M0 224h500v26H0z" fill="#25263d"/>{[20,118,218,325,420].map((x,i)=><g key={x}><rect x={x} y={123+i%2*18} width="77" height="110" fill={['#433f5c','#666078','#a16f7d'][i%3]}/><path d={`M${x-4} ${122+i%2*18}h85`} stroke="#e2ac93" strokeWidth="4"/><rect x={x+12} y="173" width="53" height="40" fill="#e6b299" opacity=".6"/><path d={`M${x+22} 150h30`} stroke="#f5d5b0" strokeWidth="4"/></g>)}<path d="M43 76q200 65 412 0" fill="none" stroke="#e1bcb0"/>{[68,130,195,260,325,390,444].map((x,i)=><circle key={x} cx={x} cy={85+Math.sin(i/6*Math.PI)*24} r="3" fill="#ffe3a5"/>)}<path d="m264 156 0-35 24-5v31m-24 8c-13-5-16 14-3 10 5-1 5-5 3-10m24-8c-13-5-16 14-3 10 5-1 5-5 3-10" stroke="#f6d5ac" fill="none" strokeWidth="3"/></>}
    {code === 'S' && <><path d="M0 205q150-59 280 3t220-6v48H0Z" fill="#566f60"/>{[36,82,127,358,405,453].map((x,i)=><g key={x}><path d={`M${x} 240V${128+i%2*20}`} stroke="#3c4c43" strokeWidth="5"/><ellipse cx={x} cy={143+i%2*15} rx="27" ry="44" fill={i%2?'#436e5d':'#729481'}/></g>)}<rect x="168" y="150" width="151" height="83" fill="#c29478"/><path d="M160 150h167v-12H160z" fill="#334d4b"/><path d="M182 173h33v43h-33zm48 0h33v43h-33zm48 0h25v61h-25z" fill="#efc9a0"/><path d="M214 250q40-38 70-16" stroke="#c8c7a2" strokeWidth="18" fill="none"/></>}
    {code === 'G' && <><path d="M0 228h500v22H0z" fill="#4a6477"/>{[26,80,139,214,345,405,461].map((x,i)=><g key={x}><rect x={x} y={117+i%3*28} width="36" height="125" fill={i%2?'#344f68':'#253c54'}/>{[0,1,2,3].map(n=><path key={n} d={`M${x+7} ${145+n*20}h22`} stroke="#9fb7bb" strokeWidth="2"/>)}</g>)}<path d="M284 229 291 81 305 31 318 81 326 229Z" fill="#7294a8"/><path d="M305 41v188m-14-129h28m-30 29h31m-33 28h35m-36 29h38" stroke="#d2d6c4" opacity=".7"/><path d="M0 239q125-8 250 1t250-2" fill="none" stroke="#b3c1bd"/></>}
    <path d="M0 246q100-15 200 0t300-1v5H0Z" fill={`url(#land${id})`}/>
  </svg>;
}

export function Skyline() {
  return <svg className="skyline" viewBox="0 0 1440 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><path d="M0 220v-34l75-35 75 20 82-58 102 66 82-25 89 42 93-31 113 36 80-19 106 18 82-46 116 30 102-43 88 38 80-16v72Z" fill="#1a2c39"/><g fill="#14232e" stroke="#536051" strokeWidth=".8"><path d="M725 212V147h63v65m-72-64q40-6 40-25 12 21 40 25Zm17-22 11-17h24l11 17M750 110V96h9v14"/><path d="m232 218 7-100 8-30 8 30 7 100M246 88V68m-16 55h34M1082 219V107l20-54 18 54v112m-24-146v146m-9-69h29"/><path d="M54 220v-45h60v45m-69-47q36-6 39-22 5 18 39 22ZM1235 220v-45h90v45m-100-46q50-8 55-28 7 21 55 28Z"/>{[350,390,430,920,950,995].map((x,i)=><path key={x} d={`M${x} 220v-${40+i%3*13}h26v${40+i%3*13}Z`}/>)}</g></svg>;
}
