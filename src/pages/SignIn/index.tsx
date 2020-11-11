import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useRef } from 'react';
import { FiLock, FiLogIn, FiMail } from 'react-icons/fi';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import getValidationErrors from '../../utils/getValidationErrors';
import { Background, Container, AnimationContainer, Content } from './styles';

interface SingInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const { formatMessage } = useIntl();
  const { addToast } = useToast();

  const { signIn } = useAuth();

  const submitHandler = useCallback(
    async (data: SingInFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required(`${formatMessage({ id: 'requiredEmail' })}`)
            .email(`${formatMessage({ id: 'validEmail' })}`),
          password: Yup.string().required(
            `${formatMessage({ id: 'requiredPassword' })}`,
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: `${formatMessage({ id: 'failTitle' })}!`,
          description: `${formatMessage({ id: 'authenticationFail' })}!`,
        });
      }
    },
    [formatMessage, signIn, history, addToast],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={submitHandler}>
            <h1>{formatMessage({ id: 'signInTitle' })}</h1>

            <Input icon={FiMail} name="email" placeholder="E-mail" />

            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder={formatMessage({ id: 'password' })}
            />

            <Button type="submit">
              {formatMessage({ id: 'signInButton' })}
            </Button>

            <Link to="/forgot-password">
              {formatMessage({ id: 'forgotPasswordButton' })}
            </Link>
          </Form>

          <Link to="/signup">
            <FiLogIn />
            {formatMessage({ id: 'createAccount' })}
          </Link>
        </AnimationContainer>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
