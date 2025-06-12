import Head from "next/head";

interface ComponentProps {
  title: string;
}
const WebPageTitle = ({ title }: ComponentProps) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta property="og:title" content="AI-Driven Skin Analysis" key="title" />
      </Head>
    </div>
  );
};
export default WebPageTitle;
