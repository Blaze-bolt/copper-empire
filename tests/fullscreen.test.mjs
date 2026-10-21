import test from 'node:test';
import assert from 'node:assert/strict';
import {createFullscreenControl} from '../src/empire/fullscreen.js';
function fixture(){const listeners={},button={attributes:{},setAttribute(k,v){this.attributes[k]=v;}};
 const doc={fullscreenEnabled:true,fullscreenElement:null,documentElement:{},querySelectorAll:()=>[button],addEventListener:(name,fn)=>listeners[name]=fn};
 doc.documentElement.requestFullscreen=async()=>{doc.fullscreenElement=doc.documentElement;listeners.fullscreenchange();};
 doc.exitFullscreen=async()=>{doc.fullscreenElement=null;listeners.fullscreenchange();};
 const errors=[],control=createFullscreenControl(doc,message=>errors.push(message));control.sync();return {doc,button,listeners,control,errors};}
test('fullscreen enters and exits the whole document, and follows Esc and rerenders',async()=>{const {doc,button,listeners,control}=fixture();assert.equal(button.attributes['aria-label'],'Enter fullscreen');await control.toggle();assert.equal(doc.fullscreenElement,doc.documentElement);assert.equal(button.attributes['aria-pressed'],'true');assert.match(button.attributes.title,/Esc/);await control.toggle();assert.equal(doc.fullscreenElement,null);await control.toggle();doc.fullscreenElement=null;listeners.fullscreenchange();control.sync();assert.equal(button.attributes['aria-pressed'],'false');});
test('denied fullscreen restores the button; unsupported browsers disable it',async()=>{const {doc,button,control,errors}=fixture();doc.documentElement.requestFullscreen=async()=>{throw Error('denied');};await control.toggle();assert.equal(errors.length,1);assert.equal(button.disabled,false);doc.fullscreenEnabled=false;control.sync();assert.equal(button.disabled,true);assert.match(button.attributes['aria-label'],/unavailable/);});
test('rapid taps make only one fullscreen request',async()=>{const {doc,control,button}=fixture();let finish,count=0;doc.documentElement.requestFullscreen=()=>{count++;return new Promise(resolve=>finish=resolve);};const pending=control.toggle();await control.toggle();assert.equal(count,1);assert.equal(button.disabled,true);finish();await pending;assert.equal(button.disabled,false);});
