import ContentLoader from 'react-content-loader';

const SkeletonHeaderPicture = () => (
  <ContentLoader
    speed={2}
    width={192}
    backgroundColor="#212121"
    foregroundColor="#4b4b4b"
    className="aspect-square md:max-h-48 "
  >
    <rect x="0" y="0" rx="0" ry="0" width="192" height="192" />
  </ContentLoader>
);

export default SkeletonHeaderPicture;
