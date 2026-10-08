const FIREBASE_CONFIG = window.PLACEMENT_RADAR_FIREBASE_CONFIG || {};
const FIREBASE_READY = FIREBASE_CONFIG.apiKey && !String(FIREBASE_CONFIG.apiKey).startsWith("YOUR_");

const PRAuth = (() => {
  let resolveReady;
  const readyPromise = new Promise(resolve => resolveReady = resolve);
  let user = null;
  let auth = null;
  let db = null;

  function configReady(){ return !!(window.firebase && FIREBASE_READY); }

  async function init(){
    if(!configReady()) {
      try {
        const demo = JSON.parse(localStorage.getItem("placementRadarDemoSession") || "null");
        if(demo && demo.uid === "demo-user-001") user = demo;
      } catch(e) { user = null; }
      resolveReady(user);
      PR.renderUserUI();
      return;
    }
    try{
      if(!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
      auth=firebase.auth();
      db=firebase.firestore();
      auth.onAuthStateChanged(async u=>{
        user=u || null;
        if(user) await PR.hydrateFromCloud();
        resolveReady(user);
        PR.renderUserUI();
      });
    }catch(e){ console.error(e); resolveReady(null); }
  }

  return {
    init, ready:()=>readyPromise, getUser:()=>user, getAuth:()=>auth, getDb:()=>db,
    isConfigured:()=>configReady(),
    async emailLogin(email,password){
      if(!configReady()) {
        if(email.trim().toLowerCase() === "demo" && password === "RadarDemo123") {
          user = {uid:"demo-user-001", email:"demo@placementradar.local", displayName:"Demo Student", photoURL:null, isDemo:true};
          localStorage.setItem("placementRadarDemoSession", JSON.stringify(user));
          resolveReady(user);
          PR.renderUserUI();
          return {user};
        }
        const err = new Error("For the demo, use username demo and password RadarDemo123.");
        err.code = "demo/invalid-credentials";
        throw err;
      }
      return auth.signInWithEmailAndPassword(email,password);
    },
    async emailSignup(email,password,name){
      if(!configReady()) throw new Error("Demo mode is active. Use the demo Sign In credentials shown on this page, or configure Firebase for real account creation.");
      const cred=await auth.createUserWithEmailAndPassword(email,password);
      if(name) await cred.user.updateProfile({displayName:name});
      if(db) await db.collection("users").doc(cred.user.uid).collection("app").doc("state").set({account:{name:name||email,email:email,photoURL:null,authProvider:"password",createdAt:firebase.firestore.FieldValue.serverTimestamp()}},{merge:true});
      return cred;
    },
    async resetPassword(email){
      if(!configReady()) throw new Error("Firebase is not configured yet. Add your Firebase Web App configuration in js/firebase-config.js.");
      return auth.sendPasswordResetEmail(email);
    },
    async googleLogin(){
      if(!configReady()) throw new Error("Firebase is not configured yet. Add your Firebase Web App configuration in js/firebase-config.js.");
      const provider=new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({prompt:"select_account"});
      return auth.signInWithPopup(provider);
    },
    async logout(){
      if(auth) await auth.signOut();
      if(user?.isDemo) localStorage.removeItem("placementRadarDemoSession");
      user=null;
      PR.renderUserUI();
    }
  };
})();

const PR = {
  WORKSPACE_KEYS:new Set(["profile","answers","result","plan","adaptivePlan","progressLogs","diagnosticMeta","questionBank","done"]),
  GLOBAL_KEYS:new Set(["diagnosticHistory","activeDiagnosticId","account"]),
  _uid(){ return PRAuth.getUser()?.uid || "guest"; },
  _activeId(){ return localStorage.getItem(`pr_${this._uid()}_activeDiagnosticId`) || ""; },
  _key(key){
    const uid=this._uid();
    if(this.WORKSPACE_KEYS.has(key)){
      let id=this._activeId();
      if(!id) id=this.ensureActiveDiagnosticSync();
      return `pr_${uid}_diag_${id}_${key}`;
    }
    return `pr_${uid}_${key}`;
  },
  _legacyKey(key){ return `pr_${this._uid()}_${key}`; },
  ensureActiveDiagnosticSync(){
    const uid=this._uid();
    let id=localStorage.getItem(`pr_${uid}_activeDiagnosticId`);
    if(id) return id;
    const history=this.get("diagnosticHistory",[]);
    const legacyProfile=localStorage.getItem(this._legacyKey("profile"));
    const legacyResult=localStorage.getItem(this._legacyKey("result"));
    const legacyHistory=Array.isArray(history)?history:[];
    const latest=legacyHistory.find(d=>d?.result && d?.profile);
    id=latest?.id || `diag_${Date.now()}`;
    localStorage.setItem(`pr_${uid}_activeDiagnosticId`,id);
    const keys=["profile","answers","result","plan","adaptivePlan","progressLogs","diagnosticMeta","questionBank","done"];
    keys.forEach(k=>{
      const old=localStorage.getItem(this._legacyKey(k));
      if(old!==null) localStorage.setItem(`pr_${uid}_diag_${id}_${k}`,old);
    });
    if(!legacyProfile && latest?.profile) localStorage.setItem(`pr_${uid}_diag_${id}_profile`,JSON.stringify(latest.profile));
    if(!legacyResult && latest?.result) localStorage.setItem(`pr_${uid}_diag_${id}_result`,JSON.stringify(latest.result));
    if(latest?.plan && !localStorage.getItem(`pr_${uid}_diag_${id}_adaptivePlan`)) localStorage.setItem(`pr_${uid}_diag_${id}_adaptivePlan`,JSON.stringify(latest.plan));
    if(latest?.progressLogs && !localStorage.getItem(`pr_${uid}_diag_${id}_progressLogs`)) localStorage.setItem(`pr_${uid}_diag_${id}_progressLogs`,JSON.stringify(latest.progressLogs));
    return id;
  },
  async ensureActiveDiagnostic(){
    const id=this.ensureActiveDiagnosticSync();
    const history=this.get("diagnosticHistory",[]);
    const current=this.get("result",null);
    if(current && !history.some(d=>d.id===id)) await this.saveDiagnosticSnapshot();
    return id;
  },
  setActiveDiagnosticId(id){ localStorage.setItem(`pr_${this._uid()}_activeDiagnosticId`,id); },
  getActiveDiagnosticId(){ return this.ensureActiveDiagnosticSync(); },
  save(key,value){
    const storageKey=this._key(key);
    localStorage.setItem(storageKey, JSON.stringify(value));
    return this.cloudSave(key,value);
  },
  get(key,fallback=null){ try{return JSON.parse(localStorage.getItem(this._key(key))) ?? fallback}catch(e){return fallback} },
  async cloudSave(key,value){
    const u=PRAuth.getUser(), db=PRAuth.getDb();
    if(!u || !db) return;
    try{
      const cloudKey=this.WORKSPACE_KEYS.has(key) ? `diag_${this.getActiveDiagnosticId()}_${key}` : key;
      await db.collection("users").doc(u.uid).collection("app").doc("state").set({[cloudKey]:value,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});
    }catch(e){ console.warn("Cloud save failed",e); }
  },
  async hydrateFromCloud(){
    const u=PRAuth.getUser(), db=PRAuth.getDb();
    if(!u || !db) return;
    try{
      const snap=await db.collection("users").doc(u.uid).collection("app").doc("state").get();
      if(snap.exists){
        const data=snap.data()||{};
        Object.entries(data).forEach(([k,v])=>{
          if(k!=="updatedAt"){
            if(k.startsWith("diag_")) localStorage.setItem(`pr_${u.uid}_${k}`,JSON.stringify(v));
            else localStorage.setItem(`pr_${u.uid}_${k}`,JSON.stringify(v));
          }
        });
      } else await this.cloudSave("account",{name:u.displayName,email:u.email,photoURL:u.photoURL});
      this.ensureActiveDiagnosticSync();
    }catch(e){ console.warn("Cloud hydration failed",e); }
  },
  profile(){ return this.get("profile",{}); },
  answers(){ return this.get("answers",{}); },
  setProfile(p){this.save("profile",p)},
  setAnswers(a){this.save("answers",a)},
  _historyEntryFromActive(existing=null){
    const result=this.get("result",null), profile=this.get("profile",null);
    if(!result && !profile) return existing;
    const now=new Date().toISOString();
    return {
      ...(existing||{}),
      id:this.getActiveDiagnosticId(),
      createdAt:existing?.createdAt||now,
      updatedAt:now,
      status:result ? "completed" : (profile ? "in-progress" : "draft"),
      profile:profile||existing?.profile||{},
      result:result ? {...result,savedFromCurrent:true} : existing?.result||null,
      plan:this.get("adaptivePlan",this.get("plan",existing?.plan||null)),
      progressLogs:this.get("progressLogs",existing?.progressLogs||{}),
      diagnosticMeta:this.get("diagnosticMeta",existing?.diagnosticMeta||null),
      answers:this.get("answers",existing?.answers||{}),
      questionBank:this.get("questionBank",existing?.questionBank||[])
    };
  },
  async saveDiagnosticSnapshot(){
    const history=this.get("diagnosticHistory",[]);
    const id=this.getActiveDiagnosticId();
    const existing=history.find(d=>d.id===id);
    const entry=this._historyEntryFromActive(existing);
    if(!entry) return null;
    const next=history.filter(d=>d.id!==id);
    next.unshift(entry);
    await this.saveGlobal("diagnosticHistory",next);
    return entry;
  },
  async saveGlobal(key,value){
    const uid=this._uid();
    localStorage.setItem(`pr_${uid}_${key}`,JSON.stringify(value));
    const u=PRAuth.getUser(),db=PRAuth.getDb();
    if(u&&db){ try{ await db.collection("users").doc(u.uid).collection("app").doc("state").set({[key]:value,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}); }catch(e){console.warn("Cloud save failed",e);} }
  },
  async archiveCurrentDiagnostic(){ return this.saveDiagnosticSnapshot(); },
  getDiagnosticHistory(){ return this.getGlobal("diagnosticHistory",[]); },
  getGlobal(key,fallback=null){ try{return JSON.parse(localStorage.getItem(`pr_${this._uid()}_${key}`)) ?? fallback}catch(e){return fallback} },
  async updateLatestDiagnosticSnapshot(){ return this.saveDiagnosticSnapshot(); },
  async startNewDiagnostic(){
    await this.ensureActiveDiagnostic();
    await this.saveDiagnosticSnapshot();
    const id=`diag_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    this.setActiveDiagnosticId(id);
    const empty={profile:null,answers:{},result:null,plan:null,adaptivePlan:null,progressLogs:{},diagnosticMeta:null,questionBank:[],done:[]};
    Object.entries(empty).forEach(([k,v])=>localStorage.setItem(this._key(k),JSON.stringify(v)));
    return id;
  },
  async deleteDiagnostic(id){
    if(!id) return false;
    const uid=this._uid();
    const history=this.getDiagnosticHistory();
    const target=history.find(d=>d.id===id);
    if(!target) return false;
    const remaining=history.filter(d=>d.id!==id);
    const prefix=`pr_${uid}_diag_${id}_`;
    Object.keys(localStorage).filter(k=>k.startsWith(prefix)).forEach(k=>localStorage.removeItem(k));
    await this.saveGlobal("diagnosticHistory",remaining);
    const u=PRAuth.getUser(), db=PRAuth.getDb();
    if(u&&db){
      try{
        await db.collection("users").doc(u.uid).collection("app").doc("state").set({[`diag_${id}_profile`]:firebase.firestore.FieldValue.delete(),[`diag_${id}_answers`]:firebase.firestore.FieldValue.delete(),[`diag_${id}_result`]:firebase.firestore.FieldValue.delete(),[`diag_${id}_plan`]:firebase.firestore.FieldValue.delete(),[`diag_${id}_adaptivePlan`]:firebase.firestore.FieldValue.delete(),[`diag_${id}_progressLogs`]:firebase.firestore.FieldValue.delete(),[`diag_${id}_diagnosticMeta`]:firebase.firestore.FieldValue.delete(),[`diag_${id}_questionBank`]:firebase.firestore.FieldValue.delete(),[`diag_${id}_done`]:firebase.firestore.FieldValue.delete()}, {merge:true});
      }catch(e){console.warn("Cloud diagnostic delete failed",e);}
    }
    if(id===this.getActiveDiagnosticId()){
      const next=remaining.slice().sort((a,b)=>new Date(b.updatedAt||b.createdAt||0)-new Date(a.updatedAt||a.createdAt||0))[0];
      if(next){
        this.setActiveDiagnosticId(next.id);
        const values={profile:next.profile||null,result:next.result||null,adaptivePlan:next.plan||null,progressLogs:next.progressLogs||{},diagnosticMeta:next.diagnosticMeta||null,answers:next.answers||{},questionBank:next.questionBank||[],done:[]};
        Object.entries(values).forEach(([k,v])=>localStorage.setItem(`pr_${uid}_diag_${next.id}_${k}`,JSON.stringify(v)));
      }else{
        const fresh=`diag_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
        this.setActiveDiagnosticId(fresh);
        const empty={profile:null,answers:{},result:null,plan:null,adaptivePlan:null,progressLogs:{},diagnosticMeta:null,questionBank:[],done:[]};
        Object.entries(empty).forEach(([k,v])=>localStorage.setItem(`pr_${uid}_diag_${fresh}_${k}`,JSON.stringify(v)));
      }
    }
    return true;
  },
  async activateDiagnostic(id){
    if(!id) return false;
    await this.ensureActiveDiagnostic();
    if(id===this.getActiveDiagnosticId()) return true;
    await this.saveDiagnosticSnapshot();
    const history=this.getDiagnosticHistory();
    const target=history.find(d=>d.id===id);
    if(target){
      this.setActiveDiagnosticId(id);
      const values={profile:target.profile||null,result:target.result||null,adaptivePlan:target.plan||null,progressLogs:target.progressLogs||{},diagnosticMeta:target.diagnosticMeta||null,answers:target.answers||{},questionBank:target.questionBank||[],done:[]};
      Object.entries(values).forEach(([k,v])=>localStorage.setItem(this._key(k),JSON.stringify(v)));
      await this.saveDiagnosticSnapshot();
      return true;
    }
    return false;
  },
  reset(){ return this.startNewDiagnostic(); },
  async requireAuth(){
    const u=await PRAuth.ready();
    if(!u){ location.href="index.html"; return false; }
    await this.ensureActiveDiagnostic();
    return true;
  },
  renderUserUI(){
    const nav=document.querySelector(".nav"); if(!nav) return;
    let box=document.getElementById("userMenu");
    if(!box){
      box=document.createElement("div"); box.id="userMenu"; box.className="user-menu";
      const right=nav.querySelector(".nav-right"); (right||nav).appendChild(box);
    }
    const u=PRAuth.getUser();
    const isLanding=location.pathname.endsWith("/") || location.pathname.endsWith("/index.html");
    const landingLinks=document.getElementById("landingNavLinks");
    const landingRight=document.getElementById("landingNavRight");
    const landingLogin=document.getElementById("landingLoginBtn");
    const landingDiagnostics=document.getElementById("landingDiagnosticsBtn");
    const homePanel=document.getElementById("loggedInHomeActions");
    if(u){
      const name=u.displayName || (u.isDemo ? "Demo Student" : u.email || "Student");
      const photo=u.photoURL?`<img src="${u.photoURL}" alt="">`:``;
      box.innerHTML=`${photo}<span class="user-greeting">Hi, ${name}</span><button class="btn btn-ghost btn-small" onclick="PRAuth.logout().then(()=>location.href='index.html')">Logout</button>`;
      if(isLanding){
        landingLinks?.classList.add("is-visible"); landingRight?.classList.add("is-visible");
        landingLogin?.classList.add("hidden"); landingDiagnostics?.classList.remove("hidden");
        homePanel?.classList.remove("hidden");
        const nameEl=document.getElementById("homeUserName"); if(nameEl) nameEl.textContent=name;
      }
    }else{
      box.innerHTML=``;
      if(isLanding){
        landingLinks?.classList.remove("is-visible");
        landingRight?.classList.add("is-visible");
        landingLogin?.classList.remove("hidden");
        landingDiagnostics?.classList.add("hidden");
        homePanel?.classList.add("hidden");
      }
    }
  }
};
function requireProfile(){ if(!PR.profile().targetRole){ location.href="profile.html"; } }

const PRProgress = {
  getPlan(){ return PR.get("adaptivePlan", null); },
  savePlan(plan){ PR.save("adaptivePlan", plan); },
  getLogs(){ return PR.get("progressLogs", {}); },
  saveLogs(logs){ PR.save("progressLogs", logs); },
  getDay(day){ return this.getLogs()[day] || null; },
  completeDay(day, data){
    const logs=this.getLogs();
    logs[day]={...(logs[day]||{}),...data,completed:true,completedAt:new Date().toISOString()};
    this.saveLogs(logs);
  },
  daysCompleted(){ return Object.values(this.getLogs()).filter(x=>x.completed).length; }
};

window.addEventListener("DOMContentLoaded",()=>PRAuth.init());
