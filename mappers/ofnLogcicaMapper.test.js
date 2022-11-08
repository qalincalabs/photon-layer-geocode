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
        id: 2997
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
          id: 166
        },
        country: {
          id: 29
        }
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
          id: 166
        },
        country: {
          id: 29
        }
      },
      line_items: [
        {
          id: 251263,
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
    }
  ],
  // map straight to workspace
  enterprises: [
    {
      id: 591,
      name: "Comptoir Demo OFN",
    },
  ],
  // map straight to shipping methods
  shippingMethods: [
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
    }
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
        id: 1
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
  ]
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
