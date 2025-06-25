import{$a as he,Da as re,Ea as _e,Vb as ae,_a as ce,_b as ue,a as Z,b as ee,f as te,sc as se,tc as fe,va as ie,wa as ne,xa as oe,ya as me}from"./chunk-O72UO5PQ.js";import{Ab as T,Cb as g,Db as d,Eb as c,Ec as G,Fb as R,Gb as U,Gc as J,Ic as W,Jb as $,Lb as k,Mb as O,Nc as X,Pa as j,Pb as H,Pc as Y,Qb as L,Ra as s,Rb as N,Tc as E,U as y,Xb as Q,Z as C,_ as P,ab as S,d as V,da as B,ea as p,eb as F,fa as l,fb as m,ia as I,jc as K,mb as _,nb as a,nc as q,oa as x,ob as A,qb as D,rb as f,tc as b,wb as h,xa as M,xb as u,yb as z,zb as w}from"./chunk-TMRP3J4S.js";var pe,de=V(()=>{"use strict";E();te();b();fe();b();te();pe=class t{constructor(o,e){this.http=o;this.platformId=e}BaseUrl=se.api;httpOption(){let o=null;return Y(this.platformId)&&(o=localStorage.getItem("token")),{headers:new Z({Authorization:`Bearer ${o}`})}}addProduct(o){return this.http.post(`${this.BaseUrl}stocks/add`,o,this.httpOption())}updateProduct(o,e){return this.http.put(`${this.BaseUrl}stocks/update/${e}`,o,this.httpOption())}getAllProducts(){return this.http.get(`${this.BaseUrl}stocks/all`,this.httpOption())}getProductById(o){return this.http.get(`${this.BaseUrl}stocks/getProductById/${o}`,this.httpOption())}deleteProduct(o){return this.http.delete(`${this.BaseUrl}stocks/delete/${o}`,this.httpOption())}get_products_supplied_by_product(o){return this.http.get(`${this.BaseUrl}stocks/suppliers_by_product/${o}`,this.httpOption())}static \u0275fac=function(e){return new(e||t)(C(ee),C(M))};static \u0275prov=y({token:t,factory:t.\u0275fac,providedIn:"root"})}});function be(t,o){if(t&1){let e=g();h(0,"img",4),d("error",function(n){p(e);let r=c();return l(r.imageError(n))}),u()}if(t&2){let e=c();a("src",e.image,j)("alt",e.alt)}}function Ce(t,o){if(t&1&&z(0,"span",6),t&2){let e=c(2);f(e.icon),a("ngClass","p-chip-icon"),_("data-pc-section","icon")}}function Ie(t,o){if(t&1&&m(0,Ce,1,4,"span",5),t&2){let e=c();a("ngIf",e.icon)}}function xe(t,o){if(t&1&&(h(0,"div",7),L(1),u()),t&2){let e=c();_("data-pc-section","label"),s(),N(e.label)}}function we(t,o){if(t&1){let e=g();h(0,"span",11),d("click",function(n){p(e);let r=c(3);return l(r.close(n))})("keydown",function(n){p(e);let r=c(3);return l(r.onKeydown(n))}),u()}if(t&2){let e=c(3);f(e.removeIcon),a("ngClass","p-chip-remove-icon"),_("data-pc-section","removeicon")("aria-label",e.removeAriaLabel)}}function Te(t,o){if(t&1){let e=g();h(0,"TimesCircleIcon",12),d("click",function(n){p(e);let r=c(3);return l(r.close(n))})("keydown",function(n){p(e);let r=c(3);return l(r.onKeydown(n))}),u()}if(t&2){let e=c(3);f("p-chip-remove-icon"),_("data-pc-section","removeicon")("aria-label",e.removeAriaLabel)}}function $e(t,o){if(t&1&&(w(0),m(1,we,1,5,"span",9)(2,Te,1,4,"TimesCircleIcon",10),T()),t&2){let e=c(2);s(),a("ngIf",e.removeIcon),s(),a("ngIf",!e.removeIcon)}}function ke(t,o){}function Oe(t,o){t&1&&m(0,ke,0,0,"ng-template")}function Ee(t,o){if(t&1){let e=g();h(0,"span",13),d("click",function(n){p(e);let r=c(2);return l(r.close(n))})("keydown",function(n){p(e);let r=c(2);return l(r.onKeydown(n))}),m(1,Oe,1,0,null,14),u()}if(t&2){let e=c(2);_("data-pc-section","removeicon")("aria-label",e.removeAriaLabel),s(),a("ngTemplateOutlet",e.removeIconTemplate||e._removeIconTemplate)}}function Ve(t,o){if(t&1&&(w(0),m(1,$e,3,2,"ng-container",3)(2,Ee,2,3,"span",8),T()),t&2){let e=c();s(),a("ngIf",!e.removeIconTemplate&&!e._removeIconTemplate),s(),a("ngIf",e.removeIconTemplate||e._removeIconTemplate)}}var ve,ye,Pe,Be,le,at,Me=V(()=>{"use strict";E();E();b();b();me();he();ue();_e();ve=["removeicon"],ye=["*"];Pe=({dt:t})=>`
.p-chip {
    display: inline-flex;
    align-items: center;
    background: ${t("chip.background")};
    color: ${t("chip.color")};
    border-radius: ${t("chip.border.radius")};
    padding: ${t("chip.padding.y")} ${t("chip.padding.x")};
    gap: ${t("chip.gap")};
}

.p-chip-icon {
    color: ${t("chip.icon.color")};
    font-size: ${t("chip.icon.font.size")};
    width: ${t("chip.icon.size")};
    height: ${t("chip.icon.size")};
}

.p-chip-image {
    border-radius: 50%;
    width: ${t("chip.image.width")};
    height: ${t("chip.image.height")};
    margin-left: calc(-1 * ${t("chip.padding.y")});
}

.p-chip:has(.p-chip-remove-icon) {
    padding-inline-end: ${t("chip.padding.y")};
}

.p-chip:has(.p-chip-image) {
    padding-top: calc(${t("chip.padding.y")} / 2);
    padding-bottom: calc(${t("chip.padding.y")} / 2);
}

.p-chip-remove-icon {
    cursor: pointer;
    font-size: ${t("chip.remove.icon.font.size")};
    width: ${t("chip.remove.icon.size")};
    height: ${t("chip.remove.icon.size")};
    color: ${t("chip.remove.icon.color")};
    border-radius: 50%;
    transition: outline-color ${t("chip.transition.duration")}, box-shadow ${t("chip.transition.duration")};
    outline-color: transparent;
}

.p-chip-remove-icon:focus-visible {
    box-shadow: ${t("chip.remove.icon.focus.ring.shadow")};
    outline: ${t("chip.remove.icon.focus.ring.width")} ${t("chip.remove.icon.focus.ring.style")} ${t("chip.remove.icon.focus.ring.color")};
    outline-offset: ${t("chip.remove.icon.focus.ring.offset")};
}
`,Be={root:"p-chip p-component",image:"p-chip-image",icon:"p-chip-icon",label:"p-chip-label",removeIcon:"p-chip-remove-icon"},le=(()=>{class t extends re{name="chip";theme=Pe;classes=Be;static \u0275fac=(()=>{let e;return function(n){return(e||(e=I(t)))(n||t)}})();static \u0275prov=y({token:t,factory:t.\u0275fac})}return t})(),at=(()=>{class t extends ce{label;icon;image;alt;style;styleClass;removable=!1;removeIcon;onRemove=new x;onImageError=new x;visible=!0;get removeAriaLabel(){return this.config.getTranslation(oe.ARIA).removeLabel}get chipProps(){return this._chipProps}set chipProps(e){this._chipProps=e,e&&typeof e=="object"&&Object.entries(e).forEach(([i,n])=>this[`_${i}`]!==n&&(this[`_${i}`]=n))}_chipProps;_componentStyle=P(le);removeIconTemplate;templates;_removeIconTemplate;ngAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"removeicon":this._removeIconTemplate=e.template;break;default:this._removeIconTemplate=e.template;break}})}ngOnChanges(e){if(super.ngOnChanges(e),e.chipProps&&e.chipProps.currentValue){let{currentValue:i}=e.chipProps;i.label!==void 0&&(this.label=i.label),i.icon!==void 0&&(this.icon=i.icon),i.image!==void 0&&(this.image=i.image),i.alt!==void 0&&(this.alt=i.alt),i.style!==void 0&&(this.style=i.style),i.styleClass!==void 0&&(this.styleClass=i.styleClass),i.removable!==void 0&&(this.removable=i.removable),i.removeIcon!==void 0&&(this.removeIcon=i.removeIcon)}}containerClass(){let e="p-chip p-component";return this.styleClass&&(e+=` ${this.styleClass}`),e}close(e){this.visible=!1,this.onRemove.emit(e)}onKeydown(e){(e.key==="Enter"||e.key==="Backspace")&&this.close(e)}imageError(e){this.onImageError.emit(e)}static \u0275fac=(()=>{let e;return function(n){return(e||(e=I(t)))(n||t)}})();static \u0275cmp=S({type:t,selectors:[["p-chip"]],contentQueries:function(i,n,r){if(i&1&&($(r,ve,4),$(r,ie,4)),i&2){let v;k(v=O())&&(n.removeIconTemplate=v.first),k(v=O())&&(n.templates=v)}},hostVars:9,hostBindings:function(i,n){i&2&&(_("data-pc-name","chip")("aria-label",n.label)("data-pc-section","root"),D(n.style),f(n.containerClass()),A("display",!n.visible&&"none"))},inputs:{label:"label",icon:"icon",image:"image",alt:"alt",style:"style",styleClass:"styleClass",removable:[2,"removable","removable",q],removeIcon:"removeIcon",chipProps:"chipProps"},outputs:{onRemove:"onRemove",onImageError:"onImageError"},features:[Q([le]),F,B],ngContentSelectors:ye,decls:6,vars:4,consts:[["iconTemplate",""],["class","p-chip-image",3,"src","alt","error",4,"ngIf","ngIfElse"],["class","p-chip-label",4,"ngIf"],[4,"ngIf"],[1,"p-chip-image",3,"error","src","alt"],[3,"class","ngClass",4,"ngIf"],[3,"ngClass"],[1,"p-chip-label"],["tabindex","0","class","p-chip-remove-icon","role","button",3,"click","keydown",4,"ngIf"],["tabindex","0","role","button",3,"class","ngClass","click","keydown",4,"ngIf"],["tabindex","0","role","button",3,"class","click","keydown",4,"ngIf"],["tabindex","0","role","button",3,"click","keydown","ngClass"],["tabindex","0","role","button",3,"click","keydown"],["tabindex","0","role","button",1,"p-chip-remove-icon",3,"click","keydown"],[4,"ngTemplateOutlet"]],template:function(i,n){if(i&1&&(R(),U(0),m(1,be,1,2,"img",1)(2,Ie,1,1,"ng-template",null,0,K)(4,xe,2,2,"div",2)(5,Ve,3,2,"ng-container",3)),i&2){let r=H(3);s(),a("ngIf",n.image)("ngIfElse",r),s(3),a("ngIf",n.label),s(),a("ngIf",n.removable)}},dependencies:[X,G,J,W,ae,ne],encapsulation:2,changeDetection:0})}return t})()});export{at as a,Me as b,pe as c,de as d};
