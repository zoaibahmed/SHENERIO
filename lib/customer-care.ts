type FaqItem = {
  id: string;
  question: string;
  answer: string;
  previewNote?: string;
  link?: { href: string; label: string };
};

type FaqGroup = { id: string; title: string; items: FaqItem[] };

// Source: TIL 2.pdf, pp. 2–3. Publication gates from p. 10 and the project audit.
export const faqGroups: FaqGroup[] = [
  {
    id: 'the-house',
    title: 'The House',
    items: [
      {
        id: 'what-is-shenerio',
        question: 'What is SHENERIO?',
        answer: 'SHENERIO is a London-founded luxury skincare brand inspired by contemporary beauty and South Korean skincare formulation innovation.',
        link: { href: '/our-house', label: 'Explore Our House' },
      },
      {
        id: 'where-is-shenerio-based',
        question: 'Where is SHENERIO based?',
        answer: 'Our brand is founded in London, United Kingdom.',
      },
      {
        id: 'where-are-products-made',
        question: 'Where are SHENERIO products formulated and manufactured?',
        answer: 'Our products are formulated and manufactured in South Korea.',
      },
    ],
  },
  {
    id: 'the-collection',
    title: 'The collection and routine',
    items: [
      {
        id: 'available-products',
        question: 'What products are currently available?',
        answer: 'The inaugural SHENERIO collection features two products: LUMICLEAR TARGET SERUM and LUMICLEAR RADIANCE CREAM.',
        previewNote: 'You can explore both products in this private preview. Purchasing is unavailable.',
        link: { href: '/collections/lumiclear', label: 'Explore LUMICLEAR' },
      },
      {
        id: 'what-is-lumiclear',
        question: 'What is the LUMICLEAR collection?',
        answer: 'LUMICLEAR is our first skincare collection, bringing together two complementary formulations featuring carefully selected cosmetic ingredients.',
      },
      {
        id: 'all-skin-types',
        question: 'Are SHENERIO products suitable for all skin types?',
        answer: 'The LUMICLEAR collection is developed with all skin types in mind. However, individual skin responses may vary. We recommend reviewing the full ingredient list and performing a patch test before first use.',
        previewNote: 'Draft source wording. Evidence for the all-skin-types positioning and final manufacturer-approved ingredient lists are awaiting approval.',
      },
      {
        id: 'women-and-men',
        question: 'Are SHENERIO products suitable for women and men?',
        answer: 'Yes. SHENERIO is a skincare brand for women and men. Our products are designed to complement everyday skincare routines regardless of gender.',
      },
      {
        id: 'under-makeup',
        question: 'Can I wear SHENERIO products under makeup?',
        answer: 'Yes. Both LUMICLEAR TARGET SERUM and LUMICLEAR RADIANCE CREAM are designed to complement your makeup routine. Apply the serum first, follow with the moisturiser and allow your skincare to settle before applying makeup.',
        previewNote: 'Draft source wording. Makeup compatibility is awaiting confirmation through product and layering tests.',
      },
      {
        id: 'using-both-products',
        question: 'Can I use the serum and cream together?',
        answer: 'Yes. They are designed to complement one another as part of a skincare routine. Apply LUMICLEAR TARGET SERUM first, followed by LUMICLEAR RADIANCE CREAM.',
        link: { href: '/the-ritual', label: 'Explore The Ritual' },
      },
      {
        id: 'frequency-of-use',
        question: 'How often should I use the products?',
        answer: 'Follow the directions on the product packaging. The intended routine is morning and evening, where suitable.',
        previewNote: 'Final packaging directions are awaiting approval.',
      },
      {
        id: 'sensitive-skin',
        question: 'Can I use the products on sensitive skin?',
        answer: 'Individual skin responses vary. Review the full ingredient list and perform a patch test before first use. If you have a known skin sensitivity, seek appropriate professional advice.',
        previewNote: 'Final manufacturer-approved ingredient lists are awaiting approval.',
      },
      {
        id: 'target-serum-price',
        question: 'What is the price of LUMICLEAR TARGET SERUM?',
        answer: 'LUMICLEAR TARGET SERUM is priced at £26.00 GBP.',
        link: { href: '/products/lumiclear-target-serum', label: 'Discover Target Serum' },
      },
      {
        id: 'radiance-cream-price',
        question: 'What is the price of LUMICLEAR RADIANCE CREAM?',
        answer: 'LUMICLEAR RADIANCE CREAM is priced at £36.00 GBP.',
        link: { href: '/products/lumiclear-radiance-cream', label: 'Discover Radiance Cream' },
      },
      {
        id: 'vegan-status',
        question: 'Are SHENERIO products vegan?',
        answer: 'Please contact our team for verified product-specific information.',
        previewNote: 'Verified product-specific information and the support channel are awaiting confirmation.',
      },
      {
        id: 'animal-testing-policy',
        question: 'Are SHENERIO products cruelty-free?',
        answer: 'Please contact our team for our confirmed animal-testing policy.',
        previewNote: 'The animal-testing policy and the support channel are awaiting confirmation.',
      },
    ],
  },
  {
    id: 'orders-and-enquiries',
    title: 'Orders and enquiries',
    items: [
      {
        id: 'placing-an-order',
        question: 'How do I place an order?',
        answer: 'Once shopping is available, select your preferred product, add it to your shopping bag and follow the secure checkout process.',
        previewNote: 'Ordering and checkout are unavailable in this private preview.',
        link: { href: '/bag', label: 'View the bag preview' },
      },
      {
        id: 'contacting-shenerio',
        question: 'How can I contact SHENERIO?',
        answer: 'Visit our Contact page to submit an enquiry to our customer service team once the service is connected.',
        previewNote: 'The contact form currently runs as a preview and does not send enquiries.',
        link: { href: '/contact', label: 'Visit Contact' },
      },
    ],
  },
];

