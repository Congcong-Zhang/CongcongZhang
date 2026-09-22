document.addEventListener(
"DOMContentLoaded",
function(){


/* =================================
   Publication Dashboard
================================= */


const container =
document.getElementById(
"publication-container"
);



if(
container &&
typeof publications !== "undefined"
){


let currentFilter = "All";

let searchKeyword = "";



/* ================================
   Statistics
================================ */


function updateStatistics(){


const total =
publications.length;



const firstAuthor =
publications.filter(
p =>
p.type.includes(
"First Author"
)
).length;



const corresponding =
publications.filter(
p =>
p.type.includes(
"Corresponding Author"
)
).length;



const years =
publications.map(
p =>
Number(p.year)
);



const period =
Math.min(...years)
+
" - "
+
Math.max(...years);



const stats =
document.getElementById(
"publication-stats"
);



if(stats){


stats.innerHTML = `


<div class="stat-card">

<h3>
${total}
</h3>

<p>
Publications
</p>

</div>



<div class="stat-card">

<h3>
${firstAuthor}
</h3>

<p>
First Author
</p>

</div>



<div class="stat-card">

<h3>
${corresponding}
</h3>

<p>
Corresponding Author
</p>

</div>



<div class="stat-card">

<h3>
${period}
</h3>

<p>
Research Period
</p>

</div>


`;

}


}



updateStatistics();


/* ================================
   Highlight My Name
================================ */

function highlightMyName(authors){

    return authors.replace(
        /Congcong Zhang(\*)?/g,
        '<strong class="my-name">Congcong Zhang$1</strong>'
    );

}


/* ================================
   Render Publications
================================ */


function renderPublications(){


container.innerHTML="";



let filtered =
publications.filter(
p=>{


let typeMatch =
(
currentFilter==="All"
||
p.type.includes(
currentFilter
)
);



let searchable =
(
p.title
+
p.authors
+
p.journal
+
p.keywords.join(" ")
+
p.year
)
.toLowerCase();



let searchMatch =
searchable.includes(
searchKeyword.toLowerCase()
);



return (
typeMatch
&&
searchMatch
);


});




/*
按年份排序
*/

filtered.sort(
(a,b)=>
Number(b.year)
-
Number(a.year)
);



let currentYear="";



filtered.forEach(
p=>{


if(
p.year !== currentYear
){


currentYear =
p.year;



let yearTitle =
document.createElement(
"h3"
);


yearTitle.className =
"publication-year";


yearTitle.innerHTML =
p.year;



container.appendChild(
yearTitle
);


}




let card =
document.createElement(
"div"
);


card.className =
"publication-card";





let typeTags =
p.type.map(
type =>
`
<span class="type-tag">
${type}
</span>

`
)
.join("");





let keywords =
p.keywords.map(
keyword =>
`
<span class="keyword-tag">
${keyword}
</span>
`
)
.join("");





card.innerHTML = `


<h3>

${p.title}

</h3>



<p class="authors">

${highlightMyName(p.authors)}

</p>




<p class="journal">


<i>
${p.journal}
</i>

${p.volume},

${p.pages}


</p>





<div class="tags">

${typeTags}

</div>




<div class="keywords">

${keywords}

</div>





<div class="pub-buttons">


${
p.ads
?
`
<a 
href="${p.ads}"
target="_blank">

ADS

</a>
`
:
""
}



${
p.doi
?
`
<a 
href="${p.doi}"
target="_blank">

DOI

</a>

`
:
""
}





${
p.researchgate
?
`
<a
href="${p.researchgate}"
target="_blank">

ResearchGate

</a>

`
:
""
}





${
p.pdf
?
`
<a
href="${p.pdf}"
target="_blank">

PDF

</a>

`
:
""
}



</div>



`;



container.appendChild(
card
);



});


}




renderPublications();






/* ================================
   Search
================================ */


const search =
document.getElementById(
"publication-search"
);



if(search){


search.addEventListener(
"input",
function(){


searchKeyword =
this.value;



renderPublications();


}

);


}






/* ================================
   Filter
================================ */


const buttons =
document.querySelectorAll(
".filter-btn"
);



buttons.forEach(
button=>{


button.addEventListener(
"click",
function(){



currentFilter =
this.dataset.filter;



buttons.forEach(
b =>
b.classList.remove(
"active"
)
);



this.classList.add(
"active"
);



renderPublications();



});


});


}







/* =================================
   Language Button
================================= */


const languageBtn =
document.getElementById(
"languageBtn"
);



if(languageBtn){


languageBtn.onclick =
function(){


alert(
"Chinese / English version will be added in the next update."
);


};


}



});
