document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("publication-container");

    if (!container || typeof publications === "undefined") {
        return;
    }

    function generateBibTeX(pub) {

        const firstAuthor = pub.authors
            .split(",")[0]
            .replace("*", "")
            .trim();

        const authorParts = firstAuthor.split(" ");

        const lastName = authorParts.length > 1
            ? authorParts[authorParts.length - 1]
            : firstAuthor;

        const key = `${lastName}${pub.year}`;

        return `@article{${key},
  author = {${pub.authors.replace("*", "")}},
  title = {${pub.title}},
  journal = {${pub.journal}},
  year = {${pub.year}},
  volume = {${pub.volume}},
  pages = {${pub.pages}}
}`;
    }


    function publicationButtons(pub) {

        let buttons = "";


        // ADS
        if (pub.bibcode) {

            const adsURL =
                `https://ui.adsabs.harvard.edu/abs/${encodeURIComponent(pub.bibcode)}`;

            buttons += `
                <a
                    href="${adsURL}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="pub-button">
                    ADS
                </a>
            `;
        }


        // DOI
        if (pub.doi) {

            buttons += `
                <a
                    href="${pub.doi}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="pub-button">
                    DOI
                </a>
            `;
        }


        // ResearchGate
        if (pub.researchgate) {

            buttons += `
                <a
                    href="${pub.researchgate}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="pub-button">
                    ResearchGate
                </a>
            `;
        }


        // BibTeX
        buttons += `
            <button
                class="pub-button bibtex-button"
                data-bibtex="${encodeURIComponent(generateBibTeX(pub))}">
                BibTeX
            </button>
        `;


        return buttons;
    }


    container.innerHTML = publications.map(pub => `

        <article class="publication-card">

            <div class="publication-year">
                ${pub.year}
            </div>

            <div class="publication-content">

                <h3>
                    ${pub.title}
                </h3>

                <p class="publication-authors">
                    ${pub.authors}
                </p>

                <p class="publication-journal">

                    <em>${pub.journal}</em>,
                    ${pub.volume},
                    ${pub.pages}

                </p>

                <div class="publication-buttons">

                    ${publicationButtons(pub)}

                </div>

            </div>

        </article>

    `).join("");


    /*
     * BibTeX popup
     */

    document.addEventListener("click", function (event) {

        if (!event.target.classList.contains("bibtex-button")) {
            return;
        }

        const bibtex =
            decodeURIComponent(event.target.dataset.bibtex);

        showBibTeXPopup(bibtex);

    });


    function showBibTeXPopup(bibtex) {

        const existing =
            document.getElementById("bibtex-popup");

        if (existing) {
            existing.remove();
        }


        const popup = document.createElement("div");

        popup.id = "bibtex-popup";

        popup.innerHTML = `

            <div class="bibtex-overlay">

                <div class="bibtex-modal">

                    <button
                        class="bibtex-close"
                        id="bibtex-close">
                        ×
                    </button>

                    <h3>
                        BibTeX
                    </h3>

                    <textarea
                        id="bibtex-text"
                        readonly>${bibtex}</textarea>

                    <button
                        id="copy-bibtex"
                        class="copy-bibtex">
                        Copy BibTeX
                    </button>

                </div>

            </div>

        `;

        document.body.appendChild(popup);


        document
            .getElementById("bibtex-close")
            .addEventListener("click", function () {

                popup.remove();

            });


        document
            .getElementById("copy-bibtex")
            .addEventListener("click", function () {

                const textarea =
                    document.getElementById("bibtex-text");

                navigator.clipboard
                    .writeText(textarea.value)
                    .then(() => {

                        this.textContent = "Copied!";

                        setTimeout(() => {

                            this.textContent = "Copy BibTeX";

                        }, 1500);

                    });

            });

    }

});
