## 🎬 MoviesTK – Angular Movie App
Welcome to MoviesTK, a feature-rich movie web application built with Angular, Bootstrap, and TMDB API integration. This project allows users to browse, search, and view detailed information about movies, with clean design and dynamic interactivity.

## 🔍 Features
📝 Registration and Login – Sign up and log in functionality (stored locally).

🎞️ Movie List – Browse a collection of trending/popular movies.

🎠 Carousel – Highlighted movie slider on the home page.

🔎 Search Functionality – Search movies by title across multiple routes.

📄 Movie Detail Page – View in-depth information like description, runtime, genres, and streaming regions.

📺 Region Availability – See where a movie is available for streaming.

❤️ Favourites – Add and manage your favourite movies locally.

📊 Movie Duration Bar – Visual representation of movie runtime.

🌐 Routing – Navigate easily between Home, Search Results, Movie Details, and Favourites pages.

📱 Responsive Design – Mobile-friendly layout using Bootstrap.


## 🧰 Technologies Used
Angular 17+ – Frontend framework

RxJS – Reactive programming for observables and HTTP calls

Bootstrap 5 – UI and layout styling

TMDB API – The Movie Database API for dynamic movie data

LocalStorage – For saving favourites

Signals – Angular reactive state management

Page Pagination – Custom pagination for search results or listings


## 🚀 Getting Started
✅ Prerequisites
Node.js (v18 or later)

1. Angular CLI

## 📦 Installation
Clone the repository:
git clone https://github.com/TornikeKhutsishvili/Movies.git
cd Movies

2. Install dependencies:
npm install

3. Run the development server:
ng serve

4. Open the app in your browser:
👉 http://localhost:4200



## 🔐 API Key Setup
To access TMDB data, you must provide your own API key.

Go to TMDB Developer

Sign up and get your API key.

Replace the placeholder in your environment.ts file:
export const environment = {
  production: false,
  apiKey: 'YOUR_API_KEY_HERE'
};


## 📁 Project Structure (Simplified)
src/
│
├── app/
│   ├── components/
│   │   ├── home/
│   │   ├── search/
│   │   ├── movie-detail/
│   │   ├── favourites/
│   │   └── shared/
│   ├── services/
│   ├── models/
│   └── app-routing.module.ts
│
├── assets/


## 🧪 Future Improvements
User authentication system
Pagination for search results
Genre-based filtering
Dark mode toggle


## 👨‍💻 Author
Tornike Khutsishvili
🌐 LinkedIn: https://www.linkedin.com/in/tornike-khutsishvili-ab1153193/ 


