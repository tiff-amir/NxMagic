import React, { FC } from 'react';

import NotFound from '@presentation/_pages/NotFound';
import PageWrapper from '@presentation/PageWrapper';

const IndexPage: FC = () => {
  return (
    <PageWrapper>
      <NotFound />
    </PageWrapper>
  );
};

export default IndexPage;
