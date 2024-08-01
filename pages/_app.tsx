import { AppProps } from 'next/app';
import Layout from '../pages/layout'; // Adjust the path if needed

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
