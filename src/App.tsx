import React from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "./store/RootStore";
import { useContext, useEffect, useRef, useState } from "react";
import { Col, Divider, Result, Skeleton } from "antd";
import styles from "./App.module.scss";
import RepositoryCard from "./Components/Repository/RepositoryCard";
import { IRepositoriesFilters } from "./store/GithubStore";
import Filters from "./Components/Filters/Filters";

const App = observer(() => {
  const {
    GithubStore: { getGithubRepositories, repositories, statusError, loading },
  } = useContext(RootStoreContext);

  const [filters, setFilters] = useState<IRepositoriesFilters>({
    page: 1,
    searchText: "javascript",
    sort: "stars",
    order: "desc",
  });

  useEffect(() => {
    getGithubRepositories(filters).then(() => {
      isScrolling.current = false;
    });
  }, [getGithubRepositories, filters]);

  const isScrolling = useRef(false);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.offsetHeight &&
      !loading &&
      !statusError
    ) {
      isScrolling.current = true;
      setFilters((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll, loading]);

  return (
    <Col className={styles.Container} xl={{ span: 18, offset: 3 }}>
      <div className={styles.ContainerHeader}>
        <Divider orientation="left">
          <h3>Репозитории Github {repositories.length}</h3>
        </Divider>
        <Filters setFilters={setFilters} filters={filters} />
      </div>

      {!repositories.length && !loading && (
        <Result
          status={"404"}
          title={"Ничего не найдено("}
          subTitle={statusError ? `Статус ошибки: ${statusError}` : ""}
        />
      )}

      {repositories.map((repository) => (
        <RepositoryCard
          key={repository.id}
          repositories={repositories}
          repository={repository}
        />
      ))}

      {loading && <Skeleton avatar paragraph={{ rows: 4 }} />}
    </Col>
  );
});

export default App;
