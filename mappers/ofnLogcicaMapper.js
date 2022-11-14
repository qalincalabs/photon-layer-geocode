export class OfnLogcicaMapper {
    constructor() {
    }

    map(data){
      return data
    }
}

function uniqByKeepLast(data, key) {
  return [...new Map(data.map((x) => [key(x), x])).values()];
}

function getInformalQuantity(quantityText){
  const quantityTextPattern = /^\d+(\.\d*)?[ ]?[^.^,]+$/
  const quantityWeightOrVolumePattern = /^\d+(\.\d*)?[ ]?(g|G|ml|mL|kg|Kg|KG|l|L)$/
  const quantityExtractValuePattern = /^\d+(\.\d*)?/

  const isWeightOrVolmue = quantityWeightOrVolumePattern.test(quantityText)

  if(isWeightOrVolmue){
    console.log("Weight or volume")
    return null
  }

  if(quantityTextPattern.test(quantityText) == false)
    return null
  
  const quantityValue = quantityExtractValuePattern.exec(quantityText)[0]
  const quantityUnitText = quantityText.slice(quantityValue.length).trim()
  
  return {
    value: quantityValue,
    unit: {
      text: quantityUnitText
    }
  }
}

function contextFromEvent(event) {
  const context = {};

  const shippingAddress = event.data.shipping_address;
  const billingAddress = event.data.billing_address;

  // add region et quartier
  context.codes = [
    {
      ids: ["ofn_be/country/" + shippingAddress.country.id],
      name: "Belgium",
      list: {
        ids: ["iso/country"],
      },
    },
  ];

  // anonymise
  const mapAddress = (address) => ({
    street: [address.street_address_1, address.street_address_2]
      .filter(Boolean)
      .join(", ")
      .replace(/[0-9]/g, '')
      .replace(/[^\w\s\']|_/g, "")
      .replace(/\s+/g, " ")
      .trim(),
    postalCode: address.postal_code,
    locality: address.locality,
    country: {
      ids: ["ofn_be/country/" + address.country.id],
    },
  });

  // consolidate if same, make a last used data, make an id with a hash (hash object library ...) ?
  context.places = [
    {
      ids: ["ofn_be/address/" + shippingAddress.id],
      services: ["shipping"],
      private: true,
      address: mapAddress(shippingAddress)
    },
    {
      ids: ["ofn_be/address/" + billingAddress.id],
      services: ["billing"],
      private: true,
      address: mapAddress(billingAddress),
    },
  ];

  context.workspaces = [
    {
      ids: ["ofn_be/user/" + event.user_id],
      //name: event.user_name,
    },
    {
      ids: ["ofn_be/enterprise/" + event.enterprise_id],
      name: event.enterprise_name,
    },
    {
      ids: ["logcica/workspace/ofn_be"],
    },
  ];

  const producerWorkspaces = event.data.line_items.map((i) => ({
    ids: ["ofn_be/enterprise/" + i.product.producer.id],
    name: i.product.producer.name,
  }));

  context.workspaces = context.workspaces.concat(producerWorkspaces);

  context.workspaces = uniqByKeepLast(context.workspaces, (x) => x.ids[0]);

  context.customers = [
    {
      ids: ["ofn_be/customer/" + event.data.customer.id],
      /*
      name: [
        event.data.billing_address.first_name,
        event.data.billing_address.last_name,
      ].join(" "),
      */
      owner: {
        workspace: {
          ids: ["ofn_be/enterprise/" + event.enterprise_id],
        },
      },
      places: [
        {
          ids: ["ofn_be/address/" + shippingAddress.id],
        },
        {
          ids: ["ofn_be/address/" + billingAddress.id],
        },
      ],
    },
  ];

  context.suppliers = [
    {
      ids: [
        "ofn_be/user/" + event.user_id + "/enterprise/" + event.enterprise_id,
      ],
      name: event.enterprise_name,
      owner: {
        workspace: {
          ids: ["ofn_be/user/" + event.user_id],
        },
      },
    },
  ];

  // todo add type : delivery or pickup (require shipping address ?)

  const shippingMethod = {
      ids: [
        "ofn_be/shipping_method/" + event.data.shipping_method.id,
        "https://openfoodnetwork.be/shippingmethods/" +
          event.data.shipping_method.id,
      ],
      type: event.data.shipping_method.type,
      name: event.data.shipping_method.name,
      description: event.data.shipping_method.description,
      owner: {
        workspace: {
          ids: ["ofn_be/enterprise/" + event.enterprise_id],
        },
      },
    }

  if(shippingMethod.type == "pickup"){
    shippingMethod.pickup = {
      place: {
        ids: ["ofn_be/address/" + shippingAddress.id]
      }
    }
  }

  context.shippingMethods = [shippingMethod];

  context.salesSessions = [
    {
      ids: ["ofn_be/order_cycle/" + event.data.order_cycle.id],
      owner: {
        workspace: {
          ids: ["ofn_be/enterprise/" + event.enterprise_id],
        },
      },
    },
  ]

  context.catalogs = [
    {
      ids: ["ofn_be/order_cycle/" + event.data.order_cycle.id],
      owner: {
        workspace: {
          ids: ["ofn_be/enterprise/" + event.enterprise_id],
        },
      },
    },
  ];

  context.productClassifications = [
    {
      ids: ["logcica/product_classification/ofn_be"],
      owner: {
        workspace: {
          ids: ["logcica/workspace/ofn_be"],
        }
      },
    },
  ];

  context.productCategories = uniqByKeepLast(
    event.data.line_items.map((i) => ({
      ids: ["ofn_be/taxon/" + i.product.category.id],
      classification: {
        ids: ["logcica/product_classification/ofn_be"],
      },
    })),
    (x) => x.ids[0]
  );

  context.productGroups = uniqByKeepLast(
    event.data.line_items.map((i) => ({
      ids: ["ofn_be/product/" + i.product.id],
      name: i.product.name,
      producer: {
        workspace: {
          ids: ["ofn_be/enterprise/" + i.product.producer.id],
        },
      },
    })),
    (x) => x.ids[0]
  );

  // TODO get the producer id !!
  context.products = uniqByKeepLast(
    event.data.line_items.map((i) => {
    
     const product = {
        ids: [
          "ofn_be/variant/" + i.variant.id,
          "ofn_be/variant/id/" + i.variant.id,
        ],
        name: i.variant.name,
        group: {
          ids: ["ofn_be/product/" + i.product.id],
        },
        categories: [
          {
            ids: ["ofn_be/taxon/" + i.product.category.id],
          },
        ],
        producer: {
          workspace: {
            ids: ["ofn_be/enterprise/" + i.product.producer.id],
          },
        },
        quantity: getInformalQuantity(i.variant.quantityText)
      }

      if(i.variant.netWeight)
        product.netWeight = {
          value: i.variant.netWeight.toString(),
          unit: {
            code: "GRM"
          }
        }

      if(i.variant.netVolume)
        product.netWeight = {
          value: i.variant.netVolume.toString(),
          unit: {
            code: "MLT"
          }
        }

      return product
    }),
    (x) => x.ids[0]
  );

  context.offers = uniqByKeepLast(
    event.data.line_items.map((i) => ({
      ids: [
        "ofn_be/enterprise/" + event.enterprise_id + "/variant/" + i.variant.id + "/price/" + i.variant.price 
      ],
      product: {
        ids: ["ofn_be/variant/" + i.variant.id],
      },
      price: {
        value: i.variant.price
      },
      owner: {
        workspace: {
          ids: ["ofn_be/enterprise/" + event.enterprise_id],
        },
      }
    })),
    (x) => x.ids[0]
  );

  context.catalogItems = uniqByKeepLast(
    event.data.line_items.map((i) => ({
      ids: [
        "ofn_be/order_cycle/" +
          event.data.order_cycle.id +
          "/variant/" +
          i.variant.id,
      ],
      name: i.variant.name,
      product: {
        ids: ["ofn_be/variant/" + i.variant.id],
      },
      catalog: {
        ids: ["ofn_be/order_cycle/" + event.data.order_cycle.id],
      },
      offers: [
        {
          ids: ["ofn_be/enterprise/" + event.enterprise_id + "/variant/" + i.variant.id + "/price/" + i.variant.price ]
        }
      ]
    })),
    (x) => x.ids[0]
  );

  const order = event.data;

  context.orders = [
    {
      number: order.number,
      link: "https://openfoodnetwork.be/admin/orders/" + order.number + "/edit",
      ids: ["ofn_be/orders/" + order.number],
      createdAt: order.created_at,
      status: order.status.toLowerCase(),
      shipmentStatus: order.shipment_status.toLowerCase(),
      paymentStatus: order.payment_status.toLowerCase(),
      buyer: {
        customer: {
          ids: ["ofn_be/customer/" + event.data.customer.id],
        },
        workspace: {
          ids: ["ofn_be/user/" + event.user_id],
        },
      },
      seller: {
        supplier: {
          ids: [
            "ofn_be/user/" +
              event.user_id +
              "/enterprise/" +
              event.enterprise_id,
          ],
        },
        workspace: {
          ids: ["ofn_be/enterprise/" + event.enterprise_id],
        },
      },
      broker: {
        workspace: {
          ids: ["logcica/workspace/ofn_be"],
        },
      },
      channel: {
        ids: ["logcica/transaction_channel/ofn_be"],
        name: "Open Food Network Belgium",
      },
      shippingAddress: {
        place: {
          ids: ["ofn_be/address/" + shippingAddress.id],
        },
      },
      shippingMethod: {
        ids: ["ofn_be/shipping_method/" + order.shipping_method.id],
      },
      salesSession: {
        ids: ["ofn_be/order_cycle/" + event.data.order_cycle.id],
      },
      totalPrice: {
        value: order.total_price
      },
      lines: order.line_items.map((i) => ({
        name: i.variant.name,
        item: {
          ids: [
            `ofn_be/order_cycle/${order.order_cycle.id}/variant/${i.variant.id}`,
          ],
        },
        product: {
          ids: ["ofn_be/variant/" + i.variant.id],
        },
        offer: {
          ids: ["ofn_be/enterprise/" + event.enterprise_id + "/variant/" + i.variant.id + "/price/" + i.variant.price ]
        },
        quantity: {
          value: i.quantity.toString()
        },
      })),
    },
  ];
  return context;
}