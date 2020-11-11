import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ptBR, enUS } from 'date-fns/locale';
import { isToday, format, parseISO, isAfter } from 'date-fns';
import { FiClock, FiPower } from 'react-icons/fi';
import { FormattedMessage, useIntl } from 'react-intl';
import DayPicker, { DayModifiers } from 'react-day-picker';
import { Link } from 'react-router-dom';
import 'react-day-picker/lib/style.css';
import {
  Container,
  Header,
  HeaderContent,
  Profile,
  Content,
  Schedule,
  Calendar,
  NextAppointment,
  Section,
  Appointment,
} from './styles';
import logoImg from '../../assets/logo.svg';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';

interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}

interface Appointment {
  id: string;
  date: string;
  formattedHour: string;
  user: {
    name: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();
  const { formatMessage, locale } = useIntl();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [monthAvailability, setMonthAvailability] = useState<
    MonthAvailabilityItem[]
  >([]);

  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const dateChangeHandler = useCallback(
    (day: Date, modifiers: DayModifiers) => {
      if (modifiers.available && !modifiers.disabled) {
        setSelectedDate(day);
      }
    },
    [],
  );

  const monthChangeHandler = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api
      .get(`/providers/${user.id}/month-availability`, {
        params: {
          year: currentMonth.getFullYear(),
          month: currentMonth.getMonth() + 1,
        },
      })
      .then(response => {
        setMonthAvailability(response.data);
      });
  }, [currentMonth, user.id]);

  useEffect(() => {
    api
      .get<Appointment[]>('/appointments/me', {
        params: {
          year: selectedDate.getFullYear(),
          month: selectedDate.getMonth() + 1,
          day: selectedDate.getDate(),
        },
      })
      .then(response => {
        const formattedAppointments = response.data.map(appointment => {
          return {
            ...appointment,
            formattedHour: format(parseISO(appointment.date), 'HH:mm'),
          };
        });
        setAppointments(formattedAppointments);
      });
  }, [selectedDate]);

  const disabledDays = useMemo(() => {
    const dates = monthAvailability
      .filter(monthDay => monthDay.available === false)
      .map(monthDay => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        return new Date(year, month, monthDay.day);
      });

    return dates;
  }, [currentMonth, monthAvailability]);

  const selectDateAsText = useMemo(() => {
    const dateDescription =
      locale === 'pt-BR' ? `'Dia' dd 'de' MMMM 'de' yyyy` : `yyyy, MMMM dd`;
    return format(selectedDate, dateDescription, {
      locale: locale === 'pt-BR' ? ptBR : enUS,
    });
  }, [locale, selectedDate]);

  const selectWeekDay = useMemo(() => {
    return format(selectedDate, 'cccc', {
      locale: locale === 'pt-BR' ? ptBR : enUS,
    });
  }, [locale, selectedDate]);

  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    });
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    });
  }, [appointments]);

  const nextAppointment = useMemo(() => {
    return appointments.find(appointment => {
      return isAfter(parseISO(appointment.date), new Date());
    });
  }, [appointments]);

  return (
    <Container>
      <Header>
        <HeaderContent>
          <img src={logoImg} alt="Gobarber" />

          <Profile>
            <Link to="/profile">
              <img src={user.avatar_url} alt={user.name} />
            </Link>
            <div>
              <span>{formatMessage({ id: 'MessageToProvider' })}</span>
              <Link to="/profile">
                <strong>{`${user.name}!`}</strong>
              </Link>
            </div>
          </Profile>

          <button type="button" onClick={signOut}>
            <FiPower />
          </button>
        </HeaderContent>
      </Header>

      <Content>
        <Schedule>
          <h1>{formatMessage({ id: 'yourAppointments' })}</h1>
          <p>
            {isToday(selectedDate) && (
              <span>{formatMessage({ id: 'today' })}</span>
            )}
            <span>{selectDateAsText}</span>
            <span>{selectWeekDay}</span>
          </p>

          {isToday(selectedDate) && nextAppointment && (
            <NextAppointment>
              <strong>{formatMessage({ id: 'nextAppointment' })}</strong>
              <div>
                <img
                  src={nextAppointment.user.avatar_url}
                  alt={nextAppointment.user.name}
                />

                <strong>{nextAppointment.user.name}</strong>
                <span>
                  <FiClock />
                  {nextAppointment?.formattedHour}
                </span>
              </div>
            </NextAppointment>
          )}

          <Section>
            <strong>{formatMessage({ id: 'morning' })}</strong>

            {morningAppointments.length === 0 && (
              <p>{formatMessage({ id: 'noAppointmentInPeriod' })}</p>
            )}

            {morningAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.formattedHour}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>

          <Section>
            <strong>{formatMessage({ id: 'afternoon' })}</strong>

            {afternoonAppointments.length === 0 && (
              <p>
                <FormattedMessage id="noAppointmentInPeriod" />
              </p>
            )}

            {afternoonAppointments.map(appointment => (
              <Appointment key={appointment.id}>
                <span>
                  <FiClock />
                  {appointment.formattedHour}
                </span>

                <div>
                  <img
                    src={appointment.user.avatar_url}
                    alt={appointment.user.name}
                  />

                  <strong>{appointment.user.name}</strong>
                </div>
              </Appointment>
            ))}
          </Section>
        </Schedule>
        <Calendar>
          <DayPicker
            weekdaysShort={[
              formatMessage({ id: 'shortSunday' }),
              formatMessage({ id: 'shortMonday' }),
              formatMessage({ id: 'shortTuesday' }),
              formatMessage({ id: 'shortWednesday' }),
              formatMessage({ id: 'shortThursday' }),
              formatMessage({ id: 'shortFriday' }),
              formatMessage({ id: 'shortSaturday' }),
            ]}
            fromMonth={new Date()}
            disabledDays={[{ daysOfWeek: [0, 6] }, ...disabledDays]}
            modifiers={{
              available: { daysOfWeek: [1, 2, 3, 4, 5] },
            }}
            onMonthChange={monthChangeHandler}
            selectedDays={selectedDate}
            onDayClick={dateChangeHandler}
            months={[
              formatMessage({ id: 'january' }),
              formatMessage({ id: 'february' }),
              formatMessage({ id: 'march' }),
              formatMessage({ id: 'april' }),
              formatMessage({ id: 'may' }),
              formatMessage({ id: 'june' }),
              formatMessage({ id: 'july' }),
              formatMessage({ id: 'august' }),
              formatMessage({ id: 'september' }),
              formatMessage({ id: 'october' }),
              formatMessage({ id: 'november' }),
              formatMessage({ id: 'december' }),
            ]}
          />
        </Calendar>
      </Content>
    </Container>
  );
};

export default Dashboard;
