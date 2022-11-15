// add to consolidation strategy the code part so it stays as aggregate until there

// TODO get rid of product_name and generic_name
// origin is country of origin

// use word taxonomy instead ...

const tagAggregates = [
  "additives",
  "allergens",
  "categories",
  "labels",
  "traces",
  "origins",
];

const mapProperties = [
  {
    origin: "product_name",
    destination: "name",
  },
  {
    origin: "generic_name",
    destination: "genericName",
  },
];

const nutrientProperties = [
  "energy",
  "carbohydrates",
  "sugars",
  "fat",
  "saturated-fat",
  "proteins",
  "salt",
  "sodium",
];

export function mapProduct(inputProduct, config) {
  const languages = config.languages;

  const context = {
    units: [],
  };

  const product = {
    ids: ["off/products/" + inputProduct.code],
    barcode: inputProduct.code,
    createdAt: new Date(inputProduct.created_t * 1000),
    modifiedAt: new Date(inputProduct.last_modified_t * 1000),
    name: inputProduct.product_name,
    genericName: inputProduct.generic_name,
  };

  mapIngredients(inputProduct, product, context, languages);

  product.images = [
    {
      url: inputProduct.image_front_url,
    },
  ];

  mapQuantity(inputProduct, product, context);
  mapNutrients(inputProduct, product, context);
  mapTags(inputProduct, product, context, languages);

  context.countriesOfOrigin = context.origins;
  delete context.origins;

  mapCategoryAndClassification(inputProduct, product, context);

  context.units = [
    ...new Map(context.units.map((item) => [item.ids[0], item])).values(),
  ];

  context.products = [product];

  return context;
}

function mapIngredients(inputProduct, product, context, languages) {
  product.ingredientStatement = inputProduct.ingredients_text;

  if (inputProduct.ingredients == null) return;

  context.ingredients = [];
  for (const val of inputProduct.ingredients) {
    const ingredientIndex = inputProduct.ingredients_tags.findIndex(
      (t) => t == val.id
    );

    context.ingredients.push({
      ids: ["off/ingredients/" + val.id],
      translations: languages.map((l) => ({
        key: l,
        value: {
          name: inputProduct["ingredients_tags_" + l][ingredientIndex],
        },
      })),
    });
  }

  product.ingredientDetails = inputProduct.ingredients.map((i) => ({
    ingredient: {
      ids: ["off/ingredients/" + i.id],
    },
    sequence: i.rank,
    contentPercentage: i.percent
  }));
}

function mapQuantity(inputProduct, product, context) {
  const quantityGrOrMl = inputProduct.product_quantity;

  const gr = {
    ids: ["off/units/g"],
  };

  product.netWeight = {
    value: quantityGrOrMl,
    unit: gr,
  };

  context.units.push(gr);
}

function mapNutrients(inputProduct, product, context) {
  product.nutrientDetails = [];
  context.nutrients = [];

  const inputNutriments = inputProduct.nutriments;

  for (const n of nutrientProperties) {
    const nutrient = {
      ids: ["off/nutrients/" + n],
    };

    const unit = {
      ids: ["off/units/" + inputNutriments[n + "_unit"]],
    };

    product.nutrientDetails.push({
      nutrient: nutrient,
      quantity: {
        value: inputNutriments[n + "_100g"],
        unit: unit,
      },
    });

    context.units.push(unit);
    context.nutrients.push(nutrient);
  }
}

function mapCategoryAndClassification(inputProduct, product, context) {
  context.classification = [
    {
      ids: ["off/categories"],
    },
    {
      ids: ["nutriscore"],
    },
  ];

  context.categories.forEach(
    (c) => (c.classification = { ids: ["off/categories"] })
  );

  // food groups (nutriscore)
  inputProduct.food_groups_tags.forEach((f) => {
    context.categories.push({
      ids: ["nutriscore/food_group/" + f],
      name: f,
      classification: { ids: ["nutriscore"] },
    });
  });

  // Food group classification
  for (const t of tagAggregates) {
    product[t] = context[t]?.map((e) => ({ ids: e.ids }));
  }
}

function mapTags(inputProduct, product, context, languages) {
  for (const p of mapProperties) {
    product[p.destination] = inputProduct[p.origin];
  }

  for (const ta of tagAggregates) {
    const tags = inputProduct[ta + "_tags"];

    if (tags.length == 0) continue;

    context[ta] = [];

    for (let i = 0; i < tags.length; i++) {
      const a = {
        ids: ["off/" + ta + "/" + tags[i]],
        translations: {},
      };

      for (const l of languages) {
        const nameTl = inputProduct[ta + "_tags_" + l][i];
        if (nameTl != null)
          a.translations[l] = {
            name: nameTl,
          };
      }

      console.log(a);
      context[ta].push(a);
    }
  }
}

const OffLogcicaMapper = () => {}
export default OffLogcicaMapper;
