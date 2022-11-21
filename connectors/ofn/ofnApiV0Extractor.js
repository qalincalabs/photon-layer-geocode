export function cleanUpOrder(order) {
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
    delete line.tax_category_id;
    line.variant = { id: line.variant.id };
  }

  // TODO not supported
  delete order.payments
  delete order.adjustments

  return order;
}

export function cleanUpProduct(product) {
  delete product.master;
  delete product.sku;
  delete product.inherits_properties;
  delete product.on_hand;
  delete product.price;

  product.producer = {
    id: product.producer_id,
    name: product.variants[0].producer_name,
  };

  delete product.producer_id;

  product.tax_category = {
    id: product.tax_category_id,
  };

  delete product.tax_category_id;

  product.category = {
    id: product.category_id,
  };

  delete product.category_id;

  for (const variant of product.variants) {
    delete variant.stock_location_id;
    delete variant.stock_location_name;
    delete variant.variant_overrides_count;
    delete variant.image;
    delete variant.producer_name;
  }

  return product;
}

export function extract(context) {
  const contextMapping = defineContextExtraction();
  const extraction = applyExtraction(contextMapping, context);
  return extraction
}

function applyExtraction(contextMapping, context) {
  const logcicaContext = {};

  for (const ext of contextMapping.extractions) {
    const extracts = ext.extractAll(context);
    extracts.forEach((e) =>
      contextMapping.default.transformOneUuid(e, ext, contextMapping)
    );
    const copies = extracts.map((e) => Object.assign({}, e));

    extracts.forEach((e) => contextMapping.default.cleanUpOne(e));
      
    // TODO remove duplicates from copies ... consolidate ?
    logcicaContext[ext.destination.key] = (
      logcicaContext[ext.destination.key] ?? []
    ).concat(copies);

    const a = []

    for(const e of logcicaContext[ext.destination.key]){
        const existent = a.find(i => i.ids.includes(e.ids[0])) // TODO not perfect
        console.log(existent)
        if(existent == null)
          a.push(e)
        else
          Object.assign(existent, e);
    }

    logcicaContext[ext.destination.key] = a

  }

  return logcicaContext
}

function defineContextExtraction() {
  const extractFromOrder = (destinationName, orderProperty) => {
    return {
      destination: { key: destinationName },
      extractAll: (ctx) => ctx.orders.map((o) => o[orderProperty]),
    };
  };

  const contextMapping = {
    default: {
      transformOneUuid: (element, extraction, context) => {
        element.ids = [
          context.target.key +
            "/" +
            extraction.destination.key +
            "/" +
            element.id,
        ];
      },
      cleanUpOne: (element) => {
        Object.keys(element)
          .filter((k) => k != "ids")
          .forEach((key) => delete element[key]);
      },
    },
    target: { key: "ofn" },
    destination: { key: "logCiCa" },
    extractions: [
      {
        destination: { key: "enterprises" },
        extractAll: (ctx) => ctx.products.map((p) => p.producer),
      },
      {
        destination: { key: "product_categories" },
        extractAll: (ctx) => ctx.products.map((p) => p.category),
      },
      {
        destination: { key: "tax_categories" },
        extractAll: (ctx) => ctx.products.map((p) => p.tax_category),
      },
      {
        destination: { key: "variants" },
        extractAll: (ctx) => ctx.products.map((p) => p.variants).flat(),
      },
      {
        destination: { key: "products" },
        extractAll: (ctx) => ctx.products,
      },
      {
        destination: { key: "countries" },
        extractAll: (ctx) =>
          ctx.orders
            .map((o) => [o.bill_address.country, o.ship_address.country])
            .flat(),
      },
      {
        destination: { key: "states" },
        extractAll: (ctx) =>
          ctx.orders
            .map((o) => [o.bill_address.state, o.ship_address.state])
            .flat(),
      },
      extractFromOrder("enterprises", "distributor"),
      extractFromOrder("users", "user"),
      extractFromOrder("customers", "customer"),
      extractFromOrder("order_cycles", "order_cycle"),
      extractFromOrder("shipping_methods", "shipping_method"),
      {
        destination: { key: "orders" },
        extractAll: (ctx) => ctx.orders,
      },
    ],
  };
  return contextMapping;
}

const OfnApiV0Extractor = () => {};
export default OfnApiV0Extractor;
