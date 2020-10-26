import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useRef, useState } from 'react';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';
import { AnimationContainer, Background, Container, Content } from './styles';

interface IForgotPasswordFormData {
  email: string;
}

const ForgotPassword: React.FC = () => {
  const [isLoading, setIsloading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const submitHandler = useCallback(
    async (data: IForgotPasswordFormData) => {
      try {
        setIsloading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: 'E-mail de recupação enviado!',
          description:
            'E-mail de recupação enviado, cheque sua caixa de e-mail!',
        });

        history.push('/signin');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na recupeção de senha',
          description: 'Erro ao fazer a recuperação de senha, tente novamente',
        });
      } finally {
        setIsloading(false);
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={submitHandler}>
            <h1>Recuperação de Senha</h1>

            <Input icon={FiMail} name="email" placeholder="E-mail" />

            <Button isLoading={isLoading} type="submit" disabled={isLoading}>
              Recuperar Senha
            </Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para o Logon
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default ForgotPassword;
