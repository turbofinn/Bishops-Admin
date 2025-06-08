// assets
import { DashboardOutlined, ScheduleOutlined, ContactsOutlined, MedicineBoxOutlined, UserAddOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  ContactsOutlined,
  MedicineBoxOutlined,
  UserAddOutlined,
  ScheduleOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.DashboardOutlined,
      breadcrumbs: false
    },
    {
      id: 'vaccines',
      title: 'Vaccines',
      type: 'item',
      url: '/dashboard/vaccines',
      icon: icons.MedicineBoxOutlined,
      breadcrumbs: false
    },
    {
      id: 'booking',
      title: 'Vaccine Bookings',
      type: 'item',
      url: '/dashboard/vaccine-bookings',
      icon: icons.ContactsOutlined,
      breadcrumbs: false
    },
    {
      id: 'appointments',
      title: 'Appointments',
      type: 'item',
      url: '/dashboard/appointments',
      icon: icons.ScheduleOutlined,
      breadcrumbs: false
    },
    {
      id: 'users',
      title: 'Users',
      type: 'item',
      url: '/dashboard/users',
      icon: icons.UserAddOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;