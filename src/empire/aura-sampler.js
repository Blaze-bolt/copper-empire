import {AURAS,AURA_DENOMINATOR} from './aura-data.js';

// Hörmann's BTRD transformed rejection proposal (1993). Acceptance below uses
// the binomial PMF ratio itself, not a normal/Poisson/Stirling approximation.
// Algorithm reference: Boost.Random binomial_distribution (Boost Software License).
// Sparse draws use geometric waiting times: an exact Bernoulli-process method.
export function secureUniform(){
 if(!globalThis.crypto?.getRandomValues)throw Error('Secure randomness is unavailable. No purchase was made.');
 const words=new Uint32Array(2);let bits;
 do{crypto.getRandomValues(words);bits=(words[0]>>>5)*67108864+(words[1]>>>6);}while(bits===0);
 return bits/9007199254740992;
}
export function binomial(n,probability,random=secureUniform){
 if(!Number.isSafeInteger(n)||n<0||n>100000000||!Number.isFinite(probability)||probability<0||probability>1)throw Error('Invalid binomial parameters.');
 if(n===0||probability===0)return 0;if(probability===1)return n;
 const flip=probability>.5,p=flip?1-probability:probability,q=1-p;
 let budget=200000;
 const uniform=()=>{if(--budget<0)throw Error('Random sampling budget exceeded. No approximate result was substituted.');const u=random();if(!Number.isFinite(u)||u<=0||u>=1)throw Error('Random source must return a value strictly between zero and one.');return u;};
 const finish=k=>flip?n-k:k;
 const mode=Math.floor((n+1)*p);
 if(mode<11){let position=0,count=0;const logFailure=Math.log1p(-p);
  while(true){position+=Math.floor(Math.log(uniform())/logFailure)+1;if(position>n)return finish(count);count++;}
 }
 const deviation=Math.sqrt(n*p*q),b=1.15+2.53*deviation,a=-.0873+.0248*b+.01*p,c=n*p+.5,alpha=(2.83+5.1/b)*deviation,vr=.92-4.2/b;
 while(true){let v=uniform(),u;
  if(v<=.86*vr){u=v/vr-.43;const k=Math.floor((2*a/(.5-Math.abs(u))+b)*u+c);if(k<0||k>n)throw Error('Invalid rejection envelope.');return finish(k);}
  if(v>=vr)u=uniform()-.5;else{u=v/vr-.93;u=(u<0?-.5:.5)-u;v=uniform()*vr;}
  const distance=.5-Math.abs(u);if(distance<=0)continue;
  const k=Math.floor((2*a/distance+b)*u+c);if(k<0||k>n)continue;
  const threshold=Math.log(v*alpha/(a/(distance*distance)+b));
  let ratio=0,rejected=false;
  // Away from the mode each ratio is <=1. The bound can reject long tails
  // early without truncating them or changing their probability.
  if(k>mode){for(let i=mode+1;i<=k;i++){
   if(--budget<0)throw Error('Exact acceptance budget exceeded. Retry the purchase.');
   const term=Math.log(((n-i+1)*p)/(i*q));ratio+=term;
   if(ratio+(k-i)*Math.min(0,term)<threshold){rejected=true;break;}
  }}else{for(let i=mode;i>k;i--){
   if(--budget<0)throw Error('Exact acceptance budget exceeded. Retry the purchase.');
   const term=Math.log((i*q)/((n-i+1)*p));ratio+=term;
   if(ratio+(i-k-1)*Math.min(0,term)<threshold){rejected=true;break;}
  }}
  if(!rejected&&threshold<=ratio)return finish(k);
 }
}
export function sampleAuras(n,random=secureUniform){
 if(!Number.isSafeInteger(n)||n<1||n>100000000)throw Error('Invalid aura batch.');
 const counts=Object.fromEntries(AURAS.map(a=>[a.id,0]));let remaining=n,weight=AURA_DENOMINATOR;
 // Rare first keeps tiny conditional probabilities stable. The common aura
 // receives the remaining trials, not an expected-value award.
 for(let i=AURAS.length-1;i>0;i--){const a=AURAS[i];counts[a.id]=binomial(remaining,a.weight/weight,random);remaining-=counts[a.id];weight-=a.weight;}
 counts.rusty=remaining;return counts;
}
