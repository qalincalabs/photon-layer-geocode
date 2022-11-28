import * as mapper from "./offLogcicaMapper.js";

test("Open food facts clean up", () => {
  const product = mapper.cleanUpProduct(offApiResponse.product, ["en", "fr", "nl", "de"]);
  console.log(JSON.stringify(product, null, 2));
  console.log(product);
});

/*
test("Open food facts mapper", async () => {
  const mapping = mapper.mapProduct(offApiResponse.product, {
    languages: ["en", "fr"],
  });
  console.log(JSON.stringify(mapping, null, 2));
});
*/

const offApiResponse = {
  code: "5430001830040",
  product: {
    _id: "5430001830040",
    _keywords: [
      "verse",
      "fraise",
      "juste",
      "collect",
      "belgie",
      "prix",
      "vruchtendranken",
      "ongekoelde",
      "dranken",
      "nectar",
      "sappen",
      "pomme",
      "en",
      "fruit",
      "plantaardige",
      "de",
      "vruchtensappen",
      "levensmiddelen",
      "ju"
    ],
    added_countries_tags: [],
    additives_n: 0,
    additives_old_n: 0,
    additives_old_tags: [],
    additives_original_tags: [],
    additives_tags: [],
    allergens: "",
    allergens_from_ingredients: "",
    allergens_from_user: "(nl) ",
    allergens_hierarchy: [],
    allergens_lc: "nl",
    allergens_tags: [],
    amino_acids_tags: [],
    brands: "Fruit Collect",
    brands_tags: [
      "fruit-collect"
    ],
    categories: "Aliments et boissons à base de végétaux, Boissons, Boissons à base de végétaux, Boissons aux fruits, Jus et nectars, Jus de fruits, Jus de fruits pur jus",
    categories_hierarchy: [
      "en:plant-based-foods-and-beverages",
      "en:beverages",
      "en:plant-based-beverages",
      "en:fruit-based-beverages",
      "en:juices-and-nectars",
      "en:fruit-juices",
      "en:squeezed-juices"
    ],
    categories_lc: "fr",
    categories_old: "Plantaardige levensmiddelen en dranken,Dranken,Plantaardige dranken,Vruchtendranken,Sappen en Nectars,Vruchtensappen,Verse ongekoelde vruchtensappen",
    categories_properties: {
      "agribalyse_proxy_food_code:en": "2035",
      "ciqual_food_code:en": "2072"
    },
    categories_properties_tags: [
      "all-products",
      "categories-known",
      "agribalyse-food-code-unknown",
      "agribalyse-proxy-food-code-2035",
      "agribalyse-proxy-food-code-known",
      "ciqual-food-code-2072",
      "ciqual-food-code-known",
      "agribalyse-known",
      "agribalyse-2035"
    ],
    categories_tags: [
      "en:plant-based-foods-and-beverages",
      "en:beverages",
      "en:plant-based-beverages",
      "en:fruit-based-beverages",
      "en:juices-and-nectars",
      "en:fruit-juices",
      "en:squeezed-juices"
    ],
    checkers_tags: [],
    cities_tags: [],
    code: "5430001830040",
    codes_tags: [
      "code-13",
      "5430001830xxx",
      "543000183xxxx",
      "54300018xxxxx",
      "5430001xxxxxx",
      "543000xxxxxxx",
      "54300xxxxxxxx",
      "5430xxxxxxxxx",
      "543xxxxxxxxxx",
      "54xxxxxxxxxxx",
      "5xxxxxxxxxxxx"
    ],
    compared_to_category: "en:squeezed-juices",
    complete: 0,
    completeness: 0.8875,
    correctors_tags: [
      "vpotvin",
      "olivier5741"
    ],
    countries: "België",
    countries_hierarchy: [
      "en:belgium"
    ],
    countries_lc: "nl",
    countries_tags: [
      "en:belgium"
    ],
    created_t: 1622207105,
    creator: "kiliweb",
    data_quality_bugs_tags: [],
    data_quality_errors_tags: [],
    data_quality_info_tags: [
      "en:packaging-data-complete",
      "en:ingredients-percent-analysis-ok",
      "en:all-ingredients-with-specified-percent",
      "en:sum-of-ingredients-with-unspecified-percent-lesser-than-10",
      "en:ecoscore-extended-data-not-computed",
      "en:food-groups-1-known",
      "en:food-groups-2-known",
      "en:food-groups-3-unknown"
    ],
    data_quality_tags: [
      "en:packaging-data-complete",
      "en:ingredients-percent-analysis-ok",
      "en:all-ingredients-with-specified-percent",
      "en:sum-of-ingredients-with-unspecified-percent-lesser-than-10",
      "en:ecoscore-extended-data-not-computed",
      "en:food-groups-1-known",
      "en:food-groups-2-known",
      "en:food-groups-3-unknown",
      "en:ecoscore-production-system-no-label"
    ],
    data_quality_warnings_tags: [
      "en:ecoscore-production-system-no-label"
    ],
    data_sources: "App - yuka, Apps",
    data_sources_tags: [
      "app-yuka",
      "apps"
    ],
    debug_param_sorted_langs: [
      "fr"
    ],
    ecoscore_data: {
      adjustments: {
        origins_of_ingredients: {
          aggregated_origins: [
            {
              origin: "en:belgium",
              percent: 100
            }
          ],
          epi_score: 74,
          epi_value: 2,
          origins_from_origins_field: [
            "en:belgium"
          ],
          transportation_scores: {
            ad: 41,
            al: 45,
            at: 45,
            ax: 75,
            ba: 19,
            be: 100,
            bg: 25,
            ch: 71,
            cy: 43,
            cz: 54,
            de: 76,
            dk: 54,
            dz: 49,
            ee: 79,
            eg: 38,
            es: 21,
            fi: 78,
            fo: 84,
            fr: 85,
            gg: 66,
            gi: 76,
            gr: 53,
            hr: 36,
            hu: 32,
            ie: 51,
            il: 38,
            im: 54,
            is: 61,
            it: 45,
            je: 64,
            lb: 43,
            li: 61,
            lt: 14,
            lu: 89,
            lv: 1,
            ly: 60,
            ma: 63,
            mc: 40,
            md: 32,
            me: 1,
            mk: 32,
            mt: 60,
            nl: 92,
            no: 35,
            pl: 40,
            ps: 46,
            pt: 71,
            ro: 35,
            rs: 14,
            se: 29,
            si: 43,
            sj: 61,
            sk: 30,
            sm: 38,
            sy: 30,
            tn: 64,
            tr: 11,
            ua: 44,
            uk: 72,
            us: 0,
            va: 26,
            world: 0,
            xk: 31
          },
          transportation_values: {
            ad: 6,
            al: 7,
            at: 7,
            ax: 11,
            ba: 3,
            be: 15,
            bg: 4,
            ch: 11,
            cy: 6,
            cz: 8,
            de: 11,
            dk: 8,
            dz: 7,
            ee: 12,
            eg: 6,
            es: 3,
            fi: 12,
            fo: 13,
            fr: 13,
            gg: 10,
            gi: 11,
            gr: 8,
            hr: 5,
            hu: 5,
            ie: 8,
            il: 6,
            im: 8,
            is: 9,
            it: 7,
            je: 10,
            lb: 6,
            li: 9,
            lt: 2,
            lu: 13,
            lv: 0,
            ly: 9,
            ma: 9,
            mc: 6,
            md: 5,
            me: 0,
            mk: 5,
            mt: 9,
            nl: 14,
            no: 5,
            pl: 6,
            ps: 7,
            pt: 11,
            ro: 5,
            rs: 2,
            se: 4,
            si: 6,
            sj: 9,
            sk: 5,
            sm: 6,
            sy: 5,
            tn: 10,
            tr: 2,
            ua: 7,
            uk: 11,
            us: 0,
            va: 4,
            world: 0,
            xk: 5
          },
          values: {
            ad: 8,
            al: 9,
            at: 9,
            ax: 13,
            ba: 5,
            be: 17,
            bg: 6,
            ch: 13,
            cy: 8,
            cz: 10,
            de: 13,
            dk: 10,
            dz: 9,
            ee: 14,
            eg: 8,
            es: 5,
            fi: 14,
            fo: 15,
            fr: 15,
            gg: 12,
            gi: 13,
            gr: 10,
            hr: 7,
            hu: 7,
            ie: 10,
            il: 8,
            im: 10,
            is: 11,
            it: 9,
            je: 12,
            lb: 8,
            li: 11,
            lt: 4,
            lu: 15,
            lv: 2,
            ly: 11,
            ma: 11,
            mc: 8,
            md: 7,
            me: 2,
            mk: 7,
            mt: 11,
            nl: 16,
            no: 7,
            pl: 8,
            ps: 9,
            pt: 13,
            ro: 7,
            rs: 4,
            se: 6,
            si: 8,
            sj: 11,
            sk: 7,
            sm: 8,
            sy: 7,
            tn: 12,
            tr: 4,
            ua: 9,
            uk: 13,
            us: 2,
            va: 6,
            world: 2,
            xk: 7
          }
        },
        packaging: {
          non_recyclable_and_non_biodegradable_materials: 0,
          packagings: [
            {
              ecoscore_material_score: 81,
              ecoscore_shape_ratio: 1,
              material: "en:clear-glass",
              number: "1",
              quantity: "1 l",
              quantity_unit: "l",
              quantity_value: "1",
              recycling: "en:recycle",
              shape: "en:bottle"
            }
          ],
          score: 81,
          value: -2
        },
        production_system: {
          labels: [],
          value: 0,
          warning: "no_label"
        },
        threatened_species: {}
      },
      agribalyse: {
        agribalyse_food_code: "2035",
        agribalyse_proxy_food_code: "2035",
        co2_agriculture: 0.22282021,
        co2_consumption: 0.0047993021,
        co2_distribution: 0.028932423,
        co2_packaging: 0.17256359,
        co2_processing: 0.036217,
        co2_total: 0.80120163,
        co2_transportation: 0.33586911,
        code: "2035",
        dqr: "3.11",
        ef_agriculture: 0.085908821,
        ef_consumption: 0.0024293397,
        ef_distribution: 0.0088128735,
        ef_packaging: 0.014792146,
        ef_processing: 0.0056288216,
        ef_total: 0.14687612,
        ef_transportation: 0.029304118,
        is_beverage: 1,
        name_en: "Mixed fruits juice, pure juice",
        name_fr: "Jus multifruit, pur jus, standard",
        score: 51
      },
      grade: "b",
      grades: {
        ad: "c",
        al: "c",
        at: "c",
        ax: "b",
        ba: "c",
        be: "b",
        bg: "c",
        ch: "b",
        cy: "c",
        cz: "c",
        de: "b",
        dk: "c",
        dz: "c",
        ee: "b",
        eg: "c",
        es: "c",
        fi: "b",
        fo: "b",
        fr: "b",
        gg: "b",
        gi: "b",
        gr: "c",
        hr: "c",
        hu: "c",
        ie: "c",
        il: "c",
        im: "c",
        is: "b",
        it: "c",
        je: "b",
        lb: "c",
        li: "b",
        lt: "c",
        lu: "b",
        lv: "c",
        ly: "b",
        ma: "b",
        mc: "c",
        md: "c",
        me: "c",
        mk: "c",
        mt: "b",
        nl: "b",
        no: "c",
        pl: "c",
        ps: "c",
        pt: "b",
        ro: "c",
        rs: "c",
        se: "c",
        si: "c",
        sj: "b",
        sk: "c",
        sm: "c",
        sy: "c",
        tn: "b",
        tr: "c",
        ua: "c",
        uk: "b",
        us: "c",
        va: "c",
        world: "c",
        xk: "c"
      },
      missing: {
        labels: 1
      },
      missing_data_warning: 1,
      score: 64,
      scores: {
        ad: 57,
        al: 58,
        at: 58,
        ax: 62,
        ba: 54,
        be: 66,
        bg: 55,
        ch: 62,
        cy: 57,
        cz: 59,
        de: 62,
        dk: 59,
        dz: 58,
        ee: 63,
        eg: 57,
        es: 54,
        fi: 63,
        fo: 64,
        fr: 64,
        gg: 61,
        gi: 62,
        gr: 59,
        hr: 56,
        hu: 56,
        ie: 59,
        il: 57,
        im: 59,
        is: 60,
        it: 58,
        je: 61,
        lb: 57,
        li: 60,
        lt: 53,
        lu: 64,
        lv: 51,
        ly: 60,
        ma: 60,
        mc: 57,
        md: 56,
        me: 51,
        mk: 56,
        mt: 60,
        nl: 65,
        no: 56,
        pl: 57,
        ps: 58,
        pt: 62,
        ro: 56,
        rs: 53,
        se: 55,
        si: 57,
        sj: 60,
        sk: 56,
        sm: 57,
        sy: 56,
        tn: 61,
        tr: 53,
        ua: 58,
        uk: 62,
        us: 51,
        va: 55,
        world: 51,
        xk: 56
      },
      status: "known"
    },
    ecoscore_grade: "b",
    ecoscore_score: 64,
    ecoscore_tags: [
      "b"
    ],
    editors_tags: [
      "vpotvin",
      "kiliweb",
      "olivier5741",
      "yuka.sY2b0xO6T85zoF3NwEKvlmBefPPXgAn2LAfVpFWo7fSVIsPRbux54ZPFKKg"
    ],
    emb_codes: "",
    emb_codes_tags: [],
    entry_dates_tags: [
      "2021-05-28",
      "2021-05",
      "2021"
    ],
    expiration_date: "",
    food_groups: "en:unsweetened-beverages",
    food_groups_tags: [
      "en:beverages",
      "en:unsweetened-beverages"
    ],
    generic_name: "Jus de Pomme -  Fraise",
    generic_name_fr: "Jus de Pomme -  Fraise",
    id: "5430001830040",
    image_front_small_url: "https://images.openfoodfacts.org/images/products/543/000/183/0040/front_fr.3.200.jpg",
    image_front_thumb_url: "https://images.openfoodfacts.org/images/products/543/000/183/0040/front_fr.3.100.jpg",
    image_front_url: "https://images.openfoodfacts.org/images/products/543/000/183/0040/front_fr.3.400.jpg",
    image_ingredients_small_url: "https://images.openfoodfacts.org/images/products/543/000/183/0040/ingredients_fr.11.200.jpg",
    image_ingredients_thumb_url: "https://images.openfoodfacts.org/images/products/543/000/183/0040/ingredients_fr.11.100.jpg",
    image_ingredients_url: "https://images.openfoodfacts.org/images/products/543/000/183/0040/ingredients_fr.11.400.jpg",
    image_nutrition_small_url: "https://images.openfoodfacts.org/images/products/543/000/183/0040/nutrition_fr.14.200.jpg",
    image_nutrition_thumb_url: "https://images.openfoodfacts.org/images/products/543/000/183/0040/nutrition_fr.14.100.jpg",
    image_nutrition_url: "https://images.openfoodfacts.org/images/products/543/000/183/0040/nutrition_fr.14.400.jpg",
    image_small_url: "https://images.openfoodfacts.org/images/products/543/000/183/0040/front_fr.3.200.jpg",
    image_thumb_url: "https://images.openfoodfacts.org/images/products/543/000/183/0040/front_fr.3.100.jpg",
    image_url: "https://images.openfoodfacts.org/images/products/543/000/183/0040/front_fr.3.400.jpg",
    images: {
      1: {
        sizes: {
          100: {
            h: 100,
            w: 49
          },
          400: {
            h: 400,
            w: 194
          },
          full: {
            h: 1200,
            w: 582
          }
        },
        uploaded_t: 1622207106,
        uploader: "kiliweb"
      },
      2: {
        sizes: {
          100: {
            h: 65,
            w: 100
          },
          400: {
            h: 262,
            w: 400
          },
          full: {
            h: 1200,
            w: 1833
          }
        },
        uploaded_t: 1622207108,
        uploader: "kiliweb"
      },
      3: {
        sizes: {
          100: {
            h: 100,
            w: 75
          },
          400: {
            h: 400,
            w: 300
          },
          full: {
            h: 3968,
            w: 2976
          }
        },
        uploaded_t: 1666088192,
        uploader: "vpotvin"
      },
      4: {
        sizes: {
          100: {
            h: 100,
            w: 75
          },
          400: {
            h: 400,
            w: 300
          },
          full: {
            h: 3968,
            w: 2976
          }
        },
        uploaded_t: 1666088195,
        uploader: "vpotvin"
      },
      front_fr: {
        angle: 0,
        coordinates_image_size: "full",
        geometry: "0x0--1--1",
        imgid: "1",
        normalize: null,
        rev: "3",
        sizes: {
          100: {
            h: 100,
            w: 49
          },
          200: {
            h: 200,
            w: 97
          },
          400: {
            h: 400,
            w: 194
          },
          full: {
            h: 1200,
            w: 582
          }
        },
        white_magic: null,
        x1: "-1",
        x2: "-1",
        y1: "-1",
        y2: "-1"
      },
      ingredients_fr: {
        angle: "0",
        coordinates_image_size: "full",
        geometry: "1380x1327-552-1420",
        imgid: "4",
        normalize: "false",
        rev: "11",
        sizes: {
          100: {
            h: 96,
            w: 100
          },
          200: {
            h: 192,
            w: 200
          },
          400: {
            h: 385,
            w: 400
          },
          full: {
            h: 1327,
            w: 1380
          }
        },
        white_magic: "false",
        x1: "552.7217280813214",
        x2: "1932.1941857925667",
        y1: "1420.8163181484276",
        y2: "2747.852720229114"
      },
      nutrition_fr: {
        angle: "0",
        coordinates_image_size: "full",
        geometry: "1315x1012-572-436",
        imgid: "4",
        normalize: "false",
        rev: "14",
        sizes: {
          100: {
            h: 77,
            w: 100
          },
          200: {
            h: 154,
            w: 200
          },
          400: {
            h: 308,
            w: 400
          },
          full: {
            h: 1012,
            w: 1315
          }
        },
        white_magic: "false",
        x1: "572.8894536213469",
        x2: "1887.8250972839896",
        y1: "436.063979113723",
        y2: "1448.4838935435196"
      }
    },
    informers_tags: [
      "yuka.sY2b0xO6T85zoF3NwEKvlmBefPPXgAn2LAfVpFWo7fSVIsPRbux54ZPFKKg",
      "kiliweb",
      "vpotvin",
      "olivier5741"
    ],
    ingredients: [
      {
        id: "en:apple",
        percent: 86,
        percent_estimate: 86,
        percent_max: 86,
        percent_min: 86,
        text: "Pomme",
        vegan: "yes",
        vegetarian: "yes"
      },
      {
        id: "en:strawberry",
        percent: 14,
        percent_estimate: 14,
        percent_max: 14,
        percent_min: 14,
        text: "fraise",
        vegan: "yes",
        vegetarian: "yes"
      }
    ],
    ingredients_analysis: {},
    ingredients_analysis_tags: [
      "en:palm-oil-free",
      "en:vegan",
      "en:vegetarian"
    ],
    ingredients_from_or_that_may_be_from_palm_oil_n: 0,
    ingredients_from_palm_oil_n: 0,
    ingredients_from_palm_oil_tags: [],
    ingredients_hierarchy: [
      "en:apple",
      "en:fruit",
      "en:strawberry",
      "en:berries"
    ],
    ingredients_n: 2,
    ingredients_n_tags: [
      "2",
      "1-10"
    ],
    ingredients_original_tags: [
      "en:apple",
      "en:strawberry"
    ],
    ingredients_percent_analysis: 1,
    ingredients_tags: [
      "en:apple",
      "en:fruit",
      "en:strawberry",
      "en:berries"
    ],
    ingredients_text: "Pomme (86%), fraise (14%)",
    ingredients_text_fr: "Pomme (86%), fraise (14%)",
    ingredients_text_with_allergens: "Pomme (86%), fraise (14%)",
    ingredients_text_with_allergens_fr: "Pomme (86%), fraise (14%)",
    ingredients_that_may_be_from_palm_oil_n: 0,
    ingredients_that_may_be_from_palm_oil_tags: [],
    ingredients_with_specified_percent_n: 2,
    ingredients_with_specified_percent_sum: 100,
    ingredients_with_unspecified_percent_n: 0,
    ingredients_with_unspecified_percent_sum: 0,
    interface_version_created: "20150316.jqm2",
    interface_version_modified: "20190830",
    known_ingredients_n: 4,
    labels: "Prix juste",
    labels_hierarchy: [
      "fr:Prix juste"
    ],
    labels_lc: "fr",
    labels_old: "fr:Prix juste",
    labels_tags: [
      "fr:prix-juste"
    ],
    lang: "fr",
    languages: {
      "en:french": 8
    },
    languages_codes: {
      fr: 8
    },
    languages_hierarchy: [
      "en:french"
    ],
    languages_tags: [
      "en:french",
      "en:1"
    ],
    last_edit_dates_tags: [
      "2022-11-15",
      "2022-11",
      "2022"
    ],
    last_editor: "olivier5741",
    last_image_dates_tags: [
      "2022-10-18",
      "2022-10",
      "2022"
    ],
    last_image_t: 1666088196,
    last_modified_by: "olivier5741",
    last_modified_t: 1668526143,
    lc: "fr",
    link: "",
    main_countries_tags: [],
    manufacturing_places: "belgique",
    manufacturing_places_tags: [
      "belgique"
    ],
    max_imgid: "4",
    minerals_tags: [],
    misc_tags: [
      "en:nutrition-no-fiber",
      "en:nutrition-fruits-vegetables-nuts-estimate-from-ingredients",
      "en:nutrition-no-fiber-or-fruits-vegetables-nuts",
      "en:nutriscore-computed",
      "en:ecoscore-extended-data-not-computed",
      "en:ecoscore-missing-data-warning",
      "en:ecoscore-missing-data-labels",
      "en:ecoscore-computed"
    ],
    no_nutrition_data: "",
    nova_group: 1,
    nova_group_debug: "",
    nova_groups: "1",
    nova_groups_markers: {},
    nova_groups_tags: [
      "en:1-unprocessed-or-minimally-processed-foods"
    ],
    nucleotides_tags: [],
    nutrient_levels: {
      fat: "low",
      salt: "low",
      "saturated-fat": "low",
      sugars: "high"
    },
    nutrient_levels_tags: [
      "en:fat-in-low-quantity",
      "en:saturated-fat-in-low-quantity",
      "en:sugars-in-high-quantity",
      "en:salt-in-low-quantity"
    ],
    nutriments: {
      carbohydrates: 12.3,
      carbohydrates_100g: 12.3,
      carbohydrates_unit: "g",
      carbohydrates_value: 12.3,
      energy: 175,
      "energy-kcal": 42,
      "energy-kcal_100g": 42,
      "energy-kcal_unit": "kcal",
      "energy-kcal_value": 42,
      "energy-kj": 175,
      "energy-kj_100g": 175,
      "energy-kj_unit": "kJ",
      "energy-kj_value": 175,
      energy_100g: 175,
      energy_unit: "kJ",
      energy_value: 175,
      fat: 0.1,
      fat_100g: 0.1,
      fat_unit: "g",
      fat_value: 0.1,
      "fruits-vegetables-nuts-estimate-from-ingredients_100g": 100,
      "fruits-vegetables-nuts-estimate-from-ingredients_serving": 100,
      "nova-group": 1,
      "nova-group_100g": 1,
      "nova-group_serving": 1,
      "nutrition-score-fr": 4,
      "nutrition-score-fr_100g": 4,
      proteins: 0.5,
      proteins_100g: 0.5,
      proteins_unit: "g",
      proteins_value: 0.5,
      salt: 0,
      salt_100g: 0,
      salt_unit: "g",
      salt_value: 0,
      "saturated-fat": 0,
      "saturated-fat_100g": 0,
      "saturated-fat_unit": "g",
      "saturated-fat_value": 0,
      sodium: 0,
      sodium_100g: 0,
      sodium_unit: "g",
      sodium_value: 0,
      sugars: 10.9,
      sugars_100g: 10.9,
      sugars_unit: "g",
      sugars_value: 10.9
    },
    nutriscore_data: {
      energy: 175,
      energy_points: 6,
      energy_value: 175,
      fiber: 0,
      fiber_points: 0,
      fiber_value: 0,
      fruits_vegetables_nuts_colza_walnut_olive_oils: 100,
      fruits_vegetables_nuts_colza_walnut_olive_oils_points: 10,
      fruits_vegetables_nuts_colza_walnut_olive_oils_value: 100,
      grade: "c",
      is_beverage: 1,
      is_cheese: 0,
      is_fat: 0,
      is_water: 0,
      negative_points: 14,
      positive_points: 10,
      proteins: 0.5,
      proteins_points: 0,
      proteins_value: 0.5,
      saturated_fat: 0,
      saturated_fat_points: 0,
      saturated_fat_ratio: 0,
      saturated_fat_ratio_points: 0,
      saturated_fat_ratio_value: 0,
      saturated_fat_value: 0,
      score: 4,
      sodium: 0,
      sodium_points: 0,
      sodium_value: 0,
      sugars: 10.9,
      sugars_points: 8,
      sugars_value: 10.9
    },
    nutriscore_grade: "c",
    nutriscore_score: 4,
    nutriscore_score_opposite: -4,
    nutrition_data: "on",
    nutrition_data_per: "100g",
    nutrition_data_prepared: "",
    nutrition_data_prepared_per: "100g",
    nutrition_grade_fr: "c",
    nutrition_grades: "c",
    nutrition_grades_tags: [
      "c"
    ],
    nutrition_score_beverage: 1,
    nutrition_score_debug: "",
    nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients: 1,
    nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients_value: 100,
    nutrition_score_warning_no_fiber: 1,
    origin: "Belgique",
    origin_fr: "Belgique",
    origins: "België",
    origins_hierarchy: [
      "en:belgium"
    ],
    origins_lc: "nl",
    origins_tags: [
      "en:belgium"
    ],
    other_nutritional_substances_tags: [],
    packaging: "Fles",
    packaging_hierarchy: [
      "en:bottle"
    ],
    packaging_lc: "nl",
    packaging_tags: [
      "en:bottle"
    ],
    packaging_text: "1 bouteille en verre transparent de 1 L à recycler",
    packaging_text_fr: "1 bouteille en verre transparent de 1 L à recycler",
    packagings: [
      {
        material: "en:clear-glass",
        number: "1",
        quantity: "1 l",
        quantity_unit: "l",
        quantity_value: "1",
        recycling: "en:recycle",
        shape: "en:bottle"
      }
    ],
    photographers_tags: [
      "kiliweb",
      "vpotvin"
    ],
    pnns_groups_1: "Beverages",
    pnns_groups_1_tags: [
      "beverages",
      "known"
    ],
    pnns_groups_2: "Fruit juices",
    pnns_groups_2_tags: [
      "fruit-juices",
      "known"
    ],
    popularity_key: 12,
    product_name: "Jus de Pomme -  Fraise",
    product_name_fr: "Jus de Pomme -  Fraise",
    product_quantity: "1000",
    purchase_places: "",
    purchase_places_tags: [],
    quantity: "1l",
    removed_countries_tags: [],
    rev: 18,
    selected_images: {
      front: {
        display: {
          fr: "https://images.openfoodfacts.org/images/products/543/000/183/0040/front_fr.3.400.jpg"
        },
        small: {
          fr: "https://images.openfoodfacts.org/images/products/543/000/183/0040/front_fr.3.200.jpg"
        },
        thumb: {
          fr: "https://images.openfoodfacts.org/images/products/543/000/183/0040/front_fr.3.100.jpg"
        }
      },
      ingredients: {
        display: {
          fr: "https://images.openfoodfacts.org/images/products/543/000/183/0040/ingredients_fr.11.400.jpg"
        },
        small: {
          fr: "https://images.openfoodfacts.org/images/products/543/000/183/0040/ingredients_fr.11.200.jpg"
        },
        thumb: {
          fr: "https://images.openfoodfacts.org/images/products/543/000/183/0040/ingredients_fr.11.100.jpg"
        }
      },
      nutrition: {
        display: {
          fr: "https://images.openfoodfacts.org/images/products/543/000/183/0040/nutrition_fr.14.400.jpg"
        },
        small: {
          fr: "https://images.openfoodfacts.org/images/products/543/000/183/0040/nutrition_fr.14.200.jpg"
        },
        thumb: {
          fr: "https://images.openfoodfacts.org/images/products/543/000/183/0040/nutrition_fr.14.100.jpg"
        }
      }
    },
    states: "en:to-be-completed, en:nutrition-facts-completed, en:ingredients-completed, en:expiration-date-to-be-completed, en:packaging-code-to-be-completed, en:characteristics-completed, en:origins-completed, en:categories-completed, en:brands-completed, en:packaging-completed, en:quantity-completed, en:product-name-completed, en:photos-to-be-validated, en:packaging-photo-to-be-selected, en:nutrition-photo-selected, en:ingredients-photo-selected, en:front-photo-selected, en:photos-uploaded",
    states_hierarchy: [
      "en:to-be-completed",
      "en:nutrition-facts-completed",
      "en:ingredients-completed",
      "en:expiration-date-to-be-completed",
      "en:packaging-code-to-be-completed",
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
      "en:ingredients-photo-selected",
      "en:front-photo-selected",
      "en:photos-uploaded"
    ],
    states_tags: [
      "en:to-be-completed",
      "en:nutrition-facts-completed",
      "en:ingredients-completed",
      "en:expiration-date-to-be-completed",
      "en:packaging-code-to-be-completed",
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
      "en:ingredients-photo-selected",
      "en:front-photo-selected",
      "en:photos-uploaded"
    ],
    stores: "",
    stores_tags: [],
    traces: "",
    traces_from_ingredients: "",
    traces_from_user: "(nl) ",
    traces_hierarchy: [],
    traces_lc: "nl",
    traces_tags: [],
    unknown_ingredients_n: 0,
    unknown_nutrients_tags: [],
    update_key: "update20221107",
    vitamins_tags: [],
    additives_tags_de: [],
    additives_tags_en: [],
    additives_tags_fr: [],
    additives_tags_nl: [],
    allergens_tags_de: [],
    allergens_tags_en: [],
    allergens_tags_fr: [],
    allergens_tags_nl: [],
    brands_tags_de: [
      "Fruit-collect"
    ],
    brands_tags_en: [
      "Fruit-collect"
    ],
    brands_tags_fr: [
      "Fruit-collect"
    ],
    brands_tags_nl: [
      "Fruit-collect"
    ],
    categories_tags_de: [
      "Pflanzliche Lebensmittel und Getränke",
      "Getränke",
      "Pflanzliche Getränke",
      "Fruchtgetränke",
      "Säfte und Nektare",
      "Fruchsäfte",
      "Direktsäfte"
    ],
    categories_tags_en: [
      "Plant-based foods and beverages",
      "Beverages",
      "Plant-based beverages",
      "Fruit-based beverages",
      "Juices and nectars",
      "Fruit juices",
      "Squeezed juices"
    ],
    categories_tags_fr: [
      "Aliments et boissons à base de végétaux",
      "Boissons",
      "Boissons à base de végétaux",
      "Boissons aux fruits",
      "Jus et nectars",
      "Jus de fruits",
      "Jus de fruits pur jus"
    ],
    categories_tags_nl: [
      "Plantaardige levensmiddelen en dranken",
      "Dranken",
      "Plantaardige dranken",
      "Vruchtendranken",
      "Sappen en Nectars",
      "Vruchtensappen",
      "Verse ongekoelde vruchtensappen"
    ],
    countries_tags_de: [
      "Belgien"
    ],
    countries_tags_en: [
      "Belgium"
    ],
    countries_tags_fr: [
      "Belgique"
    ],
    countries_tags_nl: [
      "België"
    ],
    ingredients_tags_de: [
      "Apfel",
      "Früchte",
      "Erdbeere",
      "en:Berries"
    ],
    ingredients_tags_en: [
      "Apple",
      "Fruit",
      "Strawberry",
      "Berries"
    ],
    ingredients_tags_fr: [
      "Pomme",
      "Fruit",
      "Fraise",
      "en:Berries"
    ],
    ingredients_tags_nl: [
      "Appel",
      "Vruchten",
      "Aardbei",
      "en:Berries"
    ],
    labels_tags_de: [
      "fr:prix-juste"
    ],
    labels_tags_en: [
      "fr:prix-juste"
    ],
    labels_tags_fr: [
      "Prix-juste"
    ],
    labels_tags_nl: [
      "fr:prix-juste"
    ],
    manufacturing_places_tags_de: [
      "Belgique"
    ],
    manufacturing_places_tags_en: [
      "Belgique"
    ],
    manufacturing_places_tags_fr: [
      "Belgique"
    ],
    manufacturing_places_tags_nl: [
      "Belgique"
    ],
    origins_tags_de: [
      "Belgien"
    ],
    origins_tags_en: [
      "Belgium"
    ],
    origins_tags_fr: [
      "Belgique"
    ],
    origins_tags_nl: [
      "België"
    ],
    purchase_places_tags_de: [],
    purchase_places_tags_en: [],
    purchase_places_tags_fr: [],
    purchase_places_tags_nl: [],
    states_tags_de: [
      "Auszufüllen",
      "Nährwertinformationen ausgefüllt",
      "Zutaten ausgefüllt",
      "Verbrauchsdatum auszufüllen",
      "Verpackungscode auszufüllen",
      "Merkmale ausgefüllt",
      "Herkunft ausgefüllt",
      "Kategorien ausgefüllt",
      "Marken ausgefüllt",
      "Verpackung ausgefüllt",
      "Menge ausgefüllt",
      "Produktname ausgefüllt",
      "Bilder in Prüfung",
      "Verpackungsfoto muss ausgewählt werden",
      "Nährwertangabenfoto ausgewählt",
      "Zutatenfoto ausgewählt",
      "Frontfoto ausgewählt",
      "Bilder hochgeladen"
    ],
    states_tags_en: [
      "To be completed",
      "Nutrition facts completed",
      "Ingredients completed",
      "Expiration date to be completed",
      "Packaging code to be completed",
      "Characteristics completed",
      "Origins completed",
      "Categories completed",
      "Brands completed",
      "Packaging completed",
      "Quantity completed",
      "Product name completed",
      "Photos to be validated",
      "Packaging photo to be selected",
      "Nutrition photo selected",
      "Ingredients photo selected",
      "Front photo selected",
      "Photos uploaded"
    ],
    states_tags_fr: [
      "À compléter",
      "Informations nutritionnelles complétées",
      "Ingrédients complétés",
      "Date limite à compléter",
      "Code emballeur à compléter",
      "Caractéristiques complétées",
      "Origines complétées",
      "Catégories complétées",
      "Marques complétées",
      "Emballage complété",
      "Quantité complétée",
      "Nom du produit complété",
      "Photos à valider",
      "Photo de l'emballage non sélectionnée",
      "Photo de la nutrition sélectionnée",
      "Photo des ingrédients sélectionnée",
      "Photo de face sélectionnée",
      "Photos envoyées"
    ],
    states_tags_nl: [
      "Aan te vullen",
      "Voedingswaarden klaar",
      "Ingrediënten klaar",
      "Houdbaarheidsdatum invullen",
      "Verpakkerscode niet ingevuld",
      "Eigenschappen klaar",
      "Oorsprong vervolledigd",
      "Categorieën klaar",
      "Merken klaar",
      "Verpakking klaar",
      "Hoeveelheid klaar",
      "Productnaam klaar",
      "Te controleren foto's",
      "Verpakkingsfoto moet worden geselecteerd",
      "Foto van de voedingswaarden geselecteerd",
      "Foto van de ingrediënten geselecteerd",
      "en:Front photo selected",
      "Geüploade foto's"
    ],
    stores_tags_de: [],
    stores_tags_en: [],
    stores_tags_fr: [],
    stores_tags_nl: [],
    traces_tags_de: [],
    traces_tags_en: [],
    traces_tags_fr: [],
    traces_tags_nl: [],
    vitamins_tags_de: [],
    vitamins_tags_en: [],
    vitamins_tags_fr: [],
    vitamins_tags_nl: []
  },
  status: 1,
  status_verbose: "product found"
}
