import type { Metadata } from 'next';
import { Button } from '@/modules/ui/Button';
import { ChatInputBar } from '@/modules/domains/ai/chat/ChatInputBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faPenNib, faMagnifyingGlass, faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { THEME_TITLES } from '@/libs/config/showcase.config';

export const metadata: Metadata = {
  title: { absolute: THEME_TITLES.ai },
};

const SUGGESTIONS = [
  { icon: faCode,             label: 'Kod Yaz',     description: 'Hata ayıkla, açıkla ya da kod üret' },
  { icon: faPenNib,           label: 'Yaz',         description: 'Makale, e-posta veya gönderi hazırla' },
  { icon: faMagnifyingGlass,  label: 'Analiz Et',   description: 'İçeriği özetle veya analiz et' },
  { icon: faLightbulb,        label: 'Fikir Üret',  description: 'Yeni fikirler ve çözümler bul' },
];

export default function AIThemePage() {
  return (
    <div className="h-full flex flex-col bg-surface-base">
      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-0">
        <h1 className="text-3xl font-semibold text-text-primary mb-8 text-center">
          Size nasıl yardımcı olabilirim?
        </h1>

        {/* Suggestion cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mb-4">
          {SUGGESTIONS.map((s) => (
            <Button
              key={s.label}
              as="a"
              href="/theme/ai/playground"
              variant="outline"
              className="flex-col items-start gap-2 h-auto p-4 rounded-2xl text-left"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-overlay">
                <FontAwesomeIcon icon={s.icon} className="w-4 h-4 text-text-secondary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-primary">{s.label}</p>
                <p className="text-xs text-text-secondary mt-0.5 leading-snug font-normal">{s.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="shrink-0 pb-6">
        <ChatInputBar
          placeholder="Umay'a mesaj yaz"
          modelName="Umay hata yapabilir. Önemli bilgileri doğrulayın."
        />
      </div>
    </div>
  );
}
