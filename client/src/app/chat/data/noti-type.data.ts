import { INotiType } from './../interfaces/noti-type';
import {
  faCircleInfo,
  faCircleCheck,
  faCircleExclamation,
  faComment,
  faCommentSlash,
} from '@fortawesome/free-solid-svg-icons';
interface INotiTypeData {
  [key: string]: INotiType;
}
export const NotiType: INotiTypeData = {
  info: { name: 'info', icon: faCircleInfo },
  checked: { name: 'checked', icon: faCircleCheck },
  danger: {
    name: 'danger',
    icon: faCircleExclamation,
  },
  invite: {
    name: 'invite',
    icon: faComment,
  },
};
