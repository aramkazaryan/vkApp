import React from "react";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Input, Select, Space } from "antd";
import styles from "./Filters.module.scss";
import { IRepositoriesFilters } from "../../store/GithubStore";

interface Props {
  setFilters: React.Dispatch<React.SetStateAction<IRepositoriesFilters>>;
  filters: IRepositoriesFilters;
}
const Filters: React.FC<Props> = observer(({ setFilters, filters }) => {
  const [searchText, setSearchText] = useState<string>("javascript");
  const { Search } = Input;

  return (
    <Space>
      <div className={styles.Filter}>
        <Search
          placeholder="input search text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={() => {
            if (searchText !== filters.searchText) {
              setFilters((prev) => ({
                ...prev,
                page: 1,
                searchText: searchText,
              }));
            }
          }}
        />
      </div>
      <div className={styles.Filter}>
        <Select
          defaultValue={filters.sort}
          placeholder="Сортировка"
          popupMatchSelectWidth={false}
          options={[
            {
              label: "Сортировка по количеству звезд",
              value: "stars",
            },
            {
              label: "Сортировка по количеству ответвлений",
              value: "forks",
            },
            {
              label: "Cортировать по тому, как давно были обновлены элементы",
              value: "updated",
            },
          ]}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              page: 1,
              sort: e,
            }))
          }
        />
      </div>
      <div className={styles.Filter}>
        <Select
          defaultValue={filters.order}
          placeholder="Order"
          popupMatchSelectWidth={false}
          options={[
            {
              value: "desc",
              label: "По убыванию",
            },
            {
              value: "asc",
              label: "По возрастанию",
            },
          ]}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              page: 1,
              order: e,
            }))
          }
        />
      </div>
    </Space>
  );
});

export default Filters;
