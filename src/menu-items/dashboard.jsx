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
      id: 'appointments',
      title: 'Appointments',
      type: 'item',
      url: '/dashboard/appointments',
      icon: icons.ScheduleOutlined,
      breadcrumbs: false
    },
    {
      id: 'vaccines',
      title: 'Vaccine list',
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
      id: 'payments',
      title: 'Payments',
      type: 'item',
      url: '/dashboard/payments',
      icon: icons.ScheduleOutlined,
      breadcrumbs: false
    },
    {
      id: 'Services',
      title: 'Services',
      type: 'item',
      url: '/dashboard/Services',
      icon: icons.UserAddOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
