(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["authoralbum"],{5277:function(t,i,e){"use strict";e.r(i);var s=function(){var t=this,i=t.$createElement,e=t._self._c||i;return e("div",{attrs:{id:"authoralbum"}},[e("b-container",[e("span",{staticStyle:{cursor:"pointer","margin-bottom":"1.5rem","font-size":"18px"},on:{click:t.toauthor}},[t._v("<<返回「作者頁面」")]),e("div",{attrs:{id:"albumCover"}},[e("img",{attrs:{src:t.images[0].src}}),e("h3",[t._v(t._s(this.title))]),e("p",[t._v(t._s(this.description))])]),e("div",[e("b-row",{directives:[{name:"masonry",rawName:"v-masonry"}],attrs:{"transition-duration":"0.3s","item-selector":".item"}},t._l(t.images,(function(i,s){return e("b-col",{directives:[{name:"masonry-tile",rawName:"v-masonry-tile"}],key:s,staticClass:"item",attrs:{col:"",cols:"12",lg:"3"}},[e("b-card",{directives:[{name:"b-modal",rawName:"v-b-modal.modal-img-public",modifiers:{"modal-img-public":!0}}],on:{click:function(i){return t.showModal(s)}}},[e("b-card-img",{attrs:{src:i.src}}),e("b-card-title",[t._v(t._s(i.title))])],1)],1)})),1)],1)]),0!==t.images.length&&t.showModalTF?e("b-modal",{attrs:{id:"modal-img-public",size:"xl","hide-footer":"","hide-header":""}},[e("b-btn",{attrs:{id:"goFront",variant:"light"},on:{click:function(i){return t.showModal(t.index-1)}}},[t._v("<<")]),e("b-btn",{attrs:{id:"goForw",variant:"light"},on:{click:function(i){return t.showModal(t.index+1)}}},[t._v(">>")]),e("div",{staticClass:"inner"},[e("b-row",[e("b-col",{attrs:{col:"",cols:"12",md:"9"}},[e("div",{staticClass:"cardimg"},[e("b-card-img",{attrs:{src:t.images[t.index].src}})],1),e("b-card-body")],1),e("b-col",{attrs:{col:"",cols:"12",md:"3"}},[e("b-card-title",[t._v(t._s(t.images[t.index].title))]),e("b-card-text",[t._v(t._s(t.images[t.index].description))]),t.images[t.index].liked?e("span",{staticClass:"heart",on:{click:t.unfavorite}},[e("font-awesome-icon",{attrs:{icon:["fas","heart"]}}),e("span",{staticClass:"position-absolute",staticStyle:{bottom:"-70%",left:"0","font-size":"18px"}},[t._v("點擊取消")])],1):e("span",{staticClass:"heart",on:{click:t.favorite}},[e("font-awesome-icon",{attrs:{icon:["far","heart"]}}),e("span",{staticClass:"position-absolute",staticStyle:{bottom:"-70%",left:"0","font-size":"18px"}},[t._v("點擊收藏")])],1),e("div",[e("span",{staticStyle:{color:"#777"}},[t._v("BY")]),e("div",{staticClass:"round",staticStyle:{"margin-bottom":"10px"}},[0!==t.avatar.length?e("img",{attrs:{src:t.avatar[0].src}}):t._e()]),e("a",{staticStyle:{color:"#777"}},[t._v(t._s(t.images[t.index].user))])]),e("div",[e("p",{staticStyle:{"padding-left":"10px"}},[t._v("分享至：")]),e("font-awesome-icon",{staticStyle:{margin:"0 10px 20px 10px","font-size":"30px"},attrs:{icon:["fab","facebook-square"]}}),e("font-awesome-icon",{staticStyle:{margin:"0 10px 20px 10px","font-size":"30px"},attrs:{icon:["fab","twitter-square"]}})],1)],1)],1)],1)],1):t._e()],1)},o=[],a=(e("a4d3"),e("e01a"),e("4de4"),e("7db0"),e("c975"),e("d81d"),e("a434"),e("b0c0"),e("b85c")),r={data:function(){return{title:"",description:"",images:[],index:"0",userid:"",myfavorites:[],albums:null,avatar:[{src:"000"}],showModalTF:!1}},methods:{showModal:function(t){this.showModalTF=!0,t<0?this.index=this.images.length-1:t===this.images.length?this.index=0:this.index=t},favorite:function(){var t=this;this.user?(this.myfavorites.push(this.images[this.index]._id),this.axios.patch("https://imagefruits.herokuapp.com/users/edit/"+this.userid,{account:this.user,favorite:this.myfavorites}).then((function(i){t.images[t.index].liked=!0,t.$swal({title:"收藏成功",icon:"success",confirmButtonText:"知道了"})})).catch((function(i){console.log(i),t.$swal({title:"收藏失敗",text:"發生錯誤",icon:"error",confirmButtonText:"知道了"})}))):this.$swal({title:"收藏失敗",text:"請先登入",icon:"warning",confirmButtonText:"知道了"})},unfavorite:function(){var t=this,i=this.myfavorites.indexOf(this.images[this.index]._id);this.myfavorites.splice(i,1),this.axios.patch("https://imagefruits.herokuapp.com/users/edit/"+this.userid,{account:this.user,favorite:this.myfavorites}).then((function(i){t.images[t.index].liked=!1})).catch((function(i){console.log(i),t.$swal({title:"取消失敗",text:"發生錯誤",icon:"error",confirmButtonText:"知道了"})}))},likedOrnot:function(){var t,i=this,e=Object(a["a"])(this.myfavorites);try{var s=function(){var e=t.value,s=-1;i.images.find((function(t,i){t._id===e&&(s=i)})),-1!==s&&void 0!==s&&(i.images[s].liked=!0)};for(e.s();!(t=e.n()).done;)s()}catch(o){e.e(o)}finally{e.f()}},toauthor:function(){this.$router.go(-1)}},computed:{user:function(){return this.$store.getters.user},author:function(){return this.$store.getters.author},album:function(){return this.$store.getters.album}},mounted:function(){var t=this;this.axios.get("https://imagefruits.herokuapp.com/avatar/"+this.author).then((function(i){t.avatar=i.data.result.map((function(t){return{src:"https://imagefruits.herokuapp.com/avatar/image/"+t.name}}))})).catch((function(i){console.log(i),t.$swal({title:"發生錯誤",icon:"error",confirmButtonText:"知道了"})})),this.axios.get("https://imagefruits.herokuapp.com/author/"+this.author).then((function(i){var e=i.data.result.filter((function(i){return i.album===t.album}));e=e.filter((function(t){return"公開"===t.privacy})),t.images=e.map((function(t){return{title:t.title,description:t.description,src:"https://imagefruits.herokuapp.com/file/"+t.name,_id:t._id,user:t.user,liked:!1}}))})).catch((function(i){console.log(i),t.$swal({title:"發生錯誤",icon:"error",confirmButtonText:"知道了"})})),this.axios.get("https://imagefruits.herokuapp.com/albums/"+this.author).then((function(i){var e=i.data.result.filter((function(i){return i.title===t.album}));t.albums=e.map((function(t){return{title:t.title,description:t.description,_id:t._id}})),e=e[0],t.title=e.title,t.description=e.description,t.id=e._id})).catch((function(i){console.log(i),t.$swal({title:"發生錯誤",icon:"error",confirmButtonText:"知道了"})})),void 0!==this.user&&0!==this.user.length&&this.axios.get("https://imagefruits.herokuapp.com/users/"+this.user).then((function(i){var e=i.data.result[0];void 0===e||(t.userid=e._id,t.myfavorites=e.favorite)})).catch((function(i){console.log(i),t.$swal({title:"發生錯誤",icon:"error",confirmButtonText:"知道了"})})),setTimeout((function(){t.likedOrnot()}),100)},beforeRouteLeave:function(t,i,e){this.showModalTF=!1,e()}},n=r,c=e("2877"),l=Object(c["a"])(n,s,o,!1,null,null,null);i["default"]=l.exports}}]);
//# sourceMappingURL=authoralbum.4732b584.js.map