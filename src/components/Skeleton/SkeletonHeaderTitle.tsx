import ContentLoader from 'react-content-loader';

const SkeletonHeaderTitle = () => {
  return (
    <ContentLoader
      speed={2}
      width={450}
      height={200}
      viewBox="0 0 400 150"
      backgroundColor="#212121"
      foregroundColor="#4b4b4b"
      className="h-20 md:h-[200px]"
    >
      <rect className="hidden md:block" x="10" y="0" rx="0" ry="0" width="380" height="20" />
      <rect x="10" y="45" rx="0" ry="0" width="380" height="60" />
      <rect className="hidden md:block" x="10" y="120" rx="0" ry="0" width="380" height="20" />
    </ContentLoader>
  );
};

export default SkeletonHeaderTitle;
