// Additive save metadata only. Tutorial completion never grants gameplay rewards.
export const TUTORIAL_VERSION=1;
export const isGuideId=id=>/^(?:[1-9]\d{0,2}|100[1-7]|20(?:0[1-9]|[12]\d|30))(?::[A-C0-3])?$/.test(String(id))&&((Number(String(id).split(':')[0])<=119)||Number(String(id).split(':')[0])>=1001);
export function tutorialDefaults(s){
 const t=s.tutorials??={schema:1,completed:{}};
 if(t.schema!==1||!t.completed||Array.isArray(t.completed)||typeof t.completed!=='object')throw Error('Unsupported tutorial history. Your save is preserved.');
 for(const[id,v]of Object.entries(t.completed))if(!isGuideId(id)||!Number.isSafeInteger(v)||v<1||v>1000)throw Error('Invalid tutorial completion.');
 if(s.settings.firstTimeTutorials===undefined)s.settings.firstTimeTutorials=true;
 if(typeof s.settings.firstTimeTutorials!=='boolean')throw Error('Invalid tutorial preference.');
 return t;
}
export const tutorialSeen=(s,id,version=TUTORIAL_VERSION)=>(tutorialDefaults(s).completed[id]||0)>=version;
export const needsTutorial=(s,id,version=TUTORIAL_VERSION)=>s.settings.firstTimeTutorials!==false&&!tutorialSeen(s,id,version);
export function completeTutorial(s,id,version=TUTORIAL_VERSION){if(!isGuideId(id))throw Error('Unknown tutorial.');const t=tutorialDefaults(s);if((t.completed[id]||0)>=version)return false;t.completed[id]=version;return true;}
// A grow-only map. Merge ONLY this metadata; never merge currencies or attempts.
export function mergeTutorials(target,...sources){const before=JSON.stringify(tutorialDefaults(target));for(const s of sources){if(!s?.tutorials)continue;const t=tutorialDefaults(s);for(const[id,v]of Object.entries(t.completed))target.tutorials.completed[id]=Math.max(target.tutorials.completed[id]||0,v);}return before!==JSON.stringify(target.tutorials);}
