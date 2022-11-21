import * as mapper from "./ofnLogcicaMapper.js";
import * as extractor from "./ofnApiV0Extractor.js"

// for each item, give it a name

// a transformation function ...
// how to get it ...

// use / in ids because better for pattern matching, transform in . for i18n

// TODO should I be using _ids instead of _id

// TODO, if only one variant for product, don't record product group ...

test("Order clean up", () => {
  const cleanedUpOrder = extractor.cleanUpOrder(ofnOrderSample)

  const cleanedUpProduct =  extractor.cleanUpProduct(ofnProductUnpreparedSample)

  const ofnApiV0Context = {
    orders: [cleanedUpOrder],
    products: [cleanedUpProduct]
  }

  const extractedContext = extractor.extract(ofnApiV0Context)
  console.log(JSON.stringify(extractedContext,null, 2))

  const mappedContext =  mapper.mapContext(extractedContext)
  console.log(JSON.stringify(mappedContext,null, 2))

})

const ofnOrderSample = {
  id: 422667,
  number: "R032864067",
  user_id: 3497,
  full_name: "Olivier Wouters",
  email: "olivier5741@gmail.com",
  phone: "+32999999",
  completed_at: "August 23, 2022",
  display_total:
    '<span class="money-whole">8</span><span class="money-decimal-mark">.</span><span class="money-decimal">50</span> <span class="money-currency-symbol">&#x20AC;</span>',
  edit_path: "/admin/orders/R032864067/edit",
  state: "complete",
  payment_state: "paid",
  shipment_state: "ready",
  payments_path: "/admin/orders/R032864067/payments",
  ready_to_ship: true,
  ready_to_capture: false,
  created_at: "August 23, 2022",
  distributor_name: "Comptoir Demo OFN",
  special_instructions: null,
  display_outstanding_balance: "",
  item_total: "2.0",
  adjustment_total: "6.5",
  payment_total: "8.5",
  total: "8.5",
  item_count: 1,
  adjustments: [
    {
      id: 3345525,
      amount: "0.0",
      label: "Frais de transaction",
      eligible: true,
      adjustable_type: "Spree::Payment",
      adjustable_id: 19331,
      originator_type: "Spree::PaymentMethod",
      originator_id: 183,
      tax_category_id: null,
    },
    {
      id: 3345523,
      amount: "6.5",
      label: "Expédition",
      eligible: true,
      adjustable_type: "Spree::Shipment",
      adjustable_id: 19368,
      originator_type: "Spree::ShippingMethod",
      originator_id: 112,
      tax_category_id: null,
    },
  ],
  customer_id: 2997,
  distributor: {
    id: 591,
  },
  order_cycle: {
    id: 2545,
  },
  shipping_method: {
    id: 112,
    require_ship_address: true,
    name: "Livraison par Bpost",
    description:
      "La commande vous sera livrée dans les 2 jours ouvrables après la date choisie lors de votre commande -  vu les circonstances ce délai peut-être plus long.\r\n\r\nExemple : si commande prête pour le lundi 20/04, elle vous sera livrée vers le 22/04.",
    price: "6.5",
  },
  ship_address: {
    id: 65306,
    zipcode: "6850",
    city: "Carlsbourg",
    state_name: "Luxembourg",
    state_id: 166,
    phone: "+32999999",
    firstname: "Olivier",
    lastname: "Wouters",
    address1: "Grand rue, 40",
    address2: "",
    country_id: 29,
    country_name: "Belgium",
  },
  bill_address: {
    id: 65305,
    zipcode: "6850",
    city: "Carlsbourg",
    state_name: "Luxembourg",
    state_id: 166,
    phone: "+32999999",
    firstname: "Olivier",
    lastname: "Wouters",
    address1: "Grand rue, 40",
    address2: "",
    country_id: 29,
    country_name: "Belgium",
  },
  line_items: [
    {
      id: 251263,
      quantity: 2,
      price: "1.0",
      variant: {
        id: 23800,
        product_name: "Chocolat noir sans sucre",
      }
    },
  ],
  payments: [
    {
      amount: "8.5",
      updated_at: "Aug 23, 2022 10:50",
      payment_method: "Paiement en espèces lors du retrait au comptoir",
      state: "completed",
      cvv_response_message: null,
    },
  ],
};

