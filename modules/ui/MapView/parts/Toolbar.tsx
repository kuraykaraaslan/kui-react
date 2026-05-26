'use client';
import { Button } from '@/modules/ui/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faRoute,
  faLayerGroup,
  faPlus,
  faXmark,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons';

type ToolbarProps = {
  addMode: boolean;
  onToggleAddMode: () => void;
  hasZones: boolean;
  showZones: boolean;
  onToggleZones: () => void;
  hasRoutes: boolean;
  showRoutes: boolean;
  onToggleRoutes: () => void;
};

/**
 * Add-marker + zone visibility + route visibility toggles. Kept identical to
 * the EJS partial under modules/ui/MapView/partials/_controls.ejs.
 *
 * TODO M3: search bar (geocoder).
 * TODO M4: locate-me, layer toggle, draw tools.
 */
export function Toolbar({
  addMode,
  onToggleAddMode,
  hasZones,
  showZones,
  onToggleZones,
  hasRoutes,
  showRoutes,
  onToggleRoutes,
}: ToolbarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        size="xs"
        variant={addMode ? 'primary' : 'outline'}
        title={addMode ? 'İşaretçi eklemeyi iptal et' : 'Haritaya işaretçi ekle'}
        onClick={onToggleAddMode}
        iconLeft={<FontAwesomeIcon icon={addMode ? faXmark : faPlus} aria-hidden="true" />}
        iconRight={<FontAwesomeIcon icon={faLocationDot} aria-hidden="true" />}
      >
        {addMode ? 'İptal' : 'İşaretçi Ekle'}
      </Button>

      {hasZones && (
        <Button
          size="xs"
          variant={showZones ? 'primary' : 'outline'}
          title={showZones ? 'Bölgeleri gizle' : 'Bölgeleri göster'}
          onClick={onToggleZones}
          iconLeft={<FontAwesomeIcon icon={showZones ? faEye : faEyeSlash} aria-hidden="true" />}
          iconRight={<FontAwesomeIcon icon={faLayerGroup} aria-hidden="true" />}
        >
          Bölgeler
        </Button>
      )}

      {hasRoutes && (
        <Button
          size="xs"
          variant={showRoutes ? 'primary' : 'outline'}
          title={showRoutes ? 'Rotaları gizle' : 'Rotaları göster'}
          onClick={onToggleRoutes}
          iconLeft={<FontAwesomeIcon icon={showRoutes ? faEye : faEyeSlash} aria-hidden="true" />}
          iconRight={<FontAwesomeIcon icon={faRoute} aria-hidden="true" />}
        >
          Rotalar
        </Button>
      )}

      {addMode && (
        <span className="text-xs text-primary font-medium animate-pulse">
          Haritaya tıklayarak işaretçi ekleyin
        </span>
      )}
    </div>
  );
}
