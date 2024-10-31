import React from "react";
import { render, screen } from "@testing-library/react";
import RepositoryCard from "./RepositoryCard";
import { IRepository } from "../../store/GithubStore";

// Моковые данные для тестирования
const mockRepository: IRepository = {
  id: 1,
  name: "Test Repository",
  description: "Это тестовый репозиторий.",
  created_at: "2021-01-01T00:00:00Z",
  clone_url: "https://github.com/test/repo",
  topics: ["тест", "репозиторий"],
  watchers_count: 10,
  forks_count: 5,
  stargazers_count: 15,
  owner: {
    id: 1,
    login: "testuser",
    avatar_url: "https://avatar.url/testuser.png",
    html_url: "https://github.com/testuser",
  },
  visibility: "public",
};

const mockRepositories: IRepository[] = [mockRepository];

beforeAll(() => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Добавляем мок для метода addListener
    removeListener: jest.fn(), // Добавляем мок для метода removeListener
    addEventListener: jest.fn(), // Добавляем мок для метода addEventListener
    removeEventListener: jest.fn(), // Добавляем мок для метода removeEventListener
    dispatchEvent: jest.fn(), // Добавляем мок для метода dispatchEvent
  }));
});

describe("RepositoryCard", () => {
  it("корректно отображает детали репозитория", () => {
    render(
      <RepositoryCard
        repository={mockRepository}
        repositories={mockRepositories}
      />
    );

    expect(screen.getByText(/Test Repository/i)).toBeInTheDocument();
    expect(screen.getByText(/Это тестовый репозиторий/i)).toBeInTheDocument();
    expect(screen.getByText(/testuser/i)).toBeInTheDocument();
  });
  it("должен отображать сообщение, если темы не указаны", () => {
    const emptyTopicsRepository: IRepository = {
      ...mockRepository,
      topics: [],
    };

    render(
      <RepositoryCard
        repository={emptyTopicsRepository}
        repositories={mockRepositories}
      />
    );

    // Проверяем, что отображается сообщение о том, что темы не указаны
    expect(screen.getByText(/Темы не указаны/i)).toBeInTheDocument();
  });
});
