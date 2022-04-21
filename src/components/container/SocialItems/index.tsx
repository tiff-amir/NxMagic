import React, { FC } from 'react';

import ViewVertical from '@presentation/SocialItemsVertical';
import ViewHorizontal from '@presentation/SocialItemsHorizontal';
import appConfig from 'appConfig.json';

type Props = {
  horizontal?: boolean
  className?: string
};

const SocialItems: FC<Props> = ({ horizontal = false, className }: Props) => {
  return horizontal ? (
    <ViewHorizontal
      className={className}
      telegramHref={appConfig.webApp.links.telegram}
      twitterHref={appConfig.webApp.links.twitter}
      redditHref={appConfig.webApp.links.reddit}
    />
  ) : (
    <ViewVertical
      className={className}
      telegramHref={appConfig.webApp.links.telegram}
      twitterHref={appConfig.webApp.links.twitter}
      redditHref={appConfig.webApp.links.reddit}
    />
  );
};

export default SocialItems;
