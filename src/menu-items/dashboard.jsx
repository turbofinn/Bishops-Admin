// assets
import { DashboardOutlined, ScheduleOutlined, ContactsOutlined, MedicineBoxOutlined, UserAddOutlined, CloseCircleOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  ContactsOutlined,
  MedicineBoxOutlined,
  UserAddOutlined,
  ScheduleOutlined,
  CloseCircleOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: '',
  type: 'group',
  children: [
    {
      id: 'appointments',
      title: 'Appointments',
      type: 'item',
      url: '/',
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
      id: 'close-booking',
      title: 'Close Booking',
      type: 'item',
      url: '/dashboard/close-booking',
      icon: icons.CloseCircleOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
