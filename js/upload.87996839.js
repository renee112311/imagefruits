(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["upload"],{2532:function(t,e,n){"use strict";var i=n("23e7"),a=n("5a34"),r=n("1d80"),s=n("ab13");i({target:"String",proto:!0,forced:!s("includes")},{includes:function(t){return!!~String(r(this)).indexOf(a(t),arguments.length>1?arguments[1]:void 0)}})},2679:function(t,e,n){"use strict";n.r(e);var i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"upload"}},[n("b-container",[n("h3",[t._v("上傳檔案")]),n("b-form",{on:{submit:t.submit}},[n("b-form-file",{attrs:{multiple:"",state:t.state,placeholder:"瀏覽檔案或是拖曳至此","drop-placeholder":"將檔案拖曳至此","browse-text":"瀏覽",accept:"image/*"},on:{input:t.validateFile},model:{value:t.files,callback:function(e){t.files=e},expression:"files"}}),n("p",[t._v("一張上限4MB")]),n("p",[t._v("本次最多能上傳5張")]),n("p",[t._v("PNG、JPEG、JPG、GIF、BMP")]),n("b-button",{attrs:{size:"lg",type:"submit"}},[t._v("上傳")]),n("br"),n("b-spinner",{style:t.spinnerstyle,attrs:{variant:"secondary"}})],1)],1)],1)},a=[],r=(n("caad"),n("b0c0"),n("2532"),n("b85c")),s={name:"upload",data:function(){return{files:[],state:!0,images:[],banned:!1,spinnerstyle:{display:"none"}}},computed:{user:function(){return this.$store.getters.user},imagesL:function(){var t=JSON.parse(localStorage.getItem("vuex"));return t.successUp}},methods:{validateFile:function(){var t,e=Object(r["a"])(this.files);try{for(e.s();!(t=e.n()).done;){var n=t.value;null!=n?n.size>=4e6||!n.type.includes("image")?(this.state=!1,n=null):this.state=!0:this.state=!1}}catch(i){e.e(i)}finally{e.f()}},submit:function(t){var e=this;if(t.preventDefault(),0===this.files.length)this.$swal({title:"沒有檔案",text:"請選擇單個或多個檔案",icon:"warning",confirmButtonText:"知道了"});else if(this.files.length>5)this.$swal({title:"檔案過多",text:"本次最多能上傳5張",icon:"warning",confirmButtonText:"知道了"});else{var n,i=Object(r["a"])(this.files);try{for(i.s();!(n=i.n()).done;){var a=n.value;if(null===a||a.size>=4e6||!a.type.includes("image"))return void this.$swal({title:"上傳失敗",text:"檔案格式不符",icon:"error",confirmButtonText:"知道了"})}}catch(u){i.e(u)}finally{i.f()}this.spinnerstyle.display="block";var s,o=new FormData,l=Object(r["a"])(this.files);try{for(l.s();!(s=l.n()).done;){var c=s.value;o.append("image",c),o.append("title","無題"),o.append("description","沒有任何圖片敘述"),o.append("album",null),o.append("privacy","公開")}}catch(u){l.e(u)}finally{l.f()}this.axios.post("https://imagefruits.herokuapp.com/file",o,{headers:{"Content-Type":"multipart/form-data"}}).then((function(t){for(var n=0;n<t.data.name.length;n++)e.images.push({src:"https://imagefruits.herokuapp.com/file/"+t.data.name[n].name,_id:t.data.name[n]._id});e.$store.commit("successUp",e.images),e.$router.push("/uploadSC")})).catch((function(t){e.$swal({title:"發生錯誤",text:t.response.data.message,icon:"error",confirmButtonText:"知道了"})}))}}},mounted:function(){var t=this;this.axios.get("https://imagefruits.herokuapp.com/users/"+this.user).then((function(e){var n=e.data.result[0];t.banned=n.banned})).catch((function(e){console.log(e),t.$swal({title:"發生錯誤",icon:"error",confirmButtonText:"知道了"})})),setTimeout((function(){!0===t.banned&&(t.$swal({title:"您的帳號已被停權，請洽客服",icon:"error",confirmButtonText:"知道了"}),t.$router.push("/"))}),100)}},o=s,l=n("2877"),c=Object(l["a"])(o,i,a,!1,null,null,null);e["default"]=c.exports},"5a34":function(t,e,n){var i=n("44e7");t.exports=function(t){if(i(t))throw TypeError("The method doesn't accept regular expressions");return t}},ab13:function(t,e,n){var i=n("b622"),a=i("match");t.exports=function(t){var e=/./;try{"/./"[t](e)}catch(n){try{return e[a]=!1,"/./"[t](e)}catch(i){}}return!1}},caad:function(t,e,n){"use strict";var i=n("23e7"),a=n("4d64").includes,r=n("44d2"),s=n("ae40"),o=s("indexOf",{ACCESSORS:!0,1:0});i({target:"Array",proto:!0,forced:!o},{includes:function(t){return a(this,t,arguments.length>1?arguments[1]:void 0)}}),r("includes")}}]);
//# sourceMappingURL=upload.87996839.js.map