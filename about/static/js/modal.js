!function(e){"use strict";var s;e(document).ready(function(){var t;e.support.transition=void 0!==(t=(document.body||document.documentElement).style).transition||void 0!==t.WebkitTransition||void 0!==t.MozTransition||void 0!==t.MsTransition||void 0!==t.OTransition,e.support.transition&&(s="TransitionEnd",e.browser.webkit?s="webkitTransitionEnd":e.browser.mozilla?s="transitionend":e.browser.opera&&(s="oTransitionEnd"))});function n(t,i){return this.settings=e.extend({},e.fn.modal.defaults,i),this.$element=e(t).delegate(".close","click.modal",e.proxy(this.hide,this)),this.settings.show&&this.show(),this}function o(t){this.$element.hide().trigger("hidden"),a.call(this)}function a(t){var i,n=this.$element.hasClass("fade")?"fade":"";this.isShown&&this.settings.backdrop?(i=e.support.transition&&n,this.$backdrop=e('<div class="modal-backdrop '+n+'" />').appendTo(document.body),"static"!=this.settings.backdrop&&this.$backdrop.click(e.proxy(this.hide,this)),i&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),i?this.$backdrop.one(s,t):t()):!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),e.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(s,e.proxy(d,this)):d.call(this)):t&&t()}function d(){this.$backdrop.remove(),this.$backdrop=null}function h(){var i=this;this.isShown&&this.settings.keyboard?e(document).bind("keyup.modal",function(t){27==t.which&&i.hide()}):this.isShown||e(document).unbind("keyup.modal")}n.prototype={toggle:function(){return this[this.isShown?"hide":"show"]()},show:function(){var i=this;return this.isShown=!0,this.$element.trigger("show"),h.call(this),a.call(this,function(){var t=e.support.transition&&i.$element.hasClass("fade");i.$element.appendTo(document.body).show(),t&&i.$element[0].offsetWidth,i.$element.addClass("in"),t?i.$element.one(s,function(){i.$element.trigger("shown")}):i.$element.trigger("shown")}),this},hide:function(t){if(t&&t.preventDefault(),!this.isShown)return this;return this.isShown=!1,h.call(this),this.$element.trigger("hide").removeClass("in"),(e.support.transition&&this.$element.hasClass("fade")?function(){var t=this,i=setTimeout(function(){t.$element.unbind(s),o.call(t)},500);this.$element.one(s,function(){clearTimeout(i),o.call(t)})}:o).call(this),this}},e.fn.modal=function(t){var i=this.data("modal");return i?!0===t?i:("string"==typeof t?i[t]():i&&i.toggle(),this):("string"==typeof t&&(t={show:/show|toggle/.test(t)}),this.each(function(){e(this).data("modal",new n(this,t))}))},e.fn.modal.Modal=n,e.fn.modal.defaults={backdrop:!1,keyboard:!1,show:!1},e(document).ready(function(){e("body").delegate("[data-controls-modal]","click",function(t){t.preventDefault();t=e(this).data("show",!0);e("#"+t.attr("data-controls-modal")).modal(t.data())})})}(window.jQuery||window.ender);