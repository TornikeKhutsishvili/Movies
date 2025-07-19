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


## screenshots:
<img width="1898" height="876" alt="Screenshot (3467)" src="https://github.com/user-attachments/assets/a672d46b-efce-4cab-94d5-8eca487c6452" />
<img width="1899" height="870" alt="Screenshot (3468)" src="https://github.com/user-attachments/assets/3c1fbf73-c965-40a2-ab9c-005717df5321" />
<img width="1898" height="877" alt="Screenshot (3469)" src="https://github.com/user-attachments/assets/0200f8d9-5083-48ac-af02-fb6e66e8c100" />
<img width="1900" height="871" alt="Screenshot (3470)" src="https://github.com/user-attachments/assets/c79a5abe-e124-457b-9b8a-432a88431387" />
<img width="1920" height="875" alt="Screenshot (3471)" src="https://github.com/user-attachments/assets/1b6561a0-44a4-4e9c-99d9-d2e5e5c5da98" />
<img width="1920" height="877" alt="Screenshot (3492)" src="https://github.com/user-attachments/assets/0592b422-3890-421e-9b0b-e6a3795f0a12" />
<img width="1920" height="873" alt="Screenshot (3472)" src="https://github.com/user-attachments/assets/51e559b8-0c23-4b53-af32-17ac993448ca" />
<img width="1920" height="877" alt="Screenshot (3473)" src="https://github.com/user-attachments/assets/031baabe-f923-49ad-9ff4-783603aad290" />
<img width="1920" height="876" alt="Screenshot (3474)" src="https://github.com/user-attachments/assets/7c86ea19-9a4e-43a7-bf8a-47d4dfabc874" />
<img width="1920" height="872" alt="Screenshot (3475)" src="https://github.com/user-attachments/assets/df37ef36-3e5e-4cfe-8445-33a1574bf990" />
<img width="1920" height="879" alt="Screenshot (3476)" src="https://github.com/user-attachments/assets/28a850f8-2c61-4cdb-a989-1f8f5d4c020a" />
<img width="1920" height="870" alt="Screenshot (3477)" src="https://github.com/user-attachments/assets/cc4b1897-0584-43d3-b320-d0f48428a2db" />
<img width="1920" height="875" alt="Screenshot (3478)" src="https://github.com/user-attachments/assets/1f2c1913-faf4-49e9-9820-504565379f18" />
<img width="1920" height="876" alt="Screenshot (3479)" src="https://github.com/user-attachments/assets/79a4a6b6-476f-4d42-a04b-23789adfa6a3" />
<img width="1920" height="877" alt="Screenshot (3482)" src="https://github.com/user-attachments/assets/541f5442-5ec3-4fd9-8ab4-f037070c974e" />
<img width="1920" height="877" alt="Screenshot (3483)" src="https://github.com/user-attachments/assets/70cd346f-5010-41d0-968d-a64bae01b19f" />
<img width="1920" height="875" alt="Screenshot (3484)" src="https://github.com/user-attachments/assets/03845d94-b6b7-4b12-b17c-558fddc8e2fd" />
<img width="1920" height="871" alt="Screenshot (3485)" src="https://github.com/user-attachments/assets/37303ecb-283e-4dc0-8afb-6237dd6947f7" />

## for responsive
<img width="1098" height="875" alt="Screenshot (3486)" src="https://github.com/user-attachments/assets/f37c9eb4-f1f2-470c-b6d9-a31fa2798952" />
<img width="501" height="876" alt="Screenshot (3487)" src="https://github.com/user-attachments/assets/f5660312-47f6-4258-80bb-07c9ce610754" />
<img width="497" height="873" alt="Screenshot (3488)" src="https://github.com/user-attachments/assets/b4aa3356-769f-4ba5-8a02-ae4aad4ecd0e" />
<img width="499" height="874" alt="Screenshot (3489)" src="https://github.com/user-attachments/assets/ce2cd2c7-b4a5-418b-9c6e-873bdaf9137d" />
<img width="499" height="874" alt="Screenshot (3490)" src="https://github.com/user-attachments/assets/4fb79906-6b1a-4799-9450-4087fad56d18" />
<img width="501" height="876" alt="Screenshot (3491)" src="https://github.com/user-attachments/assets/fc36ec74-1175-4a13-b448-29651b8bbe57" />




## 👨‍💻 Author
Tornike Khutsishvili
🌐 LinkedIn: https://www.linkedin.com/in/tornike-khutsishvili-ab1153193/ 


