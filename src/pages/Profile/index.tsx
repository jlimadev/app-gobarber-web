import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import { useHistory, Link } from 'react-router-dom';

import { useIntl } from 'react-intl';
import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, AvatarInput } from './styles';
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();
  const { formatMessage } = useIntl();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      const minDigits = 6;
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required(
            `${formatMessage({ id: 'requiredName' })}`,
          ),
          email: Yup.string()
            .required(`${formatMessage({ id: 'requiredEmail' })}`)
            .email(`${formatMessage({ id: 'validEmail' })}`),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string()
              .required(`${formatMessage({ id: 'requiredPassword' })}`)
              .min(
                minDigits,
                `${formatMessage({ id: 'minDigits' })}: ${minDigits}`,
              ),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required(
                `${formatMessage({ id: 'requiredPassword' })}`,
              ),
              otherwise: Yup.string(),
            })
            .nullable()
            .oneOf(
              [Yup.ref('password'), null],
              `${formatMessage({ id: 'invalidConfirmation' })}`,
            ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const {
          name,
          email,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? {
                old_password,
                password,
                password_confirmation,
              }
            : {}),
        };

        const response = await api.put('/profile', formData);

        updateUser(response.data);

        history.push('/dashboard');

        addToast({
          type: 'success',
          title: `${formatMessage({ id: 'successTitle' })}!`,
          description: `${formatMessage({ id: 'profileUpdatedSuccess' })}!`,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: `${formatMessage({ id: 'failTitle' })}!`,
          description: `${formatMessage({ id: 'profileUpdatedFail' })}!`,
        });
      }
    },
    [addToast, formatMessage, history, updateUser],
  );

  const handleAvatarChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        api.patch('/users/avatar', data).then(response => {
          updateUser(response.data);

          addToast({
            type: 'success',
            title: `${formatMessage({ id: 'successTitle' })}!`,
          });
        });
      }
    },
    [addToast, formatMessage, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form
          ref={formRef}
          initialData={{
            name: user.name,
            email: user.email,
          }}
          onSubmit={handleSubmit}
        >
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor="avatar">
              <FiCamera />

              <input type="file" id="avatar" onChange={handleAvatarChange} />
            </label>
          </AvatarInput>
          <h1>{formatMessage({ id: 'profileTitle' })}</h1>

          <Input
            icon={FiUser}
            name="name"
            placeholder={formatMessage({ id: 'name' })}
          />
          <Input icon={FiMail} name="email" placeholder="E-mail" />

          <Input
            containerStyle={{ marginTop: 24 }}
            name="old_password"
            icon={FiLock}
            type="password"
            placeholder={formatMessage({ id: 'password' })}
          />

          <Input
            name="password"
            icon={FiLock}
            type="password"
            placeholder={formatMessage({ id: 'newPasswordPlaceholder' })}
          />

          <Input
            name="password_confirmation"
            icon={FiLock}
            type="password"
            placeholder={formatMessage({ id: 'confirmPasswordPlaceholder' })}
          />

          <Button type="submit">
            {formatMessage({ id: 'confirmButton' })}
          </Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
