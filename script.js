document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
       Publication Dashboard
    ========================================================= */

    const container = document.getElementById("publication-container");

    if (container && typeof publications !== "undefined") {

        let currentFilter = "All";
        let searchKeyword = "";


        /* =====================================================
           Highlight My Name
        ===================================================== */

        function highlightMyName(authors) {

            return authors.replace(
                /Congcong Zhang(\*)?/g,
                '<strong class="my-name">Congcong Zhang$1</strong>'
            );

        }


        /* =====================================================
           Statistics
        ===================================================== */

        function updateStatistics() {

            const total = publications.length;

            const firstAuthor = publications.filter(
                p => Array.isArray(p.type) &&
                     p.type.includes("First Author")
            ).length;

            const corresponding = publications.filter(
                p => Array.isArray(p.type) &&
                     p.type.includes("Corresponding Author")
            ).length;

            const years = publications
                .map(p => Number(p.year))
                .filter(year => !Number.isNaN(year));

            const period = years.length
                ? `${Math.min(...years)} - ${Math.max(...years)}`
                : "—";

            const stats = document.getElementById("publication-stats");

            if (!stats) return;

            stats.innerHTML = `

                <div class="stat-card">
                    <h3>${total}</h3>
                    <p>Publications</p>
                </div>

                <div class="stat-card">
                    <h3>${firstAuthor}</h3>
                    <p>First Author</p>
                </div>

                <div class="stat-card">
                    <h3>${corresponding}</h3>
                    <p>Corresponding Author</p>
                </div>

                <div class="stat-card">
                    <h3>${period}</h3>
                    <p>Research Period</p>
                </div>

            `;

        }


        updateStatistics();


        /* =====================================================
           Generate BibTeX
        ===================================================== */

        function generateBibTeX(pub) {

            /*
             * 如果以后你在 publications.js 中手动填写了
             * bibtex:"..."
             * 就优先使用你提供的正式 BibTeX。
             */

            if (pub.bibtex && pub.bibtex.trim() !== "") {
                return pub.bibtex;
            }


            /*
             * 如果没有手动 BibTeX，
             * 就根据现有论文信息自动生成一个。
             */

            const firstAuthor = pub.authors
                .split(",")[0]
                .replace("*", "")
                .trim();

            const authorParts = firstAuthor.split(" ");

            const lastName =
                authorParts.length > 1
                    ? authorParts[authorParts.length - 1]
                    : firstAuthor;

            const cleanTitle = pub.title
                .replace(/[{}]/g, "");

            const citationKey =
                `${lastName}${pub.year}`;

            let bibtex = `@article{${citationKey},
  author = {${pub.authors.replace(/\*/g, "")}},
  title = {${cleanTitle}},
  journal = {${pub.journal}},
  year = {${pub.year}},
  volume = {${pub.volume}},
  pages = {${pub.pages}}`;

            if (pub.doi) {

                const doiValue = pub.doi.replace(
                    "https://doi.org/",
                    ""
                );

                bibtex += `,
  doi = {${doiValue}}`;

            }

            bibtex += `
}`;

            return bibtex;

        }


        /* =====================================================
           ADS URL
        ===================================================== */

        function getAdsURL(pub) {

            /*
             * 如果 publications.js 以后填写了 ads，
             * 优先使用 ads。
             */

            if (pub.ads && pub.ads.trim() !== "") {
                return pub.ads;
            }


            /*
             * 当前绝大多数论文已经有 bibcode，
             * 所以自动根据 bibcode 创建 ADS URL。
             */

            if (pub.bibcode && pub.bibcode.trim() !== "") {

                return (
                    "https://ui.adsabs.harvard.edu/abs/" +
                    encodeURIComponent(pub.bibcode) +
                    "/abstract"
                );

            }

            return "";

        }


        /* =====================================================
           Publication Buttons
        ===================================================== */

        function createPublicationButtons(pub, index) {

            let buttons = "";

            const adsURL = getAdsURL(pub);


            if (adsURL) {

                buttons += `
                    <a
                        href="${adsURL}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="pub-button"
                    >
                        ADS
                    </a>
                `;

            }


            if (pub.doi) {

                buttons += `
                    <a
                        href="${pub.doi}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="pub-button"
                    >
                        DOI
                    </a>
                `;

            }


            if (pub.researchgate) {

                buttons += `
                    <a
                        href="${pub.researchgate}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="pub-button"
                    >
                        ResearchGate
                    </a>
                `;

            }


            if (pub.pdf) {

                buttons += `
                    <a
                        href="${pub.pdf}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="pub-button"
                    >
                        PDF
                    </a>
                `;

            }


            buttons += `
                <button
                    type="button"
                    class="pub-button bibtex-button"
                    data-publication-index="${index}"
                >
                    BibTeX
                </button>
            `;


            return buttons;

        }


        /* =====================================================
           Render Publications
        ===================================================== */

        function renderPublications() {

            container.innerHTML = "";


            const normalizedSearch =
                searchKeyword.trim().toLowerCase();


            let filtered = publications.filter(pub => {

                const types =
                    Array.isArray(pub.type)
                        ? pub.type
                        : [];

                const keywords =
                    Array.isArray(pub.keywords)
                        ? pub.keywords
                        : [];


                const typeMatch =
                    currentFilter === "All" ||
                    types.includes(currentFilter);


                const searchableText = [

                    pub.year,
                    pub.title,
                    pub.authors,
                    pub.journal,
                    pub.volume,
                    pub.pages,
                    ...types,
                    ...keywords

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                const searchMatch =
                    normalizedSearch === "" ||
                    searchableText.includes(normalizedSearch);


                return typeMatch && searchMatch;

            });


            /*
             * 按年份从新到旧排序。
             *
             * 同一年内保留 publications.js 中原来的论文顺序。
             */

            filtered = filtered
                .map(pub => ({
                    pub,
                    originalIndex: publications.indexOf(pub)
                }))
                .sort((a, b) => {

                    const yearDifference =
                        Number(b.pub.year) - Number(a.pub.year);

                    if (yearDifference !== 0) {
                        return yearDifference;
                    }

                    return a.originalIndex - b.originalIndex;

                });


            /*
             * 没有结果
             */

            if (filtered.length === 0) {

                container.innerHTML = `

                    <div class="publication-empty">

                        <h3>No publications found</h3>

                        <p>
                            Try another keyword or publication filter.
                        </p>

                    </div>

                `;

                return;

            }


            let currentYear = "";


            filtered.forEach(item => {

                const pub = item.pub;
                const originalIndex = item.originalIndex;


                /*
                 * Year heading
                 */

                if (pub.year !== currentYear) {

                    currentYear = pub.year;

                    const yearTitle =
                        document.createElement("h3");

                    yearTitle.className =
                        "publication-year";

                    yearTitle.textContent =
                        pub.year;

                    container.appendChild(
                        yearTitle
                    );

                }


                /*
                 * Publication card
                 */

                const card =
                    document.createElement("article");

                card.className =
                    "publication-card";


                const typeTags =
                    (pub.type || [])
                        .map(type => `

                            <span class="type-tag">
                                ${type}
                            </span>

                        `)
                        .join("");


                const keywordTags =
                    (pub.keywords || [])
                        .map(keyword => `

                            <button
                                type="button"
                                class="keyword-tag"
                                data-keyword="${keyword}"
                                title="Show publications related to ${keyword}"
                            >
                                ${keyword}
                            </button>

                        `)
                        .join("");


                card.innerHTML = `

                    <h3 class="publication-title">
                        ${pub.title}
                    </h3>


                    <p class="authors">
                        ${highlightMyName(pub.authors)}
                    </p>


                    <p class="journal">

                        <em>
                            ${pub.journal}
                        </em>,

                        ${pub.volume},

                        ${pub.pages}

                    </p>


                    <div class="tags">
                        ${typeTags}
                    </div>


                    <div class="keywords">
                        ${keywordTags}
                    </div>


                    <div class="pub-buttons">

                        ${createPublicationButtons(
                            pub,
                            originalIndex
                        )}

                    </div>

                `;


                container.appendChild(card);

            });


            attachDynamicEvents();

        }


        /* =====================================================
           Dynamic Buttons
        ===================================================== */

        function attachDynamicEvents() {


            /*
             * BibTeX buttons
             */

            const bibtexButtons =
                container.querySelectorAll(
                    ".bibtex-button"
                );


            bibtexButtons.forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                this.dataset.publicationIndex
                            );

                        const pub =
                            publications[index];

                        const bibtex =
                            generateBibTeX(pub);

                        showBibTeXPopup(
                            bibtex,
                            pub.title
                        );

                    }
                );

            });



            /*
             * Keyword buttons
             */

            const keywordButtons =
                container.querySelectorAll(
                    ".keyword-tag"
                );


            keywordButtons.forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        const keyword =
                            this.dataset.keyword;

                        searchKeyword =
                            keyword;


                        const searchBox =
                            document.getElementById(
                                "publication-search"
                            );


                        if (searchBox) {
                            searchBox.value = keyword;
                        }


                        renderPublications();


                        if (searchBox) {

                            searchBox.scrollIntoView({
                                behavior: "smooth",
                                block: "center"
                            });

                        }

                    }
                );

            });

        }


        /* =====================================================
           BibTeX Popup
        ===================================================== */

        function showBibTeXPopup(bibtex, title) {

            const existingPopup =
                document.getElementById(
                    "bibtex-popup"
                );


            if (existingPopup) {
                existingPopup.remove();
            }


            const popup =
                document.createElement("div");


            popup.id =
                "bibtex-popup";


            popup.innerHTML = `

                <div class="bibtex-overlay">

                    <div
                        class="bibtex-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-label="BibTeX citation"
                    >

                        <button
                            type="button"
                            class="bibtex-close"
                            id="bibtex-close"
                            aria-label="Close BibTeX window"
                        >
                            ×
                        </button>


                        <h3>
                            BibTeX
                        </h3>


                        <p class="bibtex-paper-title">
                            ${title}
                        </p>


                        <textarea
                            id="bibtex-text"
                            readonly
                        ></textarea>


                        <button
                            type="button"
                            id="copy-bibtex"
                            class="copy-bibtex"
                        >
                            Copy BibTeX
                        </button>

                    </div>

                </div>

            `;


            document.body.appendChild(popup);


            const textarea =
                document.getElementById(
                    "bibtex-text"
                );


            textarea.value =
                bibtex;


            /*
             * Close
             */

            document
                .getElementById("bibtex-close")
                .addEventListener(
                    "click",
                    function () {

                        popup.remove();

                    }
                );


            /*
             * Click background to close
             */

            const overlay =
                popup.querySelector(
                    ".bibtex-overlay"
                );


            overlay.addEventListener(
                "click",
                function (event) {

                    if (event.target === overlay) {
                        popup.remove();
                    }

                }
            );


            /*
             * ESC to close
             */

            function closeWithEscape(event) {

                if (event.key === "Escape") {

                    popup.remove();

                    document.removeEventListener(
                        "keydown",
                        closeWithEscape
                    );

                }

            }


            document.addEventListener(
                "keydown",
                closeWithEscape
            );


            /*
             * Copy BibTeX
             */

            document
                .getElementById("copy-bibtex")
                .addEventListener(
                    "click",
                    async function () {

                        const copyButton = this;

                        try {

                            await navigator.clipboard.writeText(
                                textarea.value
                            );

                            copyButton.textContent =
                                "Copied!";

                        }

                        catch (error) {

                            textarea.select();

                            document.execCommand(
                                "copy"
                            );

                            copyButton.textContent =
                                "Copied!";

                        }


                        setTimeout(
                            function () {

                                copyButton.textContent =
                                    "Copy BibTeX";

                            },
                            1500
                        );

                    }
                );

        }


        /* =====================================================
           Search
        ===================================================== */

        const searchBox =
            document.getElementById(
                "publication-search"
            );


        if (searchBox) {

            searchBox.addEventListener(
                "input",
                function () {

                    searchKeyword =
                        this.value;

                    renderPublications();

                }
            );

        }


        /* =====================================================
           Author Type Filters
        ===================================================== */

        const filterButtons =
            document.querySelectorAll(
                ".filter-btn"
            );


        filterButtons.forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    currentFilter =
                        this.dataset.filter;


                    filterButtons.forEach(
                        btn =>
                            btn.classList.remove(
                                "active"
                            )
                    );


                    this.classList.add(
                        "active"
                    );


                    renderPublications();

                }
            );

        });


        /* =====================================================
           Initial Render
        ===================================================== */

        renderPublications();

    }


    /* =========================================================
       Language Button
       暂时保留，下一阶段做真正中英文切换
    ========================================================= */

    const languageBtn =
        document.getElementById(
            "languageBtn"
        );


    if (languageBtn) {

        languageBtn.addEventListener(
            "click",
            function () {

                alert(
                    "Chinese / English version will be added in the next update."
                );

            }
        );

    }

});

