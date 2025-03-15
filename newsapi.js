const API_KEY = "fce4d310a188453eaa6c3118531b7226";  // Remplace par ta clé API NewsAPI
const QUERY = "Algérie";
const LANGUAGE = "fr";
const PAGE_SIZE = 20;  // ✅ Limite à 20 articles
const FETCH_INTERVAL = 60 * 60 * 1000;  // ✅ 1 heure en millisecondes

// ✅ Fonction pour récupérer les actualités
async function fetchNews() {
    const url = `https://newsapi.org/v2/everything?q=${QUERY}&language=${LANGUAGE}&pageSize=${PAGE_SIZE}&sortBy=publishedAt&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "ok") {
            console.error("Erreur NewsAPI :", data);
            return;
        }

        // ✅ Analyser les articles et afficher
        const analyzedArticles = data.articles.map(article => analyzeArticle(article));
        displayNews(analyzedArticles);

    } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
    }
}

// ✅ Fonction d'analyse du sentiment et reformulation du titre
function analyzeArticle(article) {
    let sentiment = "⚪ Neutre";
    let newTitle = article.title;

    if (article.title.includes("grève") || article.title.includes("crise") || article.title.includes("tension")) {
        sentiment = "🔴 Négatif";
        newTitle = `Selon ${article.source.name}, ${article.title.toLowerCase()}`;
    } else if (article.title.includes("coopération") || article.title.includes("amélioration")) {
        sentiment = "🟢 Positif";
        newTitle = `D'après ${article.source.name}, ${article.title.toLowerCase()}`;
    }

    return { ...article, sentiment, newTitle };
}

// ✅ Fonction pour afficher les articles sur la page
function displayNews(articles) {
    const newsContainer = document.getElementById("news");
    newsContainer.innerHTML = ""; // Vider avant d'ajouter les nouveaux articles

    articles.forEach(article => {
        const articleElement = document.createElement("div");
        articleElement.classList.add("news-item");

        articleElement.innerHTML = `
            <h2>${article.sentiment} ${article.newTitle}</h2>
            <p><strong>Source:</strong> ${article.source.name} - <em>${new Date(article.publishedAt).toLocaleDateString()}</em></p>
            ${article.urlToImage ? `<img src="${article.urlToImage}" alt="${article.newTitle}" style="width:100%;max-height:300px;">` : ""}
            <p><a href="analyse.html?article=${encodeURIComponent(article.url)}">Lire l'analyse complète</a></p>
        `;

        newsContainer.appendChild(articleElement);
    });
}

// ✅ Lancer la récupération des actualités toutes les heures
setInterval(fetchNews, FETCH_INTERVAL);

// ✅ Charger les actualités au démarrage
document.addEventListener("DOMContentLoaded", fetchNews);
