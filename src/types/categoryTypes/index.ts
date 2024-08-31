type CategoryProps = {
  element: string;
  setActiveCategory: React.Dispatch<React.SetStateAction<string>>;
  activeCategory: string;
  value?: string;
};

type CategoryType = {
  category: 'playlist' | 'track' | 'album' | 'artist' | undefined;
  value: string | undefined;
};

export type { CategoryProps, CategoryType };
