export const products = [
  {
    id: '1',
    name: 'Heavyweight Tee',
    price: 68,
    category: 'Tees',
    description:
      'Cut from 320gsm 100% combed cotton. Thick, structured, and built to hold its shape wash after wash. Drop-shoulder fit with a slightly boxy silhouette — the kind of tee you reach for first.',
    details: ['320gsm combed cotton', 'Drop-shoulder, boxy fit', 'Pre-shrunk', 'Machine wash cold, tumble dry low'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Vintage Black', 'Washed White', 'Slate Grey', 'Brick Red'],
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    ],
    featured: true,
    new: true,
  },
  {
    id: '2',
    name: 'Relaxed Hoodie',
    price: 135,
    category: 'Hoodies',
    description:
      'Garment-dyed in a 400gsm French terry blend. The slightly oversized fit and dropped shoulders make this the hoodie you never want to take off. Kangaroo pocket, ribbed cuffs.',
    details: ['400gsm French terry (80% cotton, 20% polyester)', 'Garment-dyed finish', 'Oversized fit, dropped shoulders', 'Kangaroo pocket', 'Machine wash cold inside out'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Carbon Black', 'Vintage Cream', 'Stone', 'Forest'],
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80',
      'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80',
    ],
    featured: true,
    new: true,
  },
  {
    id: '3',
    name: 'Baggy Sweatpants',
    price: 115,
    category: 'Sweatpants',
    description:
      'A wide-leg sweatpant with a relaxed, lived-in feel. Elasticated waistband, side seam pockets, and a tapered ankle. Pairs with everything in the collection.',
    details: ['380gsm fleece (85% cotton, 15% polyester)', 'Wide-leg, tapered ankle', 'Elasticated waistband with drawcord', 'Side pockets + back patch pocket', 'Machine wash cold'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Ash Grey', 'Ecru', 'Mocha'],
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80',
    ],
    featured: true,
    new: false,
  },
  {
    id: '4',
    name: 'Graphic Tee — Vestige Script',
    price: 75,
    category: 'Tees',
    description:
      'The same heavyweight 320gsm blank with a bold Vestige script print across the chest. Screen-printed in-house for a crisp, durable graphic that doesn\'t crack.',
    details: ['320gsm combed cotton', 'Water-based screen print', 'Drop-shoulder, boxy fit', 'Machine wash cold, inside out'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Vintage Black', 'Washed White'],
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    ],
    featured: false,
    new: true,
  },
  {
    id: '5',
    name: 'Track Jacket',
    price: 155,
    category: 'Outerwear',
    description:
      'A zip-through track jacket in a waffle-knit cotton blend. Subtle tonal branding at the chest. Pairs naturally with the Baggy Sweatpants for a full set.',
    details: ['Waffle-knit cotton blend', 'Full-zip with ribbed collar', 'Chest pocket + side welt pockets', 'Relaxed fit', 'Machine wash cold'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Cream', 'Khaki'],
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
    ],
    featured: true,
    new: false,
  },
  {
    id: '6',
    name: 'Longsleeve Tee',
    price: 88,
    category: 'Tees',
    description:
      'The same heavyweight blank as the core tee, extended to a long sleeve. Ribbed cuffs, clean construction, no print — just the silhouette.',
    details: ['320gsm combed cotton', 'Drop-shoulder, relaxed fit', 'Ribbed cuffs', 'Machine wash cold'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Vintage Black', 'Bone', 'Brick Red', 'Midnight Navy'],
    image: 'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1622470953794-aa9c70b0fb9d?w=800&q=80',
    ],
    featured: false,
    new: true,
  },
  {
    id: '7',
    name: 'Cargo Shorts',
    price: 98,
    category: 'Bottoms',
    description:
      'Mid-thigh length cargo shorts in a washed canvas twill. Double-knee panels and multiple utility pockets. A summer staple built for real wear.',
    details: ['100% washed canvas twill', 'Relaxed fit, mid-thigh length', 'Multiple cargo pockets', 'Elasticated waistband + drawcord', 'Machine wash cold'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Washed Black', 'Sand', 'Olive'],
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4057?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4057?w=800&q=80',
    ],
    featured: false,
    new: false,
  },
  {
    id: '8',
    name: 'Snapback Cap',
    price: 45,
    category: 'Accessories',
    description:
      'Structured six-panel snapback in heavyweight brushed cotton. Embroidered Vestige logo at the front panel, tonal snapback closure.',
    details: ['Heavyweight brushed cotton', 'Structured 6-panel', 'Embroidered logo', 'One size — adjustable snapback'],
    sizes: ['One Size'],
    colors: ['Black', 'Washed White', 'Khaki'],
    image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=800&q=80',
    ],
    featured: false,
    new: false,
  },
];

export const categories = ['All', 'Tees', 'Hoodies', 'Sweatpants', 'Outerwear', 'Bottoms', 'Accessories'];

export function getProductById(id) {
  return products.find((p) => p.id === id) || null;
}

export function getFeaturedProducts() {
  return products.filter((p) => p.featured);
}

export function getNewArrivals() {
  return products.filter((p) => p.new);
}
