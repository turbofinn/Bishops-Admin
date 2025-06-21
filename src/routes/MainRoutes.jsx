import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import PaymentTable from '../sections/dashboard/default/PaymentTable';
import PaymentPage from '../pages/PaymentPage/PaymentPage';
import ServicePage from '../pages/Services/ServicePage';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const VaccinePage = Loadable(lazy(() => import('pages/vaccines/VaccinePage')));
const BookingPage = Loadable(lazy(() => import('pages/bookings/BookingPage')));
const AppointmentPage = Loadable(lazy(() => import('pages/appointments/AppointmentPage')));
const Users = Loadable(lazy(() => import('pages/users/UserPage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
      element: <DashboardDefault />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        }
        ,
        {
          path: 'vaccine-bookings',
          element: <BookingPage />
        },
        {
          path: 'appointments',
          element: <AppointmentPage />
        },
        {
          path: 'Vaccines',
          element: <VaccinePage />
        },

        {
          path: 'Payments',
          element: <PaymentPage />
        },

        {
          path: 'Services',
          element: <ServicePage />
        }
        ,
        {
          path: 'users',
          element: <Users />
        }
      ]
    }
  ]
};

export default MainRoutes;