(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-5917c11e"],{4737:function(e,t,r){},"4b1b":function(e,t,r){"use strict";r.r(t);var i=function(){var e=this;e._self._c;return e._m(0)},n=[function(){var e=this,t=e._self._c;return t("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"map-container"}},[t("div",{staticClass:"esri-widget",staticStyle:{position:"fixed",width:"400px",left:"50px",top:"50px","z-index":"999"},attrs:{id:"feature-node"}})])}],o=r("afaa"),a=r.n(o),s={name:"HighLight",data(){return{map:"",MapView:"",gisConstructor:{},gisModules:["esri/Map","esri/views/MapView","esri/layers/FeatureLayer","esri/widgets/Feature"]}},mounted(){this.init()},methods:{mapClickFun(){this.MapView.on("click",e=>{console.log(e)})},init(){a.a.loadCss("https://js.arcgis.com/4.16/esri/themes/light/main.css"),a.a.loadScript({url:"https://js.arcgis.com/4.16/init.js",dojoConfig:{async:!1}}),Object(o["loadModules"])(this.gisModules).then(this.initMap).then(this.mapClickFun)},initMap(e){for(let i in e){let t=this.gisModules[i].split("/").pop();this.gisConstructor[t]=e[i]}this.map=new this.gisConstructor.Map({basemap:"hybrid"}),this.MapView=new this.gisConstructor.MapView({container:"map-container",map:this.map,center:[-74,41.5],zoom:10});const t=new this.gisConstructor.FeatureLayer({portalItem:{id:"f430d25bf03744edbb1579e18c4bf6b8"},layerId:2,outFields:["*"]});this.map.add(t);let r=this;this.MapView.when(()=>{const e={popupTemplate:{content:"Mouse over features to show details..."}},i=new r.gisConstructor.Feature({container:"feature-node",graphic:e,map:r.map,spatialReference:r.MapView.spatialReference});r.MapView.whenLayerView(t).then((function(n){let o;r.MapView.on("pointer-move",(function(a){r.MapView.hitTest(a).then((function(a){const s=a.results.filter((function(e){return e}));if(s.length>0){const c=s[0],u={title:"{NAME}",content:"<h1>{County}</h1><h1>{GEOID}</h1><h1>{State}</h1>"},d=c.graphic.attributes;if(c.graphic.attributes){const e=c.graphic.attributes;r.MapView.popup.open({title:e.NAME,content:"<h1>"+e.County+"</h1><h1>"+e.GEOID+"</h1><h1> "+e.State+"</h1>",location:a.results[0].mapPoint})}console.log(d),t.popupTemplate=u,o&&o.remove(),c?(i.graphic=c.graphic,o=n.highlight(c.graphic)):i.graphic=e}}))}))}))})}}},c=s,u=(r("d16b"),r("2877")),d=Object(u["a"])(c,i,n,!1,null,null,null);t["default"]=d.exports},afaa:function(e,t,r){(function(e,r){r(t)})(0,(function(e){"use strict";var t="4.17",r="next";function i(e){if(e.toLowerCase()===r)return r;var t=e&&e.match(/^(\d)\.(\d+)/);return t&&{major:parseInt(t[1],10),minor:parseInt(t[2],10)}}function n(e){return void 0===e&&(e=t),"https://js.arcgis.com/"+e+"/"}function o(e){void 0===e&&(e=t);var o=n(e),a=i(e);if(a!==r&&3===a.major){var s=a.minor<=10?"js/":"";return""+o+s+"esri/css/esri.css"}return o+"esri/themes/light/main.css"}function a(e){var t=document.createElement("link");return t.rel="stylesheet",t.href=e,t}function s(e,t){if(t){var r=document.querySelector(t);r.parentNode.insertBefore(e,r)}else document.head.appendChild(e)}function c(e){return document.querySelector('link[href*="'+e+'"]')}function u(e){return!e||i(e)?o(e):e}function d(e,t){var r=u(e),i=c(r);return i||(i=a(r),s(i,t)),i}var l="undefined"!==typeof window,p={Promise:l?window["Promise"]:void 0},f={};function h(e){var t=document.createElement("script");return t.type="text/javascript",t.src=e,t.setAttribute("data-esri-loader","loading"),t}function m(e,t,r){var i;r&&(i=v(e,r));var n=function(){t(e),e.removeEventListener("load",n,!1),i&&e.removeEventListener("error",i,!1)};e.addEventListener("load",n,!1)}function v(e,t){var r=function(i){t(i.error||new Error("There was an error attempting to load "+e.src)),e.removeEventListener("error",r,!1)};return e.addEventListener("error",r,!1),r}function w(e){void 0===e&&(e={}),f=e}function g(){return document.querySelector("script[data-esri-loader]")}function b(){var e=window["require"];return e&&e.on}function M(e){void 0===e&&(e={});var t={};[f,e].forEach((function(e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])}));var r=t.version,i=t.url||n(r);return new p.Promise((function(e,n){var o=g();if(o){var a=o.getAttribute("src");a!==i?n(new Error("The ArcGIS API for JavaScript is already loaded ("+a+").")):b()?e(o):m(o,e,n)}else if(b())n(new Error("The ArcGIS API for JavaScript is already loaded."));else{var s=t.css;if(s){var c=!0===s;d(c?r:s,t.insertCssBefore)}t.dojoConfig&&(window["dojoConfig"]=t.dojoConfig),o=h(i),m(o,(function(){o.setAttribute("data-esri-loader","loaded"),e(o)}),n),document.body.appendChild(o)}}))}function y(e){return new p.Promise((function(t,r){var i=window["require"].on("error",r);window["require"](e,(function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];i.remove(),t(e)}))}))}function C(e,t){if(void 0===t&&(t={}),b())return y(e);var r=g(),i=r&&r.getAttribute("src");return!t.url&&i&&(t.url=i),M(t).then((function(){return y(e)}))}var j={getScript:g,isLoaded:b,loadModules:C,loadScript:M,loadCss:d,setDefaultOptions:w,utils:p};e.getScript=g,e.isLoaded=b,e.loadModules=C,e.loadScript=M,e.loadCss=d,e.setDefaultOptions=w,e.utils=p,e["default"]=j,Object.defineProperty(e,"__esModule",{value:!0})}))},d16b:function(e,t,r){"use strict";r("4737")}}]);