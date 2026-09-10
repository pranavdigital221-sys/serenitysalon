import { Product, Category, Testimonial, BlogPost, FAQItem } from '../types';
import {
  IKONIC_MAIN_DATA_URI,
  IKONIC_FEATURES_DATA_URI,
  IKONIC_NOZZLES_DATA_URI,
  IKONIC_LIFESTYLE_DATA_URI,
} from '../assets/ikonicImages';
import {
  DEAL_MASK_DATA_URI,
  DEAL_HAIR_DATA_URI,
} from '../assets/dealImages';
import {
  CATEGORY_ASSETS,
  PRODUCT_ASSETS,
  BLOG_ASSETS,
  AVATAR_ASSETS,
  BANNER_ASSETS,
} from '../utils/assets';

export const CATEGORIES: Category[] = [
  {
    id: 'skincare',
    name: 'Skin Care',
    slug: 'skincare',
    itemCount: 84,
    image: CATEGORY_ASSETS.skincare,
    description: 'Botanical serums, hydrating creams, and gentle cleansers for dewy skin.',
  },
  {
    id: 'makeup',
    name: 'Makeup',
    slug: 'makeup',
    itemCount: 62,
    image: CATEGORY_ASSETS.makeup,
    description: 'Mineral tints, vegan lip elixirs, and radiant clean foundations.',
  },
  {
    id: 'haircare',
    name: 'Hair Care',
    slug: 'haircare',
    itemCount: 48,
    image: CATEGORY_ASSETS.haircare,
    description: 'Nourishing scalp oils, botanical masks, and sulfate-free revitalizers.',
  },
  {
    id: 'fragrances',
    name: 'Fragrances',
    slug: 'fragrances',
    itemCount: 35,
    image: CATEGORY_ASSETS.fragrances,
    description: 'Pure botanical essences, floral waters, and artisanal perfume oils.',
  },
  {
    id: 'nailcare',
    name: 'Nail Care',
    slug: 'nailcare',
    itemCount: 29,
    image: CATEGORY_ASSETS.nailcare,
    description: 'Non-toxic 10-free polishes, cuticle elixirs, and fortifying treatments.',
  },
  {
    id: 'bodycare',
    name: 'Body Care',
    slug: 'bodycare',
    itemCount: 41,
    image: CATEGORY_ASSETS.bodycare,
    description: 'Rich whipped body butters, exfoliating botanical scrubs, and bath soaks.',
  },
  {
    id: 'accessories',
    name: 'Accessories & Tools',
    slug: 'accessories',
    itemCount: 22,
    image: CATEGORY_ASSETS.accessories,
    description: 'Gua Sha stones, jade rollers, silk hair ties, and organic cotton rounds.',
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'ikonic-blaze-blk-001',
    sku: 'IKONIC-BLAZE-BLK-001',
    name: 'Ikonic Professional Blaze Hair Dryer Black',
    brand: 'Ikonic Professional',
    category: 'Hair Care',
    subCategory: 'Professional Hair Dryer',
    price: 2301,
    originalPrice: 2950,
    discountPercentage: 22,
    rating: 4.3,
    reviewsCount: 482,
    image: IKONIC_MAIN_DATA_URI,
    secondaryImage: IKONIC_FEATURES_DATA_URI,
    galleryImages: [
      IKONIC_MAIN_DATA_URI,
      IKONIC_FEATURES_DATA_URI,
      IKONIC_NOZZLES_DATA_URI,
      IKONIC_LIFESTYLE_DATA_URI,
    ],
    isBestSeller: true,
    isNewArrival: true,
    tag: '22% OFF',
    description: 'Blaze through your everyday styling with this powerful 2000W hair dryer designed to deliver salon-quality blowouts at home. It provides flexible heat and speed control for convenient everyday styling.',
    volume: '1 Unit (Includes 2 Nozzles)',
    skinType: ['All Hair Types', 'Professional Styling'],
    warranty: '1 Year Warranty',
    features: [
      'Powerful 1800W–2000W motor',
      'High velocity motor',
      'Heat and speed control',
      'Overheat protection',
      'Superior low-noise operation',
      'Ergonomic design',
      '1.8 meter cord',
      'Convenient hanging loop',
      '2 interchangeable styling nozzles',
      '1-year warranty',
    ],
    specifications: {
      'Brand': 'Ikonic Professional',
      'Product Type': 'Hair Dryer',
      'Color': 'Black',
      'Power': '1800W–2000W',
      'Voltage': '220V–240V',
      'Frequency': '50Hz–60Hz',
      'Heat Settings': '3 Heat Settings',
      'Speed Settings': '2 Speed Settings',
      'Cord Length': '1.8 meters',
      'Warranty': '1 Year',
    },
    inStock: true,
  },
  {
    id: 'prod-1',
    name: 'Rosewater & Hyaluronic Radiance Elixir',
    category: 'Skin Care',
    price: 799,
    originalPrice: 1599,
    discountPercentage: 50,
    rating: 4.9,
    reviewsCount: 184,
    image: PRODUCT_ASSETS.prodRosewater,
    secondaryImage: PRODUCT_ASSETS.prodRosewaterSec,
    isBestSeller: true,
    isNewArrival: false,
    tag: '50% OFF',
    description: 'A soothing, multi-molecular weight hyaluronic acid serum infused with organic damask rose hydrosol to quench thirsty skin and deliver long-lasting plumpness.',
    volume: '50ml / 1.7 fl oz',
    skinType: ['Dry', 'Normal', 'Sensitive'],
    ingredients: ['Rosa Damascena Flower Water', 'Sodium Hyaluronate', 'Niacinamide', 'Aloe Barbadensis Leaf Extract', 'Centella Asiatica'],
    inStock: true,
  },
  {
    id: 'prod-2',
    name: 'Cold-Pressed Botanical Botanical Face Oil',
    category: 'Skin Care',
    price: 999,
    originalPrice: 1249,
    discountPercentage: 20,
    rating: 4.8,
    reviewsCount: 142,
    image: PRODUCT_ASSETS.prodFaceOil,
    isBestSeller: true,
    isNewArrival: false,
    tag: '20% OFF',
    description: 'Golden jojoba, rosehip seed, and squalane harmonized with calming blue tansy to lock in hydration and restore your natural barrier.',
    volume: '30ml / 1.0 fl oz',
    skinType: ['All Skin Types', 'Combination', 'Dry'],
    ingredients: ['Simmondsia Chinensis Seed Oil', 'Rosa Canina Fruit Oil', 'Squalane', 'Tanacetum Annuum Flower Oil', 'Vitamin E'],
    inStock: true,
  },
  {
    id: 'prod-3',
    name: 'Silk Petal Dewy Cushion Blush & Tint',
    category: 'Make Up',
    price: 599,
    originalPrice: 749,
    discountPercentage: 20,
    rating: 4.7,
    reviewsCount: 96,
    image: PRODUCT_ASSETS.prodBlushTint,
    isBestSeller: true,
    isNewArrival: false,
    tag: '20% OFF',
    description: 'A breathable, buildable cream blush that melts effortlessly into cheeks and lips for an ethereal, fresh-from-the-garden flush.',
    volume: '15g / 0.5 oz',
    skinType: ['All Skin Types'],
    ingredients: ['Caprylic/Capric Triglyceride', 'Mica', 'Shea Butter', 'Castor Seed Oil', 'Iron Oxides'],
    inStock: true,
  },
  {
    id: 'prod-4',
    name: 'Rosemary & Meadowfoam Scalp Revival Elixir',
    category: 'Hair Care',
    price: 899,
    originalPrice: 1199,
    discountPercentage: 25,
    rating: 4.9,
    reviewsCount: 215,
    image: PRODUCT_ASSETS.prodScalpElixir,
    isBestSeller: true,
    isNewArrival: false,
    tag: '25% OFF',
    description: 'Stimulating rosemary leaf extract with cold-pressed meadowfoam and peppermint to soothe sensitive scalps and encourage thicker, shinier hair.',
    volume: '60ml / 2.0 fl oz',
    skinType: ['All Hair Types'],
    ingredients: ['Rosmarinus Officinalis Leaf Extract', 'Limnanthes Alba Seed Oil', 'Argania Spinosa Kernel Oil', 'Mentha Piperita Oil'],
    inStock: true,
  },
  {
    id: 'prod-5',
    name: 'Velvet Jasmine & Neroli Botanical Eau de Parfum',
    category: 'Fragrances',
    price: 1999,
    originalPrice: 2499,
    discountPercentage: 20,
    rating: 5.0,
    reviewsCount: 88,
    image: PRODUCT_ASSETS.prodPerfume,
    isBestSeller: true,
    isNewArrival: false,
    tag: 'Best Seller',
    description: 'Hand-blended organic perfumer alcohol infused with night-blooming white jasmine, sunlit neroli blossoms, and warm grounding sandalwood.',
    volume: '50ml / 1.7 fl oz',
    skinType: ['All'],
    ingredients: ['Organic Grain Alcohol', 'Jasminum Officinale Extract', 'Citrus Aurantium Amara Flower Oil', 'Santalum Album Oil'],
    inStock: true,
  },
  {
    id: 'prod-6',
    name: 'Clarifying Matcha & Green Clay Gentle Cleanser',
    category: 'Skin Care',
    price: 549,
    originalPrice: 699,
    discountPercentage: 21,
    rating: 4.8,
    reviewsCount: 167,
    image: PRODUCT_ASSETS.prodCleanser,
    isBestSeller: true,
    isNewArrival: false,
    description: 'A non-stripping micro-foaming cleansing cream loaded with ceremonial grade green tea matcha and kaolin clay to purify pores while maintaining skin pH.',
    volume: '150ml / 5.1 fl oz',
    skinType: ['Oily', 'Combination', 'Normal'],
    ingredients: ['Camellia Sinensis Leaf Water', 'Kaolin Clay', 'Coco-Glucoside', 'Glycerin', 'Centella Asiatica'],
    inStock: true,
  },
  {
    id: 'prod-7',
    name: 'Botanical 10-Free Sheer Nude Nail Strengthener',
    category: 'Nail Care',
    price: 399,
    originalPrice: 549,
    discountPercentage: 27,
    rating: 4.6,
    reviewsCount: 63,
    image: PRODUCT_ASSETS.prodNailPolish,
    isBestSeller: true,
    isNewArrival: false,
    tag: 'Clean Polish',
    description: 'Infused with horsetail extract, garlic oil, and biotin to reinforce weak, peeling nails while giving a luminous French-nude sheer shine.',
    volume: '15ml / 0.5 fl oz',
    skinType: ['All Nails'],
    ingredients: ['Butyl Acetate', 'Ethyl Acetate', 'Nitrocellulose', 'Biotin', 'Equisetum Arvense Extract'],
    inStock: true,
  },
  {
    id: 'prod-8',
    name: 'Whipped Shea & Golden Honey Body Crème',
    category: 'Body Care',
    price: 799,
    originalPrice: 999,
    discountPercentage: 20,
    rating: 4.9,
    reviewsCount: 198,
    image: PRODUCT_ASSETS.prodBodyCreme,
    isBestSeller: true,
    isNewArrival: false,
    description: 'Rich, cloud-like texture whipped with fair-trade Ghanaian shea butter, wildflower honey, and sweet almond oil for velvety softness all day long.',
    volume: '200g / 7.0 oz',
    skinType: ['Dry', 'Very Dry', 'Normal'],
    ingredients: ['Butyrospermum Parkii Butter', 'Prunus Amygdalus Dulcis Oil', 'Mel (Honey)', 'Aloe Vera', 'Vanilla Planifolia'],
    inStock: true,
  },
  // Deals of the day (2 wide cards)
  {
    id: 'deal-1',
    name: 'Ultra-Hydrating Botanical Bio-Retinol Overnight Mask',
    category: 'Skin Care',
    price: 899,
    originalPrice: 1499,
    discountPercentage: 40,
    rating: 4.9,
    reviewsCount: 312,
    image: DEAL_MASK_DATA_URI,
    isDealOfTheDay: true,
    tag: 'Deal of the Day — 40% OFF',
    description: 'Wake up to luminous, renewed skin with gentle bakuchiol bio-retinol, soothing ceramides, and fermented olive leaf extract.',
    volume: '75ml / 2.5 fl oz',
    skinType: ['All Skin Types', 'Aging', 'Sensitive'],
    ingredients: ['Bakuchiol', 'Ceramide NP', 'Olea Europaea Leaf Ferment', 'Hyaluronic Acid', 'Shea Butter'],
    inStock: true,
  },
  {
    id: 'deal-2',
    name: 'Organic Sweet Amber & Vanilla Cashmere Hair Silk',
    category: 'Hair Care',
    price: 699,
    originalPrice: 1199,
    discountPercentage: 40,
    rating: 4.9,
    reviewsCount: 247,
    image: DEAL_HAIR_DATA_URI,
    isDealOfTheDay: true,
    tag: 'Deal of the Day — 40% OFF',
    description: 'Tame frizz, protect against thermal styling, and impart salon-worthy luminous sheen with cold-pressed marula and camellia blossom oils.',
    volume: '100ml / 3.4 fl oz',
    skinType: ['Dry', 'Color Treated', 'Frizzy'],
    ingredients: ['Sclerocarya Birrea Seed Oil', 'Camellia Japonica Seed Oil', 'Amber Resin Extract', 'Tocopherol'],
    inStock: true,
  },
  // New Arrivals
  {
    id: 'new-1',
    name: 'Luminous Vitamin C + Kakadu Plum Glow Serum',
    category: 'Skin Care',
    price: 999,
    originalPrice: 1349,
    discountPercentage: 25,
    rating: 4.9,
    reviewsCount: 78,
    image: PRODUCT_ASSETS.prodVitC,
    isNewArrival: true,
    tag: 'New Formula',
    description: '15% stabilized Vitamin C combined with wild-harvested Australian Kakadu Plum and ferulic acid for supreme photoprotection and spotless clarity.',
    volume: '30ml / 1.0 fl oz',
    skinType: ['Dull', 'Hyperpigmented', 'All'],
    ingredients: ['Tetrahexyldecyl Ascorbate', 'Terminalia Ferdinandiana Fruit Extract', 'Ferulic Acid', 'Vitamin E'],
    inStock: true,
  },
  {
    id: 'new-2',
    name: 'Hydra-Silk Peptide Cloud Moisturizer',
    category: 'Skin Care',
    price: 1099,
    originalPrice: 1499,
    discountPercentage: 25,
    rating: 4.8,
    reviewsCount: 54,
    image: PRODUCT_ASSETS.prodMatchaTea,
    isNewArrival: true,
    tag: 'New Formula',
    description: 'A featherlight emulsion fortified with 5 multi-peptides and squalane that repairs skin resilience without heaviness.',
    volume: '50ml / 1.7 fl oz',
    skinType: ['Combination', 'Sensitive', 'Normal'],
    ingredients: ['Palmitoyl Tripeptide-1', 'Palmitoyl Tetrapeptide-7', 'Squalane', 'Oat Beta Glucan'],
    inStock: true,
  },
  {
    id: 'new-3',
    name: 'Handcrafted Green Aventurine Facial Sculpting Tool',
    category: 'Accessories & Tools',
    price: 499,
    originalPrice: 699,
    discountPercentage: 25,
    rating: 4.9,
    reviewsCount: 110,
    image: PRODUCT_ASSETS.prodHairMist,
    isNewArrival: true,
    tag: 'Best Tool',
    description: 'Cut from 100% natural Grade-A Aventurine stone to relieve facial tension, stimulate lymphatic drainage, and sculpt cheekbone contours.',
    volume: '1 Stone + Linen Pouch',
    skinType: ['All'],
    ingredients: ['100% Natural Green Aventurine Crystal'],
    inStock: true,
  },
  {
    id: 'new-4',
    name: 'Wild Blackberry & Cedar Botanical Candle',
    category: 'Fragrances',
    price: 699,
    originalPrice: 899,
    discountPercentage: 20,
    rating: 5.0,
    reviewsCount: 62,
    image: PRODUCT_ASSETS.prodSpfFluid,
    isNewArrival: true,
    tag: 'Hand Poured',
    description: 'Clean-burning coconut soy wax scented with wild mountain blackberries, crushed bay leaf, and smoky Appalachian cedarwood.',
    volume: '240g / 8.5 oz (55 hr burn)',
    skinType: ['Home Ambience'],
    ingredients: ['Coconut-Soy Wax', 'Cotton Wick', 'Natural Botanical Fragrance Oils'],
    inStock: true,
  },
  {
    id: 'new-5',
    name: 'Organic Tinted Lip & Cheek Butter Balm',
    category: 'Make Up',
    price: 399,
    originalPrice: 499,
    discountPercentage: 20,
    rating: 4.7,
    reviewsCount: 89,
    image: PRODUCT_ASSETS.prodLipNectar,
    isNewArrival: true,
    tag: 'Organic',
    description: 'Nourishing cocoa butter and hibiscus flower pigment glide on effortlessly for a sheer berry hydration tint with a glassy sheen.',
    volume: '10g / 0.35 oz',
    skinType: ['All'],
    ingredients: ['Theobroma Cacao Seed Butter', 'Cera Alba', 'Hibiscus Sabdariffa Extract', 'Jojoba Oil'],
    inStock: true,
  },
  {
    id: 'new-6',
    name: 'Gentle Chamomile & Calendula Cleansing Oil',
    category: 'Skin Care',
    price: 749,
    originalPrice: 999,
    discountPercentage: 25,
    rating: 4.9,
    reviewsCount: 104,
    image: PRODUCT_ASSETS.prodCleanser,
    isNewArrival: true,
    tag: 'Bestseller New',
    description: 'Effortlessly dissolves waterproof makeup and daily grime without stinging delicate eyes or stripping lipid moisture.',
    volume: '120ml / 4.0 fl oz',
    skinType: ['Sensitive', 'Dry', 'All'],
    ingredients: ['Helianthus Annuus Seed Oil', 'Polyglyceryl-4 Oleate', 'Chamomilla Recutita Flower Extract', 'Calendula Officinalis Extract'],
    inStock: true,
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Sophia Montgomery',
    role: 'Verified Buyer',
    avatar: AVATAR_ASSETS.avatar1,
    quoteTitle: 'Transformed my sensitive skin in just two weeks!',
    comment: 'The Rosewater & Hyaluronic Elixir is nothing short of pure botanical magic. My redness calmed down immediately, and my skin has that luminous, rested dewy glow I haven’t seen in years. Truly a boutique clean beauty essential.',
    rating: 5,
    productUsed: 'Rosewater & Hyaluronic Radiance Elixir',
  },
  {
    id: 't-2',
    name: 'Elena Rostova',
    role: 'Clean Beauty Esthetician',
    avatar: AVATAR_ASSETS.avatar2,
    quoteTitle: 'Spa-grade formulas with completely ethical sourcing',
    comment: 'As a holistic esthetician, I inspect every ingredient list meticulously. Serenity Salon’s cold-pressed botanicals and glass apothecary bottles set the gold standard. I recommend the face oil to all my clients.',
    rating: 5,
    productUsed: 'Cold-Pressed Botanical Face Oil',
  },
  {
    id: 't-3',
    name: 'Camila Rodriguez',
    role: 'Loyal Customer since 2022',
    avatar: AVATAR_ASSETS.avatar3,
    quoteTitle: 'The most luxurious scent and texture ever',
    comment: 'The Velvet Jasmine fragrance oil and Shea Body Crème arrived in the most gorgeous biodegradable packaging. The scent lingers delicately all day without synthetic harshness. I am obsessed!',
    rating: 5,
    productUsed: 'Velvet Jasmine Eau de Parfum',
  },
  {
    id: 't-4',
    name: 'Amara Vance',
    role: 'Verified Purchaser',
    avatar: AVATAR_ASSETS.avatar4,
    quoteTitle: 'My hair has never looked so thick and glossy',
    comment: 'The Rosemary & Meadowfoam Scalp Elixir completely revitalized my dry scalp after winter. Hair feels stronger, looks shinier, and smells like an expensive organic greenhouse.',
    rating: 5,
    productUsed: 'Rosemary & Meadowfoam Scalp Elixir',
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Art of Layering Botanical Serums for Glass Skin',
    slug: 'art-of-layering-botanical-serums',
    category: 'Skincare Rituals',
    readTime: '4 min read',
    author: {
      name: 'Dr. Clara Sterling',
      avatar: AVATAR_ASSETS.avatar5,
      role: 'Head Formulator',
    },
    date: 'August 14, 2026',
    image: BLOG_ASSETS.blog1,
    excerpt: 'Unlock maximum cellular hydration by applying lightweight humectants first, followed by active botanical lipids to seal your glow.',
    content: [
      'Layering your skincare is not just a trend—it is a science based on molecular weight and absorption rates. When practicing clean beauty, the order in which you introduce active plant botanicals dictates how deeply they penetrate the dermis.',
      'Always start with a hydrating mist or floral hydrosol to dampen the stratum corneum. Damp skin is up to 10 times more permeable than dry skin, allowing humectants like multi-molecular Hyaluronic Acid and Glycerin to draw water deep into tissue.',
      'Follow immediately with targeted plant antioxidants such as Vitamin C and Niacinamide. Finally, lock the moisture barrier in place with a cold-pressed lipid oil rich in linoleic and oleic fatty acids.'
    ],
    tags: ['Glass Skin', 'Serums', 'Hydration', 'Clean Beauty'],
  },
  {
    id: 'blog-2',
    title: 'Why Cold-Pressed Plant Oils Outperform Synthetic Silicones',
    slug: 'cold-pressed-plant-oils-vs-silicones',
    category: 'Ingredient Spotlight',
    readTime: '5 min read',
    author: {
      name: 'Marcus Hayes',
      avatar: AVATAR_ASSETS.avatar6,
      role: 'Botanical Chemist',
    },
    date: 'August 08, 2026',
    image: BLOG_ASSETS.blog2,
    excerpt: 'Discover why unrefined botanical lipids feed your skin microbiome with essential omegas, rather than creating a temporary suffocating plastic film.',
    content: [
      'Synthetic silicones like dimethicone provide an instant slip, but they act as a passive seal rather than biologically active nourishment. In contrast, cold-pressed seed oils retain vital phytonutrients, polyphenols, and essential fatty acids.',
      'Oils like Rosehip, Jojoba, and Squalane mimic your skin natural sebum profile, signaling oil glands to balance production rather than overproducing in response to irritation.'
    ],
    tags: ['Plant Oils', 'Microbiome', 'Clean Ingredients'],
  },
  {
    id: 'blog-3',
    title: 'The 5-Minute Morning Lymphatic Drainage Massage with Gua Sha',
    slug: 'morning-lymphatic-drainage-gua-sha',
    category: 'Self Care Rituals',
    readTime: '3 min read',
    author: {
      name: 'Aasha Gandal',
      avatar: AVATAR_ASSETS.avatar1,
      role: 'Founder of Serenity Salon',
    },
    date: 'July 29, 2026',
    image: BLOG_ASSETS.blog3,
    excerpt: 'Sculpt cheekbones, drain morning puffiness, and boost micro-circulation with this gentle ancient ritual guided by stone crystal energy.',
    content: [
      'Waking up with facial puffiness is completely natural—fluid accumulates during horizontal sleep. A 5-minute green aventurine or jade stone massage stimulates the lymphatic nodes positioned along the jawline and collarbones.',
      'Always use a generous coat of botanical oil to provide effortless slip, preventing micro-tears in the epidermis. Angle the stone at 15 degrees and sweep upwards and outwards with featherlight pressure.'
    ],
    tags: ['Gua Sha', 'Facial Massage', 'Morning Routine'],
  }
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'Are all Serenity Salon formulas 100% natural, vegan, and cruelty-free?',
    answer: 'Yes, absolutely. Every single product in our catalog is Leaping Bunny certified cruelty-free, 100% vegan, and crafted without synthetic parabens, phthalates, sulfates (SLS/SLES), synthetic artificial fragrances, or mineral oil. We prioritize wild-harvested and organic botanical ingredients in recyclable glass packaging.',
    category: 'Products',
  },
  {
    id: 'faq-2',
    question: 'How do I know which products are suitable for my skin type?',
    answer: 'Each product page includes a tailored "Skin Type" and full botanical ingredient breakdown. If you have sensitive or reactive skin, we suggest starting with our Rosewater Hydration line and Meadowfoam elixirs. You can also filter our shop catalog directly by skin concern (e.g. Dryness, Anti-aging, Acne-prone, Sensitive).',
    category: 'Products',
  },
  {
    id: 'faq-3',
    question: 'What is your shipping policy and delivery timeline?',
    answer: 'We offer Free Standard Express Shipping on all orders over ₹999 across India. Orders placed before 2:00 PM are processed same-day. Standard delivery takes 2–4 business days across major cities, and Express Fast-Track options are available at checkout.',
    category: 'Shipping',
  },
  {
    id: 'faq-4',
    question: 'What is your 30-Day Effortless Glow return policy?',
    answer: 'We want you to love your ritual. If a formula does not suit your skin, simply return it within 30 days of delivery for a full refund or exchange. We provide complimentary reverse pick-up and prepaid return shipping across India.',
    category: 'Returns',
  },
  {
    id: 'faq-5',
    question: 'How should I store my cold-pressed botanical face oils and serums?',
    answer: 'Because we use pure cold-pressed botanicals without harsh synthetic preservatives, we recommend storing products in a cool, dry place away from direct sunlight. Dropper bottles should be tightly closed after each use.',
    category: 'Products',
  },
  {
    id: 'faq-6',
    question: 'Can I track my order status in real-time?',
    answer: 'Yes! As soon as your order leaves our clean boutique warehouse, you will receive a confirmation email and SMS with your live tracking number and delivery milestones.',
    category: 'Orders',
  }
];

