import{q as se,r as d,j as t,y as w,ab as Mt,m as M,C as oe,ac as le,a5 as ce,ad as de,b as me,a3 as R,a4 as Se,I as X,B as N,G as ze,S as Pt,ae as Tt,X as Et,af as Re,U as Ot,c as ie,ag as Wt,u as $e,ah as E,F as Ce,g as Bt,ai as _t,i as Lt,A as zt}from"./index-BudmV_mG.js";import{u as Ye,L as Rt}from"./useAdminAuth-DjxjtXrh.js";import{L as $}from"./loader-circle-Cohsv9PB.js";import{L as He,T as ye}from"./trash-2-BsN1arpg.js";import{R as $t,T as Yt,c as qe,P as Ht,W as qt,C as It,a as Vt,D as Xt,b as Ie,O as Jt,d as Qt,e as Ut,f as Gt,g as Kt,h as Zt,i as ea}from"./dialog-DpxbSrFY.js";import{U as ke,H as ta}from"./user-check-DU5vJmpC.js";import{D as aa}from"./download-CTbs6agb.js";import{S as sa}from"./search-R587z0Ov.js";import{T as Pe}from"./textarea-DKhPfgG4.js";import{E as ra}from"./eye-BsSp4prr.js";import{S as ge}from"./send-DNk5V4Jp.js";import"./Combination-CEFkor0o.js";const na=se("Pen",[["path",{d:"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",key:"1a8usu"}]]);const ia=se("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]]);const oa=se("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]);const la=se("Shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);const Te=se("TriangleAlert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);const De=se("UserX",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["line",{x1:"17",x2:"22",y1:"8",y2:"13",key:"3nzzx3"}],["line",{x1:"22",x2:"17",y1:"8",y2:"13",key:"1swrse"}]]),ca=Mt("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",{variants:{variant:{default:"bg-background text-foreground",destructive:"border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive"}},defaultVariants:{variant:"default"}}),Ve=d.forwardRef(({className:e,variant:a,...s},r)=>t.jsx("div",{ref:r,role:"alert",className:w(ca({variant:a}),e),...s}));Ve.displayName="Alert";const da=d.forwardRef(({className:e,...a},s)=>t.jsx("h5",{ref:s,className:w("mb-1 font-medium leading-none tracking-tight",e),...a}));da.displayName="AlertTitle";const Xe=d.forwardRef(({className:e,...a},s)=>t.jsx("div",{ref:s,className:w("text-sm [&_p]:leading-relaxed",e),...a}));Xe.displayName="AlertDescription";function ma({children:e}){const{user:a,isAdmin:s,isLoading:r,signIn:n,signOut:i}=Ye(),[m,c]=d.useState(""),[u,f]=d.useState(""),[x,o]=d.useState(""),[j,P]=d.useState(!1),W=async b=>{b.preventDefault(),o(""),P(!0);const{error:v}=await n(m,u);v&&(v.message.includes("Invalid login credentials")?o("Email ou mot de passe incorrect"):v.message.includes("Email not confirmed")?o("Veuillez confirmer votre email avant de vous connecter"):o(v.message)),P(!1)},D=async()=>{await i(),c(""),f("")};return r?t.jsx("div",{className:"min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4",children:t.jsxs("div",{className:"flex flex-col items-center gap-4",children:[t.jsx($,{className:"h-8 w-8 animate-spin text-primary"}),t.jsx("p",{className:"text-muted-foreground",children:"Vérification de l'accès..."})]})}):a?s?t.jsx(t.Fragment,{children:e}):t.jsx("div",{className:"min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4",children:t.jsx(M.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:t.jsxs(oe,{className:"w-full max-w-md shadow-soft",children:[t.jsxs(le,{className:"text-center",children:[t.jsx("div",{className:"mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 shadow-soft",children:t.jsx(Te,{className:"h-8 w-8 text-destructive"})}),t.jsx(ce,{className:"text-2xl font-bold",children:"Accès refusé"}),t.jsx(de,{className:"text-muted-foreground",children:"Votre compte n'a pas les droits d'administration nécessaires."})]}),t.jsxs(me,{className:"space-y-4",children:[t.jsxs("p",{className:"text-sm text-center text-muted-foreground",children:["Connecté en tant que : ",t.jsx("strong",{children:a.email})]}),t.jsx("p",{className:"text-sm text-center text-muted-foreground",children:"Contactez un administrateur pour obtenir l'accès."}),t.jsxs(N,{variant:"outline",className:"w-full",onClick:D,children:[t.jsx(He,{className:"h-4 w-4 mr-2"}),"Se déconnecter"]})]})]})})}):t.jsx("div",{className:"min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center p-4",children:t.jsx(M.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.5},children:t.jsxs(oe,{className:"w-full max-w-md shadow-soft",children:[t.jsxs(le,{className:"text-center",children:[t.jsx("div",{className:"mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-soft",children:t.jsx(la,{className:"h-8 w-8 text-primary-foreground"})}),t.jsx(ce,{className:"text-2xl font-bold",children:"Espace Administration"}),t.jsx(de,{className:"text-muted-foreground",children:"Accès réservé aux membres du bureau de l'association"})]}),t.jsx(me,{children:t.jsxs("form",{onSubmit:W,className:"space-y-4",children:[t.jsxs("div",{className:"space-y-2",children:[t.jsx(R,{htmlFor:"email",children:"Email"}),t.jsxs("div",{className:"relative",children:[t.jsx(Se,{className:"absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"}),t.jsx(X,{id:"email",type:"email",placeholder:"admin@example.com",value:m,onChange:b=>c(b.target.value),className:"pl-10",required:!0})]})]}),t.jsxs("div",{className:"space-y-2",children:[t.jsx(R,{htmlFor:"password",children:"Mot de passe"}),t.jsxs("div",{className:"relative",children:[t.jsx(Rt,{className:"absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"}),t.jsx(X,{id:"password",type:"password",placeholder:"Entrez votre mot de passe",value:u,onChange:b=>f(b.target.value),className:"pl-10",required:!0})]})]}),x&&t.jsxs(Ve,{variant:"destructive",children:[t.jsx(Te,{className:"h-4 w-4"}),t.jsx(Xe,{children:x})]}),t.jsx(N,{type:"submit",className:"w-full",variant:"playful",disabled:j,children:j?t.jsxs(t.Fragment,{children:[t.jsx($,{className:"h-4 w-4 mr-2 animate-spin"}),"Connexion..."]}):"Se connecter"})]})})]})})})}const Je=d.forwardRef(({className:e,...a},s)=>t.jsx("div",{className:"relative w-full overflow-auto",children:t.jsx("table",{ref:s,className:w("w-full caption-bottom text-sm",e),...a})}));Je.displayName="Table";const Qe=d.forwardRef(({className:e,...a},s)=>t.jsx("thead",{ref:s,className:w("[&_tr]:border-b",e),...a}));Qe.displayName="TableHeader";const Ue=d.forwardRef(({className:e,...a},s)=>t.jsx("tbody",{ref:s,className:w("[&_tr:last-child]:border-0",e),...a}));Ue.displayName="TableBody";const ua=d.forwardRef(({className:e,...a},s)=>t.jsx("tfoot",{ref:s,className:w("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",e),...a}));ua.displayName="TableFooter";const Ge=d.forwardRef(({className:e,...a},s)=>t.jsx("tr",{ref:s,className:w("border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50",e),...a}));Ge.displayName="TableRow";const I=d.forwardRef(({className:e,...a},s)=>t.jsx("th",{ref:s,className:w("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",e),...a}));I.displayName="TableHead";const V=d.forwardRef(({className:e,...a},s)=>t.jsx("td",{ref:s,className:w("p-4 align-middle [&:has([role=checkbox])]:pr-0",e),...a}));V.displayName="TableCell";const ha=d.forwardRef(({className:e,...a},s)=>t.jsx("caption",{ref:s,className:w("mt-4 text-sm text-muted-foreground",e),...a}));ha.displayName="TableCaption";var Ke="AlertDialog",[fa]=Et(Ke,[qe]),O=qe(),Ze=e=>{const{__scopeAlertDialog:a,...s}=e,r=O(a);return t.jsx($t,{...r,...s,modal:!0})};Ze.displayName=Ke;var xa="AlertDialogTrigger",et=d.forwardRef((e,a)=>{const{__scopeAlertDialog:s,...r}=e,n=O(s);return t.jsx(Yt,{...n,...r,ref:a})});et.displayName=xa;var ga="AlertDialogPortal",tt=e=>{const{__scopeAlertDialog:a,...s}=e,r=O(a);return t.jsx(Ht,{...r,...s})};tt.displayName=ga;var pa="AlertDialogOverlay",at=d.forwardRef((e,a)=>{const{__scopeAlertDialog:s,...r}=e,n=O(s);return t.jsx(Jt,{...n,...r,ref:a})});at.displayName=pa;var J="AlertDialogContent",[ya,wa]=fa(J),ba=Tt("AlertDialogContent"),st=d.forwardRef((e,a)=>{const{__scopeAlertDialog:s,children:r,...n}=e,i=O(s),m=d.useRef(null),c=ze(a,m),u=d.useRef(null);return t.jsx(qt,{contentName:J,titleName:rt,docsSlug:"alert-dialog",children:t.jsx(ya,{scope:s,cancelRef:u,children:t.jsxs(It,{role:"alertdialog",...i,...n,ref:c,onOpenAutoFocus:Pt(n.onOpenAutoFocus,f=>{f.preventDefault(),u.current?.focus({preventScroll:!0})}),onPointerDownOutside:f=>f.preventDefault(),onInteractOutside:f=>f.preventDefault(),children:[t.jsx(ba,{children:r}),t.jsx(Na,{contentRef:m})]})})})});st.displayName=J;var rt="AlertDialogTitle",nt=d.forwardRef((e,a)=>{const{__scopeAlertDialog:s,...r}=e,n=O(s);return t.jsx(Vt,{...n,...r,ref:a})});nt.displayName=rt;var it="AlertDialogDescription",ot=d.forwardRef((e,a)=>{const{__scopeAlertDialog:s,...r}=e,n=O(s);return t.jsx(Xt,{...n,...r,ref:a})});ot.displayName=it;var va="AlertDialogAction",lt=d.forwardRef((e,a)=>{const{__scopeAlertDialog:s,...r}=e,n=O(s);return t.jsx(Ie,{...n,...r,ref:a})});lt.displayName=va;var ct="AlertDialogCancel",dt=d.forwardRef((e,a)=>{const{__scopeAlertDialog:s,...r}=e,{cancelRef:n}=wa(ct,s),i=O(s),m=ze(a,n);return t.jsx(Ie,{...i,...r,ref:m})});dt.displayName=ct;var Na=({contentRef:e})=>{const a=`\`${J}\` requires a description for the component to be accessible for screen reader users.

You can add a description to the \`${J}\` by passing a \`${it}\` component as a child, which also benefits sighted users by adding visible context to the dialog.

Alternatively, you can use your own component as a description by assigning it an \`id\` and passing the same value to the \`aria-describedby\` prop in \`${J}\`. If the description is confusing or duplicative for sighted users, you can use the \`@radix-ui/react-visually-hidden\` primitive as a wrapper around your description component.

For more information, see https://radix-ui.com/primitives/docs/components/alert-dialog`;return d.useEffect(()=>{document.getElementById(e.current?.getAttribute("aria-describedby"))||console.warn(a)},[a,e]),null},ja=Ze,Fa=et,ka=tt,mt=at,ut=st,ht=lt,ft=dt,xt=nt,gt=ot;const ue=ja,he=Fa,Da=ka,pt=d.forwardRef(({className:e,...a},s)=>t.jsx(mt,{className:w("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",e),...a,ref:s}));pt.displayName=mt.displayName;const U=d.forwardRef(({className:e,...a},s)=>t.jsxs(Da,{children:[t.jsx(pt,{}),t.jsx(ut,{ref:s,className:w("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",e),...a})]}));U.displayName=ut.displayName;const G=({className:e,...a})=>t.jsx("div",{className:w("flex flex-col space-y-2 text-center sm:text-left",e),...a});G.displayName="AlertDialogHeader";const K=({className:e,...a})=>t.jsx("div",{className:w("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",e),...a});K.displayName="AlertDialogFooter";const Z=d.forwardRef(({className:e,...a},s)=>t.jsx(xt,{ref:s,className:w("text-lg font-semibold",e),...a}));Z.displayName=xt.displayName;const ee=d.forwardRef(({className:e,...a},s)=>t.jsx(gt,{ref:s,className:w("text-sm text-muted-foreground",e),...a}));ee.displayName=gt.displayName;const te=d.forwardRef(({className:e,...a},s)=>t.jsx(ht,{ref:s,className:w(Re(),e),...a}));te.displayName=ht.displayName;const ae=d.forwardRef(({className:e,...a},s)=>t.jsx(ft,{ref:s,className:w(Re({variant:"outline"}),"mt-2 sm:mt-0",e),...a}));ae.displayName=ft.displayName;function k(e){const a=Object.prototype.toString.call(e);return e instanceof Date||typeof e=="object"&&a==="[object Date]"?new e.constructor(+e):typeof e=="number"||a==="[object Number]"||typeof e=="string"||a==="[object String]"?new Date(e):new Date(NaN)}function Y(e,a){return e instanceof Date?new e.constructor(a):new Date(a)}const yt=6048e5,Aa=864e5;let Ca={};function Ne(){return Ca}function fe(e,a){const s=Ne(),r=a?.weekStartsOn??a?.locale?.options?.weekStartsOn??s.weekStartsOn??s.locale?.options?.weekStartsOn??0,n=k(e),i=n.getDay(),m=(i<r?7:0)+i-r;return n.setDate(n.getDate()-m),n.setHours(0,0,0,0),n}function we(e){return fe(e,{weekStartsOn:1})}function wt(e){const a=k(e),s=a.getFullYear(),r=Y(e,0);r.setFullYear(s+1,0,4),r.setHours(0,0,0,0);const n=we(r),i=Y(e,0);i.setFullYear(s,0,4),i.setHours(0,0,0,0);const m=we(i);return a.getTime()>=n.getTime()?s+1:a.getTime()>=m.getTime()?s:s-1}function Ee(e){const a=k(e);return a.setHours(0,0,0,0),a}function Oe(e){const a=k(e),s=new Date(Date.UTC(a.getFullYear(),a.getMonth(),a.getDate(),a.getHours(),a.getMinutes(),a.getSeconds(),a.getMilliseconds()));return s.setUTCFullYear(a.getFullYear()),+e-+s}function Sa(e,a){const s=Ee(e),r=Ee(a),n=+s-Oe(s),i=+r-Oe(r);return Math.round((n-i)/Aa)}function Ma(e){const a=wt(e),s=Y(e,0);return s.setFullYear(a,0,4),s.setHours(0,0,0,0),we(s)}function Pa(e){return e instanceof Date||typeof e=="object"&&Object.prototype.toString.call(e)==="[object Date]"}function Ta(e){if(!Pa(e)&&typeof e!="number")return!1;const a=k(e);return!isNaN(Number(a))}function Ea(e){const a=k(e),s=Y(e,0);return s.setFullYear(a.getFullYear(),0,1),s.setHours(0,0,0,0),s}const Oa={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}},Wa=(e,a,s)=>{let r;const n=Oa[e];return typeof n=="string"?r=n:a===1?r=n.one:r=n.other.replace("{{count}}",a.toString()),s?.addSuffix?s.comparison&&s.comparison>0?"in "+r:r+" ago":r};function Q(e){return(a={})=>{const s=a.width?String(a.width):e.defaultWidth;return e.formats[s]||e.formats[e.defaultWidth]}}const Ba={full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},_a={full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},La={full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},za={date:Q({formats:Ba,defaultWidth:"full"}),time:Q({formats:_a,defaultWidth:"full"}),dateTime:Q({formats:La,defaultWidth:"full"})},Ra={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"},$a=(e,a,s,r)=>Ra[e];function C(e){return(a,s)=>{const r=s?.context?String(s.context):"standalone";let n;if(r==="formatting"&&e.formattingValues){const m=e.defaultFormattingWidth||e.defaultWidth,c=s?.width?String(s.width):m;n=e.formattingValues[c]||e.formattingValues[m]}else{const m=e.defaultWidth,c=s?.width?String(s.width):e.defaultWidth;n=e.values[c]||e.values[m]}const i=e.argumentCallback?e.argumentCallback(a):a;return n[i]}}const Ya={narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},Ha={narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},qa={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},Ia={narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},Va={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},Xa={narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},Ja=(e,a)=>{const s=Number(e),r=s%100;if(r>20||r<10)switch(r%10){case 1:return s+"st";case 2:return s+"nd";case 3:return s+"rd"}return s+"th"},Qa={ordinalNumber:Ja,era:C({values:Ya,defaultWidth:"wide"}),quarter:C({values:Ha,defaultWidth:"wide",argumentCallback:e=>e-1}),month:C({values:qa,defaultWidth:"wide"}),day:C({values:Ia,defaultWidth:"wide"}),dayPeriod:C({values:Va,defaultWidth:"wide",formattingValues:Xa,defaultFormattingWidth:"wide"})};function S(e){return(a,s={})=>{const r=s.width,n=r&&e.matchPatterns[r]||e.matchPatterns[e.defaultMatchWidth],i=a.match(n);if(!i)return null;const m=i[0],c=r&&e.parsePatterns[r]||e.parsePatterns[e.defaultParseWidth],u=Array.isArray(c)?Ga(c,o=>o.test(m)):Ua(c,o=>o.test(m));let f;f=e.valueCallback?e.valueCallback(u):u,f=s.valueCallback?s.valueCallback(f):f;const x=a.slice(m.length);return{value:f,rest:x}}}function Ua(e,a){for(const s in e)if(Object.prototype.hasOwnProperty.call(e,s)&&a(e[s]))return s}function Ga(e,a){for(let s=0;s<e.length;s++)if(a(e[s]))return s}function bt(e){return(a,s={})=>{const r=a.match(e.matchPattern);if(!r)return null;const n=r[0],i=a.match(e.parsePattern);if(!i)return null;let m=e.valueCallback?e.valueCallback(i[0]):i[0];m=s.valueCallback?s.valueCallback(m):m;const c=a.slice(n.length);return{value:m,rest:c}}}const Ka=/^(\d+)(th|st|nd|rd)?/i,Za=/\d+/i,es={narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},ts={any:[/^b/i,/^(a|c)/i]},as={narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},ss={any:[/1/i,/2/i,/3/i,/4/i]},rs={narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},ns={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},is={narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},os={narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},ls={narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},cs={any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},ds={ordinalNumber:bt({matchPattern:Ka,parsePattern:Za,valueCallback:e=>parseInt(e,10)}),era:S({matchPatterns:es,defaultMatchWidth:"wide",parsePatterns:ts,defaultParseWidth:"any"}),quarter:S({matchPatterns:as,defaultMatchWidth:"wide",parsePatterns:ss,defaultParseWidth:"any",valueCallback:e=>e+1}),month:S({matchPatterns:rs,defaultMatchWidth:"wide",parsePatterns:ns,defaultParseWidth:"any"}),day:S({matchPatterns:is,defaultMatchWidth:"wide",parsePatterns:os,defaultParseWidth:"any"}),dayPeriod:S({matchPatterns:ls,defaultMatchWidth:"any",parsePatterns:cs,defaultParseWidth:"any"})},ms={code:"en-US",formatDistance:Wa,formatLong:za,formatRelative:$a,localize:Qa,match:ds,options:{weekStartsOn:0,firstWeekContainsDate:1}};function us(e){const a=k(e);return Sa(a,Ea(a))+1}function hs(e){const a=k(e),s=+we(a)-+Ma(a);return Math.round(s/yt)+1}function vt(e,a){const s=k(e),r=s.getFullYear(),n=Ne(),i=a?.firstWeekContainsDate??a?.locale?.options?.firstWeekContainsDate??n.firstWeekContainsDate??n.locale?.options?.firstWeekContainsDate??1,m=Y(e,0);m.setFullYear(r+1,0,i),m.setHours(0,0,0,0);const c=fe(m,a),u=Y(e,0);u.setFullYear(r,0,i),u.setHours(0,0,0,0);const f=fe(u,a);return s.getTime()>=c.getTime()?r+1:s.getTime()>=f.getTime()?r:r-1}function fs(e,a){const s=Ne(),r=a?.firstWeekContainsDate??a?.locale?.options?.firstWeekContainsDate??s.firstWeekContainsDate??s.locale?.options?.firstWeekContainsDate??1,n=vt(e,a),i=Y(e,0);return i.setFullYear(n,0,r),i.setHours(0,0,0,0),fe(i,a)}function xs(e,a){const s=k(e),r=+fe(s,a)-+fs(s,a);return Math.round(r/yt)+1}function g(e,a){const s=e<0?"-":"",r=Math.abs(e).toString().padStart(a,"0");return s+r}const B={y(e,a){const s=e.getFullYear(),r=s>0?s:1-s;return g(a==="yy"?r%100:r,a.length)},M(e,a){const s=e.getMonth();return a==="M"?String(s+1):g(s+1,2)},d(e,a){return g(e.getDate(),a.length)},a(e,a){const s=e.getHours()/12>=1?"pm":"am";switch(a){case"a":case"aa":return s.toUpperCase();case"aaa":return s;case"aaaaa":return s[0];case"aaaa":default:return s==="am"?"a.m.":"p.m."}},h(e,a){return g(e.getHours()%12||12,a.length)},H(e,a){return g(e.getHours(),a.length)},m(e,a){return g(e.getMinutes(),a.length)},s(e,a){return g(e.getSeconds(),a.length)},S(e,a){const s=a.length,r=e.getMilliseconds(),n=Math.trunc(r*Math.pow(10,s-3));return g(n,a.length)}},q={midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},We={G:function(e,a,s){const r=e.getFullYear()>0?1:0;switch(a){case"G":case"GG":case"GGG":return s.era(r,{width:"abbreviated"});case"GGGGG":return s.era(r,{width:"narrow"});case"GGGG":default:return s.era(r,{width:"wide"})}},y:function(e,a,s){if(a==="yo"){const r=e.getFullYear(),n=r>0?r:1-r;return s.ordinalNumber(n,{unit:"year"})}return B.y(e,a)},Y:function(e,a,s,r){const n=vt(e,r),i=n>0?n:1-n;if(a==="YY"){const m=i%100;return g(m,2)}return a==="Yo"?s.ordinalNumber(i,{unit:"year"}):g(i,a.length)},R:function(e,a){const s=wt(e);return g(s,a.length)},u:function(e,a){const s=e.getFullYear();return g(s,a.length)},Q:function(e,a,s){const r=Math.ceil((e.getMonth()+1)/3);switch(a){case"Q":return String(r);case"QQ":return g(r,2);case"Qo":return s.ordinalNumber(r,{unit:"quarter"});case"QQQ":return s.quarter(r,{width:"abbreviated",context:"formatting"});case"QQQQQ":return s.quarter(r,{width:"narrow",context:"formatting"});case"QQQQ":default:return s.quarter(r,{width:"wide",context:"formatting"})}},q:function(e,a,s){const r=Math.ceil((e.getMonth()+1)/3);switch(a){case"q":return String(r);case"qq":return g(r,2);case"qo":return s.ordinalNumber(r,{unit:"quarter"});case"qqq":return s.quarter(r,{width:"abbreviated",context:"standalone"});case"qqqqq":return s.quarter(r,{width:"narrow",context:"standalone"});case"qqqq":default:return s.quarter(r,{width:"wide",context:"standalone"})}},M:function(e,a,s){const r=e.getMonth();switch(a){case"M":case"MM":return B.M(e,a);case"Mo":return s.ordinalNumber(r+1,{unit:"month"});case"MMM":return s.month(r,{width:"abbreviated",context:"formatting"});case"MMMMM":return s.month(r,{width:"narrow",context:"formatting"});case"MMMM":default:return s.month(r,{width:"wide",context:"formatting"})}},L:function(e,a,s){const r=e.getMonth();switch(a){case"L":return String(r+1);case"LL":return g(r+1,2);case"Lo":return s.ordinalNumber(r+1,{unit:"month"});case"LLL":return s.month(r,{width:"abbreviated",context:"standalone"});case"LLLLL":return s.month(r,{width:"narrow",context:"standalone"});case"LLLL":default:return s.month(r,{width:"wide",context:"standalone"})}},w:function(e,a,s,r){const n=xs(e,r);return a==="wo"?s.ordinalNumber(n,{unit:"week"}):g(n,a.length)},I:function(e,a,s){const r=hs(e);return a==="Io"?s.ordinalNumber(r,{unit:"week"}):g(r,a.length)},d:function(e,a,s){return a==="do"?s.ordinalNumber(e.getDate(),{unit:"date"}):B.d(e,a)},D:function(e,a,s){const r=us(e);return a==="Do"?s.ordinalNumber(r,{unit:"dayOfYear"}):g(r,a.length)},E:function(e,a,s){const r=e.getDay();switch(a){case"E":case"EE":case"EEE":return s.day(r,{width:"abbreviated",context:"formatting"});case"EEEEE":return s.day(r,{width:"narrow",context:"formatting"});case"EEEEEE":return s.day(r,{width:"short",context:"formatting"});case"EEEE":default:return s.day(r,{width:"wide",context:"formatting"})}},e:function(e,a,s,r){const n=e.getDay(),i=(n-r.weekStartsOn+8)%7||7;switch(a){case"e":return String(i);case"ee":return g(i,2);case"eo":return s.ordinalNumber(i,{unit:"day"});case"eee":return s.day(n,{width:"abbreviated",context:"formatting"});case"eeeee":return s.day(n,{width:"narrow",context:"formatting"});case"eeeeee":return s.day(n,{width:"short",context:"formatting"});case"eeee":default:return s.day(n,{width:"wide",context:"formatting"})}},c:function(e,a,s,r){const n=e.getDay(),i=(n-r.weekStartsOn+8)%7||7;switch(a){case"c":return String(i);case"cc":return g(i,a.length);case"co":return s.ordinalNumber(i,{unit:"day"});case"ccc":return s.day(n,{width:"abbreviated",context:"standalone"});case"ccccc":return s.day(n,{width:"narrow",context:"standalone"});case"cccccc":return s.day(n,{width:"short",context:"standalone"});case"cccc":default:return s.day(n,{width:"wide",context:"standalone"})}},i:function(e,a,s){const r=e.getDay(),n=r===0?7:r;switch(a){case"i":return String(n);case"ii":return g(n,a.length);case"io":return s.ordinalNumber(n,{unit:"day"});case"iii":return s.day(r,{width:"abbreviated",context:"formatting"});case"iiiii":return s.day(r,{width:"narrow",context:"formatting"});case"iiiiii":return s.day(r,{width:"short",context:"formatting"});case"iiii":default:return s.day(r,{width:"wide",context:"formatting"})}},a:function(e,a,s){const n=e.getHours()/12>=1?"pm":"am";switch(a){case"a":case"aa":return s.dayPeriod(n,{width:"abbreviated",context:"formatting"});case"aaa":return s.dayPeriod(n,{width:"abbreviated",context:"formatting"}).toLowerCase();case"aaaaa":return s.dayPeriod(n,{width:"narrow",context:"formatting"});case"aaaa":default:return s.dayPeriod(n,{width:"wide",context:"formatting"})}},b:function(e,a,s){const r=e.getHours();let n;switch(r===12?n=q.noon:r===0?n=q.midnight:n=r/12>=1?"pm":"am",a){case"b":case"bb":return s.dayPeriod(n,{width:"abbreviated",context:"formatting"});case"bbb":return s.dayPeriod(n,{width:"abbreviated",context:"formatting"}).toLowerCase();case"bbbbb":return s.dayPeriod(n,{width:"narrow",context:"formatting"});case"bbbb":default:return s.dayPeriod(n,{width:"wide",context:"formatting"})}},B:function(e,a,s){const r=e.getHours();let n;switch(r>=17?n=q.evening:r>=12?n=q.afternoon:r>=4?n=q.morning:n=q.night,a){case"B":case"BB":case"BBB":return s.dayPeriod(n,{width:"abbreviated",context:"formatting"});case"BBBBB":return s.dayPeriod(n,{width:"narrow",context:"formatting"});case"BBBB":default:return s.dayPeriod(n,{width:"wide",context:"formatting"})}},h:function(e,a,s){if(a==="ho"){let r=e.getHours()%12;return r===0&&(r=12),s.ordinalNumber(r,{unit:"hour"})}return B.h(e,a)},H:function(e,a,s){return a==="Ho"?s.ordinalNumber(e.getHours(),{unit:"hour"}):B.H(e,a)},K:function(e,a,s){const r=e.getHours()%12;return a==="Ko"?s.ordinalNumber(r,{unit:"hour"}):g(r,a.length)},k:function(e,a,s){let r=e.getHours();return r===0&&(r=24),a==="ko"?s.ordinalNumber(r,{unit:"hour"}):g(r,a.length)},m:function(e,a,s){return a==="mo"?s.ordinalNumber(e.getMinutes(),{unit:"minute"}):B.m(e,a)},s:function(e,a,s){return a==="so"?s.ordinalNumber(e.getSeconds(),{unit:"second"}):B.s(e,a)},S:function(e,a){return B.S(e,a)},X:function(e,a,s){const r=e.getTimezoneOffset();if(r===0)return"Z";switch(a){case"X":return _e(r);case"XXXX":case"XX":return z(r);case"XXXXX":case"XXX":default:return z(r,":")}},x:function(e,a,s){const r=e.getTimezoneOffset();switch(a){case"x":return _e(r);case"xxxx":case"xx":return z(r);case"xxxxx":case"xxx":default:return z(r,":")}},O:function(e,a,s){const r=e.getTimezoneOffset();switch(a){case"O":case"OO":case"OOO":return"GMT"+Be(r,":");case"OOOO":default:return"GMT"+z(r,":")}},z:function(e,a,s){const r=e.getTimezoneOffset();switch(a){case"z":case"zz":case"zzz":return"GMT"+Be(r,":");case"zzzz":default:return"GMT"+z(r,":")}},t:function(e,a,s){const r=Math.trunc(e.getTime()/1e3);return g(r,a.length)},T:function(e,a,s){const r=e.getTime();return g(r,a.length)}};function Be(e,a=""){const s=e>0?"-":"+",r=Math.abs(e),n=Math.trunc(r/60),i=r%60;return i===0?s+String(n):s+String(n)+a+g(i,2)}function _e(e,a){return e%60===0?(e>0?"-":"+")+g(Math.abs(e)/60,2):z(e,a)}function z(e,a=""){const s=e>0?"-":"+",r=Math.abs(e),n=g(Math.trunc(r/60),2),i=g(r%60,2);return s+n+a+i}const Le=(e,a)=>{switch(e){case"P":return a.date({width:"short"});case"PP":return a.date({width:"medium"});case"PPP":return a.date({width:"long"});case"PPPP":default:return a.date({width:"full"})}},Nt=(e,a)=>{switch(e){case"p":return a.time({width:"short"});case"pp":return a.time({width:"medium"});case"ppp":return a.time({width:"long"});case"pppp":default:return a.time({width:"full"})}},gs=(e,a)=>{const s=e.match(/(P+)(p+)?/)||[],r=s[1],n=s[2];if(!n)return Le(e,a);let i;switch(r){case"P":i=a.dateTime({width:"short"});break;case"PP":i=a.dateTime({width:"medium"});break;case"PPP":i=a.dateTime({width:"long"});break;case"PPPP":default:i=a.dateTime({width:"full"});break}return i.replace("{{date}}",Le(r,a)).replace("{{time}}",Nt(n,a))},ps={p:Nt,P:gs},ys=/^D+$/,ws=/^Y+$/,bs=["D","DD","YY","YYYY"];function vs(e){return ys.test(e)}function Ns(e){return ws.test(e)}function js(e,a,s){const r=Fs(e,a,s);if(console.warn(r),bs.includes(e))throw new RangeError(r)}function Fs(e,a,s){const r=e[0]==="Y"?"years":"days of the month";return`Use \`${e.toLowerCase()}\` instead of \`${e}\` (in \`${a}\`) for formatting ${r} to the input \`${s}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`}const ks=/[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,Ds=/P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,As=/^'([^]*?)'?$/,Cs=/''/g,Ss=/[a-zA-Z]/;function be(e,a,s){const r=Ne(),n=s?.locale??r.locale??ms,i=s?.firstWeekContainsDate??s?.locale?.options?.firstWeekContainsDate??r.firstWeekContainsDate??r.locale?.options?.firstWeekContainsDate??1,m=s?.weekStartsOn??s?.locale?.options?.weekStartsOn??r.weekStartsOn??r.locale?.options?.weekStartsOn??0,c=k(e);if(!Ta(c))throw new RangeError("Invalid time value");let u=a.match(Ds).map(x=>{const o=x[0];if(o==="p"||o==="P"){const j=ps[o];return j(x,n.formatLong)}return x}).join("").match(ks).map(x=>{if(x==="''")return{isToken:!1,value:"'"};const o=x[0];if(o==="'")return{isToken:!1,value:Ms(x)};if(We[o])return{isToken:!0,value:x};if(o.match(Ss))throw new RangeError("Format string contains an unescaped latin alphabet character `"+o+"`");return{isToken:!1,value:x}});n.localize.preprocessor&&(u=n.localize.preprocessor(c,u));const f={firstWeekContainsDate:i,weekStartsOn:m,locale:n};return u.map(x=>{if(!x.isToken)return x.value;const o=x.value;(!s?.useAdditionalWeekYearTokens&&Ns(o)||!s?.useAdditionalDayOfYearTokens&&vs(o))&&js(o,a,String(e));const j=We[o[0]];return j(c,o,n.localize,f)}).join("")}function Ms(e){const a=e.match(As);return a?a[1].replace(Cs,"'"):e}const Ps={lessThanXSeconds:{one:"moins d’une seconde",other:"moins de {{count}} secondes"},xSeconds:{one:"1 seconde",other:"{{count}} secondes"},halfAMinute:"30 secondes",lessThanXMinutes:{one:"moins d’une minute",other:"moins de {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"environ 1 heure",other:"environ {{count}} heures"},xHours:{one:"1 heure",other:"{{count}} heures"},xDays:{one:"1 jour",other:"{{count}} jours"},aboutXWeeks:{one:"environ 1 semaine",other:"environ {{count}} semaines"},xWeeks:{one:"1 semaine",other:"{{count}} semaines"},aboutXMonths:{one:"environ 1 mois",other:"environ {{count}} mois"},xMonths:{one:"1 mois",other:"{{count}} mois"},aboutXYears:{one:"environ 1 an",other:"environ {{count}} ans"},xYears:{one:"1 an",other:"{{count}} ans"},overXYears:{one:"plus d’un an",other:"plus de {{count}} ans"},almostXYears:{one:"presqu’un an",other:"presque {{count}} ans"}},Ts=(e,a,s)=>{let r;const n=Ps[e];return typeof n=="string"?r=n:a===1?r=n.one:r=n.other.replace("{{count}}",String(a)),s?.addSuffix?s.comparison&&s.comparison>0?"dans "+r:"il y a "+r:r},Es={full:"EEEE d MMMM y",long:"d MMMM y",medium:"d MMM y",short:"dd/MM/y"},Os={full:"HH:mm:ss zzzz",long:"HH:mm:ss z",medium:"HH:mm:ss",short:"HH:mm"},Ws={full:"{{date}} 'à' {{time}}",long:"{{date}} 'à' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},Bs={date:Q({formats:Es,defaultWidth:"full"}),time:Q({formats:Os,defaultWidth:"full"}),dateTime:Q({formats:Ws,defaultWidth:"full"})},_s={lastWeek:"eeee 'dernier à' p",yesterday:"'hier à' p",today:"'aujourd’hui à' p",tomorrow:"'demain à' p'",nextWeek:"eeee 'prochain à' p",other:"P"},Ls=(e,a,s,r)=>_s[e],zs={narrow:["av. J.-C","ap. J.-C"],abbreviated:["av. J.-C","ap. J.-C"],wide:["avant Jésus-Christ","après Jésus-Christ"]},Rs={narrow:["T1","T2","T3","T4"],abbreviated:["1er trim.","2ème trim.","3ème trim.","4ème trim."],wide:["1er trimestre","2ème trimestre","3ème trimestre","4ème trimestre"]},$s={narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."],wide:["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"]},Ys={narrow:["D","L","M","M","J","V","S"],short:["di","lu","ma","me","je","ve","sa"],abbreviated:["dim.","lun.","mar.","mer.","jeu.","ven.","sam."],wide:["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"]},Hs={narrow:{am:"AM",pm:"PM",midnight:"minuit",noon:"midi",morning:"mat.",afternoon:"ap.m.",evening:"soir",night:"mat."},abbreviated:{am:"AM",pm:"PM",midnight:"minuit",noon:"midi",morning:"matin",afternoon:"après-midi",evening:"soir",night:"matin"},wide:{am:"AM",pm:"PM",midnight:"minuit",noon:"midi",morning:"du matin",afternoon:"de l’après-midi",evening:"du soir",night:"du matin"}},qs=(e,a)=>{const s=Number(e),r=a?.unit;if(s===0)return"0";const n=["year","week","hour","minute","second"];let i;return s===1?i=r&&n.includes(r)?"ère":"er":i="ème",s+i},Is=["MMM","MMMM"],Vs={preprocessor:(e,a)=>e.getDate()===1||!a.some(r=>r.isToken&&Is.includes(r.value))?a:a.map(r=>r.isToken&&r.value==="do"?{isToken:!0,value:"d"}:r),ordinalNumber:qs,era:C({values:zs,defaultWidth:"wide"}),quarter:C({values:Rs,defaultWidth:"wide",argumentCallback:e=>e-1}),month:C({values:$s,defaultWidth:"wide"}),day:C({values:Ys,defaultWidth:"wide"}),dayPeriod:C({values:Hs,defaultWidth:"wide"})},Xs=/^(\d+)(ième|ère|ème|er|e)?/i,Js=/\d+/i,Qs={narrow:/^(av\.J\.C|ap\.J\.C|ap\.J\.-C)/i,abbreviated:/^(av\.J\.-C|av\.J-C|apr\.J\.-C|apr\.J-C|ap\.J-C)/i,wide:/^(avant Jésus-Christ|après Jésus-Christ)/i},Us={any:[/^av/i,/^ap/i]},Gs={narrow:/^T?[1234]/i,abbreviated:/^[1234](er|ème|e)? trim\.?/i,wide:/^[1234](er|ème|e)? trimestre/i},Ks={any:[/1/i,/2/i,/3/i,/4/i]},Zs={narrow:/^[jfmasond]/i,abbreviated:/^(janv|févr|mars|avr|mai|juin|juill|juil|août|sept|oct|nov|déc)\.?/i,wide:/^(janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre)/i},er={narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^av/i,/^ma/i,/^juin/i,/^juil/i,/^ao/i,/^s/i,/^o/i,/^n/i,/^d/i]},tr={narrow:/^[lmjvsd]/i,short:/^(di|lu|ma|me|je|ve|sa)/i,abbreviated:/^(dim|lun|mar|mer|jeu|ven|sam)\.?/i,wide:/^(dimanche|lundi|mardi|mercredi|jeudi|vendredi|samedi)/i},ar={narrow:[/^d/i,/^l/i,/^m/i,/^m/i,/^j/i,/^v/i,/^s/i],any:[/^di/i,/^lu/i,/^ma/i,/^me/i,/^je/i,/^ve/i,/^sa/i]},sr={narrow:/^(a|p|minuit|midi|mat\.?|ap\.?m\.?|soir|nuit)/i,any:/^([ap]\.?\s?m\.?|du matin|de l'après[-\s]midi|du soir|de la nuit)/i},rr={any:{am:/^a/i,pm:/^p/i,midnight:/^min/i,noon:/^mid/i,morning:/mat/i,afternoon:/ap/i,evening:/soir/i,night:/nuit/i}},nr={ordinalNumber:bt({matchPattern:Xs,parsePattern:Js,valueCallback:e=>parseInt(e)}),era:S({matchPatterns:Qs,defaultMatchWidth:"wide",parsePatterns:Us,defaultParseWidth:"any"}),quarter:S({matchPatterns:Gs,defaultMatchWidth:"wide",parsePatterns:Ks,defaultParseWidth:"any",valueCallback:e=>e+1}),month:S({matchPatterns:Zs,defaultMatchWidth:"wide",parsePatterns:er,defaultParseWidth:"any"}),day:S({matchPatterns:tr,defaultMatchWidth:"wide",parsePatterns:ar,defaultParseWidth:"any"}),dayPeriod:S({matchPatterns:sr,defaultMatchWidth:"any",parsePatterns:rr,defaultParseWidth:"any"})},ve={code:"fr",formatDistance:Ts,formatLong:Bs,formatRelative:Ls,localize:Vs,match:nr,options:{weekStartsOn:1,firstWeekContainsDate:4}},Ae=()=>typeof window<"u"&&window.innerWidth<640;function ir({subscribers:e,searchQuery:a,onSearchChange:s,activeCount:r,totalCount:n,onToggleStatus:i,onDelete:m}){const[c,u]=d.useState(!1);d.useEffect(()=>{u(Ae()),console.log("[SubscribersList] Mobile detection:",{isMobile:Ae(),windowWidth:typeof window<"u"?window.innerWidth:"N/A",subscribersLength:e.length});const o=()=>{u(Ae())};return window.addEventListener("resize",o),()=>window.removeEventListener("resize",o)},[e.length]),d.useEffect(()=>{console.log("[SubscribersList] Subscribers updated:",{count:e.length,items:e.slice(0,2).map(o=>({id:o.id,email:o.email}))})},[e]);const f=c?{}:{initial:{opacity:0,x:-20},animate:{opacity:1,x:0}},x=()=>{const o=["Prénom","Email","Date d'inscription","Statut"],j=e.map(v=>[v.first_name||"",v.email,new Date(v.created_at).toLocaleDateString("fr-FR"),v.is_active?"Actif":"Désinscrit"]),P=[o.join(";"),...j.map(v=>v.map(h=>`"${h}"`).join(";"))].join(`
`),W=new Blob(["\uFEFF"+P],{type:"text/csv;charset=utf-8;"}),D=URL.createObjectURL(W),b=document.createElement("a");b.href=D,b.download=`abonnes-newsletter-${new Date().toISOString().split("T")[0]}.csv`,b.click(),URL.revokeObjectURL(D),Wt.success("Export CSV téléchargé")};return t.jsx(M.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.4},children:t.jsxs(oe,{className:"shadow-sm border-orange-100/50 bg-white/40 sm:bg-white/60 sm:backdrop-blur-sm hover:shadow-md transition-shadow relative z-0",style:{fontFamily:"'Nunito', sans-serif"},children:[t.jsx(le,{className:"pb-3 sm:pb-4",children:t.jsxs("div",{className:"flex flex-col gap-4 sm:gap-0",children:[t.jsxs("div",{children:[t.jsxs(ce,{className:"flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl bg-gradient-to-r from-[#FF7B42] via-[#FF9A6A] to-[#C55FA8] bg-clip-text text-transparent",style:{fontFamily:"'Nunito', sans-serif",fontWeight:700},children:[t.jsx("div",{className:"flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF7B42] to-[#C55FA8] shadow-md flex-shrink-0",children:t.jsx(Ot,{className:"h-3 w-3 sm:h-4 sm:w-4 text-white"})}),t.jsx("span",{children:"Liste des abonnés"})]}),t.jsxs(de,{className:"mt-1 sm:mt-2 text-xs sm:text-sm",style:{fontFamily:"'Nunito', sans-serif"},children:[t.jsx("strong",{className:"text-[#FF7B42]",children:r})," abonnés actifs sur ",t.jsx("strong",{children:n})," inscrits"]})]}),t.jsxs("div",{className:"flex items-center gap-2 flex-wrap sm:justify-end",children:[t.jsxs(ie,{variant:"outline",className:"flex items-center gap-1 border-orange-200 text-[#FF7B42] text-xs",children:[t.jsx(ke,{className:"h-3 w-3"}),r," actifs"]}),t.jsxs(ie,{variant:"secondary",className:"flex items-center gap-1 bg-rose-100 text-rose-700 text-xs",children:[t.jsx(De,{className:"h-3 w-3"}),n-r," désinscrits"]}),t.jsxs(N,{variant:"outline",size:"sm",onClick:x,disabled:e.length===0,className:"border-orange-200 text-[#FF7B42] hover:bg-orange-50/50 text-xs h-8 sm:h-9",children:[t.jsx(aa,{className:"h-3 w-3 mr-1"}),"CSV"]})]})]})}),t.jsxs(me,{className:"space-y-4 px-3 py-3 sm:px-6 sm:py-6",children:[t.jsxs("div",{className:"relative",children:[t.jsx(sa,{className:"absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-200 pointer-events-none"}),t.jsx(X,{placeholder:"Rechercher par email ou prénom...",value:a,onChange:o=>s(o.target.value),className:"pl-10 text-sm border-orange-100/50 focus:border-[#FF7B42] focus:ring-[#FF7B42]/20"})]}),e.length===0?t.jsxs("div",{className:"text-center py-8 sm:py-12 text-muted-foreground",children:[t.jsx(Se,{className:"h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-30"}),t.jsx("p",{style:{fontFamily:"'Nunito', sans-serif"},className:"text-sm sm:text-base",children:"Aucun abonné trouvé"})]}):t.jsxs(t.Fragment,{children:[t.jsx("div",{className:"hidden sm:block rounded-xl border border-orange-100/50 overflow-hidden bg-white/50",children:t.jsxs(Je,{children:[t.jsx(Qe,{children:t.jsxs(Ge,{className:"bg-gradient-to-r from-orange-50/50 to-rose-50/50 border-orange-100/50",children:[t.jsx(I,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-xs sm:text-sm text-gray-700",children:"Prénom"}),t.jsx(I,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-xs sm:text-sm text-gray-700",children:"Email"}),t.jsx(I,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-xs sm:text-sm text-gray-700",children:"Inscrit le"}),t.jsx(I,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-xs sm:text-sm text-gray-700",children:"Statut"}),t.jsx(I,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-right text-xs sm:text-sm text-gray-700",children:"Actions"})]})}),t.jsx(Ue,{children:e.map((o,j)=>t.jsxs(M.tr,{...f,transition:c?void 0:{delay:j*.05},className:"border-b last:border-0 hover:bg-orange-50/30 transition-colors",children:[t.jsx(V,{className:"font-medium text-sm",children:o.first_name||"—"}),t.jsx(V,{className:"text-muted-foreground text-sm",children:o.email}),t.jsx(V,{className:"text-muted-foreground text-sm",children:be(new Date(o.created_at),"dd MMM yyyy",{locale:ve})}),t.jsx(V,{children:t.jsx(ie,{variant:o.is_active?"default":"secondary",className:o.is_active?"bg-gradient-to-r from-[#FF7B42] to-[#FF9A6A] text-white hover:opacity-90 text-xs":"bg-rose-100 text-rose-700 hover:bg-rose-100 text-xs",children:o.is_active?"Actif":"Désinscrit"})}),t.jsx(V,{className:"text-right",children:t.jsxs("div",{className:"flex items-center justify-end gap-1 sm:gap-2",children:[t.jsx(N,{variant:"ghost",size:"sm",onClick:()=>i(o.id,o.is_active),className:`${o.is_active?"text-[#FF7B42] hover:bg-orange-50/50":"text-green-600 hover:bg-green-50/50"} h-8 w-8 p-0`,children:o.is_active?t.jsx(De,{className:"h-4 w-4"}):t.jsx(ke,{className:"h-4 w-4"})}),t.jsxs(ue,{children:[t.jsx(he,{asChild:!0,children:t.jsx(N,{variant:"ghost",size:"sm",className:"text-[#C55FA8] hover:bg-rose-50/50 h-8 w-8 p-0",children:t.jsx(ye,{className:"h-4 w-4"})})}),t.jsxs(U,{className:"w-[95vw] sm:w-auto",children:[t.jsxs(G,{children:[t.jsx(Z,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-base sm:text-lg",children:"Supprimer cet abonné ?"}),t.jsx(ee,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-xs sm:text-sm",children:"Cette action est irréversible. L'abonné sera définitivement supprimé de la liste."})]}),t.jsxs(K,{className:"flex-col-reverse sm:flex-row gap-2 sm:gap-0",children:[t.jsx(ae,{className:"text-xs sm:text-sm",children:"Annuler"}),t.jsx(te,{onClick:()=>m(o.id),className:"text-xs sm:text-sm",children:"Supprimer"})]})]})]})]})})]},o.id))})]})}),t.jsx("div",{className:"sm:hidden",children:t.jsx("div",{style:{display:"block"},className:"space-y-3",children:e.map(o=>t.jsxs("div",{className:"bg-white rounded-lg border border-orange-100 shadow-sm hover:shadow-md transition-shadow",style:{padding:"16px"},children:[t.jsxs("div",{className:"flex items-start justify-between gap-3 mb-3",children:[t.jsxs("div",{className:"flex-1 min-w-0",children:[t.jsx("p",{className:"font-semibold text-gray-800 text-sm",children:o.first_name||"Prénom inconnu"}),t.jsx("p",{className:"text-xs text-gray-500 mt-1 truncate",children:o.email})]}),t.jsx(ie,{className:`whitespace-nowrap text-xs ${o.is_active?"bg-gradient-to-r from-[#FF7B42] to-[#FF9A6A] text-white":"bg-rose-100 text-rose-700"}`,children:o.is_active?"Actif":"Désinscrit"})]}),t.jsxs("p",{className:"text-xs text-gray-400 mb-4",children:["📅 ",be(new Date(o.created_at),"dd MMM yyyy",{locale:ve})]}),t.jsxs("div",{className:"flex gap-2 pt-2 border-t border-orange-50",children:[t.jsx("button",{onClick:()=>i(o.id,o.is_active),className:"flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all",style:{backgroundColor:o.is_active?"#FFE8D6":"#D4EDDA",color:o.is_active?"#FF7B42":"#28a745",border:`1px solid ${o.is_active?"#FF7B42":"#28a745"}`,marginTop:"8px"},children:o.is_active?t.jsxs(t.Fragment,{children:[t.jsx(De,{className:"h-3 w-3 mr-1 inline"}),"Résilier"]}):t.jsxs(t.Fragment,{children:[t.jsx(ke,{className:"h-3 w-3 mr-1 inline"}),"Réactiver"]})}),t.jsxs(ue,{children:[t.jsx(he,{asChild:!0,children:t.jsxs("button",{className:"flex-1 py-2 px-3 text-xs font-medium rounded-md transition-all",style:{backgroundColor:"#FCE8EC",color:"#C55FA8",border:"1px solid #C55FA8",marginTop:"8px",cursor:"pointer"},children:[t.jsx(ye,{className:"h-3 w-3 mr-1 inline"}),"Supprimer"]})}),t.jsxs(U,{className:"w-[95vw] sm:w-auto",children:[t.jsxs(G,{children:[t.jsxs(Z,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-base",children:["Supprimer ",o.first_name,"?"]}),t.jsx(ee,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-xs",children:"Cette action est irréversible."})]}),t.jsxs(K,{className:"flex-col-reverse gap-2",children:[t.jsx(ae,{className:"text-xs",children:"Annuler"}),t.jsx(te,{onClick:()=>m(o.id),className:"text-xs",children:"Supprimer"})]})]})]})]})]},o.id))})})]})]})]})})}function or(){return typeof window<"u"?window.location.origin:"https://lespetitstrinquat.fr"}function lr(e){const a=or(),{firstName:s="Cher parent",title:r,content:n,contentHtml:i,unsubscribeUrl:m="#",siteUrl:c=a,logoUrl:u=`${a}/logoAsso.png`,faviconUrl:f=`${a}/favicon.ico`,year:x=new Date().getFullYear()}=e,o=i||cr(n);return`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="${f}" type="image/x-icon">
  <title>${pe(r)}</title>
  <style>
    /* Reset & Base */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Georgia', 'Garamond', 'Palatino', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'Nunito', sans-serif;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #1a1a1a;
      }
      .email-container {
        background-color: #2a2a2a;
        color: #f0f0f0;
      }
      .header {
        background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
      }
      .footer {
        background-color: #1a1a1a;
        color: #888888;
      }
      .footer a {
        color: #ff9a56;
      }
    }
    
    /* Container */
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0 8px 24px rgba(255, 123, 66, 0.1);
      border-radius: 8px;
      overflow: hidden;
    }
    
    /* Header */
    .header {
      background: linear-gradient(135deg, #FFF5F0 0%, #FFF0F7 50%, #E8F4FF 100%);
      padding: 50px 30px;
      text-align: center;
      position: relative;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at 50% 0%, rgba(255, 123, 66, 0.05) 0%, transparent 70%);
      pointer-events: none;
    }
    
    .logo {
      display: block;
      margin-bottom: 25px;
      position: relative;
      z-index: 1;
      text-align: center;
    }
    
    .logo img {
      max-width: 100%;
      width: 280px;
      height: auto;
      display: block;
      margin: 0 auto;
      border-radius: 16px;
    }
    
    .header-title {
      font-size: 38px;
      font-weight: 800;
      color: #FF7B42;
      margin: 15px 0 8px 0;
      font-family: 'Nunito', sans-serif;
      letter-spacing: -0.5px;
    }
    
    .header-subtitle {
      font-size: 15px;
      color: #555555;
      font-weight: 700;
      letter-spacing: 1px;
      margin: 0;
      font-family: 'Nunito', sans-serif;
      text-transform: uppercase;
    }
    
    /* Body */
    .body {
      padding: 50px 35px;
      background: linear-gradient(180deg, #FFFBF7 0%, #F8F5FF 45%, #F5F9FF 100%);
      position: relative;
    }
    
    .body::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle 400px at 0% 0%, rgba(255, 251, 247, 0.8), transparent),
        radial-gradient(circle 400px at 100% 100%, rgba(245, 249, 255, 0.8), transparent);
      pointer-events: none;
    }
    
    .greeting {
      font-size: 18px;
      font-weight: 600;
      color: #3C3C3C;
      margin-bottom: 25px;
      font-family: 'Nunito', sans-serif;
      position: relative;
      z-index: 1;
    }
    
    .newsletter-title {
      font-size: 32px;
      font-weight: 800;
      color: #FF7B42;
      margin: 30px 0 25px;
      font-family: 'Nunito', sans-serif;
      position: relative;
      z-index: 1;
    }
    
    .content {
      font-size: 16px;
      color: #555555;
      line-height: 1.75;
      margin: 25px 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.65) 100%);
      padding: 28px;
      border-radius: 16px;
      border-left: 5px solid;
      border-image: linear-gradient(180deg, #FF7B42 0%, #C55FA8 100%) 1;
      box-shadow: 0 4px 16px rgba(255, 123, 66, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8);
      font-family: 'Nunito', sans-serif;
      position: relative;
      z-index: 1;
      backdrop-filter: blur(10px);
    }
    
    .content p {
      margin: 16px 0;
    }
    
    .content strong {
      font-weight: 800;
      color: #333333;
    }
    
    .content em {
      font-style: italic;
      color: #D65FA8;
      font-weight: 600;
    }
    
    .content ul, .content ol {
      margin: 18px 0 18px 30px;
    }
    
    .content li {
      margin: 12px 0;
      padding-left: 8px;
    }
    
    .content a {
      color: #FF7B42;
      text-decoration: underline;
      font-weight: 700;
      transition: all 0.3s ease;
    }
    
    .content a:hover {
      color: #C55FA8;
    }
    
    /* CTA Button */
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #FF7B42 0%, #FF9A6A 50%, #C55FA8 100%);
      color: #ffffff;
      padding: 16px 40px;
      border-radius: 30px;
      text-decoration: none;
      font-weight: 800;
      font-size: 16px;
      margin: 28px 0;
      box-shadow: 0 8px 24px rgba(255, 123, 66, 0.25), 0 4px 12px rgba(197, 95, 168, 0.15);
      transition: all 0.3s ease;
      display: inline-block;
      font-family: 'Nunito', sans-serif;
      border: none;
      cursor: pointer;
    }
    
    .cta-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 12px 32px rgba(255, 123, 66, 0.35), 0 6px 16px rgba(197, 95, 168, 0.2);
      text-decoration: none;
      color: #ffffff;
    }
    
    /* Divider */
    .divider {
      border: 0;
      height: 3px;
      background: linear-gradient(to right, #FFD9A8 0%, #FFB3DA 40%, #D9C5FF 70%, transparent 100%);
      margin: 45px 0;
      border-radius: 2px;
    }
    
    /* Footer */
    .footer {
      background: linear-gradient(180deg, #F5F5F5 0%, #F9F9F9 100%);
      padding: 35px 30px;
      text-align: center;
      border-top: 2px solid;
      border-image: linear-gradient(90deg, #FFD9A8 0%, #FFB3DA 50%, #D9C5FF 100%) 1;
      font-size: 13px;
      color: #666666;
    }
    
    .footer-text {
      margin: 12px 0;
      line-height: 1.8;
      font-family: 'Nunito', sans-serif;
    }
    
    .footer-text:first-child {
      font-size: 16px;
      font-weight: 800;
      color: #FF7B42;
    }
    
    .footer a {
      color: #FF7B42;
      text-decoration: none;
      font-weight: 700;
    }
    
    .footer a:hover {
      text-decoration: underline;
    }
    
    .unsubscribe {
      margin-top: 25px;
      padding-top: 25px;
      border-top: 1px solid #E0E0E0;
      font-family: 'Nunito', sans-serif;
    }
    
    .unsubscribe a {
      color: #FF7B42;
      font-weight: 600;
      font-size: 12px;
    }
    
    /* Responsive */
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        border-radius: 0 !important;
      }
      
      .body {
        padding: 30px 20px !important;
      }
      
      .header {
        padding: 35px 20px !important;
      }
      
      .logo {
        height: 110px !important;
        margin-bottom: 18px !important;
      }
      
      .header-title {
        font-size: 24px !important;
        margin: 12px 0 6px 0 !important;
      }
      
      .header-subtitle {
        font-size: 12px !important;
      }
      
      .greeting {
        font-size: 16px !important;
        margin-bottom: 18px !important;
      }
      
      .newsletter-title {
        font-size: 26px !important;
        margin: 25px 0 18px !important;
      }
      
      .content {
        font-size: 15px !important;
        padding: 18px !important;
        margin: 18px 0 !important;
        border-radius: 12px !important;
      }
      
      .cta-button {
        padding: 12px 28px !important;
        font-size: 14px !important;
        margin: 20px 0 !important;
      }
      
      .divider {
        margin: 30px 0 !important;
      }
      
      .footer {
        padding: 25px 20px !important;
      }
      
      .footer-text {
        margin: 8px 0 !important;
        font-size: 12px !important;
      }
      
      .unsubscribe {
        margin-top: 18px !important;
        padding-top: 18px !important;
      }
    }
  </style>
</head>
<body style="background-color: #f5f5f5; padding: 20px 0;">
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <div class="logo">
        <img src="${u}" alt="Les P'tits Trinquat" style="max-width: 280px; width: 100%; height: auto; display: block; border-radius: 16px; margin: 0 auto;">
      </div>
      <div class="header-title">Les P'tits Trinquat</div>
      <div class="header-subtitle">Association des Parents d'Élèves</div>
    </div>
    
    <!-- Body -->
    <div class="body">
      <p class="greeting">Bonjour ${pe(s)},</p>
      
      <h1 class="newsletter-title">${pe(r)}</h1>
      
      <div class="content">
        ${o}
      </div>
      
      <p style="margin-top: 30px; font-style: italic; color: #999999; font-size: 14px;">
        — L'équipe des P'tits Trinquat
      </p>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p class="footer-text">
        <strong>Les P'tits Trinquat</strong> — Association des Parents d'Élèves
      </p>
      
      <p class="footer-text">
        <a href="${c}">Visiter notre site</a> • 
        <a href="${c}/actualites">Actualités</a>
      </p>
      
      <p class="footer-text" style="color: #999999;">
        © ${x} Les P'tits Trinquat. Tous droits réservés.
      </p>
      
      <div class="unsubscribe">
        <p>Vous recevez cet email car vous êtes inscrit à la newsletter de l'association Les P'tits Trinquat.</p>
        <p><a href="${m}">Se désinscrire de la newsletter</a></p>
      </div>
    </div>
  </div>
</body>
</html>`}function pe(e){const a={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"};return e.replace(/[&<>"']/g,s=>a[s])}function cr(e){let a=pe(e);return a=a.replace(/\n\n/g,"</p><p>"),a=a.replace(/\n/g,"<br>"),a=a.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>"),a=a.replace(/\*(.+?)\*/g,"<em>$1</em>"),a.includes("<p>")||(a=`<p>${a}</p>`),a}function dr({activeSubscribersCount:e=0,onSave:a,onRefresh:s}={}){const[r,n]=d.useState(""),[i,m]=d.useState(""),[c,u]=d.useState(""),[f,x]=d.useState(""),[o,j]=d.useState("mehdozz007@gmail.com"),[P,W]=d.useState(!1),[D,b]=d.useState(!1),[v,h]=d.useState(!1),[y,T]=d.useState([]),[_,F]=d.useState(null),[xe,Me]=d.useState(!1),{toast:A}=$e(),L=r.trim()&&i.trim()&&c.trim();d.useEffect(()=>{re()},[]);const re=async()=>{Me(!0);try{const l=await E.getNewsletters();if(l.success&&l.data){const p=Array.isArray(l.data)?l.data:l.data.newsletters||[];T(p.filter(H=>H.status==="draft"))}}catch(l){console.error("Erreur lors du chargement des brouillons:",l)}finally{Me(!1)}},jt=async()=>{if(L){W(!0);try{const l=await E.createNewsletter(r,i,c,f||c.substring(0,100));if(l.success)A({title:"Succès",description:"Brouillon enregistré"}),n(""),m(""),u(""),x(""),F(null),await re();else throw new Error(l.error||"Erreur lors de la sauvegarde")}catch(l){A({title:"Erreur",description:l.message||"Impossible d'enregistrer le brouillon",variant:"destructive"})}finally{W(!1)}}},Ft=l=>{n(l.title),m(l.subject),u(l.content),x(l.preview_text||""),F(l.id)},kt=async l=>{try{const p=await E.deleteNewsletter(l);if(p.success)A({title:"Succès",description:"Brouillon supprimé"}),await re();else throw new Error(p.error)}catch(p){A({title:"Erreur",description:p.message||"Impossible de supprimer le brouillon",variant:"destructive"})}},Dt=async l=>{b(!0);try{const p=y.find(Fe=>Fe.id===l);if(!p)throw new Error("Brouillon non trouvé");if(!p.title||!p.subject||!p.content)throw new Error("Le brouillon est incomplet (titre, sujet ou contenu manquant)");console.log("📧 Sending newsletter draft:",{draftId:p.id,title:p.title,subject:p.subject,contentLength:p.content.length});const H=localStorage.getItem("admin_token")||localStorage.getItem("auth_token"),ne=await fetch("https://les-ptits-trinquat-api.mehdozz007.workers.dev/newsletter/admin/send",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${H}`},body:JSON.stringify({title:p.title,subject:p.subject,content:p.content,preview_text:p.preview_text||p.content.substring(0,100)})});if(!ne.ok){const Fe=await ne.json();throw new Error(Fe.error||`HTTP ${ne.status}: ${ne.statusText}`)}const St=await ne.json();A({title:"Newsletter envoyée",description:`Votre newsletter a été envoyée à ${St.data?.sent||e} abonnés.`}),await re(),s?.()}catch(p){A({title:"Erreur d'envoi",description:p.message||"Impossible d'envoyer la newsletter.",variant:"destructive"})}finally{b(!1)}},At=async()=>{if(L){h(!0);try{const l=localStorage.getItem("admin_token")||localStorage.getItem("auth_token");if(!l)throw new Error("Token d'authentification non trouvé. Veuillez vous reconnecter.");const H=await fetch("https://les-ptits-trinquat-api.mehdozz007.workers.dev/newsletter/admin/test-email",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${l}`},body:JSON.stringify({title:r,subject:i,content:c,preview_text:f||c.substring(0,100),recipient_email:o||"mehdozz007@gmail.com"})}),je=await H.json();if(!H.ok)throw new Error(je.error||"Erreur lors de l'envoi du test");A({title:"Email de test envoyé",description:`Le test a été envoyé à ${je.data?.testEmail||o}`})}catch(l){A({title:"Erreur",description:l.message||"Impossible d'envoyer l'email de test.",variant:"destructive"})}finally{h(!1)}}},Ct=async()=>{if(!(!L||e===0)){b(!0);try{const l=await E.sendNewsletter(r,i,c,f||c.substring(0,100));if(l.success)A({title:"Newsletter envoyée",description:`Votre newsletter a été envoyée à ${e} abonnés.`}),n(""),m(""),u(""),x(""),F(null),await re(),s?.();else throw new Error(l.error||"Erreur lors de l'envoi")}catch(l){A({title:"Erreur d'envoi",description:l.message||"Impossible d'envoyer la newsletter.",variant:"destructive"})}finally{b(!1)}}};return t.jsx(M.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.4,delay:.1},children:t.jsxs(oe,{className:"shadow-sm border-orange-100/50 bg-white/60 backdrop-blur-sm hover:shadow-md transition-shadow",style:{fontFamily:"'Nunito', sans-serif"},children:[t.jsxs(le,{className:"pb-3 sm:pb-4",children:[t.jsxs(ce,{className:"flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl bg-gradient-to-r from-[#FF7B42] via-[#FF9A6A] to-[#C55FA8] bg-clip-text text-transparent",style:{fontFamily:"'Nunito', sans-serif",fontWeight:700},children:[t.jsx("div",{className:"flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF7B42] to-[#C55FA8] shadow-md flex-shrink-0",children:t.jsx(Ce,{className:"h-3 w-3 sm:h-4 sm:w-4 text-white"})}),t.jsx("span",{className:"truncate",children:"Rédiger une newsletter"})]}),t.jsxs(de,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-xs sm:text-sm mt-2 truncate",children:["Créez et envoyez à ",t.jsxs("strong",{className:"text-[#FF7B42]",children:[e," abonnés"]})," actifs"]})]}),t.jsxs(me,{className:"space-y-4 sm:space-y-6 px-3 sm:px-6",children:[t.jsxs("div",{className:"space-y-2",children:[t.jsx(R,{htmlFor:"title",style:{fontFamily:"'Nunito', sans-serif"},className:"text-xs sm:text-sm font-semibold text-gray-700",children:"Titre interne (usage admin)"}),t.jsx(X,{id:"title",placeholder:"Ex: Newsletter de janvier 2024",value:r,onChange:l=>n(l.target.value),className:"text-sm border-orange-100/50 focus:border-[#FF7B42] focus:ring-[#FF7B42]/20"})]}),t.jsxs("div",{className:"space-y-2",children:[t.jsx(R,{htmlFor:"subject",style:{fontFamily:"'Nunito', sans-serif"},className:"text-xs sm:text-sm font-semibold text-gray-700",children:"Objet de l'email"}),t.jsx(X,{id:"subject",placeholder:"Ex: Les actualités de l'école ce mois-ci",value:i,onChange:l=>m(l.target.value),className:"text-sm border-orange-100/50 focus:border-[#FF7B42] focus:ring-[#FF7B42]/20"})]}),t.jsxs("div",{className:"space-y-2",children:[t.jsx(R,{htmlFor:"preview",style:{fontFamily:"'Nunito', sans-serif"},className:"text-xs sm:text-sm font-semibold text-gray-700",children:"Texte de prévisualisation (optionnel)"}),t.jsx(Pe,{id:"preview",placeholder:"Texte qui apparaît dans la prévisualisation de l'email",value:f,onChange:l=>x(l.target.value),className:"h-[50px] sm:h-[60px] resize-none text-sm border-orange-100/50 focus:border-[#FF7B42] focus:ring-[#FF7B42]/20"})]}),t.jsxs("div",{className:"space-y-2",children:[t.jsx(R,{htmlFor:"testEmail",style:{fontFamily:"'Nunito', sans-serif"},className:"text-xs sm:text-sm font-semibold text-gray-700",children:"Email de test"}),t.jsx(X,{id:"testEmail",type:"email",placeholder:"Email pour recevoir le test",value:o,onChange:l=>j(l.target.value),className:"text-sm border-orange-100/50 focus:border-[#FF7B42] focus:ring-[#FF7B42]/20"})]}),t.jsxs("div",{className:"space-y-2",children:[t.jsx(R,{htmlFor:"content",style:{fontFamily:"'Nunito', sans-serif"},className:"text-xs sm:text-sm font-semibold text-gray-700",children:"Contenu de la newsletter"}),t.jsx(Pe,{id:"content",placeholder:"Écrivez le contenu de votre newsletter ici...",value:c,onChange:l=>u(l.target.value),className:"min-h-[150px] sm:min-h-[200px] resize-y text-sm border-orange-100/50 focus:border-[#FF7B42] focus:ring-[#FF7B42]/20"})]}),t.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2",children:[t.jsxs(N,{variant:"outline",onClick:jt,disabled:!L||P,size:"sm",className:"text-xs sm:text-sm border-orange-200 text-[#FF7B42] h-9 sm:h-10 font-medium relative overflow-hidden group transition-all",style:{background:"linear-gradient(135deg, transparent 0%, transparent 100%)"},onMouseEnter:l=>{l.currentTarget.style.background="linear-gradient(135deg, #FF7B42 0%, #FF9A6A 50%, #C55FA8 100%)",l.currentTarget.style.color="white",l.currentTarget.style.borderColor="#FF7B42"},onMouseLeave:l=>{l.currentTarget.style.background="transparent",l.currentTarget.style.color="#FF7B42",l.currentTarget.style.borderColor="rgb(254, 209, 180)"},children:[P?t.jsx($,{className:"h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin"}):t.jsx(oa,{className:"h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"}),t.jsx("span",{children:"Brouillon"})]}),t.jsxs(Qt,{children:[t.jsx(Ut,{asChild:!0,children:t.jsxs(N,{variant:"outline",disabled:!L,size:"sm",className:"text-xs sm:text-sm border-rose-200 text-[#FF9A6A] h-9 sm:h-10 font-medium relative overflow-hidden group transition-all",style:{background:"linear-gradient(135deg, transparent 0%, transparent 100%)"},onMouseEnter:l=>{l.currentTarget.style.background="linear-gradient(135deg, #FFB347 0%, #FF9A6A 50%, #FF7B42 100%)",l.currentTarget.style.color="white",l.currentTarget.style.borderColor="#FF9A6A"},onMouseLeave:l=>{l.currentTarget.style.background="transparent",l.currentTarget.style.color="#FF9A6A",l.currentTarget.style.borderColor="rgb(254, 205, 198)"},children:[t.jsx(ra,{className:"h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"}),t.jsx("span",{children:"Aperçu"})]})}),t.jsxs(Gt,{className:"max-w-2xl sm:max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-auto p-3 sm:p-6",children:[t.jsxs(Kt,{children:[t.jsx(Zt,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-base sm:text-lg",children:"Prévisualisation de la newsletter"}),t.jsx(ea,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-xs sm:text-sm",children:"Voici comment apparaîtra votre newsletter dans les clients email"})]}),t.jsx("div",{className:"mt-3 sm:mt-4 w-full",children:t.jsx("iframe",{srcDoc:lr({title:r,previewText:f||c.substring(0,100),content:c,firstName:"Cher parent"}),className:"w-full h-[550px] sm:h-[680px] border border-orange-200 rounded-lg",title:"Email preview",style:{backgroundColor:"#f5f5f5"}})})]})]}),t.jsxs(N,{variant:"secondary",onClick:At,disabled:!L||v,size:"sm",className:"text-xs sm:text-sm bg-gradient-to-r from-[#FF9A6A] to-[#C55FA8] text-white hover:shadow-md h-9 sm:h-10",children:[v?t.jsx($,{className:"h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin"}):t.jsx(ge,{className:"h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"}),t.jsx("span",{children:"Test"})]}),t.jsxs(ue,{children:[t.jsx(he,{asChild:!0,children:t.jsxs(N,{variant:"playful",disabled:!L||e===0||D,size:"sm",className:"text-xs sm:text-sm bg-gradient-to-r from-[#FF7B42] via-[#FF9A6A] to-[#C55FA8] text-white hover:shadow-lg h-9 sm:h-10",children:[D?t.jsx($,{className:"h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin"}):t.jsx(ge,{className:"h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"}),t.jsx("span",{children:"Envoyer"})]})}),t.jsxs(U,{className:"w-[95vw] sm:w-auto",children:[t.jsxs(G,{children:[t.jsx(Z,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-base sm:text-lg",children:"Confirmer l'envoi"}),t.jsxs(ee,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-xs sm:text-sm",children:["Vous êtes sur le point d'envoyer cette newsletter à"," ",t.jsxs("strong",{children:[e," abonnés"]}),". Cette action ne peut pas être annulée."]})]}),t.jsxs(K,{className:"flex-col-reverse sm:flex-row gap-2 sm:gap-0",children:[t.jsx(ae,{className:"text-xs sm:text-sm",children:"Annuler"}),t.jsx(te,{onClick:Ct,className:"text-xs sm:text-sm",children:"Confirmer l'envoi"})]})]})]})]}),y.length>0&&t.jsxs(M.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},className:"mt-8 pt-6 border-t border-orange-100/30",children:[t.jsx("div",{className:"mb-4",children:t.jsxs("h3",{className:"text-lg font-semibold bg-gradient-to-r from-[#FF7B42] to-[#C55FA8] bg-clip-text text-transparent flex items-center gap-2",children:[t.jsx(Ce,{className:"h-5 w-5 text-[#FF7B42]"}),"Brouillons (",y.length,")"]})}),t.jsx("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:y.map(l=>t.jsxs(M.div,{initial:{opacity:0,scale:.95},animate:{opacity:1,scale:1},className:"p-3 rounded-xl border border-orange-100/50 bg-gradient-to-br from-orange-50/50 to-rose-50/50 hover:shadow-md transition-all flex flex-col",children:[t.jsx("p",{className:"font-semibold text-xs sm:text-sm text-gray-900 truncate mb-1",children:l.title}),t.jsx("p",{className:"text-xs text-muted-foreground truncate mb-2 flex-1",children:l.subject}),t.jsxs("div",{className:"flex flex-row gap-1 w-full",children:[t.jsxs(N,{size:"sm",variant:"ghost",onClick:()=>Ft(l),className:"text-xs h-7 text-[#FF7B42] flex-1 px-2 min-w-0",children:[t.jsx(na,{className:"h-3 w-3 mr-1"}),"Éditer"]}),t.jsxs(N,{size:"sm",variant:"ghost",onClick:()=>Dt(l.id),disabled:D,className:"text-xs h-7 text-green-600 flex-1 px-2 min-w-0",children:[t.jsx(ge,{className:"h-3 w-3 mr-1"}),"Envoyer"]}),t.jsxs(ue,{children:[t.jsx(he,{asChild:!0,children:t.jsxs(N,{size:"sm",variant:"ghost",className:"text-xs h-7 text-red-600 flex-1 px-2 min-w-0",children:[t.jsx(ye,{className:"h-3 w-3 mr-1"}),"Supprimer"]})}),t.jsxs(U,{children:[t.jsxs(G,{children:[t.jsx(Z,{children:"Supprimer le brouillon?"}),t.jsx(ee,{children:"Cette action ne peut pas être annulée."})]}),t.jsxs(K,{children:[t.jsx(ae,{children:"Annuler"}),t.jsx(te,{onClick:()=>kt(l.id),className:"bg-red-600",children:"Supprimer"})]})]})]})]})]},l.id))})]})]})]})})}const mr=()=>typeof window<"u"&&window.innerWidth<640;function ur({newsletters:e=[],onDelete:a}={}){const[s,r]=d.useState(!1);d.useEffect(()=>{r(mr())},[]);const n=e.filter(c=>c.status==="sent"),i=e.filter(c=>c.status==="draft"),m=s?{}:{initial:{opacity:0,x:-20},animate:{opacity:1,x:0},transition:{delay:0}};return t.jsx(M.div,{initial:{opacity:0,y:20},animate:{opacity:1,y:0},transition:{duration:.4,delay:.2},children:t.jsxs(oe,{className:"shadow-sm border-orange-100/50 bg-white/60 backdrop-blur-sm hover:shadow-md transition-shadow",style:{fontFamily:"'Nunito', sans-serif"},children:[t.jsxs(le,{className:"pb-3 sm:pb-4",children:[t.jsxs(ce,{className:"flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl bg-gradient-to-r from-[#FF7B42] via-[#FF9A6A] to-[#C55FA8] bg-clip-text text-transparent",style:{fontFamily:"'Nunito', sans-serif",fontWeight:700},children:[t.jsx("div",{className:"flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF7B42] to-[#C55FA8] shadow-md flex-shrink-0",children:t.jsx(ta,{className:"h-3 w-3 sm:h-4 sm:w-4 text-white"})}),t.jsx("span",{className:"truncate",children:"Historique des newsletters"})]}),t.jsxs(de,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-xs sm:text-sm mt-2",children:[t.jsx("strong",{className:"text-[#FF7B42]",children:n.length})," newsletters envoyées, ",t.jsx("strong",{children:i.length})," brouillons"]})]}),t.jsx(me,{className:"px-3 sm:px-6",children:e.length===0?t.jsxs("div",{className:"text-center py-8 sm:py-12 text-muted-foreground",children:[t.jsx(Ce,{className:"h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 opacity-30"}),t.jsx("p",{style:{fontFamily:"'Nunito', sans-serif"},className:"text-sm sm:text-base",children:"Aucune newsletter pour le moment"})]}):t.jsx("div",{className:"space-y-3 sm:space-y-4",children:e.map((c,u)=>t.jsx(M.div,{...m,className:"p-3 sm:p-4 rounded-xl border border-orange-100/50 bg-white/60 hover:shadow-md transition-shadow",children:t.jsxs("div",{className:"flex flex-col gap-3",children:[t.jsxs("div",{className:"flex items-start justify-between gap-2",children:[t.jsxs("div",{className:"flex-1 min-w-0",children:[t.jsx("h4",{className:"font-semibold text-sm sm:text-base truncate text-gray-800",style:{fontFamily:"'Nunito', sans-serif"},children:c.title}),t.jsx(ie,{variant:c.status==="sent"?"default":"secondary",className:c.status==="sent"?"bg-gradient-to-r from-[#FF7B42] to-[#FF9A6A] text-white hover:opacity-90 text-xs mt-1":"bg-orange-100 text-orange-700 hover:bg-orange-100 text-xs mt-1",children:c.status==="sent"?t.jsxs(t.Fragment,{children:[t.jsx(ge,{className:"h-3 w-3 mr-1"}),"Envoyée"]}):t.jsxs(t.Fragment,{children:[t.jsx(Bt,{className:"h-3 w-3 mr-1"}),"Brouillon"]})})]}),t.jsxs(ue,{children:[t.jsx(he,{asChild:!0,children:t.jsx(N,{variant:"ghost",size:"sm",className:"text-[#C55FA8] hover:bg-rose-50/50 h-8 w-8 p-0 mt-1 flex-shrink-0",children:t.jsx(ye,{className:"h-4 w-4"})})}),t.jsxs(U,{className:"w-[95vw] sm:w-auto",children:[t.jsxs(G,{children:[t.jsx(Z,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-base sm:text-lg",children:"Supprimer cette newsletter ?"}),t.jsx(ee,{style:{fontFamily:"'Nunito', sans-serif"},className:"text-xs sm:text-sm",children:"Cette action supprimera définitivement cette newsletter de l'historique."})]}),t.jsxs(K,{className:"flex-col-reverse sm:flex-row gap-2 sm:gap-0",children:[t.jsx(ae,{className:"text-xs sm:text-sm",children:"Annuler"}),t.jsx(te,{onClick:()=>a?.(c.id),className:"text-xs sm:text-sm bg-gradient-to-r from-[#C55FA8] to-[#FF9A6A] text-white hover:opacity-90",children:"Supprimer"})]})]})]})]}),t.jsxs("div",{className:"space-y-1",children:[t.jsxs("p",{className:"text-xs sm:text-sm text-gray-600",style:{fontFamily:"'Nunito', sans-serif"},children:[t.jsx("strong",{children:"Objet :"})," ",c.subject]}),t.jsx("p",{className:"text-xs text-gray-500",style:{fontFamily:"'Nunito', sans-serif"},children:c.status==="sent"&&c.sent_at?t.jsxs(t.Fragment,{children:["Envoyée le ",be(new Date(c.sent_at),"dd MMM yyyy à HH:mm",{locale:ve}),c.recipients_count&&t.jsxs(t.Fragment,{children:[" • ",c.recipients_count," destinataires"]})]}):t.jsxs(t.Fragment,{children:["Créée le ",be(new Date(c.created_at),"dd MMM yyyy à HH:mm",{locale:ve})]})})]})]})},c.id))})})]})})}function hr(){const[e,a]=d.useState([]),[s,r]=d.useState([]),[n,i]=d.useState(!0),[m,c]=d.useState(""),{toast:u}=$e(),f=d.useCallback(async()=>{try{console.log("[useNewsletterAdmin] Fetching subscribers...");const h=await E.getSubscribers();if(console.log("[useNewsletterAdmin] API Result:",h),h.success&&h.data)console.log("[useNewsletterAdmin] Subscribers loaded:",h.data.length,"items"),a(h.data);else throw console.warn("[useNewsletterAdmin] API returned false success or no data:",h),new Error(h.error||"Erreur lors du chargement des abonnés")}catch(h){console.error("Fetch subscribers error:",h),u({title:"Erreur",description:h.message||"Impossible de charger les abonnés.",variant:"destructive"}),a([])}},[u]),x=d.useCallback(async()=>{try{const h=await E.getNewsletters();if(h.success&&h.data)r(h.data);else throw new Error(h.error||"Erreur lors du chargement des newsletters")}catch(h){console.error("Fetch newsletters error:",h),u({title:"Erreur",description:"Impossible de charger les newsletters.",variant:"destructive"}),r([])}},[u]),o=d.useCallback(async()=>{console.log("[useNewsletterAdmin] loadData called"),i(!0),await Promise.all([f(),x()]),i(!1)},[f,x]);d.useEffect(()=>{console.log("[useNewsletterAdmin] Component mounted, loading initial data"),o()},[]);const j=async(h,y)=>{try{if(!e.find(F=>F.id===h))return;a(F=>F.map(xe=>xe.id===h?{...xe,is_active:!y}:xe));const _=await E.toggleSubscriber(h,!y);if(!_.success)throw new Error(_.error||"Erreur lors de la mise à jour");u({title:"Succès",description:`Abonné ${y?"désactivé":"activé"}`})}catch(T){console.error("Toggle subscriber error:",T),u({title:"Erreur",description:T.message||"Impossible de mettre à jour le statut",variant:"destructive"}),await f()}},P=async h=>{if(confirm("Êtes-vous sûr de vouloir supprimer cet abonné ?"))try{a(T=>T.filter(_=>_.id!==h));const y=await E.deleteSubscriber(h);if(!y.success)throw new Error(y.error||"Erreur lors de la suppression");u({title:"Succès",description:"Abonné supprimé"})}catch(y){console.error("Delete subscriber error:",y),u({title:"Erreur",description:y.message||"Impossible de supprimer l'abonné",variant:"destructive"}),await f()}},W=async(h,y,T,_)=>{try{const F=await E.createNewsletter(h,y,T,_);if(F.success)return u({title:"Succès",description:"Newsletter créée"}),await x(),F.data;throw new Error(F.error)}catch(F){return console.error("Save newsletter error:",F),u({title:"Erreur",description:F.message||"Impossible de créer la newsletter",variant:"destructive"}),null}},D=async h=>{if(confirm("Êtes-vous sûr de vouloir supprimer cette newsletter ?"))try{r(s.filter(y=>y.id!==h)),u({title:"Succès",description:"Newsletter supprimée"})}catch(y){console.error("Delete newsletter error:",y),u({title:"Erreur",description:"Impossible de supprimer la newsletter",variant:"destructive"}),await x()}},b=e.filter(h=>h.email.toLowerCase().includes(m.toLowerCase())||(h.first_name?.toLowerCase()||"").includes(m.toLowerCase())),v=e.filter(h=>h.is_active).length;return{subscribers:b,newsletters:s,isLoading:n,searchQuery:m,setSearchQuery:c,activeSubscribersCount:v,totalSubscribersCount:e.length,toggleSubscriberStatus:j,deleteSubscriber:P,saveNewsletter:W,deleteNewsletter:D,fetchSubscribers:f,fetchNewsletters:x,refreshData:o}}function Dr(){const{user:e,isLoading:a,signOut:s}=Ye(),{subscribers:r,isLoading:n,searchQuery:i,setSearchQuery:m,activeSubscribersCount:c,totalSubscribersCount:u,toggleSubscriberStatus:f,deleteSubscriber:x,refreshData:o}=hr();return d.useEffect(()=>{console.log("[AdminNewsletter] Subscribers changed:",{count:r.length,isLoading:n})},[r.length,n]),!a&&!e?t.jsx(_t,{to:"/admin/newsletter/auth",replace:!0}):t.jsx(ma,{children:t.jsxs("div",{className:"min-h-screen bg-gradient-to-br from-[#FFFBF7] via-[#F8F5FF] to-[#F5F9FF]",style:{fontFamily:"'Nunito', sans-serif"},children:[t.jsx("header",{className:"sticky top-0 z-50 border-b border-orange-100/50 bg-gradient-to-r from-[#FFF5F0] to-[#FFF0F7] backdrop-blur-lg shadow-sm",children:t.jsxs("div",{className:"container flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4 gap-2",children:[t.jsxs("div",{className:"flex items-center gap-2 sm:gap-4 min-w-0",children:[t.jsx(Lt,{to:"/",children:t.jsxs(N,{variant:"ghost",size:"sm",className:"hover:bg-orange-50/50 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm",children:[t.jsx(zt,{className:"h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2"}),t.jsx("span",{className:"hidden sm:inline",children:"Retour"})]})}),t.jsx("div",{className:"hidden sm:block h-6 w-px bg-gradient-to-b from-orange-200 to-rose-200"}),t.jsxs("div",{className:"hidden sm:flex items-center gap-2 min-w-0",children:[t.jsx("div",{className:"flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#FF7B42] to-[#C55FA8] shadow-md flex-shrink-0",children:t.jsx(Se,{className:"h-3.5 w-3.5 text-white"})}),t.jsx("span",{className:"font-semibold text-sm bg-gradient-to-r from-[#FF7B42] to-[#C55FA8] bg-clip-text text-transparent truncate",children:"Administration Newsletter"})]})]}),t.jsxs("div",{className:"flex items-center gap-1 sm:gap-2",children:[t.jsxs(N,{variant:"outline",size:"sm",onClick:()=>{console.log("[AdminNewsletter] Refresh button clicked"),o()},disabled:n,className:"border-orange-200 hover:bg-orange-50/50 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm",children:[n?t.jsx($,{className:"h-3 w-3 sm:h-4 sm:w-4 animate-spin"}):t.jsx(ia,{className:"h-3 w-3 sm:h-4 sm:w-4"}),t.jsx("span",{className:"hidden sm:inline ml-1 sm:ml-2",children:"Actualiser"})]}),t.jsxs(N,{variant:"ghost",size:"sm",onClick:s,title:`Déconnexion (${e?.email})`,className:"hover:bg-rose-50/50 h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm",children:[t.jsx(He,{className:"h-3 w-3 sm:h-4 sm:w-4"}),t.jsx("span",{className:"hidden sm:inline ml-1 sm:ml-2",children:"Déconnexion"})]})]})]})}),t.jsxs("main",{className:"container py-4 sm:py-8 px-2 sm:px-4",children:[t.jsxs(M.div,{initial:{opacity:0,y:-20},animate:{opacity:1,y:0},className:"mb-6 sm:mb-8",children:[t.jsx("h1",{className:"text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#FF7B42] via-[#FF9A6A] to-[#C55FA8] bg-clip-text text-transparent",style:{fontFamily:"'Nunito', sans-serif",fontWeight:700},children:"Gestion de la Newsletter"}),t.jsx("p",{className:"text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2",style:{fontFamily:"'Nunito', sans-serif"},children:"Gérez vos abonnés et envoyez des newsletters aux familles"})]}),n?t.jsx("div",{className:"flex items-center justify-center py-20",children:t.jsx($,{className:"h-8 w-8 animate-spin text-primary"})}):t.jsxs("div",{className:"grid gap-6 sm:gap-8 lg:grid-cols-2 auto-rows-max",children:[t.jsx("div",{className:"space-y-6 sm:space-y-8",children:t.jsx(ir,{subscribers:r,searchQuery:i,onSearchChange:m,activeCount:c,totalCount:u,onToggleStatus:f,onDelete:x})}),t.jsxs("div",{className:"space-y-6 sm:space-y-8",children:[t.jsx(dr,{activeSubscribersCount:c,onRefresh:o}),t.jsx(ur,{})]})]})]})]})})}export{Dr as default};
