const API_KEY = fce4d310a188453eaa6c3118531b7226;  // Remplace par ta clé API NewsAPI
const QUERY = "Algérie";
const LANGUAGE = "fr";
const EXCLUDED_SOURCES = ["TSA Algérie", "El Watan", "Liberté Algérie", "Echorouk Online", "Le Soir d'Algérie", "DZ Foot"];

async function fetchNews() {
    const url = `https://newsapi.org/v2/everything?q=${QUERY}&language=${LANGUAGE}&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Vérifier si l'API a bien renvoyé des articles
        if (data.status !== "ok") {
            console.error("Erreur NewsAPI :", data);
            return;
        }

        // Filtrer les sources exclues
        const filteredArticles = data.articles.filter(article => 
            !EXCLUDED_SOURCES.includes(article.source.name)
        );

        displayNews(filteredArticles);
    } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
    }
}

function displayNews(articles) {
    const newsContainer = document.getElementById("news");
    newsContainer.innerHTML = ""; // Vider le contenu avant d'ajouter les articles

    articles.forEach(article => {
        const articleElement = document.createElement("div");
        articleElement.classList.add("news-item");

        articleElement.innerHTML = `
            <h2>${article.title}</h2>
            <p><strong>Source:</strong> ${article.source.name}</p>
            ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${article.title}" style="width:100%;max-height:300px;">` : ""}
            <p>${article.description}</p>
            <a href="${article.url}" target="_blank">Lire l'article</a>
        `;

        newsContainer.appendChild(articleElement);
    });
}

// Charger les actualités au chargement de la page
document.addEventListener("DOMContentLoaded", fetchNews);