export const INSTAGRAM_POSTS = [
  {
    id: 'ig-1',
    image: PRODUCT_ASSETS.prodCleanser,
    likes: '1.2k',
    caption: 'Dewy mornings begin with botanical botanicals. ✨🌿 #CleanBeauty',
  },
  {
    id: 'ig-2',
    image: CATEGORY_ASSETS.accessories,
    likes: '2.4k',
    caption: 'Pure silk hair ritual with rosemary meadowfoam. 🌸 #HairGlow',
  },
  {
    id: 'ig-3',
    image: PRODUCT_ASSETS.prodRosewater,
    likes: '3.1k',
    caption: 'Our #1 best selling elixir in golden hour light. ☀️ #GlassSkin',
    isFeatured: true,
  },
  {
    id: 'ig-4',
    image: PRODUCT_ASSETS.prodBlushTint,
    likes: '1.8k',
    caption: 'Petal cushion blush for an effortless, sun-kissed flush. 🌷',
  },
  {
    id: 'ig-5',
    image: PRODUCT_ASSETS.prodPerfume,
    likes: '950',
    caption: 'Night blooming jasmine and warm amber notes. 🌙 #BotanicalFragrance',
  },
  {
    id: 'ig-6',
    image: PRODUCT_ASSETS.prodHairMist,
    likes: '2.9k',
    caption: 'Carving cheekbones with Aventurine crystal healing. 💚 #GuaSha',
  },
  {
    id: 'ig-7',
    image: CATEGORY_ASSETS.bodycare,
    likes: '1.5k',
    caption: 'Whipped Ghanaian shea butter on fresh linen. 🧈 #BodyCare',
  },
  {
    id: 'ig-8',
    image: PRODUCT_ASSETS.prodFaceOil,
    likes: '2.1k',
    caption: 'Natural drops of golden barrier goodness. 💧 #CleanGlow',
  }
];