const ofnProductUnpreparedSample = {
  id: 9737,
  name: "Chocolat noir sans sucre",
  sku: "00454000020023",
  variant_unit: "items",
  variant_unit_scale: null,
  variant_unit_name: " unité",
  inherits_properties: true,
  on_hand: 0,
  price: "0.0",
  available_on: "2022-07-12 13:32:08",
  permalink_live: "chocolat-noir-sans-sucre-1",
  tax_category_id: 1,
  import_date: null,
  image_url: "/noimage/product.png",
  thumb_url: "/noimage/mini.png",
  producer_id: 591,
  category_id: 2,
  variants: [
    {
      id: 23800,
      name: "Chocolat noir sans sucre - 1  unité",
      producer_name: "Comptoir Demo OFN",
      image: null,
      sku: "00454000020023",
      import_date: null,
      options_text: "1  unité",
      unit_value: 1,
      unit_description: "",
      unit_to_display: "1  unité",
      display_as: null,
      display_name: null,
      name_to_display: "Chocolat noir sans sucre",
      variant_overrides_count: 1,
      price: "0.0",
      on_demand: false,
      on_hand: 0,
      in_stock: false,
      stock_location_id: 1,
      stock_location_name: "default"
    }
  ],
  master: {
    id: 23799,
    name: "Chocolat noir sans sucre - 1  unité",
    producer_name: "Comptoir Demo OFN",
    image: null,
    sku: "00454000020023",
    import_date: null,
    options_text: "1  unité",
    unit_value: 1,
    unit_description: "",
    unit_to_display: "1  unité",
    display_as: null,
    display_name: null,
    name_to_display: "Chocolat noir sans sucre",
    variant_overrides_count: 0,
    price: "0.0",
    on_demand: false,
    on_hand: 0,
    in_stock: false,
    stock_location_id: 1,
    stock_location_name: "default"
  }
}

const ofnProductSample = {
  id: 9737,
  name: "Chocolat noir sans sucre",
  variant_unit: "items",
  variant_unit_scale: null,
  variant_unit_name: " unité",
  available_on: "2022-07-12 13:32:08",
  permalink_live: "chocolat-noir-sans-sucre-1",
  tax_category: {
    id: 1,
  },
  image_url: "/noimage/product.png",
  thumb_url: "/noimage/mini.png",
  producer: {
    id: 591,
    name: "Comptoir Demo OFN"
  },
  category: {
    id: 2
  },
  variants: [
    {
      id: 23800,
      name: "Chocolat noir sans sucre - 1  unité",
      sku: "00454000020023",
      options_text: "1  unité",
      unit_value: 1,
      unit_description: "",
      unit_to_display: "1  unité",
      display_as: null,
      display_name: null,
      name_to_display: "Chocolat noir sans sucre",
      price: "0.0",
      on_demand: false,
      on_hand: 0,
      in_stock: false,
    }
  ]
}

