import React from "react";
import { render, screen } from "@testing-library/react";
import { rootStore, RootStoreContext } from "./store/RootStore";
import App from "./App";
import { IRepository } from "./store/GithubStore";

const mockRepositories: IRepository[] = [
  {
    id: 1,
    name: "Test Repository 1",
    description: "Описание тестового репозитория 1.",
    created_at: "2021-01-01T00:00:00Z",
    clone_url: "https://github.com/test/repo1",
    topics: ["тест", "репозиторий"],
    watchers_count: 10,
    forks_count: 5,
    stargazers_count: 15,
    owner: {
      id: 1,
      login: "testuser1",
      avatar_url: "https://avatar.url/testuser1.png",
      html_url: "https://github.com/testuser1",
    },
    visibility: "public",
  },
  {
    id: 2,
    name: "Test Repository 2",
    description: "Описание тестового репозитория 2.",
    created_at: "2021-01-01T00:00:00Z",
    clone_url: "https://github.com/test/repo2",
    topics: ["тест", "репозиторий"],
    watchers_count: 20,
    forks_count: 15,
    stargazers_count: 25,
    owner: {
      id: 2,
      login: "testuser2",
      avatar_url: "https://avatar.url/testuser2.png",
      html_url: "https://github.com/testuser2",
    },
    visibility: "public",
  },
];

const mockGetGithubRepositories = jest.fn().mockResolvedValue(mockRepositories);

const mockStore = {
  GithubStore: {
    rootStore: rootStore,
    getGithubRepositories: mockGetGithubRepositories,
    repositories: mockRepositories,
    statusError: null,
    setRepositories: jest.fn(),
    loading: false,
  },
};
beforeAll(() => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
});

describe("App", () => {
  beforeEach(() => {
    render(
      <RootStoreContext.Provider value={mockStore}>
        <App />
      </RootStoreContext.Provider>
    );
  });

  it("корректно отображает заголовок с количеством репозиториев", () => {
    expect(screen.getByText(/Репозитории Github 2/i)).toBeInTheDocument();
  });

  it("должен отображать сообщение, если репозитории не найдены", () => {
    const emptyStore = {
      GithubStore: {
        rootStore: rootStore,
        getGithubRepositories: mockGetGithubRepositories,
        repositories: [],
        setRepositories: jest.fn(),
        statusError: null,
        loading: false,
      },
    };

    render(
      <RootStoreContext.Provider value={emptyStore}>
        <App />
      </RootStoreContext.Provider>
    );

    expect(screen.getByText(/Ничего не найдено/i)).toBeInTheDocument();
  });

  it("отображает карточки репозиториев", () => {
    expect(screen.getByText(/Test Repository 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Repository 2/i)).toBeInTheDocument();
  });
});
