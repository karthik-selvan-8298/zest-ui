import * as React from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  Clock,
  Copy,
  Download,
  Ellipsis,
  EllipsisVertical,
  ExternalLink,
  Eye,
  EyeOff,
  Funnel,
  Inbox,
  Info,
  Menu,
  Minus,
  Moon,
  PanelLeft,
  Pencil,
  Plus,
  Search,
  Settings,
  Star,
  Sun,
  Trash2,
  TriangleAlert,
  Upload,
  User,
  X,
  type LucideIcon,
} from 'lucide-react';
import type { ZestIconProps } from './createZestIcon';

/*
 * Zest icons are lucide-react icons wrapped with the Zest defaults:
 * 1.25em size, strokeWidth 2.2 (the Sigma/QA icon weight), decorative by
 * default (aria-hidden) unless a `title` is given.
 */
function zestify(name: string, Lucide: LucideIcon) {
  const Icon = React.forwardRef<SVGSVGElement, ZestIconProps>(function Icon(
    { size = '1.25em', title, ...props },
    ref
  ) {
    return (
      <Lucide
        ref={ref}
        size={size as number | string}
        strokeWidth={2.2}
        aria-hidden={title ? undefined : true}
        role={title ? 'img' : undefined}
        aria-label={title}
        {...props}
      />
    );
  });
  Icon.displayName = name;
  return Icon;
}

export const ChevronDownIcon = zestify('ChevronDownIcon', ChevronDown);
export const ChevronUpIcon = zestify('ChevronUpIcon', ChevronUp);
export const ChevronLeftIcon = zestify('ChevronLeftIcon', ChevronLeft);
export const ChevronRightIcon = zestify('ChevronRightIcon', ChevronRight);
export const CloseIcon = zestify('CloseIcon', X);
export const CheckIcon = zestify('CheckIcon', Check);
export const CheckCircleIcon = zestify('CheckCircleIcon', CircleCheck);
export const InfoCircleIcon = zestify('InfoCircleIcon', Info);
export const WarningTriangleIcon = zestify('WarningTriangleIcon', TriangleAlert);
export const ErrorCircleIcon = zestify('ErrorCircleIcon', CircleAlert);
export const SearchIcon = zestify('SearchIcon', Search);
export const EyeIcon = zestify('EyeIcon', Eye);
export const EyeOffIcon = zestify('EyeOffIcon', EyeOff);
export const PlusIcon = zestify('PlusIcon', Plus);
export const MinusIcon = zestify('MinusIcon', Minus);
export const MoreVerticalIcon = zestify('MoreVerticalIcon', EllipsisVertical);
export const MoreHorizontalIcon = zestify('MoreHorizontalIcon', Ellipsis);
export const MenuIcon = zestify('MenuIcon', Menu);
export const SunIcon = zestify('SunIcon', Sun);
export const MoonIcon = zestify('MoonIcon', Moon);
export const UserIcon = zestify('UserIcon', User);
export const SettingsIcon = zestify('SettingsIcon', Settings);
export const TrashIcon = zestify('TrashIcon', Trash2);
export const EditIcon = zestify('EditIcon', Pencil);
export const CopyIcon = zestify('CopyIcon', Copy);
export const ExternalLinkIcon = zestify('ExternalLinkIcon', ExternalLink);
export const CalendarIcon = zestify('CalendarIcon', Calendar);
export const ClockIcon = zestify('ClockIcon', Clock);
export const StarIcon = zestify('StarIcon', Star);
export const DownloadIcon = zestify('DownloadIcon', Download);
export const UploadIcon = zestify('UploadIcon', Upload);
export const FilterIcon = zestify('FilterIcon', Funnel);
export const ArrowRightIcon = zestify('ArrowRightIcon', ArrowRight);
export const ArrowLeftIcon = zestify('ArrowLeftIcon', ArrowLeft);
export const ArrowUpIcon = zestify('ArrowUpIcon', ArrowUp);
export const ArrowDownIcon = zestify('ArrowDownIcon', ArrowDown);
export const InboxIcon = zestify('InboxIcon', Inbox);
export const PanelLeftIcon = zestify('PanelLeftIcon', PanelLeft);
