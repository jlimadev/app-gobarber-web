import React, { ButtonHTMLAttributes } from 'react';
import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  ...restProps
}) => (
  <Container type="button" isLoading {...restProps}>
    {isLoading ? 'Carregando' : children}
  </Container>
);

export default Button;
