// mockExploreVideos.tsx

export interface ExploreVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  description: string;
  restaurant: {
    id: string;
    name: string;
    logo: string;
    deliveryTime: string;
    deliveryFee: string;
  };
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
}

const mockExploreVideos: ExploreVideo[] = [
  {
    id: "v1",
    // Using sample video URLs that are publicly accessible
    videoUrl:
      "https://cdn.pixabay.com/video/2020/04/15/36006-409042491_large.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80",
    title: "The perfect burger doesn't exi-",
    description:
      "This juicy burger with melted cheese and caramelized onions is a must-try!",
    restaurant: {
      id: "r1",
      name: "Burger King",
      logo: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=100&q=80",
      deliveryTime: "15-25 min",
      deliveryFee: "$1.99",
    },
    user: {
      id: "u1",
      username: "foodie_adventures",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=foodie1",
    },
    stats: {
      likes: 4523,
      comments: 128,
      shares: 89,
    },
  },
  {
    id: "v2",
    // Using sample video URLs that are publicly accessible
    videoUrl:
      "https://cdn.pixabay.com/video/2020/04/15/36006-409042491_large.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
    title: "Pizza perfection in every slice",
    description:
      "Handcrafted pizza with fresh mozzarella, basil, and our secret sauce!",
    restaurant: {
      id: "r2",
      name: "Pizza Hut",
      logo: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=100&q=80",
      deliveryTime: "20-30 min",
      deliveryFee: "$2.99",
    },
    user: {
      id: "u2",
      username: "pizza_lover",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pizza2",
    },
    stats: {
      likes: 8721,
      comments: 342,
      shares: 156,
    },
  },
  {
    id: "v3",
    // Using sample video URLs that are publicly accessible
    videoUrl:
      "https://cdn.pixabay.com/video/2020/04/15/36006-409042491_large.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&q=80",
    title: "Donut heaven 🍩",
    description:
      "Freshly made donuts with a variety of toppings - the perfect sweet treat!",
    restaurant: {
      id: "r3",
      name: "Sweet Treats",
      logo: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=100&q=80",
      deliveryTime: "15-20 min",
      deliveryFee: "$1.49",
    },
    user: {
      id: "u3",
      username: "sweet_tooth",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sweet3",
    },
    stats: {
      likes: 3254,
      comments: 98,
      shares: 45,
    },
  },
  {
    id: "v4",
    // Using sample video URLs that are publicly accessible
    videoUrl:
      "https://cdn.pixabay.com/video/2020/04/15/36006-409042491_large.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&q=80",
    title: "Ramen that warms the soul",
    description:
      "Authentic Japanese ramen with rich broth, tender pork, and perfectly cooked noodles.",
    restaurant: {
      id: "r4",
      name: "Ramen House",
      logo: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=100&q=80",
      deliveryTime: "25-35 min",
      deliveryFee: "$3.49",
    },
    user: {
      id: "u4",
      username: "noodle_master",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=noodle4",
    },
    stats: {
      likes: 6782,
      comments: 231,
      shares: 112,
    },
  },
  {
    id: "v5",
    // Using sample video URLs that are publicly accessible
    videoUrl:
      "https://cdn.pixabay.com/video/2020/04/15/36006-409042491_large.mp4",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80",
    title: "Healthy eating never looked so good",
    description:
      "Fresh, colorful salad with homemade dressing - perfect for a light lunch!",
    restaurant: {
      id: "r5",
      name: "Green Eats",
      logo: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&q=80",
      deliveryTime: "10-20 min",
      deliveryFee: "$2.49",
    },
    user: {
      id: "u5",
      username: "health_foodie",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=health5",
    },
    stats: {
      likes: 2341,
      comments: 87,
      shares: 34,
    },
  },
];

export default mockExploreVideos;
