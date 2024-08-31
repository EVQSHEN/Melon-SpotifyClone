import ContentLoader from 'react-content-loader';

const SkeletonTrackRow = () => {
  return (
    <ContentLoader
      speed={2}
      width={400}
      height={120}
      viewBox="0 0 400 150"
      backgroundColor="#212121"
      foregroundColor="#4b4b4b"
    >
      <rect x="0" y="20" rx="5" ry="5" width="30" height="15" />

      <rect x="60" y="0" rx="0" ry="0" width="48" height="48" />
      <rect x="120" y="40" rx="0" ry="0" width="250" height="20" />
      <rect x="120" y="0" rx="0" ry="0" width="400" height="20" />
    </ContentLoader>
  );
};

export default SkeletonTrackRow;
