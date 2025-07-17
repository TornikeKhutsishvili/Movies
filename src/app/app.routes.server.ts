import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'movie-list/movie-details/:id',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: async () => {
      const apiKeys = [
        't0XNBuNEaL4lMfCVvx90ks41SrlQlWynqX5gqGB3',
        'EFCY2h2VghuMcuVW60TvMyWN9glnfkDhg1QKgvrk',
        'nYKWjq7aJRd5Q8xKkUyFSGGtMPfuBO2JCk8OUia8',
      ];

      const baseUrl = 'https://api.watchmode.com/v1';
      const endpoint = '/list-titles/?types=movie&sort_by=release_date_desc&limit=60';

      let data: any = null;

      for (let i = 0; i < apiKeys.length; i++) {
        const url = `${baseUrl}${endpoint}&apiKey=${apiKeys[i]}`;
        try {
          const response = await fetch(url);
          if (!response.ok) continue;

          data = await response.json();
          break;
        } catch (error) {
          console.error(`API Key ${i} failed`, error);
        }
      }

      if (!data?.titles) return [];

      return data.titles.map((title: any) => ({
        id: title.id.toString()
      }));
    }
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
