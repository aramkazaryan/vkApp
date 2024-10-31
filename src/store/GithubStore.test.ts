// GithubStore.test.ts
import GithubStore, { IRepository, IRepositoriesFilters } from "./GithubStore";
import { RootStore } from "./RootStore";

const mockRootStore: RootStore = {} as RootStore;

describe("GithubStore", () => {
  let githubStore: GithubStore;

  beforeEach(() => {
    githubStore = new GithubStore(mockRootStore);
  });

  it("следует инициализировать со значениями по умолчанию", () => {
    expect(githubStore.repositories).toEqual([]);
    expect(githubStore.statusError).toBeNull();
    expect(githubStore.loading).toBe(false);
  });

  it("следует правильно настроить репозитории, используя setRepositories", () => {
    const mockData: IRepository[] = [
      {
        id: 1,
        name: "Repo 1",
        description: "First repo",
        created_at: "2023-01-01T00:00:00Z",
        clone_url: "https://github.com/user/repo1.git",
        topics: ["topic1", "topic2"],
        watchers_count: 10,
        forks_count: 5,
        stargazers_count: 15,
        owner: {
          id: 1,
          login: "user1",
          avatar_url: "https://avatar.url/user1",
          html_url: "https://github.com/user1",
        },
        visibility: "public",
      },
    ];

    githubStore.setRepositories(mockData);
    expect(githubStore.repositories).toEqual(mockData);
  });

  it("следует извлечь репозитории и обновить состояние", async () => {
    const filters: IRepositoriesFilters = {
      page: 1,
      searchText: "test",
      sort: "stars",
      order: "desc",
    };

    // Mock the global fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            items: [
              {
                id: 1,
                name: "Repo 1",
                description: "First repo",
                created_at: "2023-01-01T00:00:00Z",
                clone_url: "https://github.com/user/repo1.git",
                pushed_at: "2023-01-01T00:00:00Z",
                topics: ["topic1", "topic2"],
                watchers_count: 10,
                forks_count: 5,
                stargazers_count: 15,
                size: 100,
                owner: {
                  id: 1,
                  login: "user1",
                  avatar_url: "https://avatar.url/user1",
                  html_url: "https://github.com/user1",
                },
                visibility: "public",
              },
            ],
          }),
      })
    ) as jest.Mock;

    const result = await githubStore.getGithubRepositories(filters);
    expect(githubStore.loading).toBe(false);
    expect(githubStore.repositories.length).toBe(1);
    expect(githubStore.statusError).toBeNull();
    expect(result).toBeDefined();
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("следует установить статус ошибки при неудачной выборке", async () => {
    const filters: IRepositoriesFilters = {
      page: 1,
      searchText: "test",
      sort: "stars",
      order: "desc",
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
      })
    ) as jest.Mock;

    const result = await githubStore.getGithubRepositories(filters);
    expect(githubStore.loading).toBe(false);
    expect(githubStore.statusError).toBe(404);
    expect(result).toBeNull();
  });
});
