const API_KEY = "fce4d310a188453eaa6c3118531b7226";  // Remplace par ta clé NewsAPI
const GPT_API_KEY = "TA_CLE_API_OPENAI";  // Remplace par ta clé OpenAI
const QUERY = "Algérie";
const LANGUAGE = "fr";
const EXCLUDED_SOURCES = ["TSA Algérie", "El Watan", "Liberté Algérie", "Echorouk Online", "Le Soir d'Algérie", "DZ Foot"];

async function fetchNews() {
    const url = `https://newsapi.org/v2/everything?q=${QUERY}&language=${LANGUAGE}&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== "ok") {
            console.error("Erreur NewsAPI :", data);
            return;
        }

        // Filtrer les sources exclues
        const filteredArticles = data.articles.filter(article => 
            !EXCLUDED_SOURCES.includes(article.source.name)
        );

        // Traiter chaque article avec ChatGPT
        for (let article of filteredArticles) {
            await analyzeArticle(article);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des articles :", error);
    }
}

// Fonction pour analyser l’article avec ChatGPT
async function analyzeArticle(article) {
    const prompt = `Analyse cet article et reformule son titre en fonction du sentiment dégagé :
    - Article : ${article.title}
    - Description : ${article.description}
    - Lien : ${article.url}

    Détails à fournir :
    - Sentiment : Positif, Neutre ou Négatif
    - Nouveau titre reformulé pour refléter le biais journalistique
    - Suggestion d’illustration pour représenter le contenu`;

    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${GPT_API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-4-turbo",
            messages: [{ role: "user", content: prompt }]
        })
    });

    const gptData = await gptResponse.json();
    
    if (!gptData.choices) {
        console.error("Erreur GPT :", gptData);
        return;
    }

    const analysis = gptData.choices[0].message.content;
    
    // Extraire les infos retournées par ChatGPT
    const lines = analysis.split("\n").filter(line => line.trim() !== "");
    const sentiment = lines[0].replace("Sentiment : ", "").trim();
    const newTitle = lines[1].replace("Nouveau titre reformulé : ", "").trim();
    const illustration = lines[2].replace("Suggestion d’illustration : ", "").trim();

    displayNews(article, newTitle, sentiment, illustration);
}

// Fonction pour afficher l’article sur la page
function displayNews(article, newTitle, sentiment, illustration) {
    const newsContainer = document.getElementById("news");
    
    const articleElement = document.createElement("div");
    articleElement.classList.add("news-item");

    // Associer une icône au sentiment
    let sentimentIcon = "⚪";
    if (sentiment.toLowerCase() === "positif") sentimentIcon = "🟢";
    if (sentiment.toLowerCase() === "négatif") sentimentIcon = "🔴";

    articleElement.innerHTML = `
        <h2>${sentimentIcon} ${newTitle}</h2>
        <p><strong>Source:</strong> ${article.source.name} - <em>${new Date(article.publishedAt).toLocaleDateString()}</em></p>
        <img src="${illustration}" alt="${newTitle}" style="width:100%;max-height:300px;">
        <p><a href="analyse.html?article=${encodeURIComponent(article.url)}">Lire l'analyse complète</a></p>
    `;

    newsContainer.appendChild(articleElement);
}

// Charger les actualités au chargement de la page
document.addEventListener("DOMContentLoaded", fetchNews);
