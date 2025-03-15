const API_KEY = "fce4d310a188453eaa6c3118531b7226";  // Remplace par ta clé NewsAPI
const QUERY = "Algérie";
const LANGUAGE = "fr";
const PAGE_SIZE = 20;  // ✅ Limite à 20 articles

async function fetchNews() {
    const url = `https://newsapi.org/v2/everything?q=${QUERY}&language=${LANGUAGE}&pageSize=${PAGE_SIZE}&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "ok") {
            console.error("Erreur NewsAPI :", data);
            return;
        }

        // ✅ On prend seulement les 20 premiers articles
        const limitedArticles = data.articles.slice(0, PAGE_SIZE);

        displayNews(limitedArticles);
    } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
    }
}
