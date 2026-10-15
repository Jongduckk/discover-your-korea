import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateDestination, restoreState } from '../src/quiz.ts';
import { destinationOrder, letters, questions } from '../src/content.ts';

// Independent transcription of the PRD table catches content mapping mistakes.
const specification = [
  [['J','S'],['M','G'],['H','M'],['S','J']],
  [['H','S'],['G','M'],['J','M'],['M','G']],
  [['S','H'],['G','M'],['M','H'],['J','S']],
  [['G','M'],['H','M'],['S','H'],['J','S']],
  [['M','H'],['H','S'],['S','G'],['G','M']],
];
test('all 20 scoring mappings and the five four-choice questions match the PRD',()=>{
  assert.equal(questions.length,5);
  for (let q=0;q<5;q++) {
    assert.equal(questions[q].options.length,4);
    for(let a=0;a<4;a++) assert.deepEqual(questions[q].options[a].slice(2),specification[q][a]);
  }
});
test('PRD example returns Jongno',()=>assert.equal(calculateDestination(['A','C','D','D','A']),'J'));
test('every answer combination has the correct winner and reverse-question tiebreak',()=>{
  const reached=new Set(); let ties=0, earlierTie=0;
  for(let n=0;n<1024;n++) {
    const indices=Array.from({length:5},(_,i)=>(n>>(i*2))&3);
    const scores:Record<string,number>={J:0,M:0,H:0,S:0,G:0};
    indices.forEach((a,q)=>{const [first,second]=specification[q][a];scores[first]+=2;scores[second]++;});
    const max=Math.max(...Object.values(scores));
    const tied=destinationOrder.filter(code=>scores[code]===max);
    let winner=tied[0];
    if(tied.length>1) {ties++;if(!tied.includes(specification[4][indices[4]][0] as typeof winner)) earlierTie++;}
    for(let q=4;q>=0;q--) {const first=specification[q][indices[q]][0];if(tied.includes(first as typeof winner)){winner=first as typeof winner;break;}}
    const actual=calculateDestination(indices.map(a=>letters[a]));
    assert.equal(actual,winner,`combination ${n}`); reached.add(actual);
  }
  assert.equal(reached.size,5);assert.ok(ties>0);assert.ok(earlierTie>0);
});
test('changed answers are recalculated without accumulating the previous score',()=>{
  const answers=['A','C','D','D','A'];assert.equal(calculateDestination(answers),'J');
  answers.splice(0,5,'B','B','B','A','D');assert.equal(calculateDestination(answers),'G');
});
test('incomplete, invalid, extra, and sparse answers are rejected',()=>{
  for(const answers of [[],['A'],['A','B','C','D','X'],['A','B','C','D',null],['A','B','C','D','A','A'],new Array(5)]) assert.throws(()=>calculateDestination(answers));
});
test('refresh restores the current question, past answers, and result',()=>{
  const progress={screen:'quiz',current:2,answers:['A','C']};assert.deepEqual(restoreState(JSON.stringify(progress)),progress);
  const result={screen:'result',current:4,answers:['A','C','D','D','A']};assert.deepEqual(restoreState(JSON.stringify(result)),result);
});
test('corrupted state gets a restart screen, while an empty session starts normally',()=>{
  for(const raw of ['oops','null','{}',JSON.stringify({screen:'quiz',current:3,answers:['A']}),JSON.stringify({screen:'result',current:4,answers:['A']}),JSON.stringify({screen:'quiz',current:0,answers:['X']})]) assert.equal(restoreState(raw).screen,'error');
  assert.equal(restoreState(null).screen,'welcome');
});
