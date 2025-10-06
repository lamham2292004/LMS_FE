import { type IconDefinition } from '@fortawesome/free-solid-svg-icons';

export interface IModule {
  name: string;
  icon: IconDefinition;
  href: string;
  children?: IModule[];
}