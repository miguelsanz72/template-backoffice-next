import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface RightPanelProps {
  titleKey?: string;
  descriptionKey?: string;
  imageSrc?: string;
  imageAlt?: string;
  translationNamespace?: string;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  titleKey = 'welcome_title',
  descriptionKey = 'welcome_description',
  imageSrc = '/images/illustrations/auth-illustration.svg',
  imageAlt = 'Authentication illustration',
  translationNamespace = 'Auth.register',
}) => {
  const t = useTranslations(translationNamespace);

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center p-12">
      <div className="max-w-lg">
        <div className="text-white space-y-6">
          <h2 className="text-3xl font-bold">{t(titleKey)}</h2>
          <p className="text-lg">{t(descriptionKey)}</p>
        </div>
        <div className="mt-8">
          <Image src={imageSrc} alt={imageAlt} width={500} height={400} className="w-full h-auto" />
        </div>
      </div>
    </div>
  );
};
