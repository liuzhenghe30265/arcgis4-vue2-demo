(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-9c633586"],{2943:function(t,e,i){"use strict";i("9722")},"4b1b":function(t,e,i){"use strict";i.r(e);var n=function(){var t=this,e=t.$createElement;t._self._c;return t._m(0)},a=[function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticStyle:{width:"100%",height:"100%"},attrs:{id:"map-container"}},[i("div",{staticClass:"esri-widget",staticStyle:{position:"fixed",width:"400px",left:"50px",top:"50px","z-index":"999"},attrs:{id:"feature-node"}})])}],r=(i("ac1f"),i("1276"),i("d81d"),i("4de4"),i("d3b7"),i("afaa")),s=i.n(r),o={name:"HighLight",data:function(){return{map:"",MapView:"",gisConstructor:{},gisModules:["esri/Map","esri/views/MapView","esri/layers/FeatureLayer","esri/widgets/Feature"]}},mounted:function(){this.init()},methods:{mapClickFun:function(){this.MapView.on("click",(function(t){console.log(t)}))},init:function(){s.a.loadCss("https://js.arcgis.com/4.16/esri/themes/light/main.css"),s.a.loadScript({url:"https://js.arcgis.com/4.16/init.js",dojoConfig:{async:!1}}),Object(r["loadModules"])(this.gisModules).then(this.initMap).then(this.mapClickFun)},initMap:function(t){for(var e in t){var i=this.gisModules[e].split("/").pop();this.gisConstructor[i]=t[e]}this.map=new this.gisConstructor.Map({basemap:"osm"}),this.MapView=new this.gisConstructor.MapView({container:"map-container",map:this.map,center:[-74,41.5],zoom:10});var n=new this.gisConstructor.FeatureLayer({portalItem:{id:"f430d25bf03744edbb1579e18c4bf6b8"},layerId:2,outFields:["*"]});this.map.add(n);var a=this;this.MapView.when((function(){var t={popupTemplate:{content:"Mouse over features to show details..."}},e=new a.gisConstructor.Feature({container:"feature-node",graphic:t,map:a.map,spatialReference:a.MapView.spatialReference});a.MapView.whenLayerView(n).then((function(i){var r;a.MapView.on("pointer-move",(function(s){a.MapView.hitTest(s).then((function(s){var o=s.results.filter((function(t){return t}));if(o.length>0){var c=o[0],p={title:"{NAME}",content:"<h1>{County}</h1><h1>{GEOID}</h1><h1>{State}</h1>"},u=c.graphic.attributes;if(c.graphic.attributes){var h=c.graphic.attributes;a.MapView.popup.open({title:h.NAME,content:"<h1>"+h.County+"</h1><h1>"+h.GEOID+"</h1><h1> "+h.State+"</h1>",location:s.results[0].mapPoint})}console.log(u),n.popupTemplate=p,r&&r.remove(),c?(e.graphic=c.graphic,r=i.highlight(c.graphic)):e.graphic=t}}))}))}))}))}}},c=o,p=(i("2943"),i("2877")),u=Object(p["a"])(c,n,a,!1,null,null,null);e["default"]=u.exports},"4de4":function(t,e,i){"use strict";var n=i("23e7"),a=i("b727").filter,r=i("1dde"),s=r("filter");n({target:"Array",proto:!0,forced:!s},{filter:function(t){return a(this,t,arguments.length>1?arguments[1]:void 0)}})},9722:function(t,e,i){},b041:function(t,e,i){"use strict";var n=i("00ee"),a=i("f5df");t.exports=n?{}.toString:function(){return"[object "+a(this)+"]"}},d3b7:function(t,e,i){var n=i("00ee"),a=i("6eeb"),r=i("b041");n||a(Object.prototype,"toString",r,{unsafe:!0})}}]);