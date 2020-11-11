import React, { useCallback, useRef } from 'react';
import { FiArrowLeft, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import logoImg from '../../assets/logo.svg';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { Background, Container, Content, AnimationContainer } from './styles';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const { formatMessage } = useIntl();
  const { addToast } = useToast();

  const formRef = useRef<FormHandles>(null);

  const history = useHistory();

  const submitHandler = useCallback(
    async (data: SignUpFormData) => {
      try {
        formRef.current?.setErrors({});
        const minDigits = 6;

        const schema = Yup.object().shape({
          name: Yup.string().required(
            `${formatMessage({ id: 'requiredName' })}`,
          ),
          email: Yup.string()
            .required(`${formatMessage({ id: 'requiredEmail' })}`)
            .email(`${formatMessage({ id: 'validEmail' })}`),
          password: Yup.string().min(
            minDigits,
            `${formatMessage({ id: 'minDigits' })}: ${minDigits}`,
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/users', data);

        addToast({
          type: 'success',
          title: `${formatMessage({ id: 'successTitle' })}!`,
          description: `${formatMessage({ id: 'registerSuccess' })}!`,
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
          title: `${formatMessage({ id: 'failTitle' })}!`,
          description: `${formatMessage({ id: 'registerFail' })}!`,
        });
      }
    },
    [addToast, formatMessage, history],
  );

  return (
    <Container>
      <Background />
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={submitHandler}>
            <h1>{formatMessage({ id: 'createYourAccount' })}</h1>

            <Input
              icon={FiUser}
              name="name"
              placeholder={formatMessage({ id: 'name' })}
            />
            <Input icon={FiMail} name="email" placeholder="E-mail" />
            <Input
              icon={FiLock}
              name="password"
              type="password"
              placeholder={formatMessage({ id: 'password' })}
            />

            <Button type="submit">{formatMessage({ id: 'register' })}</Button>
          </Form>

          <Link to="/signin">
            <FiArrowLeft />
            <FormattedMessage id="backToLogin" />
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignUp;
