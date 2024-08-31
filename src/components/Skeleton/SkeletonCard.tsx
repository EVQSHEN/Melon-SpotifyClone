import ContentLoader from 'react-content-loader';

const SkeletonCard = () => (
  <ContentLoader
    className="rounded-lg min-w-[100px]"
    speed={2}
    width="100%"
    viewBox="0 0 314 400"
    backgroundColor="#212121"
    foregroundColor="#4b4b4b"
  >
    <rect x="0" y="0" rx="0" ry="0" width="100%" height="100%" />
  </ContentLoader>
);

export default SkeletonCard;
