import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import React, { useCallback, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
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

  const history = useHistory();
  const { addToast } = useToast();
  const { formatMessage } = useIntl();

  const submitHandler = useCallback(
    async (data: IForgotPasswordFormData) => {
      try {
        setIsloading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required(`${formatMessage({ id: 'requiredEmail' })}`)
            .email(`${formatMessage({ id: 'validEmail' })}`),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api.post('/password/forgot', {
          email: data.email,
        });

        addToast({
          type: 'success',
          title: `${formatMessage({ id: 'successTitle' })}!`,
          description: `${formatMessage({ id: 'emailSentDescription' })}!`,
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
          description: `${formatMessage({ id: 'emailFailDescription' })}!`,
        });
      } finally {
        setIsloading(false);
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
            <h1>{formatMessage({ id: 'recoverPassword' })}</h1>

            <Input icon={FiMail} name="email" placeholder="E-mail" />

            <Button isLoading={isLoading} type="submit" disabled={isLoading}>
              {formatMessage({ id: 'recover' })}
            </Button>
          </Form>

          <Link to="/">
            <FiArrowLeft />
            {formatMessage({ id: 'backToLogin' })}
          </Link>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default ForgotPassword;
