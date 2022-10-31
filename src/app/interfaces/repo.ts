export interface Repo {
    id: number;
    name: string;
    full_name: string;
    html_url: string;
    description: string;
    stargazers_count: number;
    languages?: object;
    languages_array?: string[];
}
