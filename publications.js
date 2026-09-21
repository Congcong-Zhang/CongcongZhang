/* =====================================
   Congcong Zhang Publications Database
===================================== */


const publications = [


{
year:"2026",

title:
"The gas-phase nitridation processes of large, astronomically relevant polycyclic aromatic hydrocarbons cations in the interstellar medium",

journal:
"Astronomy & Astrophysics, 707, A211",

authors:
"Congcong Zhang et al.",

link:"#"

},



{
year:"2025",

title:
"A Study of Polycyclic Aromatic Hydrocarbon Emission in 30 Dor as seen by JWST",

journal:
"The Astrophysical Journal Supplement Series, 280, 4",

authors:
"Congcong Zhang, Joelene Hales, Els Peeters, Jan Cami et al.",

link:"#"

},



{
year:"2023",

title:
"Laboratory Hydrogenation of the Photo-fragments of PAH Cations: Co-evolution Interstellar Chemistry",

journal:
"Astronomy & Astrophysics, 669, A41",

authors:
"Congcong Zhang et al.",

link:"#"

},



{
year:"2022",

title:
"Gas-phase Hydrogen/Deuterium Exchange on Large, Astronomically Relevant Cationic PAHs",

journal:
"The Astrophysical Journal, 940, 73",

authors:
"Congcong Zhang et al.",

link:"#"

},



{
year:"2022",

title:
"Gas-phase Reaction of Fullerene Mono-cations with 2,3-Benzofluorene: Indicate the Importance of Charge Exchanges",

journal:
"Astronomy & Astrophysics, 662, A21",

authors:
"Congcong Zhang et al.",

link:"#"

},



{
year:"2025",

title:
"Gas-phase Formation of Large, Astronomically Relevant Polycyclic Aromatic Hydrocarbon Clusters",

journal:
"The Astrophysical Journal Supplement Series, 276, 26",

authors:
"Yanan Ge, Congcong Zhang et al.",

link:"#"

},



{
year:"2025",

title:
"Photochemical processing of CH4:O2 ices",

journal:
"Monthly Notices of the Royal Astronomical Society, 542, 2363",

authors:
"Yanan Ge, Congcong Zhang et al.",

link:"#"

}



];





/*
 Render Publications
*/


const pubContainer = 
document.getElementById(
"publication-container"
);



if(pubContainer){


publications.forEach(
(pub)=>{


const item =
document.createElement("div");


item.className="paper";



item.innerHTML=`

<h3>

${pub.title}

</h3>


<p>

<strong>
${pub.year}
</strong>

&nbsp; | &nbsp;

${pub.journal}

</p>


<p>

${pub.authors}

</p>


<a href="${pub.link}">
View Paper
</a>


`;



pubContainer.appendChild(item);



});


}
