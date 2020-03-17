import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import api from "../../services/api";

import { ButtonFilter, PageActions, Loading, Owner, IssueList } from "./styles";
import Container from "../../components/Container";

export default class Repository extends Component {
    constructor() {
        super();
        this.state = {
            repository: {},
            issues: [],
            loading: true,
            indexFilter: 0,
            page: 1,
            filters: [
                { state: "all", label: "Todas", active: true },
                { state: "open", label: "Abertas", active: false },
                { state: "closed", label: "Fechadas", active: false },
            ],
        };
    }

    async componentDidMount() {
        const { match } = this.props;
        const { filters } = this.state;

        const repoName = decodeURIComponent(match.params.repository);
        const [repo, iss] = await Promise.all([
            api.get(`/repos/${repoName}`),
            api.get(`/repos/${repoName.trim()}/issues`, {
                params: {
                    state: filters.find(f => f.active).state,
                    per_page: 5,
                },
            }),
        ]);
        this.setState({ repository: repo.data });
        this.setState({ issues: iss.data });
        this.setState({ loading: false });
    }

    loadIssues = async () => {
        const { match } = this.props;
        const { page, indexFilter, filters } = this.state;

        const repoName = decodeURIComponent(match.params.repository);
        const response = await api.get(`/repos/${repoName.trim()}/issues`, {
            params: {
                state: filters[indexFilter].state,
                per_page: 5,
                page,
            },
        });

        this.setState({ issues: response.data });
    };

    handleFilterClick = async index => {
        await this.setState({ indexFilter: index });
        this.loadIssues();
    };

    handlePage = async action => {
        const { page } = this.state;
        await this.setState({ page: action === "back" ? page - 1 : page + 1 });
        this.loadIssues();
    };

    render() {
        const { page, loading, issues, filters, repository } = this.state;
        if (loading) {
            return <Loading>Carregando</Loading>;
        }
        return (
            <>
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
                    <ButtonFilter>
                        {filters.map((filter, index) => (
                            <button
                                type="button"
                                key={filter.label}
                                onClick={() => this.handleFilterClick(index)}
                            >
                                {filter.label}
                            </button>
                        ))}
                    </ButtonFilter>
                    <IssueList>
                        {issues.map(issue => (
                            <li key={String(issue.id)}>
                                <img
                                    src={issue.user.avatar_url}
                                    alt={issue.user.login}
                                />
                                <div>
                                    <strong>
                                        <a href={issue.html_url}>
                                            {issue.title}
                                        </a>
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
                    <PageActions>
                        <button
                            type="button"
                            disabled={page < 2}
                            onClick={() => this.handlePage("back")}
                        >
                            Voltar
                        </button>
                        <span>Página {page}</span>
                        <button
                            type="button"
                            onClick={() => this.handlePage("next")}
                        >
                            Próximo
                        </button>
                    </PageActions>
                </Container>
            </>
        );
    }
}

Repository.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            repository: PropTypes.string,
        }),
    }).isRequired,
};

// https://api.github.com/users/fidelis27/repos
