import ContentLoader from 'react-content-loader';

const SkeletomRowCard = () => {
  return (
    <ContentLoader
      speed={2}
      width={350}
      height={64}
      viewBox="0 0 400 64"
      backgroundColor="#212121"
      foregroundColor="#4b4b4b"
      className="rounded-lg"
    >
      <rect x="0" y="0" rx="0" ry="0" width="400" height="64" />
    </ContentLoader>
  );
};

export default SkeletomRowCard;
