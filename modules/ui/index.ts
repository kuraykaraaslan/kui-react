// Explicit named re-exports for every component in the ui layer.
// Using explicit names (not `export * from`) lets bundlers tree-shake
// unused components out of downstream consumer bundles.

// Atoms
export { Avatar, AvatarGroup } from './Avatar';
export { Badge } from './Badge';
export { BrandLogo } from './BrandLogo';
export { Button } from './Button';
export { Checkbox } from './Checkbox';
export { DatePicker } from './DatePicker';
export { FileInput } from './FileInput';
export { Input } from './Input';
export { Select } from './Select';
export type { SelectOption } from './Select';
export { SkipLink, LiveRegion, Announcer } from './SkipLink';
export { Spinner } from './Spinner';
export { StarRating } from './StarRating';
export { StatCard } from './StatCard';
export { Textarea } from './Textarea';
export { Toggle } from './Toggle';

// Molecules
export { AdvancedDataTable } from './AdvancedDataTable';
export { AlertBanner } from './AlertBanner';
export type { AlertAction } from './AlertBanner';
export { Breadcrumb } from './Breadcrumb';
export type { BreadcrumbItem } from './Breadcrumb';
export { ButtonGroup } from './ButtonGroup';
export type { ButtonGroupItem } from './ButtonGroup';
export { Card } from './Card';
export { CheckboxGroup } from './CheckboxGroup';
export { ComboBox } from './ComboBox';
export type { ComboBoxOption } from './ComboBox';
export { ContentScoreBar } from './ContentScoreBar';
export type { ScoreRule } from './ContentScoreBar';
export { DataTable } from './DataTable';
export { DateRangePicker, TimePicker } from './DateRangePicker';
export type { DateRange } from './DateRangePicker';
export { Drawer } from './Drawer';
export { DropdownMenu } from './DropdownMenu';
export type { DropdownItem } from './DropdownMenu';
export { EmptyState } from './EmptyState';
export { MapView } from './MapView';
export type { MapVariant, MapTooltipField, MapTooltipData, MapMarker, MapZone, MapRoute } from './MapView';
export { Modal } from './Modal';
export { MultiSelect } from './MultiSelect';
export type { MultiSelectOption } from './MultiSelect';
export { PageHeader } from './PageHeader';
export type { PageHeaderAction } from './PageHeader';
export { Pagination } from './Pagination';
export { Popover } from './Popover';
export { RadioGroup } from './RadioGroup';
export type { RadioOption } from './RadioGroup';
export { SearchBar } from './SearchBar';
export { ServerDataTable } from './ServerDataTable';
export { SkeletonLine, SkeletonAvatar, SkeletonText, SkeletonCard, SkeletonTableRow } from './Skeleton';
export { Slider } from './Slider';
export { Stepper } from './Stepper';
export type { StepItem } from './Stepper';
export { TabButton } from './TabButton';
export { TabGroup } from './TabGroup';
export type { Tab } from './TabGroup';
export { Table } from './Table';
export type { TableColumn } from './Table';
export { TagInput } from './TagInput';
export { Toast, ToastProvider, ToastRegion } from './Toast';
export type { ToastAction, ToastPosition } from './Toast';
export { Tooltip } from './Tooltip';
export { TreeView } from './TreeView';
export type { TreeNode } from './TreeView';
export { VideoPlayer } from './VideoPlayer';
export type { QualityOption, SubtitleTrack, AudioTrackOption } from './VideoPlayer';
export { ViewToggle } from './ViewToggle';
export type { ViewOrientation } from './ViewToggle';

// Lazy wrappers (next/dynamic, ssr:false) for heavy components
export { LazyDataTable, LazyAdvancedDataTable, LazyServerDataTable, LazyDateRangePicker, LazyMapView, LazyVideoPlayer } from './lazy';

// Zustand toast store — programmatic API
export { useToastStore, toast, getEffectiveDuration } from './Toast.store';
export type { ToastItem, ToastVariant, ToastItemAction } from './Toast.store';
