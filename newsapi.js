const API_KEY = "fce4d310a188453eaa6c3118531b7226";  // Remplace par ta clé API NewsAPI
const QUERY = "Algérie";
const LANGUAGE = "fr";
const PAGE_SIZE = 20;  // ✅ Limite à 20 articles
const FETCH_INTERVAL = 3 * 60 * 60 * 1000;  // ✅ 3 heures en millisecondes

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

        if (!data.articles || !Array.isArray(data.articles)) {
            console.error("Aucun article trouvé ou format de réponse invalide.");
            return;
        }

        // ✅ Analyser les articles et afficher
        const analyzedArticles = await Promise.all(data.articles.map(article => analyzeArticle(article)));
        displayNews(analyzedArticles);

    } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error.message || error);
    }
}

// ✅ Fonction d'analyse du sentiment et reformulation du titre
async function analyzeArticle(article) {
    let sentiment = "⚪ Neutre";
    let newTitle = article.title;

    // Exemple d'analyse avec des mots-clés
    const negativeKeywords = ["grève", "crise", "tension", "problème"];
    const positiveKeywords = ["coopération", "amélioration", "succès", "progrès"];

    if (negativeKeywords.some(keyword => article.title.toLowerCase().includes(keyword))) {
        sentiment = "🔴 Négatif";
        newTitle = `Selon ${article.source.name}, ${article.title.toLowerCase()}`;
    } else if (positiveKeywords.some(keyword => article.title.toLowerCase().includes(keyword))) {
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

        const imageUrl = article.urlToImage || "https://via.placeholder.com/300x150"; // Image par défaut

        articleElement.innerHTML = `
            <h2>${article.sentiment} ${article.newTitle}</h2>
            <p><strong>Source:</strong> ${article.source.name} - <em>${new Date(article.publishedAt).toLocaleDateString()}</em></p>
            <img src="${imageUrl}" alt="${article.newTitle}" onerror="this.src='https://via.placeholder.com/300x150';" style="width:100%;max-height:300px;">
            <p><a href="analyse.html?article=${encodeURIComponent(article.url)}">Lire l'analyse complète</a></p>
        `;

        newsContainer.appendChild(articleElement);
    });
}

// ✅ Lancer la récupération des actualités toutes les 3 heures
setInterval(fetchNews, FETCH_INTERVAL);

// ✅ Charger les actualités au démarrage
document.addEventListener("DOMContentLoaded", fetchNews);
