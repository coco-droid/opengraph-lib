URL = window.URL || window.webkitURL;
const ogfind={
ogdata:{},
oghtml:'',
ogUrl:'',
ogcustom:'',
/*urlify:function(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  var urj="";
   urj=text.match(urlRegex, function(url) {
   urj=url[0];
  })
   if (urj){
    console.log(urj);
    ogfind.ogUrl=urj[0];
    return urj;
   }
   else
   {  
    var parsed = psl.parse(text);
    console.log(parsed.tld); // 'com'
    console.log(parsed.sld); // 'google'
    console.log(parsed.domain); // 'google.com'
    console.log(parsed.subdomain);
    if (parsed.domain==undefined){
       console.log("aucun dommain");
       return null;
    }
    else
    {
      console.log("https://"+parsed.domain);
      ogfind.ogUrl="https://"+parsed.domain;
      return "https://"+parsed.domain;
    }
   }
},*/
urlify:function(text)
{
  var matches = Autolinker.parse(text, {
    urls: true,
    //email: true
} );           // 2
   // 'url'
    // 'google.com'
/*console.log( matches[ 1 ].getType() ); 
console.log( matches[ 0 ].getType() ); 
console.log( matches.length ); // 'email'
console.log( matches[ 1 ].getEmail() );
console.log( matches[ 0 ].getUrl() ); */
if (matches[0]==undefined){
  return null;
}
else{
return matches[0].getUrl();
}
},
loadStyle:function(url, callback){

    var link = document.createElement("link")
    link.rel="stylesheet";

    if (link.readyState){  //IE
        link.onreadystatechange = function(){
            if (link.readyState == "loaded" ||
                    link.readyState == "complete"){
                link.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        link.onload = function(){
            callback();
        };
    }

    link.href = url;
    document.getElementsByTagName("head")[0].appendChild(link);
},
posturl:function(url,url2,callback)
	{
       const xhr = new XMLHttpRequest();
    var urlEncoded = encodeURIComponent(url2); 
// listen for `load` event
xhr.onload = () => {

    // print JSON response
    if (xhr.status >= 200 && xhr.status < 300) {
        // parse JSON
        const response = JSON.parse(xhr.responseText);
        //return response;
        //console.log(response);
        callback(response);
    }
};

// create a JSON object
const json = {
    "url":urlEncoded,
};

// open request
xhr.open('POST', url);

// set `Content-Type` header
xhr.setRequestHeader('Content-Type', 'application/json');
// send rquest with JSON payload
xhr.send(JSON.stringify(json));
	},
domainOfUrl:function(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        return match[2];
    }
    else {
        return null;
    }
},

type_view:function()
{
  if(document.getElementById('urlview')==null)
     {
    console.log("aucun precedent");
      }
  else{
     document.getElementById('urlview').remove();
      }
},
auto:function(element1,ele2,style1,style2){
  if(element1)
  {
   
    var ele=document.querySelector(element1);
     ele.innerHTML='<div id="cmsg" class="ogconte"><input id="ogmsg" type="text" name="" ></div>';
    document.getElementById("ogmsg").onchange = function(){
      ogfind.type_view();
      var text=document.getElementById("ogmsg").value;
      var url=ogfind.urlify(text);
       if(url==null)
       {
          console.log("no url found");
       }
       else
       {
      var res=ogfind.posturl("https://bot.alwaysdata.net/url",url,function(re){
      var design=ogfind.viewed(re);
      if(design !=undefined){
      document.getElementById("ogmsg").insertAdjacentHTML('beforebegin',design);
       ogfind.ogdata=re;
      ogfind.oghtml=ogfind.msgbox(re);
      }
      else
      {
         console.log("no opengraph");
      }
    }); 
    }
     };  
  }
  else
  {
    console("nothing for first element");
  }
  if(ele2){
      let el_list=[...document.querySelectorAll(ele2)];
      console.log(el_list);
      let allmsg={};
      let j=0;
      let very="";
      for (var i=0;i<=el_list.length-1; i++) {
        console.log(i);
        if(el_list[i] !=undefined){
         very=el_list[i].innerText;
         let verify=ogfind.urlify(very);
          //if(i==1){console.log(very+"et"+verify);}
          if(verify!=null)
           { 
               allmsg[i]={
                                   link:true,
                                   conthtml:el_list[i].innerHTML,
                                   conttext:very,
                                   url:verify
                                 }
           }
            else
            {
               console.log("zero link..");
               allmsg[i]={
                                   link:false
                                }
            }
      }
      else{
        console.log("this is undefined"+i);
      }
      }
      function furl(){ 
       if(j<el_list.length){
      if(allmsg[j].link){
      var res2=ogfind.posturl("https://bot.alwaysdata.net/url",allmsg[j].url,function(re){
          console.log(re);
           var design=ogfind.msgbox(re);
       //console.log("pour"+j+"design"+design+"html"+allmsg[j].conthtml);
       el_list[j].innerHTML=design+allmsg[j].conthtml;
       j++;
       furl();
      });
      }
       else{
                  j++; 
                  furl();
              }
      }
      else{
          console.log("opengraph distribued");
      }
    }
    furl();
  }
  else{
    console.log("nothing for element2");
  }
},
viewed:function(json){
 
if(json.ogTitle){
if(json.ogType!= undefined && json.ogType=="video.other"){
//var vurl=json.ogVideo["url"];
//console.log(vurl);
if(json.ogDescription==undefined){
var desc="";
}
else
{
	var desc=ogfind.jsonSmart(json.ogDescription).substring(0,44);
}
//document.getElementById('cmsg').style.transition="0.5s";
return'<div id="urlview"><div id="og" ><div Id="ic" style=" "><img id="ogicon" src="'+ogfind.jsonSmart(json.ogImage).url+'"style="height:100%;" /></div><div style="text-align:left;border-top-left-radius:13px;border-bottom-left-radius:13px;"><span id="ogtitle">'+ogfind.jsonSmart(json.ogTitle)+'</span></br><span id="ogdescription">'+desc+'</span></br><span id="url">'+this.domainOfUrl(ogfind.jsonSmart(json.ogUrl))+'</span></div></div></div>';

}
else{
if(json.ogDescription==undefined){
var desc="";
}
else
{
	var desc=ogfind.jsonSmart(json.ogDescription).substring(0,44);
}
return'<div id="urlview"><div id="og" ><div Id="ic" style=""><img  id="ogicon" src="'+ogfind.jsonSmart(json.ogImage).url+'"style="height:100%;border-top-left-radius:13px;border-bottom-left-radius:13px;" /></div><div style="text-align:left;" id=""><span id="ogtitle">'+ogfind.jsonSmart(json.ogTitle)+'</span></br><span id="ogdescription">'+desc+'</span></br><span id="url">'+this.domainOfUrl(ogfind.jsonSmart(json.ogUrl))+'</span></div></div></div>';
}
}
},
msgbox:function (json){
if(json.ogTitle){
  var movie=json.ogType=="video.other"||json.ogVideo !=undefined;
if(json.ogType!= undefined && movie){
  bool=false;
}
else
{
  bool=true;
}
if(bool){
if(json.ogDescription==undefined){
var desc="";
}
else
{
	var desc=ogfind.jsonSmart(json.ogDescription.substring(0,44));
}
return '<div id="og"><div Id="ic" style=" float: left;"><img id="ogicon" src="'+ogfind.jsonSmart(json.ogImage).url+'"style="width: 90px;" /></div><div style="text-align:left;"><span id="ogtitle">'+ogfind.jsonSmart(json.ogTitle)+'</span></br><span id="ogdescription">'+desc+'</span></br><span id="url">'+ogfind.domainOfUrl(ogfind.jsonSmart(json.ogUrl))+'</span></div></div>';
}
else{
if(json.ogDescription==undefined){
var desc="";
}
else
{
	var desc=ogfind.jsonSmart(json.ogDescription.substring(0,44));
}
var v=ogfind.jsonSmart(json.ogVideo["url"]);
if (v=="") {
  ogfind.jsonSmart(json.twitterPlayer["url"]);
}
else
{
  v=v;
}
return '<div id="ogsend"><div class="ogif" onclick="ogfind.ogvideoload(\''+v+'\')"><img style="filter: blur(8px);-webkit-filter: blur(8px);width:100%;height:100%;"src="'+ogfind.jsonSmart(json.ogImage).url+'"/></div><div style="text-align:left;"><span id="ogtitle">'+ogfind.jsonSmart(json.ogTitle)+'" </span></div><span id="ogdescription">'+desc+'</span><span id="url">'+ogfind.domainOfUrl(ogfind.jsonSmart(json.ogUrl))+'</span></div>';
}
}
else
{

}
},
ogvideoload:function(embed)
{
  var ogfra=document.getElementById("ogcntiframe");
  var close="";
  var expand="";
  var dexpand="";
  var ogframe="";
  if(ogfra==null ||ogfra==undefined){
  var ogcntiframe=document.createElement("div");
   close=document.createElement("i");
   expand=document.createElement("i");
   dexpand=document.createElement("i");
   ogframe= document.createElement("iframe");
  ogframe.id="ogiframe";
  ogframe.width=0;
//700 230
  close.setAttribute("class","fa fa-close");
  close.setAttribute("onclick","ogfind.ogcloses()");
  close.id="ogclose";
  close.style.fontSize="24px";
  expand.setAttribute("class","fa fa-expand");
  dexpand.setAttribute("class","fa fa-window-minimize")
  dexpand.id="ogdexpand";
  expand.id="ogexpand";
  close.style.textAlign="left";
  close.style.color="#fff";
  ogframe.height=0;
  ogcntiframe.style.width="90%";
  ogcntiframe.id="ogcntiframe";
ogcntiframe.style.height="489px";
  ogcntiframe.style.position="fixed";
  ogcntiframe.style.zIndex="11100";
  ogframe.src=embed;
  ogcntiframe.appendChild(close);
  ogcntiframe.appendChild(expand);
  ogcntiframe.appendChild(dexpand);
  ogcntiframe.appendChild(ogframe);
  document.body.appendChild(ogcntiframe);
  ogframe.addEventListener("focus", event => {
    close.style.display="block";
    expand.style.display="block";
    
}, true); 
ogframe.addEventListener("blur", () => {
    expand.style.display="none";
    dexpand.style.display="none";
    close.style.display="none";
}, true);
document.getElementById("ogclose").onclick=function()
{
 document.getElementById("ogcntiframe").style.display="none";
   document.getElementById("ogiframe").src="";
}
}
else{
 ogfra.src=embed;
 ogfra.style.display="block";
 ogfra.addEventListener("focus", event => {
    close.style.display="block";
    expand.style.display="block";
    
}, true); 
ogfra.addEventListener("blur", () => {
    expand.style.display="none";
    dexpand.style.display="none";
    close.style.display="none";
}, true);
document.getElementById("ogclose").onclick=function()
{
  document.getElementById("ogcntiframe").style.display="none";
   document.getElementById("ogiframe").src="";
  console.log("active");
}
}
},
ogcloses:function(){
  document.getElementById("ogcntiframe").style.display="none";
   document.getElementById("ogiframe").src="";
},
ogInputVal:function(bol)
{   
    var value=ogfind.linkShort(ogfind.ogcustom.value,ogfind.ogUrl,"");
    var obj={
                      value:value,
                      ogdata:this.ogdata,
                      oghtml:this.oghtml
                   }
    ogfind.ogdata={};
    ogfind.oghtml="";
    return obj;
},
ogNewMsg:function(text,tag){
   let resto="";
   let urlk=ogfind.urlify(text);
       if(urlk==null)
       {
          console.log("no url found og");
          return text;
       }
       else
       {
        let short=text;
        resto ="<div id='ogwait'></div>";
        
        if(tag &&tag!="default")
        {
           short=ogfind.linkShort(text,urlk,tag);
        }
        else if(tag=="default")
        {
          short=ogfind.linkShort(text,urlk,"");
        }
        else
        {
           short=text;
        }
        var res=ogfind.posturl("https://bot.alwaysdata.net/url",urlk,function(re){
        console.log(urlk);
        
      var design=ogfind.msgbox(re);
      var ogwait=document.getElementById("ogwait");
      if(design !=undefined){
        document.querySelector("#waitext").insertAdjacentHTML('beforebegin',design);
        document.querySelector("#waitext").style.marginTop="9px";
       document.querySelector("#waitext").innerHTML=short;
       var lin=document.querySelector("#ogtemp");
       //link.style.color=window.getComputedStyle(link.parentElement,null).getPropertyValue("background");
        lin.style.background=window.getComputedStyle(lin.parentElement,null).getPropertyValue("color");
        lin.id="styleadded";
        ogwait.id="ogloaded";
        document.querySelector("#waitext").id="ogloaded";
      }
      else
      {
         console.log("no opengraph");
      }
    });
        return resto+"<div id='waitext'>"+text+"</div>";
    }
  
},
linkShort:function(text,url,tag)
{
   var text1="";
   var repl=url
   var lik=url;
   console.log(lik);
   if(Array.isArray(lik)){
    lik=lik[0];
    //repl=repl;
   }
    else{
      lik=lik;
      console.log(lik);
    }
   //lik=lik.replace("https://","");
   if (url){
   lik=ogfind.domainOfUrl(lik);
   console.log(lik);
   var parsed = psl.parse(lik);
   console.log(parsed.tld); // 'com'
   console.log(parsed.sld); // 'google'
   console.log(parsed.domain); // 'google.com'
   console.log(parsed.subdomain);
   var secure=parsed.sld;
   console.log("url secure"+secure);
   if(tag)
   {
      text1=text.replace(url,tag);
   }
   else
   {
     text1=text.replace(repl,"<a class='oglink' id='ogtemp' href='"+repl+"'>"+secure+"</a>");
     if (text1==text){
      repl=repl.replace("http://","");
      text1=text.replace(repl,"<a class='oglink' id='ogtemp' href='"+url+"'>"+secure+"</a>");
     }
   }
 }
 else{
   text1=text;
 }
 return text1;
},
jsonSmart:function(obj)
{
  if (obj){
     if(Array.isArray(obj))
     {
        return obj[0];
        console.log("array");
     }
     else
     {
       return obj;
     }
  }
  else
    {
      return'';
    }
},
ogCustom:function(cusin,cusdiv){
  if(cusin&&cusdiv){ 
  var cus=document.querySelector(cusin);
  ogfind.ogcustom=document.querySelector(cusin);
  var place=document.querySelector(cusdiv);
  cus.onchange = function(){
      ogfind.type_view();
      var text=cus.value;
      var url=ogfind.urlify(text);
       if(url==null)
       {
          console.log("no url found");
          ogfind.ogdata={};
          ogfind.oghtml="";
       }
       else
       {
         ogfind.ogUrl=url;
      var res=ogfind.posturl("https://bot.alwaysdata.net/url",url,function(re){
      var design=ogfind.viewed(re);
      if(design !=undefined){
      place.insertAdjacentHTML('beforebegin',design);
       ogfind.ogdata=re;
      ogfind.oghtml=ogfind.msgbox(re);
      }
      else
      {
         console.log("no opengraph");
      }
    }); 
    }
  }
  }
  else
  {
   console.log("no element in parameter");
  }
}
}
