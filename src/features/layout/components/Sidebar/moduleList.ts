import {
  faHouse,
  faFile,
  faGraduationCap,
} from '@fortawesome/free-solid-svg-icons';
import { type IModule } from '@/features/layout/types';

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