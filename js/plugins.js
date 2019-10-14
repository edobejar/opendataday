/*!
Waypoints - 4.0.1
Copyright © 2011-2016 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
!function(){"use strict";function t(o){if(!o)throw new Error("No options passed to Waypoint constructor");if(!o.element)throw new Error("No element option passed to Waypoint constructor");if(!o.handler)throw new Error("No handler option passed to Waypoint constructor");this.key="waypoint-"+e,this.options=t.Adapter.extend({},t.defaults,o),this.element=this.options.element,this.adapter=new t.Adapter(this.element),this.callback=o.handler,this.axis=this.options.horizontal?"horizontal":"vertical",this.enabled=this.options.enabled,this.triggerPoint=null,this.group=t.Group.findOrCreate({name:this.options.group,axis:this.axis}),this.context=t.Context.findOrCreateByElement(this.options.context),t.offsetAliases[this.options.offset]&&(this.options.offset=t.offsetAliases[this.options.offset]),this.group.add(this),this.context.add(this),i[this.key]=this,e+=1}var e=0,i={};t.prototype.queueTrigger=function(t){this.group.queueTrigger(this,t)},t.prototype.trigger=function(t){this.enabled&&this.callback&&this.callback.apply(this,t)},t.prototype.destroy=function(){this.context.remove(this),this.group.remove(this),delete i[this.key]},t.prototype.disable=function(){return this.enabled=!1,this},t.prototype.enable=function(){return this.context.refresh(),this.enabled=!0,this},t.prototype.next=function(){return this.group.next(this)},t.prototype.previous=function(){return this.group.previous(this)},t.invokeAll=function(t){var e=[];for(var o in i)e.push(i[o]);for(var n=0,r=e.length;r>n;n++)e[n][t]()},t.destroyAll=function(){t.invokeAll("destroy")},t.disableAll=function(){t.invokeAll("disable")},t.enableAll=function(){t.Context.refreshAll();for(var e in i)i[e].enabled=!0;return this},t.refreshAll=function(){t.Context.refreshAll()},t.viewportHeight=function(){return window.innerHeight||document.documentElement.clientHeight},t.viewportWidth=function(){return document.documentElement.clientWidth},t.adapters=[],t.defaults={context:window,continuous:!0,enabled:!0,group:"default",horizontal:!1,offset:0},t.offsetAliases={"bottom-in-view":function(){return this.context.innerHeight()-this.adapter.outerHeight()},"right-in-view":function(){return this.context.innerWidth()-this.adapter.outerWidth()}},window.Waypoint=t}(),function(){"use strict";function t(t){window.setTimeout(t,1e3/60)}function e(t){this.element=t,this.Adapter=n.Adapter,this.adapter=new this.Adapter(t),this.key="waypoint-context-"+i,this.didScroll=!1,this.didResize=!1,this.oldScroll={x:this.adapter.scrollLeft(),y:this.adapter.scrollTop()},this.waypoints={vertical:{},horizontal:{}},t.waypointContextKey=this.key,o[t.waypointContextKey]=this,i+=1,n.windowContext||(n.windowContext=!0,n.windowContext=new e(window)),this.createThrottledScrollHandler(),this.createThrottledResizeHandler()}var i=0,o={},n=window.Waypoint,r=window.onload;e.prototype.add=function(t){var e=t.options.horizontal?"horizontal":"vertical";this.waypoints[e][t.key]=t,this.refresh()},e.prototype.checkEmpty=function(){var t=this.Adapter.isEmptyObject(this.waypoints.horizontal),e=this.Adapter.isEmptyObject(this.waypoints.vertical),i=this.element==this.element.window;t&&e&&!i&&(this.adapter.off(".waypoints"),delete o[this.key])},e.prototype.createThrottledResizeHandler=function(){function t(){e.handleResize(),e.didResize=!1}var e=this;this.adapter.on("resize.waypoints",function(){e.didResize||(e.didResize=!0,n.requestAnimationFrame(t))})},e.prototype.createThrottledScrollHandler=function(){function t(){e.handleScroll(),e.didScroll=!1}var e=this;this.adapter.on("scroll.waypoints",function(){(!e.didScroll||n.isTouch)&&(e.didScroll=!0,n.requestAnimationFrame(t))})},e.prototype.handleResize=function(){n.Context.refreshAll()},e.prototype.handleScroll=function(){var t={},e={horizontal:{newScroll:this.adapter.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.adapter.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};for(var i in e){var o=e[i],n=o.newScroll>o.oldScroll,r=n?o.forward:o.backward;for(var s in this.waypoints[i]){var a=this.waypoints[i][s];if(null!==a.triggerPoint){var l=o.oldScroll<a.triggerPoint,h=o.newScroll>=a.triggerPoint,p=l&&h,u=!l&&!h;(p||u)&&(a.queueTrigger(r),t[a.group.id]=a.group)}}}for(var c in t)t[c].flushTriggers();this.oldScroll={x:e.horizontal.newScroll,y:e.vertical.newScroll}},e.prototype.innerHeight=function(){return this.element==this.element.window?n.viewportHeight():this.adapter.innerHeight()},e.prototype.remove=function(t){delete this.waypoints[t.axis][t.key],this.checkEmpty()},e.prototype.innerWidth=function(){return this.element==this.element.window?n.viewportWidth():this.adapter.innerWidth()},e.prototype.destroy=function(){var t=[];for(var e in this.waypoints)for(var i in this.waypoints[e])t.push(this.waypoints[e][i]);for(var o=0,n=t.length;n>o;o++)t[o].destroy()},e.prototype.refresh=function(){var t,e=this.element==this.element.window,i=e?void 0:this.adapter.offset(),o={};this.handleScroll(),t={horizontal:{contextOffset:e?0:i.left,contextScroll:e?0:this.oldScroll.x,contextDimension:this.innerWidth(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:e?0:i.top,contextScroll:e?0:this.oldScroll.y,contextDimension:this.innerHeight(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}};for(var r in t){var s=t[r];for(var a in this.waypoints[r]){var l,h,p,u,c,d=this.waypoints[r][a],f=d.options.offset,w=d.triggerPoint,y=0,g=null==w;d.element!==d.element.window&&(y=d.adapter.offset()[s.offsetProp]),"function"==typeof f?f=f.apply(d):"string"==typeof f&&(f=parseFloat(f),d.options.offset.indexOf("%")>-1&&(f=Math.ceil(s.contextDimension*f/100))),l=s.contextScroll-s.contextOffset,d.triggerPoint=Math.floor(y+l-f),h=w<s.oldScroll,p=d.triggerPoint>=s.oldScroll,u=h&&p,c=!h&&!p,!g&&u?(d.queueTrigger(s.backward),o[d.group.id]=d.group):!g&&c?(d.queueTrigger(s.forward),o[d.group.id]=d.group):g&&s.oldScroll>=d.triggerPoint&&(d.queueTrigger(s.forward),o[d.group.id]=d.group)}}return n.requestAnimationFrame(function(){for(var t in o)o[t].flushTriggers()}),this},e.findOrCreateByElement=function(t){return e.findByElement(t)||new e(t)},e.refreshAll=function(){for(var t in o)o[t].refresh()},e.findByElement=function(t){return o[t.waypointContextKey]},window.onload=function(){r&&r(),e.refreshAll()},n.requestAnimationFrame=function(e){var i=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||t;i.call(window,e)},n.Context=e}(),function(){"use strict";function t(t,e){return t.triggerPoint-e.triggerPoint}function e(t,e){return e.triggerPoint-t.triggerPoint}function i(t){this.name=t.name,this.axis=t.axis,this.id=this.name+"-"+this.axis,this.waypoints=[],this.clearTriggerQueues(),o[this.axis][this.name]=this}var o={vertical:{},horizontal:{}},n=window.Waypoint;i.prototype.add=function(t){this.waypoints.push(t)},i.prototype.clearTriggerQueues=function(){this.triggerQueues={up:[],down:[],left:[],right:[]}},i.prototype.flushTriggers=function(){for(var i in this.triggerQueues){var o=this.triggerQueues[i],n="up"===i||"left"===i;o.sort(n?e:t);for(var r=0,s=o.length;s>r;r+=1){var a=o[r];(a.options.continuous||r===o.length-1)&&a.trigger([i])}}this.clearTriggerQueues()},i.prototype.next=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints),o=i===this.waypoints.length-1;return o?null:this.waypoints[i+1]},i.prototype.previous=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints);return i?this.waypoints[i-1]:null},i.prototype.queueTrigger=function(t,e){this.triggerQueues[e].push(t)},i.prototype.remove=function(t){var e=n.Adapter.inArray(t,this.waypoints);e>-1&&this.waypoints.splice(e,1)},i.prototype.first=function(){return this.waypoints[0]},i.prototype.last=function(){return this.waypoints[this.waypoints.length-1]},i.findOrCreate=function(t){return o[t.axis][t.name]||new i(t)},n.Group=i}(),function(){"use strict";function t(t){this.$element=e(t)}var e=window.jQuery,i=window.Waypoint;e.each(["innerHeight","innerWidth","off","offset","on","outerHeight","outerWidth","scrollLeft","scrollTop"],function(e,i){t.prototype[i]=function(){var t=Array.prototype.slice.call(arguments);return this.$element[i].apply(this.$element,t)}}),e.each(["extend","inArray","isEmptyObject"],function(i,o){t[o]=e[o]}),i.adapters.push({name:"jquery",Adapter:t}),i.Adapter=t}(),function(){"use strict";function t(t){return function(){var i=[],o=arguments[0];return t.isFunction(arguments[0])&&(o=t.extend({},arguments[1]),o.handler=arguments[0]),this.each(function(){var n=t.extend({},o,{element:this});"string"==typeof n.context&&(n.context=t(this).closest(n.context)[0]),i.push(new e(n))}),i}}var e=window.Waypoint;window.jQuery&&(window.jQuery.fn.waypoint=t(window.jQuery)),window.Zepto&&(window.Zepto.fn.waypoint=t(window.Zepto))}();
/*!
Waypoints Sticky Element Shortcut - 4.0.1
Copyright © 2011-2016 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blob/master/licenses.txt
*/
!function(){"use strict";function t(s){this.options=e.extend({},i.defaults,t.defaults,s),this.element=this.options.element,this.$element=e(this.element),this.createWrapper(),this.createWaypoint()}var e=window.jQuery,i=window.Waypoint;t.prototype.createWaypoint=function(){var t=this.options.handler;this.waypoint=new i(e.extend({},this.options,{element:this.wrapper,handler:e.proxy(function(e){var i=this.options.direction.indexOf(e)>-1,s=i?this.$element.outerHeight(!0):"";this.$wrapper.height(s),this.$element.toggleClass(this.options.stuckClass,i),t&&t.call(this,e)},this)}))},t.prototype.createWrapper=function(){this.options.wrapper&&this.$element.wrap(this.options.wrapper),this.$wrapper=this.$element.parent(),this.wrapper=this.$wrapper[0]},t.prototype.destroy=function(){this.$element.parent()[0]===this.wrapper&&(this.waypoint.destroy(),this.$element.removeClass(this.options.stuckClass),this.options.wrapper&&this.$element.unwrap())},t.defaults={wrapper:'<div class="sticky-wrapper" />',stuckClass:"stuck",direction:"down right"},i.Sticky=t}();
/*!
 * jQuery Smooth Scroll - v2.2.0 - 2017-05-05
 * https://github.com/kswedberg/jquery-smooth-scroll
 * Copyright (c) 2017 Karl Swedberg
 * Licensed MIT
 */