const ofnContext = {
  // map straight to order
  orders: [
    {
      id: 422667,
      number: "R032864067",
      completed_at: "August 23, 2022",
      display_total:
        '<span class="money-whole">8</span><span class="money-decimal-mark">.</span><span class="money-decimal">50</span> <span class="money-currency-symbol">&#x20AC;</span>',
      edit_path: "/admin/orders/R032864067/edit",
      state: "complete",
      payment_state: "paid",
      shipment_state: "ready",
      payments_path: "/admin/orders/R032864067/payments",
      ready_to_ship: true,
      ready_to_capture: false,
      created_at: "August 23, 2022",
      special_instructions: null,
      display_outstanding_balance: "",
      item_total: "2.0",
      adjustment_total: "6.5",
      payment_total: "8.5",
      total: "8.5",
      item_count: 1,
      user: {
        id: 2997,
      },
      customer: {
        id: 2997,
      },
      distributor: {
        id: 591,
      },
      order_cycle: {
        id: 2545,
      },
      shipping_method: {
        id: 112,
      },
      ship_address: {
        id: 65306,
        zipcode: "6850",
        city: "Carlsbourg",
        phone: "+32999999",
        firstname: "Olivier",
        lastname: "Wouters",
        address1: "Grand rue, 40",
        address2: "",
        state: {
          id: 166,
        },
        country: {
          id: 29,
        },
      },
      bill_address: {
        zipcode: "6850",
        city: "Carlsbourg",
        phone: "+32999999",
        firstname: "Olivier",
        lastname: "Wouters",
        address1: "Grand rue, 40",
        address2: "",
        state: {
          id: 166,
        },
        country: {
          id: 29,
        },
      },
      line_items: [
        {
          quantity: 2,
          max_quantity: null,
          price: "1.0",
          tax_category: {
            id: 1,
          },
          variant: {
            id: 23800,
          },
        },
      ],
    },
  ],
  tax_categories: [
    {
      id: 1,
    },
  ],
  orderCycles: [
    {
      id: 2545,
    },
  ],
  customers: [
    {
      id: 2997,
    },
  ],
  // map straight to workspace
  users: [
    {
      id: 2997,
      full_name: "Olivier Wouters",
      email: "olivier5741@gmail.com",
      phone: "+32999999",
    },
  ],
  // map straight to workspace
  enterprises: [
    {
      id: 591,
      name: "Comptoir Demo OFN",
    },
  ],
  // map straight to shipping methods
  shipping_methods: [
    {
      id: 112,
      require_ship_address: true,
      name: "Livraison par Bpost",
      description:
        "La commande vous sera livrée dans les 2 jours ouvrables après la date choisie lors de votre commande -  vu les circonstances ce délai peut-être plus long.\r\n\r\nExemple : si commande prête pour le lundi 20/04, elle vous sera livrée vers le 22/04.",
      price: "6.5",
    },
  ],
  // map straight to area
  states: [
    {
      name: "Luxembourg",
      id: 166,
    },
  ],
  // map straight to area
  countries: [
    {
      id: 29,
      name: "Belgium",
    },
  ],
  // map straight to product
  variants: [
    {
      id: 25242,
      name: "Poireau (Test) - Un poireau (1 pièce)",
      producer: {
        id: 591,
      },
      image: null,
      sku: "",
      import_date: null,
      options_text: "1 pièce",
      unit_value: 1,
      unit_description: "",
      unit_to_display: "1 pièce",
      display_as: "1 pièce",
      display_name: "Un poireau",
      name_to_display: "Un poireau",
      variant_overrides_count: 0,
      price: "1.0",
      on_demand: false,
      on_hand: 0,
      in_stock: false,
      stock_location_id: 1,
      stock_location_name: "default",
    },
    {
      id: 25243,
      name: "Poireau (Test) - Une botte de poireaux (1 botte)",
      producer: {
        id: 591,
      },
      image: null,
      sku: "",
      import_date: null,
      options_text: "1 botte",
      unit_value: 1,
      unit_description: "3 pièces",
      unit_to_display: "1 botte",
      display_as: "1 botte",
      display_name: "Une botte de poireaux",
      name_to_display: "Une botte de poireaux",
      variant_overrides_count: 0,
      price: "2.5",
      on_demand: false,
      on_hand: 0,
      in_stock: false,
      stock_location_id: 1,
      stock_location_name: "default",
    },
  ],
  // map straight to productGroup
  products: [
    {
      id: 10293,
      name: "Poireau (Test)",
      sku: "",
      variant_unit: "items",
      variant_unit_scale: null,
      variant_unit_name: "pièce",
      inherits_properties: true,
      on_hand: 0,
      price: "1.0",
      available_on: "2022-10-06 11:33:36",
      permalink_live: "test-unite-2",
      tax_category: {
        id: 1,
      },
      import_date: null,
      image_url: "/noimage/product.png",
      thumb_url: "/noimage/mini.png",
      producer: {
        id: 591,
      },
      category: {
        id: 75,
      },
      variants: [
        {
          id: 25242,
        },
        {
          id: 25243,
        },
      ],
    },
  ],
};

