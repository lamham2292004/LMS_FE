import {
  faHouse,
  faFile,
  faGraduationCap,
  faChartLine,
  faCalendar,
  faBell,
  faCheckSquare,
  faUsers,
  faComment,
  faCog,
} from '@fortawesome/free-solid-svg-icons';
import { type IModule } from '@/features/layout/types';

export interface IModuleSection {
  label: string;
  items: IModule[];
}

export const moduleSections: IModuleSection[] = [
  {
    label: 'DASHBOARD',
    items: [
      {
        name: 'Analytics',
        icon: faChartLine,
        href: '/authorized/dashboard',
      },
      {
        name: 'Documents',
        icon: faFile,
        href: '/authorized/dashboard/documents',
      },
      {
        name: 'Calendar',
        icon: faCalendar,
        href: '/authorized/dashboard/calendar',
      },
      {
        name: 'Notifications',
        icon: faBell,
        href: '/authorized/dashboard/notifications',
      },
      {
        name: 'Tasks',
        icon: faCheckSquare,
        href: '/authorized/dashboard/tasks',
      },
    ],
  },
  {
    label: 'RELATIONSHIPS',
    items: [
      {
        name: 'Departments',
        icon: faUsers,
        href: '/authorized/dashboard/departments',
      },
      {
        name: 'Blog',
        icon: faFile,
        href: '/authorized/dashboard/blog',
      },
      {
        name: 'Chats',
        icon: faComment,
        href: '/authorized/dashboard/chats',
      },
    ],
  },
  {
    label: 'CONFIGURATION',
    items: [
      {
        name: 'Lms',
        icon: faGraduationCap,
        href: '/authorized/lms',
      },
      {
        name: 'Settings',
        icon: faCog,
        href: '/authorized/dashboard/settings',
      },
    ],
  },
];

// Keep old moduleList for backward compatibility
export const moduleList: IModule[] = [
  {
    name: 'Home',
    icon: faHouse,
    href: '/authorized/dashboard',
  },
  {
    name: 'Documents',
    icon: faFile,
    href: '/authorized/dashboard/documents',
  },
  {
    name: 'LMS',
    icon: faGraduationCap,
    href: '/authorized/lms',
  },
];