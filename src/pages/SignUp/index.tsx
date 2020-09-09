import React from 'react';
import { FiArrowLeft, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Background, Container, Content } from './styles';

const SignUp: React.FC = () => {
  const submitHandler = (data: object): void => {
    console.log(data);
  };

  return (
    <Container>
      <Background />
      <Content>
        <img src={logoImg} alt="GoBarber" />

        <Form onSubmit={submitHandler}>
          <h1>Faça seu cadastro</h1>

          <Input icon={FiUser} name="name" placeholder="Nome" />
          <Input icon={FiMail} name="email" placeholder="E-mail" />
          <Input
            icon={FiLock}
            name="password"
            type="password"
            placeholder="Password"
          />

          <Button type="submit">Cadastrar</Button>
        </Form>

        <a href="/">
          <FiArrowLeft />
          Voltar para o Logon
        </a>
      </Content>
    </Container>
  );
};

export default SignUp;
