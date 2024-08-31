import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const CategoryBlock: React.FC = () => {
  const { value, category } = useParams();
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = React.useState<string>('All');
  const categories = ['All', 'Album', 'Artist', 'Track', 'Playlist'];

  React.useEffect(() => {
    if (category) {
      categories.map((v) => v.toLowerCase()).includes(category.toLowerCase())
        ? setActiveCategory(category)
        : navigate(`/search/${value}/`);
    }
  }, [category]);

  return (
    <div className="flex mb-8 flex-wrap">
      {categories.map((el) => (
        <Link
          key={el}
          to={`/search/${value}/${el === 'All' ? '' : el.toLocaleLowerCase()}`}
          onClick={() => setActiveCategory(el)}
          className={`cursor-pointer mr-2 mb-3 px-3 py-1 rounded-lg ${
            activeCategory.toLocaleLowerCase() === el.toLocaleLowerCase()
              ? 'bg-sky-600'
              : 'bg-elGrey'
          }`}
        >
          {el}
        </Link>
      ))}
    </div>
  );
};

export default CategoryBlock;
