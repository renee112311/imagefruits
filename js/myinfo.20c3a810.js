(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["myinfo"],{"00d8":function(t,e){(function(){var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",r={rotl:function(t,e){return t<<e|t>>>32-e},rotr:function(t,e){return t<<32-e|t>>>e},endian:function(t){if(t.constructor==Number)return 16711935&r.rotl(t,8)|4278255360&r.rotl(t,24);for(var e=0;e<t.length;e++)t[e]=r.endian(t[e]);return t},randomBytes:function(t){for(var e=[];t>0;t--)e.push(Math.floor(256*Math.random()));return e},bytesToWords:function(t){for(var e=[],r=0,n=0;r<t.length;r++,n+=8)e[n>>>5]|=t[r]<<24-n%32;return e},wordsToBytes:function(t){for(var e=[],r=0;r<32*t.length;r+=8)e.push(t[r>>>5]>>>24-r%32&255);return e},bytesToHex:function(t){for(var e=[],r=0;r<t.length;r++)e.push((t[r]>>>4).toString(16)),e.push((15&t[r]).toString(16));return e.join("")},hexToBytes:function(t){for(var e=[],r=0;r<t.length;r+=2)e.push(parseInt(t.substr(r,2),16));return e},bytesToBase64:function(t){for(var r=[],n=0;n<t.length;n+=3)for(var i=t[n]<<16|t[n+1]<<8|t[n+2],o=0;o<4;o++)8*n+6*o<=8*t.length?r.push(e.charAt(i>>>6*(3-o)&63)):r.push("=");return r.join("")},base64ToBytes:function(t){t=t.replace(/[^A-Z0-9+\/]/gi,"");for(var r=[],n=0,i=0;n<t.length;i=++n%4)0!=i&&r.push((e.indexOf(t.charAt(n-1))&Math.pow(2,-2*i+8)-1)<<2*i|e.indexOf(t.charAt(n))>>>6-2*i);return r}};t.exports=r})()},"044b":function(t,e){function r(t){return!!t.constructor&&"function"===typeof t.constructor.isBuffer&&t.constructor.isBuffer(t)}function n(t){return"function"===typeof t.readFloatLE&&"function"===typeof t.slice&&r(t.slice(0,0))}
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
t.exports=function(t){return null!=t&&(r(t)||n(t)||!!t._isBuffer)}},"16ec":function(t,e,r){"use strict";r.r(e);var n=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",{attrs:{id:"myinfo"}},[r("b-container",[r("h3",[t._v("我的資料")]),r("b-row",[r("b-col",{attrs:{cols:"4"}},[r("span",{staticClass:"round"},[0!==t.avatar.length?r("img",{attrs:{src:t.avatar[0].src}}):t._e()]),r("b-form",{on:{submit:t.newAvatar}},[r("b-form-file",{attrs:{state:t.filestate,placeholder:"瀏覽檔案或是拖曳至此","drop-placeholder":"將檔案拖曳至此",required:"","browse-text":"瀏覽",accept:"image/*"},on:{input:t.validateFile},model:{value:t.file,callback:function(e){t.file=e},expression:"file"}}),r("p",[t._v("上限250KB")]),r("p",[t._v("PNG、JPEG、JPG、GIF、BMP")]),r("b-button",{attrs:{type:"newAvatar"}},[t._v("上傳頭像")])],1)],1),r("b-col",{staticClass:"pt-5",attrs:{cols:"8"}},[r("b-form",{on:{submit:t.submit}},[r("b-form-group",{attrs:{label:"密碼","label-for":"input-password",description:"為了保護您的帳戶安全，舊密碼不在此顯示","invalid-feedback":"格式不符",state:t.state("password")}},[r("b-form-input",{attrs:{id:"input-password",type:"password",state:t.state("password"),placeholder:"請輸入新密碼"},model:{value:t.password,callback:function(e){t.password=e},expression:"password"}})],1),r("b-form-group",{attrs:{label:"自我介紹","label-for":"input-info",description:"自我介紹最多150字","invalid-feedback":"格式不符",state:t.state("description")}},[r("b-form-textarea",{attrs:{type:"textarea",state:t.state("description"),placeholder:"介紹一下自己吧"},model:{value:t.description,callback:function(e){t.description=e},expression:"description"}})],1),r("b-button",{attrs:{type:"submit"}},[t._v("儲存修改")])],1)],1)],1)],1)],1)},i=[],o=(r("a4d3"),r("e01a"),r("caad"),r("d81d"),r("b0c0"),r("2532"),r("6821")),s=r.n(o),a={data:function(){return{account:"",password:"",description:"",id:"",file:null,filestate:null,model_account:"",model_password:"",model_description:"",avatar:[]}},methods:{state:function(t){if("description"===t)return!(void 0!==this.description&&this.description.length>150)},submit:function(t){var e=this;t.preventDefault(),void 0!==this.description&&this.description.length>150?this.$swal({title:"修改失敗",text:"自我介紹格式不符",icon:"error",confirmButtonText:"知道了"}):this.password.length>0?this.axios.patch("https://imagefruits.herokuapp.com/users/edit/"+this.id,{password:s()(this.password),description:this.description}).then((function(t){e.model_description=e.description,e.$swal({title:"修改成功",icon:"success",confirmButtonText:"知道了"})})).catch((function(t){e.$swal({title:"發生錯誤",text:t.response.data.message,icon:"error",confirmButtonText:"知道了"})})):this.axios.patch("https://imagefruits.herokuapp.com/users/edit/"+this.id,{description:this.description}).then((function(t){e.model_description=e.description,e.$swal({title:"修改成功",icon:"success",confirmButtonText:"知道了"})})).catch((function(t){e.$swal({title:"發生錯誤",text:t.response.data.message,icon:"error",confirmButtonText:"知道了"})}))},newAvatar:function(t){var e=this;if(t.preventDefault(),console.log(this.file),null===this.file||this.file.size>=25e4||!this.file.type.includes("image"))this.$swal({title:"發生錯誤",text:"檔案格式不符",icon:"error",confirmButtonText:"知道了"});else if(0!==this.avatar.length)this.axios.delete("https://imagefruits.herokuapp.com/avatar/"+this.avatar[0]._id).then((function(t){e.avatar=null;var r=new FormData;r.append("image",e.file),e.axios.post("https://imagefruits.herokuapp.com/avatar",r,{headers:{"Content-Type":"multipart/form-data"}}).then((function(t){e.$swal({title:"上傳成功",icon:"success",confirmButtonText:"知道了"}),location.reload()})).catch((function(t){e.filestate=!1,e.$swal({title:"發生錯誤",text:t.response.data.message,icon:"error",confirmButtonText:"知道了"})}))})).catch((function(){e.$swal({title:"發生錯誤",icon:"error",confirmButtonText:"知道了"})}));else{var r=new FormData;r.append("image",this.file),this.axios.post("https://imagefruits.herokuapp.com/avatar",r,{headers:{"Content-Type":"multipart/form-data"}}).then((function(t){e.$swal({title:"上傳成功",icon:"success",confirmButtonText:"知道了"}),location.reload()})).catch((function(t){e.filestate=!1,e.$swal({title:"發生錯誤",text:t.response.data.message,icon:"error",confirmButtonText:"知道了"})}))}},validateFile:function(){null!=this.file&&(this.file.size>=25e4||!this.file.type.includes("image")?(this.filestate=!1,this.file=null):this.filestate=!0)}},computed:{user:function(){return this.$store.getters.user}},mounted:function(){var t=this;this.axios.get("https://imagefruits.herokuapp.com/users/"+this.user).then((function(e){var r=e.data.result[0];t.description=r.description,t.id=r._id,t.model_description=r.description})).catch((function(e){console.log(e),t.$swal({title:"發生錯誤",icon:"error",confirmButtonText:"知道了"})})),this.axios.get("https://imagefruits.herokuapp.com/avatar/"+this.user).then((function(e){t.avatar=e.data.result.map((function(t){return{src:"https://imagefruits.herokuapp.com/avatar/image/"+t.name,_id:t._id}}))})).catch((function(e){console.log(e),t.$swal({title:"發生錯誤",icon:"error",confirmButtonText:"知道了"})})),setTimeout((function(){!0===t.banned&&(t.$swal({title:"您的帳號已被停權，請洽客服",icon:"error",confirmButtonText:"知道了"}),t.$router.push("/"))}),500)}},c=a,u=r("2877"),l=Object(u["a"])(c,n,i,!1,null,null,null);e["default"]=l.exports},2532:function(t,e,r){"use strict";var n=r("23e7"),i=r("5a34"),o=r("1d80"),s=r("ab13");n({target:"String",proto:!0,forced:!s("includes")},{includes:function(t){return!!~String(o(this)).indexOf(i(t),arguments.length>1?arguments[1]:void 0)}})},"5a34":function(t,e,r){var n=r("44e7");t.exports=function(t){if(n(t))throw TypeError("The method doesn't accept regular expressions");return t}},6821:function(t,e,r){(function(){var e=r("00d8"),n=r("9a63").utf8,i=r("044b"),o=r("9a63").bin,s=function(t,r){t.constructor==String?t=r&&"binary"===r.encoding?o.stringToBytes(t):n.stringToBytes(t):i(t)?t=Array.prototype.slice.call(t,0):Array.isArray(t)||(t=t.toString());for(var a=e.bytesToWords(t),c=8*t.length,u=1732584193,l=-271733879,f=-1732584194,p=271733878,d=0;d<a.length;d++)a[d]=16711935&(a[d]<<8|a[d]>>>24)|4278255360&(a[d]<<24|a[d]>>>8);a[c>>>5]|=128<<c%32,a[14+(c+64>>>9<<4)]=c;var h=s._ff,m=s._gg,g=s._hh,v=s._ii;for(d=0;d<a.length;d+=16){var b=u,x=l,w=f,y=p;u=h(u,l,f,p,a[d+0],7,-680876936),p=h(p,u,l,f,a[d+1],12,-389564586),f=h(f,p,u,l,a[d+2],17,606105819),l=h(l,f,p,u,a[d+3],22,-1044525330),u=h(u,l,f,p,a[d+4],7,-176418897),p=h(p,u,l,f,a[d+5],12,1200080426),f=h(f,p,u,l,a[d+6],17,-1473231341),l=h(l,f,p,u,a[d+7],22,-45705983),u=h(u,l,f,p,a[d+8],7,1770035416),p=h(p,u,l,f,a[d+9],12,-1958414417),f=h(f,p,u,l,a[d+10],17,-42063),l=h(l,f,p,u,a[d+11],22,-1990404162),u=h(u,l,f,p,a[d+12],7,1804603682),p=h(p,u,l,f,a[d+13],12,-40341101),f=h(f,p,u,l,a[d+14],17,-1502002290),l=h(l,f,p,u,a[d+15],22,1236535329),u=m(u,l,f,p,a[d+1],5,-165796510),p=m(p,u,l,f,a[d+6],9,-1069501632),f=m(f,p,u,l,a[d+11],14,643717713),l=m(l,f,p,u,a[d+0],20,-373897302),u=m(u,l,f,p,a[d+5],5,-701558691),p=m(p,u,l,f,a[d+10],9,38016083),f=m(f,p,u,l,a[d+15],14,-660478335),l=m(l,f,p,u,a[d+4],20,-405537848),u=m(u,l,f,p,a[d+9],5,568446438),p=m(p,u,l,f,a[d+14],9,-1019803690),f=m(f,p,u,l,a[d+3],14,-187363961),l=m(l,f,p,u,a[d+8],20,1163531501),u=m(u,l,f,p,a[d+13],5,-1444681467),p=m(p,u,l,f,a[d+2],9,-51403784),f=m(f,p,u,l,a[d+7],14,1735328473),l=m(l,f,p,u,a[d+12],20,-1926607734),u=g(u,l,f,p,a[d+5],4,-378558),p=g(p,u,l,f,a[d+8],11,-2022574463),f=g(f,p,u,l,a[d+11],16,1839030562),l=g(l,f,p,u,a[d+14],23,-35309556),u=g(u,l,f,p,a[d+1],4,-1530992060),p=g(p,u,l,f,a[d+4],11,1272893353),f=g(f,p,u,l,a[d+7],16,-155497632),l=g(l,f,p,u,a[d+10],23,-1094730640),u=g(u,l,f,p,a[d+13],4,681279174),p=g(p,u,l,f,a[d+0],11,-358537222),f=g(f,p,u,l,a[d+3],16,-722521979),l=g(l,f,p,u,a[d+6],23,76029189),u=g(u,l,f,p,a[d+9],4,-640364487),p=g(p,u,l,f,a[d+12],11,-421815835),f=g(f,p,u,l,a[d+15],16,530742520),l=g(l,f,p,u,a[d+2],23,-995338651),u=v(u,l,f,p,a[d+0],6,-198630844),p=v(p,u,l,f,a[d+7],10,1126891415),f=v(f,p,u,l,a[d+14],15,-1416354905),l=v(l,f,p,u,a[d+5],21,-57434055),u=v(u,l,f,p,a[d+12],6,1700485571),p=v(p,u,l,f,a[d+3],10,-1894986606),f=v(f,p,u,l,a[d+10],15,-1051523),l=v(l,f,p,u,a[d+1],21,-2054922799),u=v(u,l,f,p,a[d+8],6,1873313359),p=v(p,u,l,f,a[d+15],10,-30611744),f=v(f,p,u,l,a[d+6],15,-1560198380),l=v(l,f,p,u,a[d+13],21,1309151649),u=v(u,l,f,p,a[d+4],6,-145523070),p=v(p,u,l,f,a[d+11],10,-1120210379),f=v(f,p,u,l,a[d+2],15,718787259),l=v(l,f,p,u,a[d+9],21,-343485551),u=u+b>>>0,l=l+x>>>0,f=f+w>>>0,p=p+y>>>0}return e.endian([u,l,f,p])};s._ff=function(t,e,r,n,i,o,s){var a=t+(e&r|~e&n)+(i>>>0)+s;return(a<<o|a>>>32-o)+e},s._gg=function(t,e,r,n,i,o,s){var a=t+(e&n|r&~n)+(i>>>0)+s;return(a<<o|a>>>32-o)+e},s._hh=function(t,e,r,n,i,o,s){var a=t+(e^r^n)+(i>>>0)+s;return(a<<o|a>>>32-o)+e},s._ii=function(t,e,r,n,i,o,s){var a=t+(r^(e|~n))+(i>>>0)+s;return(a<<o|a>>>32-o)+e},s._blocksize=16,s._digestsize=16,t.exports=function(t,r){if(void 0===t||null===t)throw new Error("Illegal argument "+t);var n=e.wordsToBytes(s(t,r));return r&&r.asBytes?n:r&&r.asString?o.bytesToString(n):e.bytesToHex(n)}})()},"9a63":function(t,e){var r={utf8:{stringToBytes:function(t){return r.bin.stringToBytes(unescape(encodeURIComponent(t)))},bytesToString:function(t){return decodeURIComponent(escape(r.bin.bytesToString(t)))}},bin:{stringToBytes:function(t){for(var e=[],r=0;r<t.length;r++)e.push(255&t.charCodeAt(r));return e},bytesToString:function(t){for(var e=[],r=0;r<t.length;r++)e.push(String.fromCharCode(t[r]));return e.join("")}}};t.exports=r},ab13:function(t,e,r){var n=r("b622"),i=n("match");t.exports=function(t){var e=/./;try{"/./"[t](e)}catch(r){try{return e[i]=!1,"/./"[t](e)}catch(n){}}return!1}},caad:function(t,e,r){"use strict";var n=r("23e7"),i=r("4d64").includes,o=r("44d2"),s=r("ae40"),a=s("indexOf",{ACCESSORS:!0,1:0});n({target:"Array",proto:!0,forced:!a},{includes:function(t){return i(this,t,arguments.length>1?arguments[1]:void 0)}}),o("includes")}}]);
//# sourceMappingURL=myinfo.20c3a810.js.map