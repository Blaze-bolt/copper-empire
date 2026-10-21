import {sampleAuras} from './aura-sampler.js';
self.onmessage=event=>{try{self.postMessage({counts:sampleAuras(event.data.quantity)});}catch(error){self.postMessage({error:error.message});}};
