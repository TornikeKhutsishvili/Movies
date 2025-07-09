export interface Actors {
  id: number;
  full_name: string;
  first_name: string;
  last_name: string;
  tmdb_id: number;
  imdb_id: string;
  main_profession: string;
  secondary_profession: string;
  tertiary_profession: string;
  date_of_birth: string;
  date_of_death: string | null;
  place_of_birth: string;
  gender: 'm' | 'f';
  headshot_url: string;
  known_for: number[];
  relevance_percentile: number;
}