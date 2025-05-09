// assets
import { DashboardOutlined } from '@ant-design/icons';
import { ContactsOutlined } from '@ant-design/icons';
import { MedicineBoxOutlined } from '@ant-design/icons';
import { UserAddOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  ContactsOutlined,
  MedicineBoxOutlined,
  UserAddOutlined
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
      title: 'Bookings',
      type: 'item',
      url: '/dashboard/bookings',
      icon: icons.ContactsOutlined,
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