export const ELEMENTOR_CONVERSION_DATA = {
  themeName: 'Serenity Salon — WordPress & Elementor Conversion Kit',
  colorPalette: {
    primaryDeepGreen: '#1F3A26',
    secondarySageGreen: '#4F7358',
    accentGold: '#C9A66B',
    pageBgCream: '#F7F5F1',
    cardSurfaceWhite: '#FFFFFF',
    bodyTextCharcoal: '#1A1A1A',
    mutedGray: '#6E6E6E',
    badgePeach: '#FDF1E4'
  },
  elementorWidgetsMapping: [
    { section: 'Top Announcement Bar', elementorWidget: 'Header / Custom HTML or Container Strip with Icon List' },
    { section: 'Main Sticky Nav', elementorWidget: 'Nav Menu + Search + Menu Cart + Off-Canvas Drawer' },
    { section: 'Hero Section', elementorWidget: 'Container (Flex 2-Col) + Heading + Text Editor + Button + Image + Icon Box' },
    { section: 'Category Marquee Ticker', elementorWidget: 'Elementor Text Marquee Widget or HTML Text with Customizer CSS' },
    { section: 'Shop By Category', elementorWidget: 'Container Grid (5 Columns) + Image Box with circular border-radius 9999px' },
    { section: 'Dual Promo Banner Row', elementorWidget: '2-Column Container + Call to Action Widget or Image + Button' },
    { section: 'About Us / Brand Story', elementorWidget: 'Inner Section (Image Gallery/Grid) + Heading + Icon List + Counter/Stats' },
    { section: 'Best Sellers Section', elementorWidget: 'WooCommerce Products Widget (Custom Query / Grid 4 cols) with Tab Filter' },
    { section: 'Summer Glow Countdown', elementorWidget: 'Countdown Widget + Heading + Call to Action' },
    { section: 'Deals of the Day', elementorWidget: '2-Column Promo Cards / WooCommerce Products Widget (Horizontal layout)' },
    { section: 'Weekly Deals Dark Banner', elementorWidget: 'Container Background #1F3A26 + Heading + Button (Light variant)' },
    { section: 'New Arrival Products', elementorWidget: '1 Promo Column (Image Box) + 6 Products (WooCommerce Grid)' },
    { section: 'Testimonials Carousel', elementorWidget: 'Testimonial Carousel Widget / Reviews Widget' },
    { section: 'News & Blogs Section', elementorWidget: 'Posts Widget (Grid 3 cols, Cards skin)' },
    { section: 'Instagram Gallery', elementorWidget: 'Basic Gallery / Media Carousel / Instagram Feed Widget (8 images)' },
    { section: 'FAQ Accordion', elementorWidget: 'Accordion Widget (Native Elementor) + Contact Callout Box' },
    { section: 'Newsletter Bar', elementorWidget: 'Elementor Form Widget / Mailchimp Form' },
    { section: 'Footer Section', elementorWidget: '5-Column Container + Site Logo + Nav Menus + Social Icons' }
  ],
  customizerCssSnippet: `/* ======================================================
   SERENITY SALON — WORDPRESS CUSTOMIZER ADDITIONAL CSS
   Paste into: WP Admin > Appearance > Customize > Additional CSS
====================================================== */

:root {
  --bs-green-primary: #1F3A26;
  --bs-green-secondary: #4F7358;
  --bs-gold-accent: #C9A66B;
  --bs-bg-cream: #F7F5F1;
  --bs-surface-white: #FFFFFF;
  --bs-text-charcoal: #1A1A1A;
  --bs-text-muted: #6E6E6E;
  --bs-badge-peach: #FDF1E4;
  --bs-radius-card: 20px;
  --bs-radius-button: 9999px;
  --font-heading: 'Jost', sans-serif;
  --font-body: 'Plus Jakarta Sans', sans-serif;
  --font-script: 'Caveat', cursive;
}

body.serenity-salon {
  background-color: var(--bs-bg-cream);
  color: var(--bs-text-charcoal);
  font-family: var(--font-body);
}

/* Headings with Gold Highlight Accents */
.elementor-heading-title, h1, h2, h3, h4 {
  font-family: var(--font-heading);
  color: var(--bs-text-charcoal);
}

.gold-highlight {
  color: var(--bs-gold-accent) !important;
}

/* Pill Shaped CTA Buttons */
.elementor-button, .bs-btn-primary {
  background-color: var(--bs-green-primary) !important;
  color: #FFFFFF !important;
  border-radius: var(--bs-radius-button) !important;
  padding: 14px 28px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

.elementor-button:hover, .bs-btn-primary:hover {
  background-color: var(--bs-green-secondary) !important;
  transform: translateY(-2px);
}

/* White Pill on Dark Background */
.bs-btn-light {
  background-color: #FFFFFF !important;
  color: var(--bs-green-primary) !important;
  border-radius: var(--bs-radius-button) !important;
  padding: 14px 28px !important;
  font-weight: 600 !important;
  transition: all 0.3s ease !important;
}

.bs-btn-light:hover {
  background-color: var(--bs-gold-accent) !important;
  color: #FFFFFF !important;
}

/* Rounded Cards */
.bs-card, .elementor-widget-container .woocommerce ul.products li.product {
  background: #FFFFFF;
  border-radius: var(--bs-radius-card);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid rgba(31, 58, 38, 0.06);
}

.bs-card:hover, .woocommerce ul.products li.product:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(31, 58, 38, 0.08);
}

/* Discount Badge */
.bs-discount-badge {
  background-color: var(--bs-badge-peach);
  color: var(--bs-green-primary);
  font-weight: 700;
  border-radius: 9999px;
  padding: 4px 12px;
  font-size: 12px;
}

/* Infinite Marquee Ticker */
@keyframes bs-marquee {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
}

.bs-marquee-track {
  display: flex;
  width: max-content;
  animation: bs-marquee 25s linear infinite;
}

.bs-marquee-track:hover {
  animation-play-state: paused;
}

/* Script Signature Font */
.bs-signature-font {
  font-family: var(--font-script);
  font-size: 32px;
  color: var(--bs-gold-accent);
}
`
};
