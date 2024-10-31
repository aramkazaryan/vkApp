import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";

export interface IRepository {
  id: number;
  name: string;
  description: string;
  created_at: string;
  clone_url: string;
  topics: string[];
  watchers_count: number;
  forks_count: number;
  stargazers_count: number;
  owner: {
    id: number;
    login: string;
    avatar_url: string;
    html_url: string;
  };
  visibility: string;
}

export interface IRepositoriesFilters {
  page: number;
  searchText: string;
  sort: string;
  order: string;
}
class GithubStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  repositories: IRepository[] = [];

  statusError: number | null = null;

  loading: boolean = false;

  setRepositories = (data: IRepository[]) => {
    this.repositories = data;
  };

  getGithubRepositories = async (
    filters: IRepositoriesFilters
  ): Promise<IRepository[] | null> => {
    const requestOptions = {
      method: "GET",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `${process.env.VITE_GITHUB_TOKEN}`,
      },
    };
    if (filters.page === 1) {
      this.repositories = [];
    }
    this.loading = true;
    let ResponseStatusCode: number = 0;
    try {
      const response = await fetch(
        `${process.env.VITE_REACT_APP_API_URL}/${process.env.VITE_REACT_APP_API_REPOSITORIES}?q=${filters.searchText}&page=${filters.page}&per_page=5&sort=${filters.sort}&order=${filters.order}`,
        requestOptions
      );
      ResponseStatusCode = response.status;
      const data = await response.json();
      this.loading = false;
      if (response.ok) {
        this.statusError = null;
        if (filters.page === 1) {
          this.repositories = data.items;
        } else {
          this.repositories = [...this.repositories, ...data.items];
        }
      } else {
        this.statusError = response.status;
      }
      return data;
    } catch (error) {
      console.log(error);
      if (ResponseStatusCode) {
        this.statusError = ResponseStatusCode;
      }
      this.loading = false;
      return null;
    }
  };
}

export default GithubStore;
