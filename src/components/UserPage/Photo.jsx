import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const PhotoGallery = ({ userId }) => {
  const { data: posts } = useQuery({
    queryKey: ['posts', userId],
    queryFn: async () => {
      const res = await axios.get('/api/posts');
      return res.data?.data.filter(p => p.userId.toString() === userId.toString());
    },
  });

  const photos = posts?.filter(p => p.image);

  return (
    <div className="grid grid-cols-3 gap-2">
      {photos?.map(p => (
        <img key={p._id} src={p.image} className="rounded-lg object-cover h-40 w-full" />
      ))}
    </div>
  );
};

export default PhotoGallery;