const preparedOrderSample = {
  id: 422667,
  number: "R032864067",
  completed_at: "August 23, 2022",
  display_total:
    '<span class="money-whole">8</span><span class="money-decimal-mark">.</span><span class="money-decimal">50</span> <span class="money-currency-symbol">&#x20AC;</span>',
  edit_path: "/admin/orders/R032864067/edit",
  state: "complete",
  payment_state: "paid",
  shipment_state: "ready",
  payments_path: "/admin/orders/R032864067/payments",
  ready_to_ship: true,
  ready_to_capture: false,
  created_at: "August 23, 2022",
  special_instructions: null,
  display_outstanding_balance: "",
  item_total: "2.0",
  adjustment_total: "6.5",
  payment_total: "8.5",
  total: "8.5",
  item_count: 1,
  adjustments: [
    {
      id: 3345525,
      amount: "0.0",
      label: "Frais de transaction",
      eligible: true,
      adjustable_type: "Spree::Payment",
      adjustable_id: 19331,
      originator_type: "Spree::PaymentMethod",
      originator_id: 183,
      tax_category_id: null,
    },
    {
      id: 3345523,
      amount: "6.5",
      label: "Expédition",
      eligible: true,
      adjustable_type: "Spree::Shipment",
      adjustable_id: 19368,
      originator_type: "Spree::ShippingMethod",
      originator_id: 112,
      tax_category_id: null,
    },
  ],
  distributor: {
    id: 591,
    name: "Comptoir Demo OFN",
  },
  order_cycle: {
    id: 2545,
  },
  shipping_method: {
    id: 112,
    require_ship_address: true,
    name: "Livraison par Bpost",
    description:
      "La commande vous sera livrée dans les 2 jours ouvrables après la date choisie lors de votre commande -  vu les circonstances ce délai peut-être plus long.\r\n\r\nExemple : si commande prête pour le lundi 20/04, elle vous sera livrée vers le 22/04.",
    price: "6.5",
  },
  ship_address: {
    zipcode: "6850",
    city: "Carlsbourg",
    phone: "+32999999",
    firstname: "Olivier",
    lastname: "Wouters",
    address1: "Grand rue, 40",
    address2: "",
    country: {
      id: 29,
      name: "Belgium",
    },
    state: {
      id: 166,
      name: "Luxembourg",
    },
  },
  bill_address: {
    zipcode: "6850",
    city: "Carlsbourg",
    phone: "+32999999",
    firstname: "Olivier",
    lastname: "Wouters",
    address1: "Grand rue, 40",
    address2: "",
    country: {
      id: 29,
      name: "Belgium",
    },
    state: {
      id: 166,
      name: "Luxembourg",
    },
  },
  line_items: [
    {
      id: 251263,
      quantity: 2,
      price: "1.0",
      variant: {
        id: 23800
      }
    },
  ],
  payments: [
    {
      amount: "8.5",
      updated_at: "Aug 23, 2022 10:50",
      payment_method: {
        name: "Paiement en espèces lors du retrait au comptoir",
      },
      state: "completed",
      cvv_response_message: null,
    },
  ],
  user: {
    id: 3497,
    full_name: "Olivier Wouters",
    email: "olivier5741@gmail.com",
    phone: "+32999999",
  },
  customer: {
    id: 2997,
  },
};