type CareLink = { href: string; label: string };

type CareDocument = {
  title: string;
  category: 'Customer care' | 'Legal';
  heading: string;
  status: string;
  description: string;
  links: CareLink[];
};

export const careDocuments = {
  shipping: {
    title: 'Shipping & Delivery',
    category: 'Customer care',
    heading: 'Delivery information',
    status: 'Awaiting confirmation',
    description: 'Delivery destinations, shipping charges and estimated delivery times will be available once SHENERIO confirms its fulfilment arrangements.',
    links: [{ href: '/faq', label: 'Frequently Asked Questions' }, { href: '/order-tracking', label: 'Order Tracking' }],
  },
  returns: {
    title: 'Returns & Refunds',
    category: 'Customer care',
    heading: 'Returns information',
    status: 'Awaiting confirmation',
    description: 'Instructions for requesting a return or refund will appear here once SHENERIO approves its return terms and support process.',
    links: [{ href: '/returns-policy', label: 'Returns Policy' }, { href: '/contact', label: 'Contact SHENERIO' }],
  },
  tracking: {
    title: 'Order Tracking',
    category: 'Customer care',
    heading: 'Order lookup is unavailable',
    status: 'Private preview',
    description: 'Order status and carrier tracking will be available once ordering and fulfilment are connected.',
    links: [{ href: '/shipping-delivery', label: 'Shipping & Delivery' }, { href: '/faq', label: 'Frequently Asked Questions' }],
  },
  account: {
    title: 'Your account',
    category: 'Customer care',
    heading: 'Sign-in is unavailable',
    status: 'Private preview',
    description: 'Sign-in, account details and order history require the customer account service. You can browse SHENERIO and explore both LUMICLEAR products in the meantime.',
    links: [{ href: '/collections', label: 'Discover Collections' }, { href: '/contact', label: 'Contact SHENERIO' }],
  },
  privacy: {
    title: 'Privacy Policy',
    category: 'Legal',
    heading: 'Privacy notice',
    status: 'Internal preview · awaiting approval',
    description: 'A reviewed privacy notice will be published once the merchant confirms its business identity, service providers, data handling and privacy contact details.',
    links: [{ href: '/cookie-policy', label: 'Cookie Policy' }, { href: '/contact', label: 'Contact SHENERIO' }],
  },
  cookies: {
    title: 'Cookie Policy',
    category: 'Legal',
    heading: 'Cookie notice',
    status: 'Internal preview · awaiting approval',
    description: 'A reviewed notice will describe the technologies in use once the live website is configured. This preview has no marketing or analytics integration. Cookie preferences will appear here if optional tracking is introduced.',
    links: [{ href: '/privacy-policy', label: 'Privacy Policy' }],
  },
  terms: {
    title: 'Terms & Conditions',
    category: 'Legal',
    heading: 'Website and purchase terms',
    status: 'Internal preview · awaiting approval',
    description: 'Reviewed terms will be published after SHENERIO confirms the merchant identity, transaction process and commercial conditions.',
    links: [{ href: '/returns-policy', label: 'Returns Policy' }, { href: '/privacy-policy', label: 'Privacy Policy' }],
  },
  returnsPolicy: {
    title: 'Returns Policy',
    category: 'Legal',
    heading: 'Policy for returns and refunds',
    status: 'Internal preview · awaiting approval',
    description: 'A reviewed returns policy will be published once the merchant approves eligibility, time limits, refund handling and the return address.',
    links: [{ href: '/returns-refunds', label: 'Returns & Refunds' }, { href: '/contact', label: 'Contact SHENERIO' }],
  },
} satisfies Record<string, CareDocument>;

export type CareDocumentKey = keyof typeof careDocuments;
