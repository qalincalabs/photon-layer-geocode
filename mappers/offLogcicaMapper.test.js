test("Open food facts mapper", () => {


  const languages = ["en", "fr"];
  const input = offApiResponse;

  const mapping = map(offApiResponse.product, languages)

  console.log(JSON.stringify(mapping, null, 2));
  console.log(createLanguageUrl(["en", "fr"]).join(","));
});

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

function createLanguageUrl(languages) {
  const fields = [];

  for (const t of tagAggregates) {
    for (const l of languages) {
      fields.push(t + "_tags_" + l);
    }
  }

  return fields;
}

function map(inputProduct, languages) {

  const context = {
    units: []
  };

  const product = {
    ids: ["off/products/" + inputProduct.code],
    barcodes: [inputProduct.code],
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

  context.units = [...new Map(context.units.map(item =>
    [item.ids[0], item])).values()];

  context.products = [product];

  return context;
}

// inputProduct, product, context, languages

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
  }));
}

function mapQuantity(inputProduct, product, context) {
  const quantityGrOrMl = inputProduct.product_quantity;

  const gr = {
    ids: ["off/units/g"],
  }

  product.netWeight = {
    value: quantityGrOrMl,
    unit: gr
  };

  context.units.push(gr)
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
    }

    product.nutrientDetails.push({
      nutrient: nutrient,
      quantity: {
        value: inputNutriments[n + "_100g"],
        unit: unit
      },
    });

    context.units.push(unit)
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

