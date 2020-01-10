import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import api from "../../services/api";

import { Loading, Owner, IssueList } from "./styles";
import Container from "../../components/Container";

function Repository({ match }) {
    const [repository, setRepository] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    Repository.propTypes = {
        match: PropTypes.shape({
            params: PropTypes.shape({
                repository: PropTypes.string,
            }),
        }).isRequired,
    };
    useEffect(() => {
        const repoName = decodeURIComponent(match.params.repository);
        async function fetchData() {
            const [repo, iss] = await Promise.all([
                api.get(`/repos/${repoName}`),
                api.get(`/repos/${repoName.trim()}/issues`, {
                    params: {
                        state: "open",
                        per_page: 5,
                    },
                }),
            ]);
            setRepository(repo.data);
            setIssues(iss.data);
            setLoading(false);
        }

        fetchData();
    });

    if (loading) {
        return <Loading>Carregando</Loading>;
    }
    return (
        <>
            {}
            <Container>
                <Owner>
                    <Link to="/">Voltar a página inicial</Link>
                    <img
                        src={repository.owner.avatar_url}
                        alt={repository.owner.login}
                    />
                    <h1>{repository.name}</h1>
                    <p>{repository.description}</p>
                </Owner>

                <IssueList>
                    {issues.map(issue => (
                        <li key={String(issue.id)}>
                            <img
                                src={issue.user.avatar_url}
                                alt={issue.user.login}
                            />
                            <div>
                                <strong>
                                    <a href={issue.html_url}>{issue.title}</a>
                                    {issue.labels.map(label => (
                                        <span key={String(label.id)}>
                                            {label.name}
                                        </span>
                                    ))}
                                </strong>
                                <p>{issue.user.login}</p>
                            </div>
                        </li>
                    ))}
                </IssueList>
            </Container>
            );
        </>
    );
}

export default Repository;
