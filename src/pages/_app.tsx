import 'normalize.css/normalize.css';
import 'react-toastify/dist/ReactToastify.css';
import React, { FC } from 'react';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';

import { getData } from 'src/store';
import Layout from '../components/Layout';

import './styles/variables.scss';
import './styles/theme-dark.scss';
import './styles/theme.scss';
import './styles/general.scss';

const { store } = getData();

type Props = {
  props: { [key: string]: string | boolean | null| number | undefined },
};

const App: FC<AppProps & Props> = ({ Component, props }) => {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...props} />
      </Layout>
    </Provider>
  );
};

export default App;
