import type { RestaurantStatus, MenuItemStatus } from '@/modules/domains/food/types';
import type { OrderTrackingStep } from '@/modules/domains/food/order/OrderTrackingTimeline';
import type { CuisineIconKey } from '@/modules/domains/food/cuisine/CuisineHeroBanner';
import type { CourierVehicle } from '@/modules/domains/food/order/CourierCard';
import type { Review, ReviewSummary } from '@/modules/domains/reviews/types';

export const CUISINE_TYPES = [
  'Italian',
  'Japanese',
  'Turkish',
  'Mexican',
  'Indian',
  'American',
  'Vegan',
];

export type RestaurantData = {
  restaurantId: string;
  name: string;
  slug: string;
  description: string;
  cuisineTypes: string[];
  address: string;
  city: string;
  country: string;
  rating: number;
  reviewCount: number;
  deliveryTimeMin: number;
  deliveryTimeMax: number;
  minimumOrderAmount: number;
  deliveryFee: number;
  status: RestaurantStatus;
  promoText?: string;
};

export type FoodCategory = {
  id: string;
  label: string;
  cuisineFilter?: string;
};

export type PromoBanner = {
  id: string;
  title: string;
  subtitle: string;
  badgeLabel: string;
};

export const FOOD_CATEGORIES: FoodCategory[] = [
  { id: 'all',      label: 'All' },
  { id: 'deals',    label: 'Deals' },
  { id: 'pizza',    label: 'Pizza',   cuisineFilter: 'Italian' },
  { id: 'burgers',  label: 'Burgers', cuisineFilter: 'American' },
  { id: 'japanese', label: 'Japanese', cuisineFilter: 'Japanese' },
  { id: 'healthy',  label: 'Healthy', cuisineFilter: 'Vegan' },
  { id: 'indian',   label: 'Indian',  cuisineFilter: 'Indian' },
  { id: 'mexican',  label: 'Mexican', cuisineFilter: 'Mexican' },
];

export const PROMO_BANNERS: PromoBanner[] = [
  {
    id: 'pb-01',
    title: 'Free Delivery',
    subtitle: '$0 delivery fee on your first 5 orders',
    badgeLabel: 'New users',
  },
  {
    id: 'pb-02',
    title: '20% Off Italian',
    subtitle: 'Use code PASTA20 at checkout',
    badgeLabel: 'Limited time',
  },
  {
    id: 'pb-03',
    title: 'Double Points',
    subtitle: 'Earn 2× loyalty points this weekend',
    badgeLabel: 'Weekend deal',
  },
];

export type MenuItemData = {
  menuItemId: string;
  restaurantId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  imageUrl: string | null;
  calories: number | null;
  isVegetarian: boolean;
  isVegan: boolean;
  status: MenuItemStatus;
};

