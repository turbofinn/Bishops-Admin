import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));
const VaccinePage = Loadable(lazy(() => import('pages/vaccines/VaccinePage')));
const BookingPage = Loadable(lazy(() => import('pages/bookings/BookingPage')));
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
          path: 'bookings',
          element: <BookingPage/>
        },
        {
          path: 'Vaccines',
          element: <VaccinePage/>
        }
        ,
        {
          path: 'users',
          element: <Users/>
        }
      ]
    }
  ]
};

export default MainRoutes;