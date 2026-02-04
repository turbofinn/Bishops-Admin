import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import AuthGuard from 'components/AuthGuard';
import PaymentTable from '../sections/dashboard/default/PaymentTable';
import PaymentPage from '../pages/PaymentPage/PaymentPage';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const VaccinePage = Loadable(lazy(() => import('pages/vaccines/VaccinePage')));
const BookingPage = Loadable(lazy(() => import('pages/bookings/BookingPage')));
const AppointmentPage = Loadable(lazy(() => import('pages/appointments/AppointmentPage')));
const Users = Loadable(lazy(() => import('pages/users/UserPage')));
const CloseBookingPage = Loadable(lazy(() => import('pages/closeBooking/CloseBookingPage')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <DashboardLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/',
      element: <AppointmentPage />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
          element: <DashboardDefault />
        },
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
          path: 'close-booking',
          element: <CloseBookingPage />
        },
        {
          path: 'users',
          element: <Users />
        }
      ]
    }
  ]
};

export default MainRoutes;