!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a("object"==typeof module&&module.exports?require("jquery"):jQuery)}(function(a){var b={},c={exclude:[],excludeWithin:[],offset:0,direction:"top",delegateSelector:null,scrollElement:null,scrollTarget:null,autoFocus:!1,beforeScroll:function(){},afterScroll:function(){},easing:"swing",speed:400,autoCoefficient:2,preventDefault:!0},d=function(b){var c=[],d=!1,e=b.dir&&"left"===b.dir?"scrollLeft":"scrollTop";return this.each(function(){var b=a(this);if(this!==document&&this!==window)return!document.scrollingElement||this!==document.documentElement&&this!==document.body?void(b[e]()>0?c.push(this):(b[e](1),d=b[e]()>0,d&&c.push(this),b[e](0))):(c.push(document.scrollingElement),!1)}),c.length||this.each(function(){this===document.documentElement&&"smooth"===a(this).css("scrollBehavior")&&(c=[this]),c.length||"BODY"!==this.nodeName||(c=[this])}),"first"===b.el&&c.length>1&&(c=[c[0]]),c},e=/^([\-\+]=)(\d+)/;a.fn.extend({scrollable:function(a){var b=d.call(this,{dir:a});return this.pushStack(b)},firstScrollable:function(a){var b=d.call(this,{el:"first",dir:a});return this.pushStack(b)},smoothScroll:function(b,c){if("options"===(b=b||{}))return c?this.each(function(){var b=a(this),d=a.extend(b.data("ssOpts")||{},c);a(this).data("ssOpts",d)}):this.first().data("ssOpts");var d=a.extend({},a.fn.smoothScroll.defaults,b),e=function(b){var c=function(a){return a.replace(/(:|\.|\/)/g,"\\$1")},e=this,f=a(this),g=a.extend({},d,f.data("ssOpts")||{}),h=d.exclude,i=g.excludeWithin,j=0,k=0,l=!0,m={},n=a.smoothScroll.filterPath(location.pathname),o=a.smoothScroll.filterPath(e.pathname),p=location.hostname===e.hostname||!e.hostname,q=g.scrollTarget||o===n,r=c(e.hash);if(r&&!a(r).length&&(l=!1),g.scrollTarget||p&&q&&r){for(;l&&j<h.length;)f.is(c(h[j++]))&&(l=!1);for(;l&&k<i.length;)f.closest(i[k++]).length&&(l=!1)}else l=!1;l&&(g.preventDefault&&b.preventDefault(),a.extend(m,g,{scrollTarget:g.scrollTarget||r,link:e}),a.smoothScroll(m))};return null!==b.delegateSelector?this.off("click.smoothscroll",b.delegateSelector).on("click.smoothscroll",b.delegateSelector,e):this.off("click.smoothscroll").on("click.smoothscroll",e),this}});var f=function(a){var b={relative:""},c="string"==typeof a&&e.exec(a);return"number"==typeof a?b.px=a:c&&(b.relative=c[1],b.px=parseFloat(c[2])||0),b},g=function(b){var c=a(b.scrollTarget);b.autoFocus&&c.length&&(c[0].focus(),c.is(document.activeElement)||(c.prop({tabIndex:-1}),c[0].focus())),b.afterScroll.call(b.link,b)};a.smoothScroll=function(c,d){if("options"===c&&"object"==typeof d)return a.extend(b,d);var e,h,i,j,k=f(c),l={},m=0,n="offset",o="scrollTop",p={},q={};k.px?e=a.extend({link:null},a.fn.smoothScroll.defaults,b):(e=a.extend({link:null},a.fn.smoothScroll.defaults,c||{},b),e.scrollElement&&(n="position","static"===e.scrollElement.css("position")&&e.scrollElement.css("position","relative")),d&&(k=f(d))),o="left"===e.direction?"scrollLeft":o,e.scrollElement?(h=e.scrollElement,k.px||/^(?:HTML|BODY)$/.test(h[0].nodeName)||(m=h[o]())):h=a("html, body").firstScrollable(e.direction),e.beforeScroll.call(h,e),l=k.px?k:{relative:"",px:a(e.scrollTarget)[n]()&&a(e.scrollTarget)[n]()[e.direction]||0},p[o]=l.relative+(l.px+m+e.offset),i=e.speed,"auto"===i&&(j=Math.abs(p[o]-h[o]()),i=j/e.autoCoefficient),q={duration:i,easing:e.easing,complete:function(){g(e)}},e.step&&(q.step=e.step),h.length?h.stop().animate(p,q):g(e)},a.smoothScroll.version="2.2.0",a.smoothScroll.filterPath=function(a){return a=a||"",a.replace(/^\//,"").replace(/(?:index|default).[a-zA-Z]{3,4}$/,"").replace(/\/$/,"")},a.fn.smoothScroll.defaults=c});
/*!
 * SlickNav Responsive Mobile Menu v1.0.8
 * (c) 2016 Josh Cope
 * licensed under MIT
 */
!function(e,n,t){function a(n,t){this.element=n,this.settings=e.extend({},i,t),this.settings.duplicate||t.hasOwnProperty("removeIds")||(this.settings.removeIds=!1),this._defaults=i,this._name=s,this.init()}var i={label:"MENU",duplicate:!0,duration:200,easingOpen:"swing",easingClose:"swing",closedSymbol:"&#9658;",openedSymbol:"&#9660;",prependTo:"body",appendTo:"",parentTag:"a",closeOnClick:!1,allowParentLinks:!1,nestedParentLinks:!0,showChildren:!1,removeIds:!0,removeClasses:!1,removeStyles:!1,brand:"",animations:"jquery",init:function(){},beforeOpen:function(){},beforeClose:function(){},afterOpen:function(){},afterClose:function(){}},s="slicknav",o="slicknav";a.prototype.init=function(){var t,a,i=this,s=e(this.element),l=this.settings;if(l.duplicate?i.mobileNav=s.clone():i.mobileNav=s,l.removeIds&&(i.mobileNav.removeAttr("id"),i.mobileNav.find("*").each(function(n,t){e(t).removeAttr("id")})),l.removeClasses&&(i.mobileNav.removeAttr("class"),i.mobileNav.find("*").each(function(n,t){e(t).removeAttr("class")})),l.removeStyles&&(i.mobileNav.removeAttr("style"),i.mobileNav.find("*").each(function(n,t){e(t).removeAttr("style")})),t=o+"_icon",""===l.label&&(t+=" "+o+"_no-text"),"a"==l.parentTag&&(l.parentTag='a href="#"'),i.mobileNav.attr("class",o+"_nav"),a=e('<div class="'+o+'_menu"></div>'),""!==l.brand){var r=e('<div class="'+o+'_brand">'+l.brand+"</div>");e(a).append(r)}i.btn=e(["<"+l.parentTag+' aria-haspopup="true" tabindex="0" class="'+o+"_btn "+o+'_collapsed">','<span class="'+o+'_menutxt">'+l.label+"</span>",'<span class="'+t+'">','<span class="'+o+'_icon-bar"></span>','<span class="'+o+'_icon-bar"></span>','<span class="'+o+'_icon-bar"></span>',"</span>","</"+l.parentTag+">"].join("")),e(a).append(i.btn),""!==l.appendTo?e(l.appendTo).append(a):e(l.prependTo).prepend(a),a.append(i.mobileNav);var d=i.mobileNav.find("li");e(d).each(function(){var n=e(this),t={};if(t.children=n.children("ul").attr("role","menu"),n.data("menu",t),t.children.length>0){var a=n.contents(),s=!1,r=[];e(a).each(function(){return e(this).is("ul")?!1:(r.push(this),void(e(this).is("a")&&(s=!0)))});var d=e("<"+l.parentTag+' role="menuitem" aria-haspopup="true" tabindex="-1" class="'+o+'_item"/>');if(l.allowParentLinks&&!l.nestedParentLinks&&s)e(r).wrapAll('<span class="'+o+"_parent-link "+o+'_row"/>').parent();else{var c=e(r).wrapAll(d).parent();c.addClass(o+"_row")}l.showChildren?n.addClass(o+"_open"):n.addClass(o+"_collapsed"),n.addClass(o+"_parent");var p=e('<span class="'+o+'_arrow">'+(l.showChildren?l.openedSymbol:l.closedSymbol)+"</span>");l.allowParentLinks&&!l.nestedParentLinks&&s&&(p=p.wrap(d).parent()),e(r).last().after(p)}else 0===n.children().length&&n.addClass(o+"_txtnode");n.children("a").attr("role","menuitem").click(function(n){l.closeOnClick&&!e(n.target).parent().closest("li").hasClass(o+"_parent")&&e(i.btn).click()}),l.closeOnClick&&l.allowParentLinks&&(n.children("a").children("a").click(function(n){e(i.btn).click()}),n.find("."+o+"_parent-link a:not(."+o+"_item)").click(function(n){e(i.btn).click()}))}),e(d).each(function(){var n=e(this).data("menu");l.showChildren||i._visibilityToggle(n.children,null,!1,null,!0)}),i._visibilityToggle(i.mobileNav,null,!1,"init",!0),i.mobileNav.attr("role","menu"),e(n).mousedown(function(){i._outlines(!1)}),e(n).keyup(function(){i._outlines(!0)}),e(i.btn).click(function(e){e.preventDefault(),i._menuToggle()}),i.mobileNav.on("click","."+o+"_item",function(n){n.preventDefault(),i._itemClick(e(this))}),e(i.btn).keydown(function(e){var n=e||event;13==n.keyCode&&(e.preventDefault(),i._menuToggle())}),i.mobileNav.on("keydown","."+o+"_item",function(n){var t=n||event;13==t.keyCode&&(n.preventDefault(),i._itemClick(e(n.target)))}),l.allowParentLinks&&l.nestedParentLinks&&e("."+o+"_item a").click(function(e){e.stopImmediatePropagation()})},a.prototype._menuToggle=function(e){var n=this,t=n.btn,a=n.mobileNav;t.hasClass(o+"_collapsed")?(t.removeClass(o+"_collapsed"),t.addClass(o+"_open")):(t.removeClass(o+"_open"),t.addClass(o+"_collapsed")),t.addClass(o+"_animating"),n._visibilityToggle(a,t.parent(),!0,t)},a.prototype._itemClick=function(e){var n=this,t=n.settings,a=e.data("menu");a||(a={},a.arrow=e.children("."+o+"_arrow"),a.ul=e.next("ul"),a.parent=e.parent(),a.parent.hasClass(o+"_parent-link")&&(a.parent=e.parent().parent(),a.ul=e.parent().next("ul")),e.data("menu",a)),a.parent.hasClass(o+"_collapsed")?(a.arrow.html(t.openedSymbol),a.parent.removeClass(o+"_collapsed"),a.parent.addClass(o+"_open"),a.parent.addClass(o+"_animating"),n._visibilityToggle(a.ul,a.parent,!0,e)):(a.arrow.html(t.closedSymbol),a.parent.addClass(o+"_collapsed"),a.parent.removeClass(o+"_open"),a.parent.addClass(o+"_animating"),n._visibilityToggle(a.ul,a.parent,!0,e))},a.prototype._visibilityToggle=function(n,t,a,i,s){function l(n,t){e(n).removeClass(o+"_animating"),e(t).removeClass(o+"_animating"),s||c.afterOpen(n)}function r(t,a){n.attr("aria-hidden","true"),p.attr("tabindex","-1"),d._setVisAttr(n,!0),n.hide(),e(t).removeClass(o+"_animating"),e(a).removeClass(o+"_animating"),s?"init"==t&&c.init():c.afterClose(t)}var d=this,c=d.settings,p=d._getActionItems(n),u=0;a&&(u=c.duration),n.hasClass(o+"_hidden")?(n.removeClass(o+"_hidden"),s||c.beforeOpen(i),"jquery"===c.animations?n.stop(!0,!0).slideDown(u,c.easingOpen,function(){l(i,t)}):"velocity"===c.animations&&n.velocity("finish").velocity("slideDown",{duration:c.duration,easing:c.easingOpen,complete:function(){l(i,t)}}),n.attr("aria-hidden","false"),p.attr("tabindex","0"),d._setVisAttr(n,!1)):(n.addClass(o+"_hidden"),s||c.beforeClose(i),"jquery"===c.animations?n.stop(!0,!0).slideUp(u,this.settings.easingClose,function(){r(i,t)}):"velocity"===c.animations&&n.velocity("finish").velocity("slideUp",{duration:c.duration,easing:c.easingClose,complete:function(){r(i,t)}}))},a.prototype._setVisAttr=function(n,t){var a=this,i=n.children("li").children("ul").not("."+o+"_hidden");t?i.each(function(){var n=e(this);n.attr("aria-hidden","true");var i=a._getActionItems(n);i.attr("tabindex","-1"),a._setVisAttr(n,t)}):i.each(function(){var n=e(this);n.attr("aria-hidden","false");var i=a._getActionItems(n);i.attr("tabindex","0"),a._setVisAttr(n,t)})},a.prototype._getActionItems=function(e){var n=e.data("menu");if(!n){n={};var t=e.children("li"),a=t.find("a");n.links=a.add(t.find("."+o+"_item")),e.data("menu",n)}return n.links},a.prototype._outlines=function(n){n?e("."+o+"_item, ."+o+"_btn").css("outline",""):e("."+o+"_item, ."+o+"_btn").css("outline","none")},a.prototype.toggle=function(){var e=this;e._menuToggle()},a.prototype.open=function(){var e=this;e.btn.hasClass(o+"_collapsed")&&e._menuToggle()},a.prototype.close=function(){var e=this;e.btn.hasClass(o+"_open")&&e._menuToggle()},e.fn[s]=function(n){var t=arguments;if(void 0===n||"object"==typeof n)return this.each(function(){e.data(this,"plugin_"+s)||e.data(this,"plugin_"+s,new a(this,n))});if("string"==typeof n&&"_"!==n[0]&&"init"!==n){var i;return this.each(function(){var o=e.data(this,"plugin_"+s);o instanceof a&&"function"==typeof o[n]&&(i=o[n].apply(o,Array.prototype.slice.call(t,1)))}),void 0!==i?i:this}}}(jQuery,document,window);
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n;n="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,n.supercluster=t()}}(function(){return function t(n,o,e){function i(s,u){if(!o[s]){if(!n[s]){var a="function"==typeof require&&require;if(!u&&a)return a(s,!0);if(r)return r(s,!0);var h=new Error("Cannot find module '"+s+"'");throw h.code="MODULE_NOT_FOUND",h}var p=o[s]={exports:{}};n[s][0].call(p.exports,function(t){var o=n[s][1][t];return i(o?o:t)},p,p.exports,t,n,o,e)}return o[s].exports}for(var r="function"==typeof require&&require,s=0;s<e.length;s++)i(e[s]);return i}({1:[function(t,n){"use strict";function o(t){return new e(t)}function e(t){this.options=c(Object.create(this.options),t),this.trees=new Array(this.options.maxZoom+1)}function i(t,n,o,e,i){return{x:t,y:n,zoom:1/0,id:e,properties:i,parentId:-1,numPoints:o}}function r(t,n){var o=t.geometry.coordinates;return{x:a(o[0]),y:h(o[1]),zoom:1/0,id:n,parentId:-1}}function s(t){return{type:"Feature",properties:u(t),geometry:{type:"Point",coordinates:[p(t.x),f(t.y)]}}}function u(t){var n=t.numPoints,o=n>=1e4?Math.round(n/1e3)+"k":n>=1e3?Math.round(n/100)/10+"k":n;return c(c({},t.properties),{cluster:!0,cluster_id:t.id,point_count:n,point_count_abbreviated:o})}function a(t){return t/360+.5}function h(t){var n=Math.sin(t*Math.PI/180),o=.5-.25*Math.log((1+n)/(1-n))/Math.PI;return 0>o?0:o>1?1:o}function p(t){return 360*(t-.5)}function f(t){var n=(180-360*t)*Math.PI/180;return 360*Math.atan(Math.exp(n))/Math.PI-90}function c(t,n){for(var o in n)t[o]=n[o];return t}function d(t){return t.x}function l(t){return t.y}var m=t("kdbush");n.exports=o,e.prototype={options:{minZoom:0,maxZoom:16,radius:40,extent:512,nodeSize:64,log:!1,reduce:null,initial:function(){return{}},map:function(t){return t}},load:function(t){var n=this.options.log;n&&console.time("total time");var o="prepare "+t.length+" points";n&&console.time(o),this.points=t;var e=t.map(r);n&&console.timeEnd(o);for(var i=this.options.maxZoom;i>=this.options.minZoom;i--){var s=+Date.now();this.trees[i+1]=m(e,d,l,this.options.nodeSize,Float32Array),e=this._cluster(e,i),n&&console.log("z%d: %d clusters in %dms",i,e.length,+Date.now()-s)}return this.trees[this.options.minZoom]=m(e,d,l,this.options.nodeSize,Float32Array),n&&console.timeEnd("total time"),this},getClusters:function(t,n){for(var o=this.trees[this._limitZoom(n)],e=o.range(a(t[0]),h(t[3]),a(t[2]),h(t[1])),i=[],r=0;r<e.length;r++){var u=o.points[e[r]];i.push(u.numPoints?s(u):this.points[u.id])}return i},getChildren:function(t,n){for(var o=this.trees[n+1].points[t],e=this.options.radius/(this.options.extent*Math.pow(2,n)),i=this.trees[n+1].within(o.x,o.y,e),r=[],u=0;u<i.length;u++){var a=this.trees[n+1].points[i[u]];a.parentId===t&&r.push(a.numPoints?s(a):this.points[a.id])}return r},getLeaves:function(t,n,o,e){o=o||10,e=e||0;var i=[];return this._appendLeaves(i,t,n,o,e,0),i},getTile:function(t,n,o){var e=this.trees[this._limitZoom(t)],i=Math.pow(2,t),r=this.options.extent,s=this.options.radius,u=s/r,a=(o-u)/i,h=(o+1+u)/i,p={features:[]};return this._addTileFeatures(e.range((n-u)/i,a,(n+1+u)/i,h),e.points,n,o,i,p),0===n&&this._addTileFeatures(e.range(1-u/i,a,1,h),e.points,i,o,i,p),n===i-1&&this._addTileFeatures(e.range(0,a,u/i,h),e.points,-1,o,i,p),p.features.length?p:null},getClusterExpansionZoom:function(t,n){for(;n<this.options.maxZoom;){var o=this.getChildren(t,n);if(n++,1!==o.length)break;t=o[0].properties.cluster_id}return n},_appendLeaves:function(t,n,o,e,i,r){for(var s=this.getChildren(n,o),u=0;u<s.length;u++){var a=s[u].properties;if(a.cluster?r+a.point_count<=i?r+=a.point_count:r=this._appendLeaves(t,a.cluster_id,o+1,e,i,r):i>r?r++:t.push(s[u]),t.length===e)break}return r},_addTileFeatures:function(t,n,o,e,i,r){for(var s=0;s<t.length;s++){var a=n[t[s]];r.features.push({type:1,geometry:[[Math.round(this.options.extent*(a.x*i-o)),Math.round(this.options.extent*(a.y*i-e))]],tags:a.numPoints?u(a):this.points[a.id].properties})}},_limitZoom:function(t){return Math.max(this.options.minZoom,Math.min(t,this.options.maxZoom+1))},_cluster:function(t,n){for(var o=[],e=this.options.radius/(this.options.extent*Math.pow(2,n)),r=0;r<t.length;r++){var s=t[r];if(!(s.zoom<=n)){s.zoom=n;var u=this.trees[n+1],a=u.within(s.x,s.y,e),h=s.numPoints||1,p=s.x*h,f=s.y*h,c=null;this.options.reduce&&(c=this.options.initial(),this._accumulate(c,s));for(var d=0;d<a.length;d++){var l=u.points[a[d]];if(n<l.zoom){var m=l.numPoints||1;l.zoom=n,p+=l.x*m,f+=l.y*m,h+=m,l.parentId=r,this.options.reduce&&this._accumulate(c,l)}}1===h?o.push(s):(s.parentId=r,o.push(i(p/h,f/h,h,r,c)))}}return o},_accumulate:function(t,n){var o=n.numPoints?n.properties:this.options.map(this.points[n.id].properties);this.options.reduce(t,o)}}},{kdbush:2}],2:[function(t,n){"use strict";function o(t,n,o,i,r){return new e(t,n,o,i,r)}function e(t,n,o,e,u){n=n||i,o=o||r,u=u||Array,this.nodeSize=e||64,this.points=t,this.ids=new u(t.length),this.coords=new u(2*t.length);for(var a=0;a<t.length;a++)this.ids[a]=a,this.coords[2*a]=n(t[a]),this.coords[2*a+1]=o(t[a]);s(this.ids,this.coords,this.nodeSize,0,this.ids.length-1,0)}function i(t){return t[0]}function r(t){return t[1]}var s=t("./sort"),u=t("./range"),a=t("./within");n.exports=o,e.prototype={range:function(t,n,o,e){return u(this.ids,this.coords,t,n,o,e,this.nodeSize)},within:function(t,n,o){return a(this.ids,this.coords,t,n,o,this.nodeSize)}}},{"./range":3,"./sort":4,"./within":5}],3:[function(t,n){"use strict";function o(t,n,o,e,i,r,s){for(var u,a,h=[0,t.length-1,0],p=[];h.length;){var f=h.pop(),c=h.pop(),d=h.pop();if(s>=c-d)for(var l=d;c>=l;l++)u=n[2*l],a=n[2*l+1],u>=o&&i>=u&&a>=e&&r>=a&&p.push(t[l]);else{var m=Math.floor((d+c)/2);u=n[2*m],a=n[2*m+1],u>=o&&i>=u&&a>=e&&r>=a&&p.push(t[m]);var v=(f+1)%2;(0===f?u>=o:a>=e)&&(h.push(d),h.push(m-1),h.push(v)),(0===f?i>=u:r>=a)&&(h.push(m+1),h.push(c),h.push(v))}}return p}n.exports=o},{}],4:[function(t,n){"use strict";function o(t,n,i,r,s,u){if(!(i>=s-r)){var a=Math.floor((r+s)/2);e(t,n,a,r,s,u%2),o(t,n,i,r,a-1,u+1),o(t,n,i,a+1,s,u+1)}}function e(t,n,o,r,s,u){for(;s>r;){if(s-r>600){var a=s-r+1,h=o-r+1,p=Math.log(a),f=.5*Math.exp(2*p/3),c=.5*Math.sqrt(p*f*(a-f)/a)*(0>h-a/2?-1:1),d=Math.max(r,Math.floor(o-h*f/a+c)),l=Math.min(s,Math.floor(o+(a-h)*f/a+c));e(t,n,o,d,l,u)}var m=n[2*o+u],v=r,g=s;for(i(t,n,r,o),n[2*s+u]>m&&i(t,n,r,s);g>v;){for(i(t,n,v,g),v++,g--;n[2*v+u]<m;)v++;for(;n[2*g+u]>m;)g--}n[2*r+u]===m?i(t,n,r,g):(g++,i(t,n,g,s)),o>=g&&(r=g+1),g>=o&&(s=g-1)}}function i(t,n,o,e){r(t,o,e),r(n,2*o,2*e),r(n,2*o+1,2*e+1)}function r(t,n,o){var e=t[n];t[n]=t[o],t[o]=e}n.exports=o},{}],5:[function(t,n){"use strict";function o(t,n,o,i,r,s){for(var u=[0,t.length-1,0],a=[],h=r*r;u.length;){var p=u.pop(),f=u.pop(),c=u.pop();if(s>=f-c)for(var d=c;f>=d;d++)e(n[2*d],n[2*d+1],o,i)<=h&&a.push(t[d]);else{var l=Math.floor((c+f)/2),m=n[2*l],v=n[2*l+1];e(m,v,o,i)<=h&&a.push(t[l]);var g=(p+1)%2;(0===p?m>=o-r:v>=i-r)&&(u.push(c),u.push(l-1),u.push(g)),(0===p?o+r>=m:i+r>=v)&&(u.push(l+1),u.push(f),u.push(g))}}return a}function e(t,n,o,e){var i=t-o,r=n-e;return i*i+r*r}n.exports=o},{}]},{},[1])(1)});