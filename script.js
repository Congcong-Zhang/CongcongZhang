/* =====================================
   Congcong Zhang Homepage Script
===================================== */



const languageBtn =
document.getElementById(
"languageBtn"
);



let chinese=false;



languageBtn.onclick=function(){


if(!chinese){


languageBtn.innerHTML="English";



document.querySelector(
".intro h2"
).innerHTML=
"天体物理学家";



document.querySelector(
".intro p"
).innerHTML=
"探索星际介质中碳质分子的起源与演化";



document.querySelector(
"#about h2"
).innerHTML=
"个人简介";



document.querySelector(
"#research h2"
).innerHTML=
"研究方向";



document.querySelector(
"#publications h2"
).innerHTML=
"论文发表";



document.querySelector(
"#projects h2"
).innerHTML=
"科研项目";



document.querySelector(
"#awards h2"
).innerHTML=
"荣誉奖励";



document.querySelector(
"#contact h2"
).innerHTML=
"联系方式";



chinese=true;



}

else{


languageBtn.innerHTML="中文";


location.reload();



}



};
