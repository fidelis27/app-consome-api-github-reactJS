/* eslint-disable no-useless-catch */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaGithubAlt, FaPlus, FaSpinner } from "react-icons/fa";
import api from "../../services/api";

import { ErrorType, Form, SubmitButton, List } from "./styles";
import Container from "../../components/Container";

// eslint-disable-next-line react/prefer-stateless-function
export default class Main extends Component {
    // eslint-disable-next-line react/state-in-constructor
    state = {
        newRepo: "",
        repositories: [],
        loading: false,
        error: "",
        validateForm: false,
    };

    componentDidMount() {
        const repositories = localStorage.getItem("repositories");

        if (repositories) {
            this.setState({ repositories: JSON.parse(repositories) });
        }
    }

    componentDidUpdate(_, prevState) {
        const { repositories } = this.state;

        if (prevState.repositories !== repositories) {
            localStorage.setItem("repositories", JSON.stringify(repositories));
        }
    }

    handleInputChange = e => {
        this.setState({ newRepo: e.target.value });
    };

    handleRemove = async index => {
        const { repositories } = this.state;

        repositories.splice(index, 1);
        await this.setState({ repositories });
        localStorage.setItem("repositories", JSON.stringify(repositories));
    };

    handleSubmit = async e => {
        e.preventDefault();
        this.setState({ error: "" });
        this.setState({ validateForm: false });

        try {
            const { newRepo, repositories } = this.state;
            this.setState({ loading: true });
            if (newRepo === "") {
                this.setState({ validateForm: true });
                this.setState({ error: "Informe um repositório!" });
                return;
            }

            const IfExists = repositories.find(r => r.name === newRepo);

            if (IfExists) {
                this.setState({ error: "Repositório já existe!" });
                this.setState({ validateForm: true });
                return;
            }
            const response = await api.get(`/repos/${newRepo}`);
            const data = {
                name: response.data.full_name,
            };

            this.setState({
                repositories: [...repositories, data],
                newRepo: "",
                loading: false,
            });
        } catch (error) {
            this.setState({ error: "Repositório não encontrado!" });
            this.setState({ validateForm: true });
        } finally {
            this.setState({ loading: false });
        }
    };

    render() {
        const {
            error,
            newRepo,
            repositories,
            loading,
            validateForm,
        } = this.state;

        return (
            <Container>
                <h1>
                    <FaGithubAlt />
                    Repositórios
                </h1>
                <Form onSubmit={this.handleSubmit} error={validateForm}>
                    <input
                        type="text"
                        placeholder="Adicionar repositório"
                        value={newRepo}
                        onChange={this.handleInputChange}
                    />
                    <SubmitButton loading={loading}>
                        {loading ? (
                            <FaSpinner color="#FFF" size={14} />
                        ) : (
                            <FaPlus color="#FFF" size={14} />
                        )}
                    </SubmitButton>
                </Form>
                {error && <ErrorType>{error}</ErrorType>}
                <List>
                    {repositories.map((repository, index) => (
                        <li key={repository.name}>
                            <span>{repository.name}</span>
                            <Link
                                to={`/repository/${encodeURIComponent(
                                    repository.name
                                )} `}
                            >
                                Detalhes
                            </Link>
                            <button
                                type="button"
                                onClick={() => this.handleRemove(index)}
                            >
                                Excluir
                            </button>
                        </li>
                    ))}
                </List>
            </Container>
        );
    }
}
