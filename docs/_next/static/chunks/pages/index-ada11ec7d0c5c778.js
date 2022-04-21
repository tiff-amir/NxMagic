(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{3821:function(e,n,t){"use strict";t.d(n,{Z:function(){return l}});var s=t(7294),a=getComputedStyle(document.body),r=function(){var e=0;return function(){return e||(n="--unit",e=Number(((null===a||void 0===a?void 0:a.getPropertyValue(n))||"0").replace("px","")));var n}}(),o=t(12),i=t.n(o),c=t(5893),l=function(e){var n=e.children,t=(0,s.useRef)(),a=(0,s.useRef)(),o=r(),l=(0,s.useCallback)((function(){if(t.current&&a.current){var e=(t.current.offsetHeight-a.current.offsetHeight)/2/o;t.current.style.setProperty("--container-height-vertical-padding","".concat(e))}}),[o]);return l(),(0,s.useEffect)((function(){return window.addEventListener("resize",l),function(){window.removeEventListener("resize",l)}}),[l]),(0,c.jsx)("div",{ref:t,className:i().PageWrapper,children:n})}},3274:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return G}});var s=t(7294),a=t(5313),r=t(4184),o=t.n(r),i=t(4691),c=t(2809),l=t(4798),u=t.n(l),d=t(9894),_=t(6359),p=t.n(_),m=t(5893),f=function(e){var n,t=e.id,s=void 0===t?(0,d.Z)():t,a=e.warning,r=void 0===a?"":a,i=e.error,l=void 0===i?"":i,_=e.success,f=void 0===_?"":_,x=e.label,h=void 0===x?"":x,v=e.className,g=void 0===v?"":v,b=e.name,R=void 0===b?"":b,j=e.placeholder,N=void 0===j?"":j,k=e.value,C=void 0===k?"":k,P=e.onChange,I=void 0===P?u():P,M=e.prepend,y=void 0===M?null:M,Z=e.append,w=void 0===Z?null:Z,L=e.autoComplete,D=void 0!==L&&L,T=e.lock,E=void 0!==T&&T,S=e.big,B=void 0!==S&&S,F=e.spellcheck,W=void 0===F||F;return(0,m.jsxs)("div",{className:o()(p().Input,g),children:[h?(0,m.jsx)("div",{className:p().label,children:(0,m.jsx)("label",{htmlFor:s,children:h})}):null,(0,m.jsxs)("div",{className:p().container,children:[y?(0,m.jsx)("div",{className:p().prepend,children:y}):null,(0,m.jsx)("input",{spellCheck:W,disabled:E,autoComplete:D?"on":"off",id:s,name:R,className:o()(p().input,(n={},(0,c.Z)(n,p()["input--big"],B),(0,c.Z)(n,p()["input--error"],l),n)),placeholder:N,value:C,onChange:I,type:"text"}),w?(0,m.jsx)("div",{className:p().append,children:w}):null]}),Boolean(f)&&!l&&!r&&(0,m.jsx)("div",{className:p().success,children:f}),!l&&Boolean(r)&&(0,m.jsx)("div",{className:p().warning,children:r}),Boolean(l)&&(0,m.jsx)("div",{className:p().error,children:l})]})},x=t(2125),h=t(2918),v=t(1087),g=t.n(v),b=function(e){var n=e.ownAddress,t=e.address,a=e.isDecreasing,r=e.withFee,c=e.onClose,l=e.onDecrease,u=e.onChange,d=e.isAddressIncorrect,_=e.decreaseFee,p=e.rootSymbol,v=(0,i.Z)().t,b=(0,s.useCallback)((function(e){u(e.target.value)}),[u]);return(0,m.jsx)(h.Z,{className:g().DecreaseModal,title:v("DecreaseModal.title"),onClose:c,buttons:(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(x.ZP,{className:g().button,type:x.Xi,onClick:c,text:v("_common.close")}),(0,m.jsx)(x.ZP,{blank:!0,disabled:a,onClick:l,className:o()(g().button,g()["button--last"]),type:x.Pq,text:v("DecreaseModal.decrease")})]}),children:(0,m.jsx)(f,{spellcheck:!1,placeholder:n,onChange:b,lock:a,label:v("DecreaseModal.inputLabel"),value:t,warning:r?v("DecreaseModal.decreaseFee",{value:_,symbol:p}):void 0,error:d?v("_errors.address"):void 0})})},R=t(1391),j=function(e){return e.umill.isIncreasing},N=function(e){return e.umill.increaseError},k=function(e){return e.umill.isDecreasing},C=function(e){return e.umill.decreaseError},P=t(116),I=/^0x[a-f0-9]{40}$/i,M=t(6137),y=t(7872),Z=function(e){var n=e.onClose,t=(0,i.Z)().t,r=(0,a.I0)(),o=(0,s.useRef)(""),c=(0,s.useRef)(!1),l=(0,a.v9)(R.f5),u=(0,a.v9)(R.nO),d=(0,a.v9)(R.Et),_=(0,a.v9)(k),p=(0,a.v9)(C),f=(0,s.useState)(!1),x=f[0],h=f[1],v=(0,s.useState)(""),g=v[0],j=v[1],N=(0,s.useContext)(M.Z).open;(0,s.useEffect)((function(){p!==o.current&&(o.current=p,p&&N(t("_errors.unknown"),{type:"error"}))}),[p,N,t]),(0,s.useEffect)((function(){_!==c.current&&(c.current=_,_||p||(N(t("DecreaseModal.decreased"),{type:"success"}),n()))}),[p,_,n,N,t]);var Z=(0,s.useCallback)((function(){h(!0),g&&!I.test(g)||(u===d&&l===g?N(t("DecreaseModal.decreased",{balance:u,symbol:y.r.NA}),{type:"success"}):(N(t("DecreaseModal.decreasing"),{autoClose:1e3}),r((0,P.umillDecrease)(g||l))))}),[l,d,g,r,u,N,t]),w=(0,s.useCallback)((function(e){h(!1),j(e)}),[]);return(0,m.jsx)(b,{ownAddress:l,withFee:g!==l&&I.test(g),decreaseFee:y.r.LL,rootSymbol:y.Lu.N,isAddressIncorrect:x&&g&&!I.test(g),onChange:w,onClose:n,address:g,isDecreasing:_,onDecrease:Z})},w=t(3617),L=t(6679),D=t(6130),T=t.n(D),E=function(e){var n=e.children,t=e.onSubmit,a=e.autoComplete,r=void 0===a?"":a,i=e.className,c=void 0===i?"":i,l=e.skipPrevent,u=void 0!==l&&l,d=e.disabled,_=void 0!==d&&d,p=(0,s.useCallback)((function(e){u||(0,L.P)(e),_||t(e)}),[_,t,u]);return(0,m.jsxs)("form",{action:"",autoComplete:r,className:o()(T().Form,c),onSubmit:t&&p,children:[n,t&&(0,m.jsx)("input",{type:"submit",className:T().hiddenSubmit})]})},S=t(4810),B=t(3579),F=t(9566),W=t.n(F),A=function(e){var n=e.contractAddress,t=e.contractLink,a=e.symbol,r=e.tokenName,c=e.increase,l=e.increaseResult,u=e.onIncreaseChange,d=e.connectRequired,_=e.isConnecting,p=e.disabled,h=e.onConnect,v=e.onIncrease,g=e.onDecrease,b=e.telegramLink,R=e.githubLink,j=e.redditLink,N=e.whitepaperLink,k=e.increaseLimit,C=(0,i.Z)().t,P=(0,s.useCallback)((function(e){u(Number(e.target.value||"0"))}),[u]);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)("div",{className:W().title,children:[(0,m.jsx)("span",{className:W().titleTextMain,children:C("RootPage.title.0")}),(0,m.jsx)("span",{className:W().titleTextRegular,children:C("RootPage.title.1")})]}),(0,m.jsx)("div",{className:W().contract,children:(0,m.jsx)(w.Z,{blank:!0,href:t,className:W().contractLink,children:n})}),(0,m.jsxs)("div",{className:W().description,children:[(0,m.jsx)("span",{className:W().descriptionRegular,children:C("RootPage.description.0")}),(0,m.jsx)("span",{className:W().descriptionMain,children:C("RootPage.description.1")}),(0,m.jsx)("span",{className:W().descriptionRegular,children:C("RootPage.description.2")}),(0,m.jsx)("span",{className:W().descriptionMain,children:C("RootPage.description.3")})]}),(0,m.jsxs)("div",{className:W().increase,children:[(0,m.jsxs)("div",{className:W().increaseTitle,children:[(0,m.jsx)("span",{className:W().increaseTitleRegular,children:C("RootPage.increase.0")}),(0,m.jsx)("span",{className:W().increaseTitleMain,children:C("RootPage.increase.1")}),(0,m.jsx)("span",{className:W().increaseTitleRegular,children:C("RootPage.increase.2",{tokenName:r})})]}),(0,m.jsxs)(E,{disabled:!c,onSubmit:v,children:[(0,m.jsx)(f,{big:!0,lock:p,onChange:P,value:c?String(c):"",className:W().increaseInput,warning:k<c&&!d?C("RootPage.maximumIncreaseWarning",{value:k}):void 0}),(0,m.jsx)("div",{className:W().controls,children:d?(0,m.jsx)(x.ZP,{big:!0,disabled:_,type:x.Pq,text:C("RootPage.connectWallet"),onClick:h,className:W().button}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(x.ZP,{big:!0,disabled:p,className:W().button,type:x.Xi,text:C("RootPage.decrease"),onClick:g}),(0,m.jsx)("div",{className:W().space}),(0,m.jsx)(x.ZP,{big:!0,disabled:!c||p,className:o()(W().button,W().increaseButton),type:x.Pq,text:C("RootPage.increaseAmount"),onClick:v})]})})]}),Boolean(l)&&!d&&(0,m.jsxs)("div",{className:W().increaseResult,children:[(0,m.jsx)("div",{children:(0,m.jsx)("span",{className:W().increaseResultRegular,children:C("RootPage.increaseResult.0")})}),(0,m.jsx)("div",{children:(0,m.jsx)("span",{className:W().increaseResultMain,children:C("RootPage.increaseResult.1",{symbol:a,value:l})})})]}),(0,m.jsxs)("div",{className:W().footer,children:[b&&(0,m.jsxs)(S.ZP,{blank:!0,className:W().footerButton,type:x.Xi,href:b,children:[(0,m.jsx)(B.Z,{className:W().footerIcon,name:"telegram"}),(0,m.jsx)("div",{className:W().footerText,children:C("_common.telegram")})]}),R&&(0,m.jsxs)(S.ZP,{blank:!0,className:W().footerButton,type:x.Xi,href:R,children:[(0,m.jsx)(B.Z,{className:W().footerIcon,name:"github"}),(0,m.jsx)("div",{className:W().footerText,children:C("_common.github")})]}),j&&(0,m.jsxs)(S.ZP,{blank:!0,className:W().footerButton,type:x.Xi,href:j,children:[(0,m.jsx)(B.Z,{className:W().footerIcon,name:"reddit"}),(0,m.jsx)("div",{className:W().footerText,children:C("_common.reddit")})]}),N&&(0,m.jsxs)(S.ZP,{blank:!0,className:W().footerButton,type:x.Xi,href:N,children:[(0,m.jsx)(B.Z,{className:W().footerIcon,name:"whitepaper"}),(0,m.jsx)("div",{className:W().footerText,children:C("_common.whitepaper")})]})]})]})]})},V=t(5445),X=t(9192),O=function(){var e=(0,i.Z)().t,n=(0,a.I0)(),t=(0,s.useRef)(""),r=(0,s.useRef)(!1),o=(0,a.v9)(R.Et),c=(0,a.v9)(R.f5),l=(0,a.v9)(R.DS),u=(0,a.v9)(j),d=(0,a.v9)(N),_=Math.floor(y.r.K9/o),p=(0,s.useState)(10),f=p[0],x=p[1],h=(0,s.useContext)(M.Z).open,v=(0,s.useContext)(V.Z),g=v.open,b=v.close;(0,s.useEffect)((function(){d!==t.current&&(t.current=d,d&&h(e("_errors.unknown"),{type:"error"}))}),[d,h,e]),(0,s.useEffect)((function(){u!==r.current&&(r.current=u,u||d||h(e("RootPage.increased"),{type:"success"}))}),[d,u,h,e]);var k=(0,s.useCallback)((function(e){x(e)}),[]),C=(0,s.useCallback)((function(){var e=g((0,m.jsx)(X.Z,{onClose:function(){return b(e)}}))}),[b,g]),I=(0,s.useCallback)((function(){h(e("RootPage.increasing"),{autoClose:1e3}),n((0,P.umillIncrease)(Math.min(f,_)))}),[e,h,n,f,_]),w=(0,s.useCallback)((function(){var e=g((0,m.jsx)(Z,{onClose:function(){return b(e)}}))}),[g,b]);return(0,m.jsx)(A,{disabled:u,increase:f,increaseResult:f?Math.min(f,_)*o+o:o,contractAddress:y.r.Lk,contractLink:y.r.Ok.G,symbol:y.r.NA,tokenName:y.r.u2,telegramLink:y.VV.Ok.wL,githubLink:y.VV.Ok.bW,redditLink:y.VV.Ok.Od,whitepaperLink:y.VV.Ok.JE,connectRequired:!c,isConnecting:l,onIncreaseChange:k,onConnect:C,onIncrease:I,onDecrease:w,increaseLimit:_})},q=t(3821),G=function(){return(0,m.jsx)(q.Z,{children:(0,m.jsx)(O,{})})}},5301:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return t(3274)}])},6130:function(e){e.exports={hiddenSubmit:"Form_hiddenSubmit__z57mo"}},6359:function(e){e.exports={Input:"Input_Input__G2lLh",container:"Input_container__tBYzX",label:"Input_label__0K5rv",prepend:"Input_prepend__aSIDr",append:"Input_append__krtki",input:"Input_input__A5waW","input--error":"Input_input--error__SLkaL","input--big":"Input_input--big__XDjwC",error:"Input_error__3Wfdz",success:"Input_success__xMMP5",warning:"Input_warning__Gr1fa"}},12:function(e){e.exports={PageWrapper:"PageWrapper_PageWrapper__ajZPm"}},1087:function(e){e.exports={DecreaseModal:"DecreaseModal_DecreaseModal__kWwxN",button:"DecreaseModal_button__hA594","button--last":"DecreaseModal_button--last__Mxn_W"}},9566:function(e){e.exports={title:"Root_title__IEHWl",titleTextMain:"Root_titleTextMain__dV_9I",titleTextRegular:"Root_titleTextRegular__FYWE3",contract:"Root_contract__9P20x",contractLink:"Root_contractLink__Tmsot",description:"Root_description__sbFq2",descriptionRegular:"Root_descriptionRegular__AWPQ1",descriptionMain:"Root_descriptionMain__NsXHG",increase:"Root_increase__Tphjl",increaseTitle:"Root_increaseTitle__8B3M_",increaseTitleMain:"Root_increaseTitleMain__SdQpP",increaseInput:"Root_increaseInput__GBygh",controls:"Root_controls__DrOHq",button:"Root_button__rsTLZ",space:"Root_space__fjsVq",increaseButton:"Root_increaseButton__SkyeM",increaseResult:"Root_increaseResult__bx28C",increaseResultRegular:"Root_increaseResultRegular__ZxaUs",increaseResultMain:"Root_increaseResultMain__ErMRa",footer:"Root_footer__XM4LG",footerButton:"Root_footerButton__VG_hy",footerIcon:"Root_footerIcon__1nFEP",footerText:"Root_footerText__avQq6"}}},function(e){e.O(0,[774,888,179],(function(){return n=5301,e(e.s=n);var n}));var n=e.O();_N_E=n}]);