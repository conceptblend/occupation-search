(this["webpackJsonpnoc-magic"]=this["webpackJsonpnoc-magic"]||[]).push([[6],{302:function(e,t,n){"use strict";var a=n(312),c=n(0),r=n.n(c),i=n(380),l=n(382),o=n(381),u=n(303),s=n.n(u),d=function(e){var t=e.title,n=e.description,a=e["data-matchtype"];return[r.a.createElement("div",{key:"content"},t&&r.a.createElement("div",{className:"title"},t),"isolated"===a&&n&&r.a.createElement("div",{className:"description"},n))]},m=function(e){var t=Object(c.useState)(!1),n=Object(a.a)(t,2),u=n[0],m=n[1],p=Object(c.useState)(""),f=Object(a.a)(p,2),v=f[0],b=f[1],E=Object(c.useState)([]),h=Object(a.a)(E,2),g=h[0],j=h[1],O=Object(c.useState)({}),y=Object(a.a)(O,2),S=y[0],T=y[1];return r.a.createElement(r.a.Fragment,null,r.a.createElement(i.a,null,r.a.createElement(i.a.Field,null,r.a.createElement("label",null,"Type your job title and select the closest match"),r.a.createElement(l.a,{fluid:!0,input:{icon:"search",iconPosition:"left"},loading:u,onResultSelect:function(e,t){var n=t.result;b(""),T(n)},onSearchChange:s.a.debounce((function(t,n){var a=n.value;m(!0),b(a),setTimeout((function(){if(a.length<1)return m(!1),b(""),void j([]);m(!1),j(e.queryFn(a))}),300)}),500,{leading:!0}),results:g,resultRenderer:d,value:v}))),S.title&&r.a.createElement(o.a,{fluid:!0,description:S.description,header:S.title,meta:S.meta}))};m.defaultProps={},t.a=m},379:function(e,t,n){"use strict";n.r(t);var a=n(0),c=n.n(a),r=n(303),i=n.n(r),l=n(302);t.default=function(e){if(void 0===e.source)throw new Error('TextSearch requires a "source"');var t=e.source,n=function(e,t){return e.nocTitle.localeCompare(t.nocTitle)};return c.a.createElement(l.a,{key:"lunr",queryFn:function(e){var a=new RegExp(i.a.escapeRegExp(e),"i");return i.a.map(i.a.filter(t,(function(e){return a.test(e.nocTitle)||a.test(e.combinedExamples)})).sort(n),(function(e){return{title:e.nocTitle,description:e.combinedExamples,meta:"Code ".concat(e.nocCode," -- Level ").concat(e.nocLevel)}}))}})}}}]);
//# sourceMappingURL=6.2feb3b69.chunk.js.map