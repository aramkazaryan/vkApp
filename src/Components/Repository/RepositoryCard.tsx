import React from "react";
import { observer } from "mobx-react-lite";
import { RootStoreContext } from "../../store/RootStore";
import { useContext } from "react";
import { Avatar, Badge, Card, Modal, Space, Tag, Typography } from "antd";
import styles from "./RepositoryCard.module.scss";
import {
  ClockCircleOutlined,
  DeleteTwoTone,
  EditOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
  ForkOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { IRepository } from "../../store/GithubStore";
import moment from "moment";

interface Props {
  repository: IRepository;
  repositories: IRepository[];
}
const RepositoryCard: React.FC<Props> = observer(
  ({ repository, repositories }) => {
    const {
      GithubStore: { setRepositories },
    } = useContext(RootStoreContext);

    const { Meta } = Card;
    const { Title, Paragraph } = Typography;
    const { confirm } = Modal;

    const cardFooterInfo = [
      {
        name: "stars",
        count: repository.stargazers_count,
        icon: <StarOutlined className={styles.CardFooterInfoIcon} />,
      },
      {
        name: "watch",
        count: repository.watchers_count,
        icon: <EyeOutlined className={styles.CardFooterInfoIcon} />,
      },
      {
        name: "stars",
        count: repository.forks_count,
        icon: <ForkOutlined className={styles.CardFooterInfoIcon} />,
      },
    ];

    const showDeleteConfirm = () => {
      confirm({
        title: "Удалить репозиторий?",
        icon: <ExclamationCircleFilled />,
        okText: "Удалить",
        okType: "danger",
        cancelText: "Отмена",
        onOk() {
          setRepositories(
            repositories.filter((repo) => repo.id !== repository.id)
          );
        },
      });
    };

    return (
      <div className={styles.RepositoryCard}>
        <Badge.Ribbon text={repository.visibility} key={repository.id}>
          <Card
            extra={
              <DeleteTwoTone
                className={styles.RepoDeleteButton}
                twoToneColor="red"
                onClick={() => showDeleteConfirm()}
              />
            }
            title={
              <Meta
                className={styles.CardHeader}
                avatar={<Avatar src={repository.owner.avatar_url} />}
                title={
                  <Space>
                    <Title level={4}>
                      <a href={repository.owner.html_url}>
                        {repository.owner.login}
                      </a>
                      {" / "}
                    </Title>
                    <Title
                      level={4}
                      editable={{
                        icon: <EditOutlined className={styles.EditButton} />,
                        onChange: (e) => {
                          setRepositories(
                            repositories.map((repo) =>
                              repo.id === repository.id
                                ? {
                                    ...repo,
                                    name: e,
                                  }
                                : repo
                            )
                          );
                        },
                        text: repository.name,
                        tooltip: "Изменить наименование репозитория",
                      }}
                    >
                      <a href={repository.clone_url}>{repository.name} </a>
                    </Title>
                  </Space>
                }
              />
            }
            actions={cardFooterInfo.map(({ name, count, icon }) => {
              return (
                <Space key={name}>
                  {icon}
                  <Badge
                    count={count}
                    color="blue"
                    showZero
                    overflowCount={10000000}
                  />
                </Space>
              );
            })}
          >
            <Typography>
              <Title level={5}>Описание</Title>
              <blockquote>
                {" "}
                <Paragraph
                  editable={{
                    icon: <EditOutlined className={styles.EditButton} />,
                    onChange: (e) => {
                      setRepositories(
                        repositories.map((repo) =>
                          repo.id === repository.id
                            ? {
                                ...repo,
                                description: e,
                              }
                            : repo
                        )
                      );
                    },
                    tooltip: "Отредактировать описание",
                    text: repository.description,
                  }}
                >
                  {repository.description}
                </Paragraph>
              </blockquote>
              <Title level={5}>Темы</Title>
              <Paragraph>
                {repository.topics.length ? (
                  repository.topics.map((topic, index) => {
                    return (
                      <Tag
                        color="orange"
                        key={topic + index}
                        className={styles.TopicTags}
                      >
                        {topic}
                      </Tag>
                    );
                  })
                ) : (
                  <Tag>Темы не указаны</Tag>
                )}
              </Paragraph>
              <Paragraph>
                <Tag
                  bordered={false}
                  color="processing"
                  icon={<ClockCircleOutlined />}
                >
                  Дата создания:{" "}
                  {moment(repository.created_at).format("DD.MM.YYYY")}
                </Tag>
              </Paragraph>
            </Typography>
          </Card>
        </Badge.Ribbon>
      </div>
    );
  }
);

export default RepositoryCard;
