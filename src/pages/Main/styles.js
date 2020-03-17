import styled, { keyframes, css } from "styled-components";

export const Form = styled.form`
    margin-top: 30px;
    display: flex;
    flex-direction: row;

    input {
        flex: 1;
        border: 1px solid ${props => (props.error ? "red" : "#eee")};
        padding: 10px 15px;
        border-radius: 4px;
        font-size: 16px;
    }
`;

const rotate = keyframes`
from {
    transform: rotate(0deg);
}
to {
    transform: rotate(360deg);
}`;

export const SubmitButton = styled.button.attrs(props => ({
    type: "submit",
    // eslint-disable-next-line no-unneeded-ternary
    disabled: props.loading,
}))`
    background: #7159c1;
    border: 0;
    padding: 0 15px;
    margin-left: 10px;
    border-radius: 4px;
    display: block;
    justify-content: center;
    align-items: center;

    &[disabled] {
        cursor: not-allowed;
        opacity: 0.6;
    }
    ${props =>
        props.loading &&
        css`
            svg {
                animation: ${rotate} 2s linear infinite;
            }
        `}
`;

export const List = styled.ul`
    list-style: nome;
    margin-top: 30px;

    li {
        padding: 15px 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        span {
            min-width: 250px;
            font-weight: bold;
        }

        & + li {
            border-top: 1px solid #eee;
        }

        a {
            color: #7159c1;
            text-decoration: none;
        }
        button {
            background: #7159c1;
            border: 0;
            color: white;
            width: 80px;
            height: 32px;
            padding: 0 15px;
            margin-left: 10px;
            border-radius: 4px;
            display: block;
            justify-content: center;
            align-items: center;
        }
    }
`;

export const ErrorType = styled.small`
    font-size: 14px;
    color: red;
    display: block;
    margin-top: 10px;
`;
