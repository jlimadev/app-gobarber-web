import React, { useCallback, useEffect, useState } from 'react';
import { FiArrowRight, FiHome, FiPower } from 'react-icons/fi';
import { useIntl } from 'react-intl';
import { Link, useHistory } from 'react-router-dom';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import {
  Barbers,
  BarbersContainer,
  Container,
  Content,
  Header,
  HeaderButtonsContainer,
  HeaderContent,
  Profile,
  Section,
} from './styles';

interface Providers {
  id: string;
  name: string;
  avatar_url: string;
}

const Providers: React.FC = () => {
  const history = useHistory();
  const { formatMessage } = useIntl();
  const { user, signOut } = useAuth();

  const [providers, setProviders] = useState<Providers[]>([]);

  useEffect(() => {
    api.get('/providers').then(response => {
      setProviders(response.data);
    });
  }, []);

  const goBack = useCallback(() => {
    history.goBack();
  }, [history]);

  const navigateToCreateAppointment = useCallback(() => {
    history.push('/create-appointment', providers);
  }, [history, providers]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="Gobarber" onClick={goBack} />

          <Profile>
            <Link to="/profile">
              <img src={user.avatar_url} alt={user.name} />
            </Link>

            <div>
              <span>{`${formatMessage({ id: 'findYourBarber' })},`}</span>
              <Link to="/profile">
                <strong>{`${user.name}!`}</strong>
              </Link>
            </div>
          </Profile>
          <HeaderButtonsContainer>
            <button
              type="button"
              onClick={goBack}
              title={formatMessage({ id: 'home' })}
            >
              <FiHome />
            </button>
            <button
              type="button"
              onClick={signOut}
              title={formatMessage({ id: 'signOut' })}
            >
              <FiPower />
            </button>
          </HeaderButtonsContainer>
        </HeaderContent>
      </Header>
      <Content>
        <BarbersContainer>
          <Section>
            <strong>{formatMessage({ id: 'chooseYourBarber' })}</strong>

            {providers.length === 0 && (
              <p>{formatMessage({ id: 'noProvidersFound' })}</p>
            )}

            {providers.map(provider => (
              <Barbers key={provider.id}>
                <button type="button" onClick={navigateToCreateAppointment}>
                  <img src={provider.avatar_url} alt={provider.name} />

                  <strong>{provider.name}</strong>

                  <button
                    type="button"
                    onClick={navigateToCreateAppointment}
                    title={formatMessage({ id: 'home' })}
                  >
                    <FiArrowRight />
                  </button>
                </button>
              </Barbers>
            ))}
          </Section>
        </BarbersContainer>
      </Content>
    </Container>
  );
};

export default Providers;
