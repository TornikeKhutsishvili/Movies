export interface Movie {
  posterMedium: any;
  title: string;
  year: number;
  imdb_id: string;
  type: string;
  id: string;
  genres: any;
  genre_names?: string[];
}

export interface MovieDetail extends Movie {
  original_title: string;
  plot_overview: string;
  runtime_minutes: number;
  end_year: number;
  release_date: string;
  tmdb_id: number;
  Rated: string;
  Released: string;
  Runtime: string;
  us_rating: string;
  genres: any;
  genre_names?: string[];
  user_rating: string;
  critic_score: string;
  relevance_percentile: number;
  original_language: string;
  network_names: any;
  backdrop: any;
  trailer: any;
  trailer_thumbnail: any;
}