const offApiResponse = {
  code: "5391533790106",
  product: {
    _id: "5391533790106",
    _keywords: [
      "sheep",
      "alternative",
      "dairie",
      "grilling",
      "fermented",
      "product",
      "cheese",
      "food",
      "ewelloumi",
      "halloumi",
      "farm",
      "ballyhubbock",
      "ireland",
      "meat",
      "milk",
      "irish",
      "cypriot",
    ],
    added_countries_tags: [],
    additives_n: 0,
    additives_old_n: 0,
    additives_old_tags: [],
    additives_original_tags: [],
    additives_tags: [],
    allergens: "en:milk",
    allergens_from_ingredients: "en:milk, Milk",
    allergens_from_user: "(en) Milk",
    allergens_hierarchy: ["en:milk"],
    allergens_lc: "en",
    allergens_tags: ["en:milk"],
    amino_acids_tags: [],
    brands: "Ballyhubbock Farm",
    brands_tags: ["ballyhubbock-farm"],
    categories:
      "Dairies,Fermented foods,Fermented milk products,Cheeses,Meat alternatives,Cypriot cheeses,Grilling cheeses,Halloumi",
    categories_hierarchy: [
      "en:dairies",
      "en:fermented-foods",
      "en:fermented-milk-products",
      "en:cheeses",
      "en:meat-alternatives",
      "en:cypriot-cheeses",
      "en:grilling-cheeses",
      "en:halloumi",
    ],
    categories_lc: "en",
    categories_properties: {
      "agribalyse_proxy_food_code:en": "12001",
      "ciqual_food_code:en": "12999",
    },
    categories_properties_tags: [
      "all-products",
      "categories-known",
      "agribalyse-food-code-unknown",
      "agribalyse-proxy-food-code-12001",
      "agribalyse-proxy-food-code-known",
      "ciqual-food-code-12999",
      "ciqual-food-code-known",
      "agribalyse-known",
      "agribalyse-12001",
    ],
    categories_tags: [
      "en:dairies",
      "en:fermented-foods",
      "en:fermented-milk-products",
      "en:cheeses",
      "en:meat-alternatives",
      "en:cypriot-cheeses",
      "en:grilling-cheeses",
      "en:halloumi",
    ],
    checkers_tags: [],
    cities_tags: [],
    code: "5391533790106",
    codes_tags: [
      "code-13",
      "5391533790xxx",
      "539153379xxxx",
      "53915337xxxxx",
      "5391533xxxxxx",
      "539153xxxxxxx",
      "53915xxxxxxxx",
      "5391xxxxxxxxx",
      "539xxxxxxxxxx",
      "53xxxxxxxxxxx",
      "5xxxxxxxxxxxx",
    ],
    compared_to_category: "en:halloumi",
    complete: 0,
    completeness: 1.075,
    correctors_tags: ["smoothie-app", "olivier5741"],
    countries: "Ireland",
    countries_hierarchy: ["en:ireland"],
    countries_lc: "en",
    countries_tags: ["en:ireland"],
    created_t: 1627739624,
    creator: "kiliweb",
    data_quality_bugs_tags: [],
    data_quality_errors_tags: [],
    data_quality_info_tags: [
      "en:packaging-data-incomplete",
      "en:ingredients-percent-analysis-ok",
      "en:ecoscore-extended-data-not-computed",
      "en:food-groups-1-known",
      "en:food-groups-2-known",
      "en:food-groups-3-unknown",
    ],
    data_quality_tags: [
      "en:packaging-data-incomplete",
      "en:ingredients-percent-analysis-ok",
      "en:ecoscore-extended-data-not-computed",
      "en:food-groups-1-known",
      "en:food-groups-2-known",
      "en:food-groups-3-unknown",
      "en:ecoscore-packaging-unspecified-shape",
      "en:ecoscore-production-system-no-label",
    ],
    data_quality_warnings_tags: [
      "en:ecoscore-packaging-unspecified-shape",
      "en:ecoscore-production-system-no-label",
    ],
    data_sources: "App - yuka, Apps, App - smoothie-openfoodfacts",
    data_sources_tags: ["app-yuka", "apps", "app-smoothie-openfoodfacts"],
    debug_param_sorted_langs: ["en"],
    ecoscore_data: {
      adjustments: {
        origins_of_ingredients: {
          aggregated_origins: [
            {
              origin: "en:ireland",
              percent: 100,
            },
          ],
          epi_score: 73,
          epi_value: 2,
          origins_from_origins_field: ["en:ireland"],
          transportation_scores: {
            ad: 64,
            al: 51,
            at: 24,
            ax: 73,
            ba: 28,
            be: 53,
            bg: 31,
            ch: 14,
            cy: 49,
            cz: 7,
            de: 31,
            dk: 7,
            dz: 55,
            ee: 78,
            eg: 44,
            es: 72,
            fi: 76,
            fo: 69,
            fr: 55,
            gg: 58,
            gi: 82,
            gr: 59,
            hr: 40,
            hu: 20,
            ie: 100,
            il: 44,
            im: 91,
            is: 69,
            it: 54,
            je: 56,
            lb: 48,
            li: 13,
            lt: 70,
            lu: 42,
            lv: 78,
            ly: 66,
            ma: 69,
            mc: 70,
            md: 38,
            me: 46,
            mk: 38,
            mt: 66,
            nl: 47,
            no: 86,
            pl: 64,
            ps: 51,
            pt: 77,
            ro: 41,
            rs: 28,
            se: 71,
            si: 42,
            sj: 60,
            sk: 11,
            sm: 48,
            sy: 35,
            tn: 70,
            tr: 17,
            ua: 50,
            uk: 79,
            us: 0,
            va: 33,
            world: 0,
            xk: 37,
          },
          transportation_values: {
            ad: 10,
            al: 8,
            at: 4,
            ax: 11,
            ba: 4,
            be: 8,
            bg: 5,
            ch: 2,
            cy: 7,
            cz: 1,
            de: 5,
            dk: 1,
            dz: 8,
            ee: 12,
            eg: 7,
            es: 11,
            fi: 11,
            fo: 10,
            fr: 8,
            gg: 9,
            gi: 12,
            gr: 9,
            hr: 6,
            hu: 3,
            ie: 15,
            il: 7,
            im: 14,
            is: 10,
            it: 8,
            je: 8,
            lb: 7,
            li: 2,
            lt: 11,
            lu: 6,
            lv: 12,
            ly: 10,
            ma: 10,
            mc: 11,
            md: 6,
            me: 7,
            mk: 6,
            mt: 10,
            nl: 7,
            no: 13,
            pl: 10,
            ps: 8,
            pt: 12,
            ro: 6,
            rs: 4,
            se: 11,
            si: 6,
            sj: 9,
            sk: 2,
            sm: 7,
            sy: 5,
            tn: 11,
            tr: 3,
            ua: 8,
            uk: 12,
            us: 0,
            va: 5,
            world: 0,
            xk: 6,
          },
          values: {
            ad: 12,
            al: 10,
            at: 6,
            ax: 13,
            ba: 6,
            be: 10,
            bg: 7,
            ch: 4,
            cy: 9,
            cz: 3,
            de: 7,
            dk: 3,
            dz: 10,
            ee: 14,
            eg: 9,
            es: 13,
            fi: 13,
            fo: 12,
            fr: 10,
            gg: 11,
            gi: 14,
            gr: 11,
            hr: 8,
            hu: 5,
            ie: 17,
            il: 9,
            im: 16,
            is: 12,
            it: 10,
            je: 10,
            lb: 9,
            li: 4,
            lt: 13,
            lu: 8,
            lv: 14,
            ly: 12,
            ma: 12,
            mc: 13,
            md: 8,
            me: 9,
            mk: 8,
            mt: 12,
            nl: 9,
            no: 15,
            pl: 12,
            ps: 10,
            pt: 14,
            ro: 8,
            rs: 6,
            se: 13,
            si: 8,
            sj: 11,
            sk: 4,
            sm: 9,
            sy: 7,
            tn: 13,
            tr: 5,
            ua: 10,
            uk: 14,
            us: 2,
            va: 7,
            world: 2,
            xk: 8,
          },
        },
        packaging: {
          non_recyclable_and_non_biodegradable_materials: 1,
          packagings: [
            {
              ecoscore_material_score: 0,
              ecoscore_shape_ratio: 1,
              material: "en:plastic",
              non_recyclable_and_non_biodegradable: "maybe",
              shape: "en:unknown",
            },
          ],
          score: 0,
          value: -10,
          warning: "unspecified_shape",
        },
        production_system: {
          labels: [],
          value: 0,
          warning: "no_label",
        },
        threatened_species: {},
      },
      agribalyse: {
        agribalyse_proxy_food_code: "12001",
        co2_agriculture: 4.7126103,
        co2_consumption: 0.0047993021,
        co2_distribution: 0.029050683,
        co2_packaging: 0.26662691,
        co2_processing: 0.22452742,
        co2_total: 5.4920327,
        co2_transportation: 0.25844052,
        code: "12001",
        dqr: "1.81",
        ef_agriculture: 0.41632179,
        ef_consumption: 0.0024293397,
        ef_distribution: 0.0088270864,
        ef_packaging: 0.019721226,
        ef_processing: 0.028839787,
        ef_total: 0.49584622,
        ef_transportation: 0.020064567,
        is_beverage: 0,
        name_en: "Camembert cheese, from cow's milk",
        name_fr: "Camembert, sans précision",
        score: 54,
      },
      grade: "c",
      grades: {
        ad: "c",
        al: "c",
        at: "c",
        ax: "c",
        ba: "c",
        be: "c",
        bg: "c",
        ch: "c",
        cy: "c",
        cz: "c",
        de: "c",
        dk: "c",
        dz: "c",
        ee: "c",
        eg: "c",
        es: "c",
        fi: "c",
        fo: "c",
        fr: "c",
        gg: "c",
        gi: "c",
        gr: "c",
        hr: "c",
        hu: "c",
        ie: "b",
        il: "c",
        im: "b",
        is: "c",
        it: "c",
        je: "c",
        lb: "c",
        li: "c",
        lt: "c",
        lu: "c",
        lv: "c",
        ly: "c",
        ma: "c",
        mc: "c",
        md: "c",
        me: "c",
        mk: "c",
        mt: "c",
        nl: "c",
        no: "c",
        pl: "c",
        ps: "c",
        pt: "c",
        ro: "c",
        rs: "c",
        se: "c",
        si: "c",
        sj: "c",
        sk: "c",
        sm: "c",
        sy: "c",
        tn: "c",
        tr: "c",
        ua: "c",
        uk: "c",
        us: "c",
        va: "c",
        world: "c",
        xk: "c",
      },
      missing: {
        labels: 1,
        packagings: 1,
      },
      missing_data_warning: 1,
      score: 54,
      scores: {
        ad: 56,
        al: 54,
        at: 50,
        ax: 57,
        ba: 50,
        be: 54,
        bg: 51,
        ch: 48,
        cy: 53,
        cz: 47,
        de: 51,
        dk: 47,
        dz: 54,
        ee: 58,
        eg: 53,
        es: 57,
        fi: 57,
        fo: 56,
        fr: 54,
        gg: 55,
        gi: 58,
        gr: 55,
        hr: 52,
        hu: 49,
        ie: 61,
        il: 53,
        im: 60,
        is: 56,
        it: 54,
        je: 54,
        lb: 53,
        li: 48,
        lt: 57,
        lu: 52,
        lv: 58,
        ly: 56,
        ma: 56,
        mc: 57,
        md: 52,
        me: 53,
        mk: 52,
        mt: 56,
        nl: 53,
        no: 59,
        pl: 56,
        ps: 54,
        pt: 58,
        ro: 52,
        rs: 50,
        se: 57,
        si: 52,
        sj: 55,
        sk: 48,
        sm: 53,
        sy: 51,
        tn: 57,
        tr: 49,
        ua: 54,
        uk: 58,
        us: 46,
        va: 51,
        world: 46,
        xk: 52,
      },
      status: "known",
    },
    ecoscore_grade: "c",
    ecoscore_score: 54,
    ecoscore_tags: ["c"],
    editors_tags: [
      "kiliweb",
      "smoothie-app",
      "yuka.sY2b0xO6T85zoF3NwEKvlhx_Usrig2jubzPhqVWs_ciBDZvkZYpf2YbqIas",
      "olivier5741",
    ],
    emb_codes: "IE 2136 EC",
    emb_codes_tags: ["ie-2136-ec"],
    entry_dates_tags: ["2021-07-31", "2021-07", "2021"],
    expiration_date: "28/03/2023",
    food_groups: "en:cheese",
    food_groups_tags: ["en:milk-and-dairy-products", "en:cheese"],
    generic_name: "Halloumi",
    generic_name_en: "Halloumi",
    id: "5391533790106",
    image_front_small_url:
      "https://images.openfoodfacts.org/images/products/539/153/379/0106/front_en.3.200.jpg",
    image_front_thumb_url:
      "https://images.openfoodfacts.org/images/products/539/153/379/0106/front_en.3.100.jpg",
    image_front_url:
      "https://images.openfoodfacts.org/images/products/539/153/379/0106/front_en.3.400.jpg",
    image_nutrition_small_url:
      "https://images.openfoodfacts.org/images/products/539/153/379/0106/nutrition_en.5.200.jpg",
    image_nutrition_thumb_url:
      "https://images.openfoodfacts.org/images/products/539/153/379/0106/nutrition_en.5.100.jpg",
    image_nutrition_url:
      "https://images.openfoodfacts.org/images/products/539/153/379/0106/nutrition_en.5.400.jpg",
    image_small_url:
      "https://images.openfoodfacts.org/images/products/539/153/379/0106/front_en.3.200.jpg",
    image_thumb_url:
      "https://images.openfoodfacts.org/images/products/539/153/379/0106/front_en.3.100.jpg",
    image_url:
      "https://images.openfoodfacts.org/images/products/539/153/379/0106/front_en.3.400.jpg",
    images: {
      1: {
        sizes: {
          100: {
            h: 100,
            w: 96,
          },
          400: {
            h: 400,
            w: 385,
          },
          full: {
            h: 1055,
            w: 1015,
          },
        },
        uploaded_t: 1627739624,
        uploader: "kiliweb",
      },
      2: {
        sizes: {
          100: {
            h: 68,
            w: 100,
          },
          400: {
            h: 270,
            w: 400,
          },
          full: {
            h: 489,
            w: 724,
          },
        },
        uploaded_t: 1627739625,
        uploader: "kiliweb",
      },
      front_en: {
        angle: 0,
        coordinates_image_size: "full",
        geometry: "0x0--1--1",
        imgid: "1",
        normalize: null,
        rev: "3",
        sizes: {
          100: {
            h: 100,
            w: 96,
          },
          200: {
            h: 200,
            w: 192,
          },
          400: {
            h: 400,
            w: 385,
          },
          full: {
            h: 1055,
            w: 1015,
          },
        },
        white_magic: null,
        x1: "-1",
        x2: "-1",
        y1: "-1",
        y2: "-1",
      },
      nutrition_en: {
        angle: 0,
        coordinates_image_size: "full",
        geometry: "0x0--1--1",
        imgid: "2",
        normalize: null,
        rev: "5",
        sizes: {
          100: {
            h: 68,
            w: 100,
          },
          200: {
            h: 135,
            w: 200,
          },
          400: {
            h: 270,
            w: 400,
          },
          full: {
            h: 489,
            w: 724,
          },
        },
        white_magic: null,
        x1: "-1",
        x2: "-1",
        y1: "-1",
        y2: "-1",
      },
    },
    informers_tags: [
      "yuka.sY2b0xO6T85zoF3NwEKvlhx_Usrig2jubzPhqVWs_ciBDZvkZYpf2YbqIas",
      "kiliweb",
      "smoothie-app",
      "olivier5741",
    ],
    ingredients: [
      {
        id: "en:sheeps-milk",
        percent_estimate: 66.6666666666667,
        percent_max: 100,
        percent_min: 33.3333333333333,
        rank: 1,
        text: "Sheep _Milk_",
        vegan: "no",
        vegetarian: "yes",
      },
      {
        id: "en:rennet",
        labels: "en:vegetarian",
        percent_estimate: 16.6666666666667,
        percent_max: 50,
        percent_min: 0,
        rank: 2,
        text: "Rennet",
        vegan: "maybe",
        vegetarian: "en:yes",
      },
      {
        id: "en:salt",
        percent_estimate: 16.6666666666667,
        percent_max: 33.3333333333333,
        percent_min: 0,
        rank: 3,
        text: "Salt",
        vegan: "yes",
        vegetarian: "yes",
      },
    ],
    ingredients_analysis: {
      "en:non-vegan": ["en:sheeps-milk"],
    },
    ingredients_analysis_tags: [
      "en:palm-oil-free",
      "en:non-vegan",
      "en:vegetarian",
    ],
    ingredients_from_or_that_may_be_from_palm_oil_n: 0,
    ingredients_from_palm_oil_n: 0,
    ingredients_from_palm_oil_tags: [],
    ingredients_hierarchy: [
      "en:sheeps-milk",
      "en:dairy",
      "en:milk",
      "en:rennet",
      "en:enzyme",
      "en:coagulating-enzyme",
      "en:salt",
    ],
    ingredients_n: 3,
    ingredients_n_tags: ["3", "1-10"],
    ingredients_original_tags: ["en:sheeps-milk", "en:rennet", "en:salt"],
    ingredients_percent_analysis: 1,
    ingredients_tags: [
      "en:sheeps-milk",
      "en:dairy",
      "en:milk",
      "en:rennet",
      "en:enzyme",
      "en:coagulating-enzyme",
      "en:salt",
    ],
    ingredients_tags_en: [
      "Sheeps milk",
      "Dairy",
      "Milk",
      "Rennet",
      "Enzyme",
      "Coagulating enzyme",
      "Salt",
    ],
    ingredients_tags_fr: [
      "Lait de brebis",
      "Produits laitiers et dérivées",
      "Lait",
      "Présure",
      "Enzyme",
      "Enzyme coagulante",
      "Sel",
    ],
    ingredients_text: "Sheep _Milk_, Vegetarian Rennet, Salt",
    ingredients_text_en: "Sheep _Milk_, Vegetarian Rennet, Salt",
    ingredients_text_with_allergens:
      'Sheep <span class="allergen">Milk</span>, Vegetarian Rennet, Salt',
    ingredients_text_with_allergens_en:
      'Sheep <span class="allergen">Milk</span>, Vegetarian Rennet, Salt',
    ingredients_that_may_be_from_palm_oil_n: 0,
    ingredients_that_may_be_from_palm_oil_tags: [],
    ingredients_with_specified_percent_n: 0,
    ingredients_with_specified_percent_sum: 0,
    ingredients_with_unspecified_percent_n: 3,
    ingredients_with_unspecified_percent_sum: 100,
    interface_version_created: "20150316.jqm2",
    interface_version_modified: "20190830",
    known_ingredients_n: 7,
    labels: "",
    labels_hierarchy: [],
    labels_lc: "en",
    labels_tags: [],
    lang: "en",
    languages: {
      "en:english": 6,
    },
    languages_codes: {
      en: 6,
    },
    languages_hierarchy: ["en:english"],
    languages_tags: ["en:english", "en:1"],
    last_edit_dates_tags: ["2022-11-01", "2022-11", "2022"],
    last_editor: "olivier5741",
    last_image_dates_tags: ["2021-07-31", "2021-07", "2021"],
    last_image_t: 1627739625,
    last_modified_by: "olivier5741",
    last_modified_t: 1667295301,
    lc: "en",
    link: "https://www.facebook.com/ballyhubbockfarm/",
    main_countries_tags: [],
    manufacturing_places: "Glen-of-Imaal,Co. Wicklow,Ireland",
    manufacturing_places_tags: ["glen-of-imaal", "co-wicklow", "ireland"],
    max_imgid: "2",
    minerals_tags: [],
    misc_tags: [
      "en:nutrition-no-fiber",
      "en:nutrition-fruits-vegetables-nuts-estimate-from-ingredients",
      "en:nutrition-no-fiber-or-fruits-vegetables-nuts",
      "en:nutriscore-computed",
      "en:ecoscore-extended-data-not-computed",
      "en:ecoscore-missing-data-warning",
      "en:ecoscore-missing-data-labels",
      "en:ecoscore-missing-data-packagings",
      "en:ecoscore-computed",
      "en:main-countries-new-product",
    ],
    no_nutrition_data: "",
    nova_group: 3,
    nova_group_debug: "",
    nova_groups: "3",
    nova_groups_markers: {
      3: [
        ["categories", "en:cheeses"],
        ["ingredients", "en:salt"],
        ["ingredients", "en:enzyme"],
      ],
    },
    nova_groups_tags: ["en:3-processed-foods"],
    nucleotides_tags: [],
    nutrient_levels: {
      fat: "high",
      salt: "high",
      "saturated-fat": "high",
      sugars: "low",
    },
    nutrient_levels_tags: [
      "en:fat-in-high-quantity",
      "en:saturated-fat-in-high-quantity",
      "en:sugars-in-low-quantity",
      "en:salt-in-high-quantity",
    ],
    nutriments: {
      carbohydrates: 1.8,
      carbohydrates_100g: 1.8,
      carbohydrates_unit: "g",
      carbohydrates_value: 1.8,
      energy: 1280,
      "energy-kcal": 294,
      "energy-kcal_100g": 294,
      "energy-kcal_unit": "kcal",
      "energy-kcal_value": 294,
      "energy-kj": 1280,
      "energy-kj_100g": 1280,
      "energy-kj_unit": "kJ",
      "energy-kj_value": 1280,
      energy_100g: 1280,
      energy_unit: "kJ",
      energy_value: 1280,
      fat: 26.8,
      fat_100g: 26.8,
      fat_unit: "g",
      fat_value: 26.8,
      "fruits-vegetables-nuts-estimate-from-ingredients_100g": 0,
      "fruits-vegetables-nuts-estimate-from-ingredients_serving": 0,
      "nova-group": 3,
      "nova-group_100g": 3,
      "nova-group_serving": 3,
      "nutrition-score-fr": 18,
      "nutrition-score-fr_100g": 18,
      proteins: 22,
      proteins_100g: 22,
      proteins_unit: "g",
      proteins_value: 22,
      salt: 3.5,
      salt_100g: 3.5,
      salt_unit: "g",
      salt_value: 3.5,
      "saturated-fat": 13.6,
      "saturated-fat_100g": 13.6,
      "saturated-fat_unit": "g",
      "saturated-fat_value": 13.6,
      sodium: 1.4,
      sodium_100g: 1.4,
      sodium_unit: "g",
      sodium_value: 1.4,
      sugars: 0.4,
      sugars_100g: 0.4,
      sugars_unit: "g",
      sugars_value: 0.4,
    },
    nutriscore_data: {
      energy: 1280,
      energy_points: 3,
      energy_value: 1280,
      fiber: 0,
      fiber_points: 0,
      fiber_value: 0,
      fruits_vegetables_nuts_colza_walnut_olive_oils: 0,
      fruits_vegetables_nuts_colza_walnut_olive_oils_points: 0,
      fruits_vegetables_nuts_colza_walnut_olive_oils_value: 0,
      grade: "d",
      is_beverage: 0,
      is_cheese: "1",
      is_fat: 0,
      is_water: 0,
      negative_points: 23,
      positive_points: 5,
      proteins: 22,
      proteins_points: 5,
      proteins_value: 22,
      saturated_fat: 13.6,
      saturated_fat_points: 10,
      saturated_fat_ratio: 50.7462686567164,
      saturated_fat_ratio_points: 7,
      saturated_fat_ratio_value: 50.7,
      saturated_fat_value: 13.6,
      score: 18,
      sodium: 1400,
      sodium_points: 10,
      sodium_value: 1400,
      sugars: 0.4,
      sugars_points: 0,
      sugars_value: 0.4,
    },
    nutriscore_grade: "d",
    nutriscore_score: 18,
    nutriscore_score_opposite: -18,
    nutrition_data: "on",
    nutrition_data_per: "100g",
    nutrition_data_prepared: "",
    nutrition_data_prepared_per: "100g",
    nutrition_grade_fr: "d",
    nutrition_grades: "d",
    nutrition_grades_tags: ["d"],
    nutrition_score_beverage: 0,
    nutrition_score_debug: "",
    nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients: 1,
    nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients_value: 0,
    nutrition_score_warning_no_fiber: 1,
    origin: "Ireland",
    origin_en: "Ireland",
    origins: "Ireland",
    origins_hierarchy: ["en:ireland"],
    origins_lc: "en",
    origins_tags: ["en:ireland"],
    other_nutritional_substances_tags: [],
    packaging: "Plastic",
    packaging_hierarchy: ["en:plastic"],
    packaging_lc: "en",
    packaging_tags: ["en:plastic"],
    packaging_text: "",
    packaging_text_en: "",
    packagings: [
      {
        material: "en:plastic",
      },
    ],
    photographers_tags: ["kiliweb"],
    pnns_groups_1: "Milk and dairy products",
    pnns_groups_1_tags: ["milk-and-dairy-products", "known"],
    pnns_groups_2: "Cheese",
    pnns_groups_2_tags: ["cheese", "known"],
    popularity_key: 0,
    product_name: "Irish Sheep Milk Ewelloumi",
    product_name_en: "Irish Sheep Milk Ewelloumi",
    product_quantity: "150",
    purchase_places: "Kilmessan,Ireland",
    purchase_places_tags: ["kilmessan", "ireland"],
    quantity: "150 g",
    removed_countries_tags: [],
    rev: 24,
    selected_images: {
      front: {
        display: {
          en: "https://images.openfoodfacts.org/images/products/539/153/379/0106/front_en.3.400.jpg",
        },
        small: {
          en: "https://images.openfoodfacts.org/images/products/539/153/379/0106/front_en.3.200.jpg",
        },
        thumb: {
          en: "https://images.openfoodfacts.org/images/products/539/153/379/0106/front_en.3.100.jpg",
        },
      },
      nutrition: {
        display: {
          en: "https://images.openfoodfacts.org/images/products/539/153/379/0106/nutrition_en.5.400.jpg",
        },
        small: {
          en: "https://images.openfoodfacts.org/images/products/539/153/379/0106/nutrition_en.5.200.jpg",
        },
        thumb: {
          en: "https://images.openfoodfacts.org/images/products/539/153/379/0106/nutrition_en.5.100.jpg",
        },
      },
    },
    states:
      "en:to-be-completed, en:nutrition-facts-completed, en:ingredients-completed, en:expiration-date-completed, en:packaging-code-completed, en:characteristics-completed, en:origins-completed, en:categories-completed, en:brands-completed, en:packaging-completed, en:quantity-completed, en:product-name-completed, en:photos-to-be-validated, en:packaging-photo-to-be-selected, en:nutrition-photo-selected, en:ingredients-photo-to-be-selected, en:front-photo-selected, en:photos-uploaded",
    states_hierarchy: [
      "en:to-be-completed",
      "en:nutrition-facts-completed",
      "en:ingredients-completed",
      "en:expiration-date-completed",
      "en:packaging-code-completed",
      "en:characteristics-completed",
      "en:origins-completed",
      "en:categories-completed",
      "en:brands-completed",
      "en:packaging-completed",
      "en:quantity-completed",
      "en:product-name-completed",
      "en:photos-to-be-validated",
      "en:packaging-photo-to-be-selected",
      "en:nutrition-photo-selected",
      "en:ingredients-photo-to-be-selected",
      "en:front-photo-selected",
      "en:photos-uploaded",
    ],
    states_tags: [
      "en:to-be-completed",
      "en:nutrition-facts-completed",
      "en:ingredients-completed",
      "en:expiration-date-completed",
      "en:packaging-code-completed",
      "en:characteristics-completed",
      "en:origins-completed",
      "en:categories-completed",
      "en:brands-completed",
      "en:packaging-completed",
      "en:quantity-completed",
      "en:product-name-completed",
      "en:photos-to-be-validated",
      "en:packaging-photo-to-be-selected",
      "en:nutrition-photo-selected",
      "en:ingredients-photo-to-be-selected",
      "en:front-photo-selected",
      "en:photos-uploaded",
    ],
    stores: "Swainstown farm",
    stores_tags: ["swainstown-farm"],
    traces: "en:Made in an area that uses Gluten and Nuts",
    traces_from_ingredients: "",
    traces_from_user: "(en) Made in an area that uses Gluten and Nuts",
    traces_hierarchy: ["en:Made in an area that uses Gluten and Nuts"],
    traces_lc: "en",
    traces_tags: ["en:gluten", "en:nuts"],
    unknown_ingredients_n: 0,
    unknown_nutrients_tags: [],
    update_key: "pack-eco",
    vitamins_tags: [],
    additives_tags_en: [],
    additives_tags_fr: [],
    allergens_tags_en: ["Milk"],
    allergens_tags_fr: ["Lait"],
    brands_tags_en: ["Ballyhubbock-farm"],
    brands_tags_fr: ["Ballyhubbock-farm"],
    categories_tags_en: [
      "Dairies",
      "Fermented foods",
      "Fermented milk products",
      "Cheeses",
      "Meat alternatives",
      "Cypriot cheeses",
      "Grilling cheeses",
      "Halloumi",
    ],
    categories_tags_fr: [
      "Produits laitiers",
      "Produits fermentés",
      "Produits laitiers fermentés",
      "Fromages",
      "Alternatives à la viande",
      "en:Cypriot cheeses",
      "Fromages à griller",
      "Halloumi",
    ],
    countries_tags_en: ["Ireland"],
    countries_tags_fr: ["Irlande"],
    ingredients_tags_en: [
      "Sheeps milk",
      "Dairy",
      "Milk",
      "Rennet",
      "Enzyme",
      "Coagulating enzyme",
      "Salt",
    ],
    ingredients_tags_fr: [
      "Lait de brebis",
      "Produits laitiers et dérivées",
      "Lait",
      "Présure",
      "Enzyme",
      "Enzyme coagulante",
      "Sel",
    ],
    labels_tags_en: [],
    labels_tags_fr: [],
    manufacturing_places_tags_en: ["Glen-of-imaal", "Co-wicklow", "Ireland"],
    manufacturing_places_tags_fr: ["Glen-of-imaal", "Co-wicklow", "Ireland"],
    origins_tags_en: ["Ireland"],
    origins_tags_fr: ["Irlande"],
    traces_tags_en: ["Gluten", "Nuts"],
    traces_tags_fr: ["Gluten", "Fruits à coque"],
  },
  status: 1,
  status_verbose: "product found",
};
