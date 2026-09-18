{\rtf1\ansi\ansicpg936\cocoartf2870
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 /* =====================================\
   Congcong Zhang Homepage Script\
===================================== */\
\
\
\
const languageBtn =\
document.getElementById(\
"languageBtn"\
);\
\
\
\
let chinese=false;\
\
\
\
languageBtn.onclick=function()\{\
\
\
if(!chinese)\{\
\
\
languageBtn.innerHTML="English";\
\
\
\
document.querySelector(\
".intro h2"\
).innerHTML=\
"\uc0\u22825 \u20307 \u29289 \u29702 \u23398 \u23478 ";\
\
\
\
document.querySelector(\
".intro p"\
).innerHTML=\
"\uc0\u25506 \u32034 \u26143 \u38469 \u20171 \u36136 \u20013 \u30899 \u36136 \u20998 \u23376 \u30340 \u36215 \u28304 \u19982 \u28436 \u21270 ";\
\
\
\
document.querySelector(\
"#about h2"\
).innerHTML=\
"\uc0\u20010 \u20154 \u31616 \u20171 ";\
\
\
\
document.querySelector(\
"#research h2"\
).innerHTML=\
"\uc0\u30740 \u31350 \u26041 \u21521 ";\
\
\
\
document.querySelector(\
"#publications h2"\
).innerHTML=\
"\uc0\u35770 \u25991 \u21457 \u34920 ";\
\
\
\
document.querySelector(\
"#projects h2"\
).innerHTML=\
"\uc0\u31185 \u30740 \u39033 \u30446 ";\
\
\
\
document.querySelector(\
"#awards h2"\
).innerHTML=\
"\uc0\u33635 \u35465 \u22870 \u21169 ";\
\
\
\
document.querySelector(\
"#contact h2"\
).innerHTML=\
"\uc0\u32852 \u31995 \u26041 \u24335 ";\
\
\
\
chinese=true;\
\
\
\
\}\
\
else\{\
\
\
languageBtn.innerHTML="\uc0\u20013 \u25991 ";\
\
\
location.reload();\
\
\
\
\}\
\
\
\
\};}