export type OrderData = {
  orderId: string;
  orderNumber: string;
  restaurantName: string;
  restaurantId: string;
  items: { name: string; quantity: number; unitPrice: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  currency: string;
  orderStatus: 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY' | 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  deliveryStatus: 'PENDING' | 'ASSIGNED' | 'PICKED_UP' | 'ON_THE_WAY' | 'DELIVERED' | 'FAILED';
  createdAt: string;
};

export const RESTAURANTS: RestaurantData[] = [
  {
    restaurantId: 'r-01',
    name: 'Bella Napoli',
    slug: 'bella-napoli',
    description: 'Authentic Neapolitan pizza and pasta made with imported Italian ingredients. Wood-fired oven, open kitchen.',
    cuisineTypes: ['Italian'],
    address: '12 Piazza Verde',
    city: 'New York',
    country: 'US',
    rating: 4.8,
    reviewCount: 312,
    deliveryTimeMin: 25,
    deliveryTimeMax: 40,
    minimumOrderAmount: 15,
    deliveryFee: 2.99,
    status: 'ACTIVE',
    promoText: '20% off',
  },
  {
    restaurantId: 'r-02',
    name: 'Sakura Bento',
    slug: 'sakura-bento',
    description: 'Modern Japanese cuisine — sushi, ramen, tempura, and seasonal specials. Fresh fish delivered daily.',
    cuisineTypes: ['Japanese'],
    address: '88 Sakura Lane',
    city: 'New York',
    country: 'US',
    rating: 4.6,
    reviewCount: 198,
    deliveryTimeMin: 30,
    deliveryTimeMax: 50,
    minimumOrderAmount: 20,
    deliveryFee: 3.49,
    status: 'ACTIVE',
  },
  {
    restaurantId: 'r-03',
    name: 'Istanbul Kebab House',
    slug: 'istanbul-kebab-house',
    description: 'Traditional Turkish grills, mezze plates, and fresh lavash bread baked in a stone oven.',
    cuisineTypes: ['Turkish'],
    address: '7 Bosphorus Street',
    city: 'New York',
    country: 'US',
    rating: 4.5,
    reviewCount: 241,
    deliveryTimeMin: 20,
    deliveryTimeMax: 35,
    minimumOrderAmount: 12,
    deliveryFee: 1.99,
    status: 'ACTIVE',
    promoText: 'Free delivery',
  },
  {
    restaurantId: 'r-04',
    name: 'Taco Loco',
    slug: 'taco-loco',
    description: 'Street-style tacos, burritos, and loaded nachos with freshly-made salsas and guacamole.',
    cuisineTypes: ['Mexican'],
    address: '55 Salsa Avenue',
    city: 'New York',
    country: 'US',
    rating: 4.3,
    reviewCount: 175,
    deliveryTimeMin: 15,
    deliveryTimeMax: 30,
    minimumOrderAmount: 10,
    deliveryFee: 1.49,
    status: 'ACTIVE',
  },
  {
    restaurantId: 'r-05',
    name: 'Spice Garden',
    slug: 'spice-garden',
    description: 'Aromatic Indian curries, biryanis, and tandoori specialties prepared with hand-ground spice blends.',
    cuisineTypes: ['Indian', 'Vegan'],
    address: '23 Masala Road',
    city: 'New York',
    country: 'US',
    rating: 4.7,
    reviewCount: 289,
    deliveryTimeMin: 35,
    deliveryTimeMax: 55,
    minimumOrderAmount: 18,
    deliveryFee: 2.49,
    status: 'ACTIVE',
  },
  {
    restaurantId: 'r-06',
    name: 'The Burger Joint',
    slug: 'the-burger-joint',
    description: 'Classic American smash burgers, loaded fries, and thick milkshakes. No-frills, all flavor.',
    cuisineTypes: ['American'],
    address: '101 Liberty Blvd',
    city: 'New York',
    country: 'US',
    rating: 4.4,
    reviewCount: 430,
    deliveryTimeMin: 20,
    deliveryTimeMax: 35,
    minimumOrderAmount: 12,
    deliveryFee: 0,
    status: 'ACTIVE',
    promoText: 'Free delivery',
  },
];

export const MENU_ITEMS: MenuItemData[] = [
  {
    menuItemId: 'mi-01',
    restaurantId: 'r-01',
    categoryId: 'cat-pizza',
    name: 'Margherita Pizza',
    description: 'Classic San Marzano tomato base, fior di latte mozzarella, fresh basil, extra virgin olive oil.',
    price: 14.5,
    currency: 'USD',
    imageUrl: null,
    calories: 780,
    isVegetarian: true,
    isVegan: false,
    status: 'AVAILABLE',
  },
  {
    menuItemId: 'mi-02',
    restaurantId: 'r-01',
    categoryId: 'cat-pasta',
    name: 'Tagliatelle al Ragù',
    description: 'Hand-rolled egg pasta with a slow-cooked Bolognese sauce, Parmigiano Reggiano.',
    price: 16.0,
    currency: 'USD',
    imageUrl: null,
    calories: 920,
    isVegetarian: false,
    isVegan: false,
    status: 'AVAILABLE',
  },
  {
    menuItemId: 'mi-03',
    restaurantId: 'r-02',
    categoryId: 'cat-sushi',
    name: 'Salmon Sashimi (8 pcs)',
    description: 'Premium Atlantic salmon, thinly sliced, served with pickled ginger and wasabi.',
    price: 18.0,
    currency: 'USD',
    imageUrl: null,
    calories: 340,
    isVegetarian: false,
    isVegan: false,
    status: 'AVAILABLE',
  },
  {
    menuItemId: 'mi-04',
    restaurantId: 'r-02',
    categoryId: 'cat-ramen',
    name: 'Tonkotsu Ramen',
    description: 'Rich pork bone broth, chashu pork, soft-boiled egg, bamboo shoots, nori, and green onion.',
    price: 15.5,
    currency: 'USD',
    imageUrl: null,
    calories: 850,
    isVegetarian: false,
    isVegan: false,
    status: 'AVAILABLE',
  },
  {
    menuItemId: 'mi-05',
    restaurantId: 'r-03',
    categoryId: 'cat-grill',
    name: 'Mixed Kebab Plate',
    description: 'Adana and shish kebabs served with rice pilaf, grilled vegetables, and warm lavash.',
    price: 19.0,
    currency: 'USD',
    imageUrl: null,
    calories: 1100,
    isVegetarian: false,
    isVegan: false,
    status: 'AVAILABLE',
  },
  {
    menuItemId: 'mi-06',
    restaurantId: 'r-04',
    categoryId: 'cat-tacos',
    name: 'Street Tacos (3 pcs)',
    description: 'Corn tortillas, marinated carne asada, fresh pico de gallo, guacamole, and cilantro.',
    price: 11.5,
    currency: 'USD',
    imageUrl: null,
    calories: 560,
    isVegetarian: false,
    isVegan: false,
    status: 'AVAILABLE',
  },
  {
    menuItemId: 'mi-07',
    restaurantId: 'r-05',
    categoryId: 'cat-curry',
    name: 'Palak Paneer',
    description: 'Cottage cheese cubes in a spiced spinach gravy, served with basmati rice and naan.',
    price: 13.5,
    currency: 'USD',
    imageUrl: null,
    calories: 620,
    isVegetarian: true,
    isVegan: false,
    status: 'AVAILABLE',
  },
  {
    menuItemId: 'mi-08',
    restaurantId: 'r-05',
    categoryId: 'cat-biryani',
    name: 'Vegetable Biryani',
    description: 'Fragrant basmati rice layered with seasonal vegetables, saffron, and fried onions.',
    price: 12.0,
    currency: 'USD',
    imageUrl: null,
    calories: 710,
    isVegetarian: true,
    isVegan: true,
    status: 'AVAILABLE',
  },
  {
    menuItemId: 'mi-09',
    restaurantId: 'r-06',
    categoryId: 'cat-burgers',
    name: 'Classic Smash Burger',
    description: 'Double smashed beef patty, American cheese, pickles, caramelized onions, secret sauce.',
    price: 13.0,
    currency: 'USD',
    imageUrl: null,
    calories: 950,
    isVegetarian: false,
    isVegan: false,
    status: 'AVAILABLE',
  },
  {
    menuItemId: 'mi-10',
    restaurantId: 'r-06',
    categoryId: 'cat-sides',
    name: 'Loaded Cheese Fries',
    description: 'Thick-cut fries smothered in cheddar cheese sauce, crispy bacon bits, and jalapeños.',
    price: 7.5,
    currency: 'USD',
    imageUrl: null,
    calories: 680,
    isVegetarian: false,
    isVegan: false,
    status: 'AVAILABLE',
  },
];

export const SAMPLE_ORDERS: OrderData[] = [
  {
    orderId: 'ord-01',
    orderNumber: 'YD-20260508-001',
    restaurantName: 'Bella Napoli',
    restaurantId: 'r-01',
    items: [
      { name: 'Margherita Pizza', quantity: 1, unitPrice: 14.5 },
      { name: 'Tagliatelle al Ragù', quantity: 1, unitPrice: 16.0 },
    ],
    subtotal: 30.5,
    deliveryFee: 2.99,
    total: 33.49,
    currency: 'USD',
    orderStatus: 'DELIVERED',
    deliveryStatus: 'DELIVERED',
    createdAt: '2026-05-07T18:30:00Z',
  },
  {
    orderId: 'ord-02',
    orderNumber: 'YD-20260508-002',
    restaurantName: 'Sakura Bento',
    restaurantId: 'r-02',
    items: [
      { name: 'Salmon Sashimi (8 pcs)', quantity: 1, unitPrice: 18.0 },
      { name: 'Tonkotsu Ramen', quantity: 2, unitPrice: 15.5 },
    ],
    subtotal: 49.0,
    deliveryFee: 3.49,
    total: 52.49,
    currency: 'USD',
    orderStatus: 'ON_THE_WAY',
    deliveryStatus: 'ON_THE_WAY',
    createdAt: '2026-05-08T12:10:00Z',
  },
  {
    orderId: 'ord-03',
    orderNumber: 'YD-20260508-003',
    restaurantName: 'Taco Loco',
    restaurantId: 'r-04',
    items: [
      { name: 'Street Tacos (3 pcs)', quantity: 2, unitPrice: 11.5 },
    ],
    subtotal: 23.0,
    deliveryFee: 1.49,
    total: 24.49,
    currency: 'USD',
    orderStatus: 'CANCELLED',
    deliveryStatus: 'FAILED',
    createdAt: '2026-05-06T20:45:00Z',
  },
  {
    orderId: 'ord-04',
    orderNumber: 'YD-20260508-004',
    restaurantName: 'Spice Garden',
    restaurantId: 'r-05',
    items: [
      { name: 'Palak Paneer', quantity: 1, unitPrice: 13.5 },
      { name: 'Vegetable Biryani', quantity: 1, unitPrice: 12.0 },
    ],
    subtotal: 25.5,
    deliveryFee: 2.49,
    total: 27.99,
    currency: 'USD',
    orderStatus: 'PREPARING',
    deliveryStatus: 'ASSIGNED',
    createdAt: '2026-05-08T13:55:00Z',
  },
];

/* =========================================================
   ORDER TRACKING (live status detail page)
========================================================= */

export type OrderTrackingData = {
  orderId: string;
  steps: OrderTrackingStep[];
  estimatedArrival: string;
  destinationLabel: string;
  courier: {
    name: string;
    avatarUrl?: string;
    rating: number;
    reviewCount: number;
    vehicle: CourierVehicle;
    vehicleLabel?: string;
    online: boolean;
  };
};

export const ORDER_TRACKINGS: Record<string, OrderTrackingData> = {
  'ord-02': {
    orderId: 'ord-02',
    estimatedArrival: new Date(Date.now() + 14 * 60_000).toISOString(),
    destinationLabel: '221B Baker St · Apt 4',
    courier: {
      name: 'Marco Bianchi',
      rating: 4.92,
      reviewCount: 1834,
      vehicle: 'scooter',
      vehicleLabel: 'Vespa · 124-AB-89',
      online: true,
    },
    steps: [
      {
        key: 'PLACED',
        label: 'Order placed',
        description: 'We have received your order.',
        occurredAt: '2026-05-08T12:10:00Z',
      },
      {
        key: 'PREPARING',
        label: 'Restaurant is preparing',
        description: 'Sakura Bento accepted your order at 12:11.',
        occurredAt: '2026-05-08T12:12:00Z',
      },
      {
        key: 'READY',
        label: 'Ready for pickup',
        description: 'Marco is on his way to the restaurant.',
        occurredAt: '2026-05-08T12:34:00Z',
      },
      {
        key: 'ON_THE_WAY',
        label: 'Out for delivery',
        description: 'Your order is on the way.',
        occurredAt: '2026-05-08T12:42:00Z',
        isCurrent: true,
      },
      {
        key: 'DELIVERED',
        label: 'Delivered',
      },
    ],
  },
  'ord-04': {
    orderId: 'ord-04',
    estimatedArrival: new Date(Date.now() + 38 * 60_000).toISOString(),
    destinationLabel: '99 Olive Ave',
    courier: {
      name: 'Lia Patel',
      rating: 4.78,
      reviewCount: 612,
      vehicle: 'bike',
      online: true,
    },
    steps: [
      { key: 'PLACED', label: 'Order placed', occurredAt: '2026-05-08T13:55:00Z' },
      {
        key: 'PREPARING',
        label: 'Restaurant is preparing',
        description: 'Spice Garden accepted your order.',
        occurredAt: '2026-05-08T13:57:00Z',
        isCurrent: true,
      },
      { key: 'READY',      label: 'Ready for pickup' },
      { key: 'ON_THE_WAY', label: 'Out for delivery' },
      { key: 'DELIVERED',  label: 'Delivered' },
    ],
  },
};

/* =========================================================
   CUISINES (for /cuisines/[slug] page)
========================================================= */

export type CuisineData = {
  slug: string;
  name: string;
  icon: CuisineIconKey;
  description: string;
  imageUrl?: string;
  cuisineFilter: string;
  featuredDishIds: string[];
};

export const CUISINES: CuisineData[] = [
  {
    slug: 'italian',
    name: 'Italian',
    icon: 'pizza',
    description: 'Wood-fired pizzas, fresh handmade pasta, and Mediterranean classics from the best Italian kitchens in town.',
    imageUrl: 'https://picsum.photos/seed/cuisine-italian/1600/600',
    cuisineFilter: 'Italian',
    featuredDishIds: ['mi-01', 'mi-02'],
  },
  {
    slug: 'japanese',
    name: 'Japanese',
    icon: 'bowl',
    description: 'Sushi, sashimi, ramen, and seasonal specials made by chefs trained in traditional Japanese technique.',
    imageUrl: 'https://picsum.photos/seed/cuisine-japanese/1600/600',
    cuisineFilter: 'Japanese',
    featuredDishIds: ['mi-03', 'mi-04'],
  },
  {
    slug: 'turkish',
    name: 'Turkish',
    icon: 'grill',
    description: 'Smoky kebabs, mezze plates, and stone-oven lavash — straight from Anatolian home kitchens.',
    imageUrl: 'https://picsum.photos/seed/cuisine-turkish/1600/600',
    cuisineFilter: 'Turkish',
    featuredDishIds: ['mi-05'],
  },
  {
    slug: 'indian',
    name: 'Indian',
    icon: 'pepper',
    description: 'Aromatic curries, biryanis, and tandoori — hand-ground spice blends and chef-led flavor.',
    imageUrl: 'https://picsum.photos/seed/cuisine-indian/1600/600',
    cuisineFilter: 'Indian',
    featuredDishIds: ['mi-07', 'mi-08'],
  },
  {
    slug: 'american',
    name: 'American',
    icon: 'drumstick',
    description: 'Smash burgers, loaded fries, thick milkshakes — the comfort-food classics, done right.',
    imageUrl: 'https://picsum.photos/seed/cuisine-american/1600/600',
    cuisineFilter: 'American',
    featuredDishIds: ['mi-09', 'mi-10'],
  },
];

export const FEATURED_DISH_IMAGES: Record<string, string> = {
  'mi-01': 'https://picsum.photos/seed/dish-mi-01/800/600',
  'mi-02': 'https://picsum.photos/seed/dish-mi-02/800/600',
  'mi-03': 'https://picsum.photos/seed/dish-mi-03/800/600',
  'mi-04': 'https://picsum.photos/seed/dish-mi-04/800/600',
  'mi-05': 'https://picsum.photos/seed/dish-mi-05/800/600',
  'mi-06': 'https://picsum.photos/seed/dish-mi-06/800/600',
  'mi-07': 'https://picsum.photos/seed/dish-mi-07/800/600',
  'mi-08': 'https://picsum.photos/seed/dish-mi-08/800/600',
  'mi-09': 'https://picsum.photos/seed/dish-mi-09/800/600',
  'mi-10': 'https://picsum.photos/seed/dish-mi-10/800/600',
};

/* =========================================================
   RESTAURANT REVIEWS
   Keyed by restaurant slug so the reviews page can do a
   constant-time lookup.
========================================================= */

export const RESTAURANT_REVIEW_SUMMARIES: Record<string, ReviewSummary> = {
  'bella-napoli': {
    subjectId: 'r-01',
    average: 4.8,
    total: 312,
    distribution: { 1: 4, 2: 6, 3: 18, 4: 64, 5: 220 },
  },
  'sakura-bento': {
    subjectId: 'r-02',
    average: 4.6,
    total: 198,
    distribution: { 1: 3, 2: 5, 3: 14, 4: 52, 5: 124 },
  },
  'istanbul-kebab-house': {
    subjectId: 'r-03',
    average: 4.5,
    total: 241,
    distribution: { 1: 6, 2: 9, 3: 22, 4: 78, 5: 126 },
  },
  'taco-loco': {
    subjectId: 'r-04',
    average: 4.3,
    total: 175,
    distribution: { 1: 5, 2: 9, 3: 24, 4: 60, 5: 77 },
  },
  'spice-garden': {
    subjectId: 'r-05',
    average: 4.7,
    total: 289,
    distribution: { 1: 4, 2: 7, 3: 18, 4: 70, 5: 190 },
  },
  'the-burger-joint': {
    subjectId: 'r-06',
    average: 4.4,
    total: 430,
    distribution: { 1: 10, 2: 18, 3: 52, 4: 140, 5: 210 },
  },
};

export const RESTAURANT_REVIEWS: Record<string, Review[]> = {
  'bella-napoli': [
    {
      reviewId: 'rev-bn-01',
      subjectId: 'r-01',
      author: { name: 'Maya P.', avatarUrl: 'https://i.pravatar.cc/64?img=47' },
      rating: 5,
      title: 'Best margherita in town',
      body:
        'Wood-fired crust was perfectly charred and the buffalo mozzarella tasted like it just arrived from Italy. The basil was fragrant — a clear sign of fresh ingredients. Arrived hot in 25 minutes.',
      createdAt: '2026-04-12T10:30:00Z',
      helpfulCount: 24,
      verified: true,
    },
    {
      reviewId: 'rev-bn-02',
      subjectId: 'r-01',
      author: { name: 'Daniel R.', avatarUrl: null },
      rating: 4,
      title: 'Solid pasta, slightly long wait',
      body:
        'The tagliatelle al ragù was rich and the portion size was generous. Took about 50 minutes on a Friday night which is a bit longer than the estimate, but worth it.',
      createdAt: '2026-04-05T19:15:00Z',
      helpfulCount: 9,
      verified: true,
    },
    {
      reviewId: 'rev-bn-03',
      subjectId: 'r-01',
      author: { name: 'Olivia K.', avatarUrl: 'https://i.pravatar.cc/64?img=12' },
      rating: 5,
      title: null,
      body:
        'Consistent favourite. Their gluten-free option is genuinely good — most places get it wrong, but the crust here actually has structure.',
      createdAt: '2026-03-22T13:45:00Z',
      helpfulCount: 18,
      verified: false,
    },
    {
      reviewId: 'rev-bn-04',
      subjectId: 'r-01',
      author: { name: 'Brandon T.', avatarUrl: null },
      rating: 3,
      title: 'Good food, packaging needs work',
      body:
        "Flavours were spot-on but the pizza box was a little flimsy and the crust got steam-soggy by the time it arrived. Would order again but maybe pick up instead.",
      createdAt: '2026-03-08T20:20:00Z',
      helpfulCount: 4,
      verified: true,
    },
  ],
  'sakura-bento': [
    {
      reviewId: 'rev-sb-01',
      subjectId: 'r-02',
      author: { name: 'Hannah S.', avatarUrl: 'https://i.pravatar.cc/64?img=32' },
      rating: 5,
      title: 'Ramen is unreal',
      body:
        'The tonkotsu broth has clearly been simmered for hours — deep, milky, and not at all greasy. The chashu was meltingly tender. A staple for cold nights.',
      createdAt: '2026-04-18T11:00:00Z',
      helpfulCount: 31,
      verified: true,
    },
    {
      reviewId: 'rev-sb-02',
      subjectId: 'r-02',
      author: { name: 'Yusuf A.', avatarUrl: null },
      rating: 4,
      title: 'Fresh sushi, packed neatly',
      body:
        'Salmon nigiri was beautifully fresh. One piece had a slightly thicker rice base than the others, but it was a minor thing. Will order again.',
      createdAt: '2026-04-02T17:30:00Z',
      helpfulCount: 6,
      verified: false,
    },
  ],
  'istanbul-kebab-house': [
    {
      reviewId: 'rev-ik-01',
      subjectId: 'r-03',
      author: { name: 'Eylül D.', avatarUrl: 'https://i.pravatar.cc/64?img=5' },
      rating: 5,
      title: 'Tastes like home',
      body:
        'The adana kebab was perfectly spiced and the lavash was clearly freshly baked. They even included extra pickles and onion — proper Istanbul style.',
      createdAt: '2026-04-15T18:00:00Z',
      helpfulCount: 22,
      verified: true,
    },
    {
      reviewId: 'rev-ik-02',
      subjectId: 'r-03',
      author: { name: 'Marcus L.', avatarUrl: null },
      rating: 4,
      title: null,
      body:
        'Generous portions and the lentil soup is a great starter. Delivery was on the faster side of the estimate, which was a nice surprise.',
      createdAt: '2026-04-09T12:25:00Z',
      helpfulCount: 11,
      verified: true,
    },
  ],
  'taco-loco': [
    {
      reviewId: 'rev-tl-01',
      subjectId: 'r-04',
      author: { name: 'Sofia M.', avatarUrl: 'https://i.pravatar.cc/64?img=23' },
      rating: 4,
      title: 'Salsa game on point',
      body:
        'Three different salsas, each with a distinct flavour. The carne asada tacos were tender. Would have been a 5 if the tortillas had been a touch warmer.',
      createdAt: '2026-04-10T20:00:00Z',
      helpfulCount: 14,
      verified: true,
    },
    {
      reviewId: 'rev-tl-02',
      subjectId: 'r-04',
      author: { name: 'Jordan B.', avatarUrl: null },
      rating: 5,
      title: null,
      body:
        'Loaded nachos are the move. Cheese, beans, jalapeños, lime crema — everything in balance. Cleaned the plate.',
      createdAt: '2026-03-30T19:10:00Z',
      helpfulCount: 8,
      verified: false,
    },
  ],
  'spice-garden': [
    {
      reviewId: 'rev-sg-01',
      subjectId: 'r-05',
      author: { name: 'Priya N.', avatarUrl: 'https://i.pravatar.cc/64?img=44' },
      rating: 5,
      title: 'Vegan biryani is fantastic',
      body:
        'The basmati was fragrant and each layer was packed with vegetables and saffron. They got the spice level exactly right — bold, not just hot.',
      createdAt: '2026-04-17T13:30:00Z',
      helpfulCount: 27,
      verified: true,
    },
  ],
  'the-burger-joint': [
    {
      reviewId: 'rev-bj-01',
      subjectId: 'r-06',
      author: { name: 'Tom W.', avatarUrl: null },
      rating: 5,
      title: 'Smash burger done right',
      body:
        'Thin, crispy edges, perfect melty cheese, soft brioche bun. Fries were crisp and seasoned well. Free delivery just sealed it.',
      createdAt: '2026-04-19T20:45:00Z',
      helpfulCount: 35,
      verified: true,
    },
    {
      reviewId: 'rev-bj-02',
      subjectId: 'r-06',
      author: { name: 'Aisha M.', avatarUrl: 'https://i.pravatar.cc/64?img=15' },
      rating: 4,
      title: 'Great milkshake',
      body:
        'Burger was solid and the vanilla milkshake was thick enough to need a spoon — exactly how it should be. Would love a small-side fries option.',
      createdAt: '2026-04-11T21:05:00Z',
      helpfulCount: 7,
      verified: false,
    },
  ],
};
