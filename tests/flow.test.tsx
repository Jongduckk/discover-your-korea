import test from 'node:test';
import assert from 'node:assert/strict';
import React, { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { JSDOM } from 'jsdom';
import App from '../src/App';
import { SESSION_KEY } from '../src/quiz';

function setup() {
  const dom = new JSDOM('<div id="root"></div>', { url: 'http://localhost:5173' });
  Object.assign(globalThis, { window: dom.window, document: dom.window.document, HTMLElement: dom.window.HTMLElement, Image: dom.window.Image, sessionStorage: dom.window.sessionStorage, IS_REACT_ACT_ENVIRONMENT: true });
  window.scrollTo=()=>{};
  window.matchMedia=(()=>({matches:false,addEventListener(){},removeEventListener(){}})) as typeof window.matchMedia;
  return dom;
}
function button(text: string): HTMLButtonElement {
  const found=Array.from(document.querySelectorAll('button')).find(el=>el.textContent?.includes(text));
  assert.ok(found,`button exists: ${text}`);return found;
}
async function click(el: HTMLButtonElement) {await act(async()=>el.click());}
async function answer(index:number) {
  const buttons=document.querySelectorAll<HTMLButtonElement>('.answer-button');
  assert.equal(buttons.length,4);await click(buttons[index]);
  await act(async()=>{await new Promise(resolve=>setTimeout(resolve,230));});
}
test('complete UI flow: quick double tap, back, refresh, sorting, result, and restart',async()=>{
  const dom=setup();const container=document.getElementById('root')!;let root:Root=createRoot(container);
  try {
    await act(async()=>root.render(<App/>));
    assert.match(container.textContent!,/DiscoverYour Seoul/);
    assert.ok(document.querySelector('img[src$="rocket.webp"]'));
    await click(button('Start the Sorting'));
    const first=document.querySelector<HTMLButtonElement>('.answer-button')!;
    await act(async()=>{first.click();first.click();});
    await act(async()=>{await new Promise(resolve=>setTimeout(resolve,230));});
    assert.match(document.querySelector('.question-count')!.textContent!,/2/);
    await click(button('Back'));
    assert.equal(document.querySelectorAll('.answer-button.selected').length,1);
    await answer(3);await answer(0);
    assert.equal(JSON.parse(sessionStorage.getItem(SESSION_KEY)!).current,2);
    await act(async()=>root.unmount());root=createRoot(container);
    await act(async()=>root.render(<App/>));
    assert.match(document.querySelector('.quiz-title')!.textContent!,/time for a break/);
    await answer(0);await answer(2);await answer(2);
    assert.ok(document.querySelector('.sorting-screen'));
    await act(async()=>{await new Promise(resolve=>setTimeout(resolve,2750));});
    assert.match(document.querySelector('.result-reveal h1')!.textContent!,/Seongsu/);
    assert.equal(document.querySelectorAll('.spot-card').length,3);
    assert.equal(document.querySelectorAll('.official-links a[target="_blank"]').length,2);
    assert.ok(button('Explore the K-Culture Lecture').disabled);
    assert.equal(document.activeElement,document.querySelector('.result-reveal h1'));
    await click(button('Try Again'));
    assert.deepEqual(JSON.parse(sessionStorage.getItem(SESSION_KEY)!).answers,[]);
    assert.match(document.querySelector('.question-count')!.textContent!,/1/);
  } finally {await act(async()=>root.unmount());dom.window.close();}
});
test('invalid persisted responses offer a working restart',async()=>{
  const dom=setup();sessionStorage.setItem(SESSION_KEY,'broken json');const root=createRoot(document.getElementById('root')!);
  try {
    await act(async()=>root.render(<App/>));assert.ok(document.querySelector('.error-screen'));
    await click(button('Restart Quiz'));assert.equal(document.querySelectorAll('.answer-button').length,4);
  } finally {await act(async()=>root.unmount());dom.window.close();}
});
test('blocked browser storage never prevents the quiz from starting',async()=>{
  const dom=setup();Object.defineProperty(globalThis,'sessionStorage',{configurable:true,get(){throw new Error('Storage unavailable');}});
  const root=createRoot(document.getElementById('root')!);
  try {
    await act(async()=>root.render(<App/>));await click(button('Start the Sorting'));await answer(0);
    assert.match(document.querySelector('.question-count')!.textContent!,/2/);
  } finally {await act(async()=>root.unmount());dom.window.close();delete (globalThis as any).sessionStorage;}
});
