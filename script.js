document.addEventListener("DOMContentLoaded", function () {


    /* =========================================================
       Language System
    ========================================================= */

    const languageBtn =
        document.getElementById("languageBtn");


    /*
     * 优先读取访客上一次选择的语言。
     * 如果以前没有选择过，则默认英文。
     */

    let currentLanguage =
        localStorage.getItem("siteLanguage") || "en";


    /*
     * 防止 localStorage 中出现异常值
     */

    if (
        currentLanguage !== "en" &&
        currentLanguage !== "zh"
    ) {
        currentLanguage = "en";
    }



    /* =========================================================
       Translation Helpers
    ========================================================= */

    function translateType(type) {

        if (currentLanguage === "en") {
            return type;
        }


        const translations = {

            "First Author": "第一作者",

            "Corresponding Author": "通讯作者",

            "Co-author": "合作者"

        };


        return translations[type] || type;

    }



    function applyLanguage() {


        /* -----------------------------------------------------
           Static bilingual text
        ----------------------------------------------------- */

        const bilingualElements =
            document.querySelectorAll(
                "[data-en][data-zh]"
            );


        bilingualElements.forEach(element => {

            const text =
                currentLanguage === "zh"
                    ? element.dataset.zh
                    : element.dataset.en;


            /*
             * 使用 innerHTML，
             * 因为 Education 中包含 <br>
             */

            element.innerHTML = text;

        });



        /* -----------------------------------------------------
           Search placeholder
        ----------------------------------------------------- */

        const searchBox =
            document.getElementById(
                "publication-search"
            );


        if (searchBox) {

            searchBox.placeholder =
                currentLanguage === "zh"
                    ? searchBox.dataset.placeholderZh
                    : searchBox.dataset.placeholderEn;

        }



        /* -----------------------------------------------------
           Language button
        ----------------------------------------------------- */

        if (languageBtn) {

            languageBtn.textContent =
                currentLanguage === "en"
                    ? "中文"
                    : "EN";

        }



        /* -----------------------------------------------------
           HTML language attribute
        ----------------------------------------------------- */

        document.documentElement.lang =
            currentLanguage === "zh"
                ? "zh-CN"
                : "en";



        /* -----------------------------------------------------
           Browser title
        ----------------------------------------------------- */

        document.title =
            currentLanguage === "zh"
                ? "Congcong Zhang | 天体物理研究者"
                : "Congcong Zhang | Astrophysicist";

    }



    /* =========================================================
       Publication Dashboard
    ========================================================= */

    const container =
        document.getElementById(
            "publication-container"
        );


    let currentFilter = "All";

    let searchKeyword = "";



    if (
        container &&
        typeof publications !== "undefined"
    ) {


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

            const total =
                publications.length;


            const firstAuthor =
                publications.filter(
                    pub =>
                        Array.isArray(pub.type) &&
                        pub.type.includes(
                            "First Author"
                        )
                ).length;


            const corresponding =
                publications.filter(
                    pub =>
                        Array.isArray(pub.type) &&
                        pub.type.includes(
                            "Corresponding Author"
                        )
                ).length;


            const years =
                publications
                    .map(
                        pub =>
                            Number(pub.year)
                    )
                    .filter(
                        year =>
                            !Number.isNaN(year)
                    );


            const period =
                years.length
                    ? `${Math.min(...years)} - ${Math.max(...years)}`
                    : "—";


            const stats =
                document.getElementById(
                    "publication-stats"
                );


            if (!stats) {
                return;
            }


            const labels =
                currentLanguage === "zh"
                    ? {
                        publications: "论文",
                        firstAuthor: "第一作者",
                        corresponding: "通讯作者",
                        researchPeriod: "研究时间"
                    }
                    : {
                        publications: "Publications",
                        firstAuthor: "First Author",
                        corresponding: "Corresponding Author",
                        researchPeriod: "Research Period"
                    };


            stats.innerHTML = `

                <div class="stat-card">

                    <h3>
                        ${total}
                    </h3>

                    <p>
                        ${labels.publications}
                    </p>

                </div>


                <div class="stat-card">

                    <h3>
                        ${firstAuthor}
                    </h3>

                    <p>
                        ${labels.firstAuthor}
                    </p>

                </div>


                <div class="stat-card">

                    <h3>
                        ${corresponding}
                    </h3>

                    <p>
                        ${labels.corresponding}
                    </p>

                </div>


                <div class="stat-card">

                    <h3>
                        ${period}
                    </h3>

                    <p>
                        ${labels.researchPeriod}
                    </p>

                </div>

            `;

        }



        /* =====================================================
           Generate BibTeX
        ===================================================== */

        function generateBibTeX(pub) {


            /*
             * 如果 publications.js 中以后填写了
             * 正式 BibTeX，优先使用。
             */

            if (
                pub.bibtex &&
                pub.bibtex.trim() !== ""
            ) {

                return pub.bibtex;

            }



            /*
             * 否则根据当前数据自动生成。
             */

            const firstAuthor =
                pub.authors
                    .split(",")[0]
                    .replace("*", "")
                    .trim();


            const authorParts =
                firstAuthor.split(" ");


            const lastName =
                authorParts.length > 1
                    ? authorParts[
                        authorParts.length - 1
                    ]
                    : firstAuthor;


            const cleanTitle =
                pub.title.replace(
                    /[{}]/g,
                    ""
                );


            const citationKey =
                `${lastName}${pub.year}`;


            let bibtex =
`@article{${citationKey},
  author = {${pub.authors.replace(/\*/g, "")}},
  title = {${cleanTitle}},
  journal = {${pub.journal}},
  year = {${pub.year}},
  volume = {${pub.volume}},
  pages = {${pub.pages}}`;


            if (pub.doi) {

                const doiValue =
                    pub.doi.replace(
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
             * 如果以后手动提供 ads，
             * 优先使用。
             */

            if (
                pub.ads &&
                pub.ads.trim() !== ""
            ) {

                return pub.ads;

            }



            /*
             * 否则由 bibcode 自动创建 ADS 链接。
             */

            if (
                pub.bibcode &&
                pub.bibcode.trim() !== ""
            ) {

                return (
                    "https://ui.adsabs.harvard.edu/abs/" +
                    encodeURIComponent(
                        pub.bibcode
                    ) +
                    "/abstract"
                );

            }


            return "";

        }



        /* =====================================================
           Publication Buttons
        ===================================================== */

        function createPublicationButtons(
            pub,
            index
        ) {

            let buttons = "";


            const adsURL =
                getAdsURL(pub);



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
                searchKeyword
                    .trim()
                    .toLowerCase();



            let filtered =
                publications.filter(
                    pub => {


                        const types =
                            Array.isArray(pub.type)
                                ? pub.type
                                : [];


                        const keywords =
                            Array.isArray(
                                pub.keywords
                            )
                                ? pub.keywords
                                : [];



                        /*
                         * 筛选仍然使用英文内部值。
                         *
                         * 例如：
                         * data-filter="First Author"
                         *
                         * 即使按钮显示“第一作者”，
                         * 逻辑仍然稳定。
                         */

                        const typeMatch =
                            currentFilter === "All" ||
                            types.includes(
                                currentFilter
                            );



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
                            searchableText.includes(
                                normalizedSearch
                            );


                        return (
                            typeMatch &&
                            searchMatch
                        );

                    }
                );



            /*
             * 年份从新到旧。
             *
             * 同一年保持 publications.js
             * 原来的排序。
             */

            filtered =
                filtered
                    .map(
                        pub => ({
                            pub: pub,

                            originalIndex:
                                publications.indexOf(
                                    pub
                                )
                        })
                    )
                    .sort(
                        (a, b) => {

                            const yearDifference =
                                Number(
                                    b.pub.year
                                ) -
                                Number(
                                    a.pub.year
                                );


                            if (
                                yearDifference !== 0
                            ) {

                                return yearDifference;

                            }


                            return (
                                a.originalIndex -
                                b.originalIndex
                            );

                        }
                    );



            /* =================================================
               No results
            ================================================= */

            if (
                filtered.length === 0
            ) {


                if (
                    currentLanguage === "zh"
                ) {

                    container.innerHTML = `

                        <div class="publication-empty">

                            <h3>
                                未找到相关论文
                            </h3>

                            <p>
                                请尝试其他关键词或筛选条件。
                            </p>

                        </div>

                    `;

                }

                else {

                    container.innerHTML = `

                        <div class="publication-empty">

                            <h3>
                                No publications found
                            </h3>

                            <p>
                                Try another keyword or publication filter.
                            </p>

                        </div>

                    `;

                }


                return;

            }



            let currentYear = "";



            filtered.forEach(
                item => {


                    const pub =
                        item.pub;


                    const originalIndex =
                        item.originalIndex;



                    /* =========================================
                       Year
                    ========================================= */

                    if (
                        pub.year !==
                        currentYear
                    ) {


                        currentYear =
                            pub.year;


                        const yearTitle =
                            document.createElement(
                                "h3"
                            );


                        yearTitle.className =
                            "publication-year";


                        yearTitle.textContent =
                            pub.year;


                        container.appendChild(
                            yearTitle
                        );

                    }



                    /* =========================================
                       Publication Card
                    ========================================= */

                    const card =
                        document.createElement(
                            "article"
                        );


                    card.className =
                        "publication-card";



                    const typeTags =
                        (
                            Array.isArray(
                                pub.type
                            )
                                ? pub.type
                                : []
                        )
                            .map(
                                type => `

                                    <span class="type-tag">

                                        ${translateType(type)}

                                    </span>

                                `
                            )
                            .join("");



                    /*
                     * Topic 标签保持学术英文。
                     *
                     * PAH / JWST / Fullerene /
                     * Astrochemistry 等无需翻译，
                     * 也方便国际访客识别。
                     */

                    const keywordTags =
                        (
                            Array.isArray(
                                pub.keywords
                            )
                                ? pub.keywords
                                : []
                        )
                            .map(
                                keyword => `

                                    <button
                                        type="button"
                                        class="keyword-tag"
                                        data-keyword="${keyword}"
                                        title="${
                                            currentLanguage === "zh"
                                                ? "筛选相关论文"
                                                : "Show related publications"
                                        }"
                                    >
                                        ${keyword}
                                    </button>

                                `
                            )
                            .join("");



                    card.innerHTML = `

                        <h3 class="publication-title">

                            ${pub.title}

                        </h3>


                        <p class="authors">

                            ${highlightMyName(
                                pub.authors
                            )}

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


                    container.appendChild(
                        card
                    );

                }
            );


            attachDynamicEvents();

        }



        /* =====================================================
           Dynamic Events
        ===================================================== */

        function attachDynamicEvents() {


            /* -------------------------------------------------
               BibTeX
            ------------------------------------------------- */

            const bibtexButtons =
                container.querySelectorAll(
                    ".bibtex-button"
                );


            bibtexButtons.forEach(
                button => {


                    button.addEventListener(
                        "click",
                        function () {


                            const index =
                                Number(
                                    this.dataset
                                        .publicationIndex
                                );


                            const pub =
                                publications[index];


                            const bibtex =
                                generateBibTeX(
                                    pub
                                );


                            showBibTeXPopup(
                                bibtex,
                                pub.title
                            );

                        }
                    );

                }
            );



            /* -------------------------------------------------
               Keyword buttons
            ------------------------------------------------- */

            const keywordButtons =
                container.querySelectorAll(
                    ".keyword-tag"
                );


            keywordButtons.forEach(
                button => {


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

                                searchBox.value =
                                    keyword;

                            }


                            renderPublications();


                            if (searchBox) {

                                searchBox.scrollIntoView({

                                    behavior:
                                        "smooth",

                                    block:
                                        "center"

                                });

                            }

                        }
                    );

                }
            );

        }



        /* =====================================================
           BibTeX Popup
        ===================================================== */

        function showBibTeXPopup(
            bibtex,
            title
        ) {


            const existingPopup =
                document.getElementById(
                    "bibtex-popup"
                );


            if (existingPopup) {

                existingPopup.remove();

            }



            const popup =
                document.createElement(
                    "div"
                );


            popup.id =
                "bibtex-popup";



            const copyText =
                currentLanguage === "zh"
                    ? "复制 BibTeX"
                    : "Copy BibTeX";



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
                            aria-label="Close"
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

                            ${copyText}

                        </button>

                    </div>

                </div>

            `;



            document.body.appendChild(
                popup
            );



            const textarea =
                document.getElementById(
                    "bibtex-text"
                );


            textarea.value =
                bibtex;



            /* -------------------------------------------------
               Close button
            ------------------------------------------------- */

            document
                .getElementById(
                    "bibtex-close"
                )
                .addEventListener(
                    "click",
                    function () {

                        popup.remove();

                    }
                );



            /* -------------------------------------------------
               Click overlay to close
            ------------------------------------------------- */

            const overlay =
                popup.querySelector(
                    ".bibtex-overlay"
                );


            overlay.addEventListener(
                "click",
                function (event) {


                    if (
                        event.target ===
                        overlay
                    ) {

                        popup.remove();

                    }

                }
            );



            /* -------------------------------------------------
               ESC
            ------------------------------------------------- */

            function closeWithEscape(
                event
            ) {


                if (
                    event.key ===
                    "Escape"
                ) {

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



            /* -------------------------------------------------
               Copy BibTeX
            ------------------------------------------------- */

            document
                .getElementById(
                    "copy-bibtex"
                )
                .addEventListener(
                    "click",
                    async function () {


                        const copyButton =
                            this;


                        try {


                            await navigator
                                .clipboard
                                .writeText(
                                    textarea.value
                                );


                            copyButton.textContent =
                                currentLanguage ===
                                "zh"
                                    ? "已复制！"
                                    : "Copied!";

                        }


                        catch (error) {


                            textarea.select();


                            document.execCommand(
                                "copy"
                            );


                            copyButton.textContent =
                                currentLanguage ===
                                "zh"
                                    ? "已复制！"
                                    : "Copied!";

                        }



                        setTimeout(
                            function () {


                                copyButton.textContent =
                                    currentLanguage ===
                                    "zh"
                                        ? "复制 BibTeX"
                                        : "Copy BibTeX";

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


        filterButtons.forEach(
            button => {


                button.addEventListener(
                    "click",
                    function () {


                        /*
                         * 注意：
                         *
                         * data-filter 始终保存英文内部值。
                         *
                         * 按钮显示的中文/英文变化
                         * 不会影响筛选功能。
                         */

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

            }
        );



        /* =====================================================
           Initial Publications
        ===================================================== */

        updateStatistics();

        renderPublications();

    }



    /* =========================================================
       Language Switching
    ========================================================= */

    function switchLanguage() {


        currentLanguage =
            currentLanguage === "en"
                ? "zh"
                : "en";


        /*
         * 保存访客选择。
         */

        localStorage.setItem(
            "siteLanguage",
            currentLanguage
        );


        /*
         * 更新静态页面。
         */

        applyLanguage();


        /*
         * 更新动态 Publications。
         */

        if (
            container &&
            typeof publications !==
            "undefined"
        ) {

            updateStatistics();

            renderPublications();

        }

    }



    if (languageBtn) {


        languageBtn.addEventListener(
            "click",
            switchLanguage
        );

    }



    /* =========================================================
       Initial Language
    ========================================================= */

    applyLanguage();


    /*
     * 如果网页打开时，
     * localStorage 里保存的是中文，
     * Publications 也同步重新渲染一次。
     */

    if (
        container &&
        typeof publications !==
        "undefined"
    ) {

        updateStatistics();

        renderPublications();

    }

});
