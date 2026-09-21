// ==========================================
// Congcong Zhang Personal Website
// V2 Publication System
// ==========================================


// ------------------------------------------
// 1. Publication System
// ------------------------------------------

const publicationContainer = document.getElementById("publication-container");

let currentYear = "all";
let currentSearch = "";


// Escape HTML to keep the page safe
function escapeHTML(text) {
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// Highlight Congcong Zhang
function formatAuthors(authors) {

    let text = escapeHTML(authors);

    // Congcong Zhang*
    text = text.replace(
        /Congcong Zhang\*/g,
        "<strong>Congcong Zhang</strong>*"
    );

    // Congcong Zhang without *
    text = text.replace(
        /Congcong Zhang(?!\*)/g,
        "<strong>Congcong Zhang</strong>"
    );

    return text;
}


// Sort publications by year
function sortPublications(data) {

    return [...data].sort((a, b) => {

        const yearA = parseInt(a.year);
        const yearB = parseInt(b.year);

        return yearB - yearA;

    });
}


// Get all publication years
function getYears() {

    return [...new Set(
        publications.map(p => p.year)
    )].sort((a, b) => b - a);

}


// Create search and filter controls
function createPublicationControls() {

    if (!publicationContainer) return;

    const controls = document.createElement("div");

    controls.className = "publication-controls";

    const years = getYears();

    controls.innerHTML = `

        <div class="publication-filters">

            <button
                class="year-filter active"
                data-year="all">
                ALL
            </button>

            ${years.map(year => `
                <button
                    class="year-filter"
                    data-year="${year}">
                    ${year}
                </button>
            `).join("")}

        </div>


        <div class="publication-search">

            <input
                type="text"
                id="publication-search-input"
                placeholder="Search publications..."
                aria-label="Search publications">

        </div>

    `;

    publicationContainer.parentNode.insertBefore(
        controls,
        publicationContainer
    );


    // Year buttons
    document
        .querySelectorAll(".year-filter")
        .forEach(button => {

            button.addEventListener("click", function () {

                currentYear = this.dataset.year;

                document
                    .querySelectorAll(".year-filter")
                    .forEach(btn => {
                        btn.classList.remove("active");
                    });

                this.classList.add("active");

                renderPublications();

            });

        });


    // Search box
    const searchInput =
        document.getElementById(
            "publication-search-input"
        );

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                currentSearch =
                    this.value.toLowerCase().trim();

                renderPublications();

            }
        );

    }

}


// Create buttons for publication links
function createPublicationLinks(publication) {

    let links = "";

    if (publication.ads) {

        links += `
            <a
                href="${publication.ads}"
                target="_blank"
                rel="noopener noreferrer">
                ADS
            </a>
        `;

    }

    if (publication.doi) {

        links += `
            <a
                href="${publication.doi}"
                target="_blank"
                rel="noopener noreferrer">
                DOI
            </a>
        `;

    }

    if (publication.researchgate) {

        links += `
            <a
                href="${publication.researchgate}"
                target="_blank"
                rel="noopener noreferrer">
                ResearchGate
            </a>
        `;

    }

    if (publication.pdf) {

        links += `
            <a
                href="${publication.pdf}"
                target="_blank"
                rel="noopener noreferrer">
                PDF
            </a>
        `;

    }

    if (publication.bibtex) {

        links += `
            <a
                href="${publication.bibtex}"
                target="_blank"
                rel="noopener noreferrer">
                BibTeX
            </a>
        `;

    }

    if (!links) {
        return "";
    }

    return `
        <div class="publication-links">
            ${links}
        </div>
    `;

}


// Render publications
function renderPublications() {

    if (!publicationContainer) return;


    let filtered = sortPublications(publications);


    // Filter by year
    if (currentYear !== "all") {

        filtered = filtered.filter(
            publication =>
                publication.year === currentYear
        );

    }


    // Search
    if (currentSearch) {

        filtered = filtered.filter(publication => {

            const searchText = `

                ${publication.title}

                ${publication.authors}

                ${publication.journal}

                ${publication.year}

            `.toLowerCase();

            return searchText.includes(currentSearch);

        });

    }


    // No results
    if (filtered.length === 0) {

        publicationContainer.innerHTML = `
            <div class="no-publications">
                No publications found.
            </div>
        `;

        return;

    }


    // Render publications
    publicationContainer.innerHTML = filtered.map(
        publication => {

            return `

                <article class="publication-item">

                    <div class="publication-year">
                        ${escapeHTML(publication.year)}
                    </div>

                    <div class="publication-content">

                        <h3>
                            ${escapeHTML(publication.title)}
                        </h3>

                        <p class="publication-authors">
                            ${formatAuthors(publication.authors)}
                        </p>

                        <p class="publication-journal">

                            <em>
                                ${escapeHTML(publication.journal)}
                            </em>

                            ${publication.volume
                                ? `, ${escapeHTML(publication.volume)}`
                                : ""
                            }

                            ${publication.pages
                                ? `, ${escapeHTML(publication.pages)}`
                                : ""
                            }

                        </p>

                        ${createPublicationLinks(publication)}

                    </div>

                </article>

            `;

        }
    ).join("");

}


// Initialize publication system
if (publicationContainer) {

    createPublicationControls();

    renderPublications();

}



// ------------------------------------------
// 2. Language Switch
// ------------------------------------------

const languageBtn =
    document.getElementById("languageBtn");

let chinese = false;


if (languageBtn) {

    languageBtn.onclick = function () {

        if (!chinese) {

            languageBtn.innerHTML = "English";


            const introTitle =
                document.querySelector(".intro h2");

            const introText =
                document.querySelector(".intro p");


            if (introTitle) {
                introTitle.innerHTML = "天体物理学家";
            }

            if (introText) {
                introText.innerHTML =
                    "探索星际介质中碳质分子的起源与演化";
            }


            const about =
                document.querySelector("#about h2");

            const research =
                document.querySelector("#research h2");

            const publicationsTitle =
                document.querySelector("#publications h2");

            const projects =
                document.querySelector("#projects h2");

            const awards =
                document.querySelector("#awards h2");

            const contact =
                document.querySelector("#contact h2");


            if (about) {
                about.innerHTML = "个人简介";
            }

            if (research) {
                research.innerHTML = "研究方向";
            }

            if (publicationsTitle) {
                publicationsTitle.innerHTML = "论文发表";
            }

            if (projects) {
                projects.innerHTML = "科研项目";
            }

            if (awards) {
                awards.innerHTML = "荣誉奖励";
            }

            if (contact) {
                contact.innerHTML = "联系方式";
            }


            // Update search placeholder
            const searchInput =
                document.getElementById(
                    "publication-search-input"
                );

            if (searchInput) {
                searchInput.placeholder = "搜索论文...";
            }


            // Update ALL button
            const allButton =
                document.querySelector(
                    '.year-filter[data-year="all"]'
                );

            if (allButton) {
                allButton.innerHTML = "全部";
            }


            chinese = true;

        } else {

            location.reload();

        }

    };

}
