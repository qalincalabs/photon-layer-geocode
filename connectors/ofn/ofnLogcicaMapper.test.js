import * as mapper from "./ofnLogcicaMapper.js";

test("Open food network mapper", async () => {
  // const response = mapper.contextFromEvent(testInput)
  const prepared = prepareOrderBeforeExploding(ofnOrderSample);
  console.log(JSON.stringify(prepared, null, 2));
  const exploded = explodeOrder(prepared);

  console.log(JSON.stringify(exploded, null, 2));
});

function explodeOrder(order) {

  const context = {
    enterprises: [order.distributor],
    order_cycles: [order.order_cycle],
    shipping_methods: [order.shipping_method],
    users: [order.user],
    customers: [order.customer],
  };

  order.distributor = {
    id: order.distributor.id,
  };

  order.shipping_method = {
    id: order.shipping_method.id,
  };

  order.user = {
    id: order.user.id,
  };

  context.order = order;

  context.countries = [];
  context.states = [];

  ["ship_address", "bill_address"].forEach((a) => {
    const country = order[a].country
    context.countries.push(country);
    order[a].country = { id: country.id };

    const state = order[a].state
    context.states.push(state);
    order[a].state = { id: state.id };
  });

  context.variants = []
  context.products = []

  for(const line of order.line_items){

    context.products.push(line.variant.product)
    line.variant.product = {ids: line.variant.product.ids}
    
    context.variants.push(line.variant)

    line.variant = { id: line.variant.id }
  }

  return context;
}

// TODO adjustments not handled
function prepareOrderBeforeExploding(order) {
  order.user = {
    id: order.user_id,
    full_name: order.full_name,
    email: order.email,
    phone: order.phone,
  };

  delete order.user_id;
  delete order.full_name;
  delete order.email;
  delete order.phone;

  order.distributor.name = order.distributor_name;
  delete order.distributor_name;

  if (order.customer_id != null) {
    order.customer = {
      id: order.customer_id,
    };
    delete order.customer_id;
  }

  ["bill_address", "ship_address"].forEach((a) => {
    delete order[a].id;

    order[a].country = {
      id: order[a].country_id,
      name: order[a].country_name,
    };

    delete order[a].country_id;
    delete order[a].country_name;

    order[a].state = {
      id: order[a].state_id,
      name: order[a].state_name,
    };

    delete order[a].state_id;
    delete order[a].state_name;
  });

  for (const line of order.line_items) {
    delete line.order_id;

    line.tax_category = {
      id: line.tax_category_id,
    };

    delete line.tax_category_id;

    line.variant.product = {
      ids: ["ofn/"+order.distributor.id+"/products/"+line.variant.product_name], // TODO sluggify
      name: line.variant.product_name,
    };

    delete line.variant.product_name;
  }

  for (const p of order.payments) {
    p.payment_method = {
      name: p.payment_method,
    };
  }

  return order;
}

function explode(input) {
  const context = {};

  return context;
}

const ofnApiVoResponse = {
  orders: [],
  products: [],
};

// ofn context

// first explode, least shareable item
// this will give the ids from context and least shareable items
// second map to language least shareable item

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
      max_quantity: null,
      price: "1.0",
      order_id: 422667,
      tax_category_id: 1,
      variant: {
        id: 23800,
        is_master: false,
        product_name: "Chocolat noir sans sucre",
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
      },
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
  display_total: "<span class=\"money-whole\">8</span><span class=\"money-decimal-mark\">.</span><span class=\"money-decimal\">50</span> <span class=\"money-currency-symbol\">&#x20AC;</span>",
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
      tax_category_id: null
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
      tax_category_id: null
    }
  ],
  distributor: {
    id: 591,
    name: "Comptoir Demo OFN"
  },
  order_cycle: {
    id: 2545
  },
  shipping_method: {
    id: 112,
    require_ship_address: true,
    name: "Livraison par Bpost",
    description: "La commande vous sera livrée dans les 2 jours ouvrables après la date choisie lors de votre commande -  vu les circonstances ce délai peut-être plus long.\r\n\r\nExemple : si commande prête pour le lundi 20/04, elle vous sera livrée vers le 22/04.",
    price: "6.5"
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
      name: "Belgium"
    },
    state: {
      id: 166,
      name: "Luxembourg"
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
    country: {
      id: 29,
      name: "Belgium"
    },
    state: {
      id: 166,
      name: "Luxembourg"
    }
  },
  line_items: [
    {
      id: 251263,
      quantity: 2,
      max_quantity: null,
      price: "1.0",
      variant: {
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
          ids: [
            "ofn/591/Chocolat noir sans sucre"
          ],
          name: "Chocolat noir sans sucre"
        }
      },
      tax_category: {
        id: 1
      }
    }
  ],
  payments: [
    {
      amount: "8.5",
      updated_at: "Aug 23, 2022 10:50",
      payment_method: {
        name: "Paiement en espèces lors du retrait au comptoir"
      },
      state: "completed",
      cvv_response_message: null
    }
  ],
  user: {
    id: 3497,
    full_name: "Olivier Wouters",
    email: "olivier5741@gmail.com",
    phone: "+32999999"
  },
  customer: {
    id: 2997
  }
}

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