const explodedOrderSample = {
  enterprises: [
    {
      id: 591,
      name: "Comptoir Demo OFN",
    },
  ],
  order_cycles: [
    {
      id: 2545,
    },
  ],
  shipping_methods: [
    {
      id: 112,
      require_ship_address: true,
      name: "Livraison par Bpost",
      description:
        "La commande vous sera livrée dans les 2 jours ouvrables après la date choisie lors de votre commande -  vu les circonstances ce délai peut-être plus long.\r\n\r\nExemple : si commande prête pour le lundi 20/04, elle vous sera livrée vers le 22/04.",
      price: "6.5",
    },
  ],
  users: [
    {
      id: 3497,
      full_name: "Olivier Wouters",
      email: "olivier5741@gmail.com",
      phone: "+32999999",
    },
  ],
  customers: [
    {
      id: 2997,
    },
  ],
  countries: [
    {
      id: 29,
      name: "Belgium",
    },
    {
      id: 29,
      name: "Belgium",
    },
  ],
  states: [
    {
      id: 166,
      name: "Luxembourg",
    },
    {
      id: 166,
      name: "Luxembourg",
    },
  ],
  variants: [
    {
      id: 23800,
      is_master: false,
      sku: "00454000020023",
      options_text: "1  unité",
      unit_value: 1,
      unit_description: "",
      unit_to_display: "1  unité",
      display_as: null,
      display_name: null,
      name_to_display: "Chocolat noir sans sucre",
      price: "0.0",
      on_demand: false,
      on_hand: 0,
      fees: {},
      fees_name: {},
      price_with_fees: "0.0",
      tag_list: [],
      thumb_url: "/noimage/mini.png",
      unit_price_price: "0.0",
      unit_price_unit: " unité",
      product: {
        ids: ["ofn/591/products/Chocolat noir sans sucre"],
      },
    },
  ],
  products: [
    {
      ids: ["ofn/591/products/Chocolat noir sans sucre"],
      name: "Chocolat noir sans sucre",
    },
  ],
  orders: [
    {
      id: 422667,
      number: "R032864067",
      completed_at: "August 23, 2022",
      display_total:
        '<span class="money-whole">8</span><span class="money-decimal-mark">.</span><span class="money-decimal">50</span> <span class="money-currency-symbol">&#x20AC;</span>',
      edit_path: "/admin/orders/R032864067/edit",
      state: "complete",
      payment_state: "paid",
      shipment_state: "ready",
      payments_path: "/admin/orders/R032864067/payments",
      ready_to_ship: true,
      ready_to_capture: false,
      created_at: "August 23, 2022",
      special_instructions: null,
      display_outstanding_balance: "",
      item_total: "2.0",
      adjustment_total: "6.5",
      payment_total: "8.5",
      total: "8.5",
      item_count: 1,
      adjustments: [
        {
          id: 3345525,
          amount: "0.0",
          label: "Frais de transaction",
          eligible: true,
          adjustable_type: "Spree::Payment",
          adjustable_id: 19331,
          originator_type: "Spree::PaymentMethod",
          originator_id: 183,
          tax_category_id: null,
        },
        {
          id: 3345523,
          amount: "6.5",
          label: "Expédition",
          eligible: true,
          adjustable_type: "Spree::Shipment",
          adjustable_id: 19368,
          originator_type: "Spree::ShippingMethod",
          originator_id: 112,
          tax_category_id: null,
        },
      ],
      distributor: {
        id: 591,
      },
      order_cycle: {
        id: 2545,
      },
      shipping_method: {
        id: 112,
      },
      ship_address: {
        zipcode: "6850",
        city: "Carlsbourg",
        phone: "+32999999",
        firstname: "Olivier",
        lastname: "Wouters",
        address1: "Grand rue, 40",
        address2: "",
        country: {
          id: 29,
        },
        state: {
          id: 166,
        },
      },
      bill_address: {
        zipcode: "6850",
        city: "Carlsbourg",
        phone: "+32999999",
        firstname: "Olivier",
        lastname: "Wouters",
        address1: "Grand rue, 40",
        address2: "",
        country: {
          id: 29,
        },
        state: {
          id: 166,
        },
      },
      line_items: [
        {
          id: 251263,
          quantity: 2,
          max_quantity: null,
          price: "1.0",
          variant: {
            id: 23800,
          },
          tax_category: {
            id: 1,
          },
        },
      ],
      payments: [
        {
          amount: "8.5",
          updated_at: "Aug 23, 2022 10:50",
          payment_method: {
            name: "Paiement en espèces lors du retrait au comptoir",
          },
          state: "completed",
          cvv_response_message: null,
        },
      ],
      user: {
        id: 3497,
      },
      customer: {
        id: 2997,
      },
    },
  ],
};

const testInput = {
  type: "order_created_or_updated",
  at: "2022-09-06T11:35:40.772Z",
  enterprise_id: 591,
  enterprise_name: "Comptoir Demo OFN",
  user_id: 3497,
  user_name: "Olivier Wouters",
  id: "9e0728f4-00ed-43c7-adb3-1d573a848ac3",
  data: {
    id: 428730,
    number: "FAKE_R484327078",
    created_at: "2022-09-06",
    status: "complete",
    payment_status: "paid",
    shipment_status: "ready",
    total_price: "7.5",
    customer: {
      id: 2997,
    },
    billing_address: {
      id: 66375,
      phone: "+32999999",
      first_name: "Olivier",
      last_name: "Wouters",
      street_address_1: "Grand rue, 40",
      street_address_2: "",
      postal_code: "6850",
      locality: "Carlsbourg",
      region: {
        id: 166,
        name: "Luxembourg",
      },
      country: {
        id: 29,
        name: "Belgium",
      },
    },
    shipping_address: {
      id: 66376,
      phone: "+32999999",
      first_name: "Olivier",
      last_name: "Wouters",
      street_address_1: "Grand rue, 40",
      street_address_2: "",
      postal_code: "6850",
      locality: "Carlsbourg",
      region: {
        id: 166,
        name: "Luxembourg",
      },
      country: {
        id: 29,
        name: "Belgium",
      },
    },
    shipping_method: {
      id: 113,
      name: "Livraison par Bpost",
    },
    order_cycle: {
      id: 2545,
    },
    line_items: [
      {
        quantity: 1,
        variant: {
          id: 23800,
          name: "Chocolat noir sans sucre",
          sku: "00454000020023",
        },
        product: {
          id: 9737,
          name: "Chocolat noir sans sucre",
          category: {
            id: 2,
          },
          producer: {
            id: 591,
            name: "Comptoir Démo OFN",
          },
        },
      },
    ],
  },
};
