// Standard Universal Elementor Page Template JSON
// Compatible with all Elementor versions (Free & Pro, with or without Container experiment)

import { BANNER_ASSETS, CATEGORY_ASSETS, AVATAR_ASSETS } from '../utils/assets';

export const ELEMENTOR_PAGE_TEMPLATE_JSON = {
  version: "0.4",
  title: "Serenity Salon - Homepage Template",
  type: "page",
  page_settings: {
    template: "elementor_header_footer",
    page_title: "Serenity Salon Boutique"
  },
  content: [
    // 1. HERO SECTION (Standard Section -> 2 Columns)
    {
      id: "bs_hero_section",
      elType: "section",
      isInner: false,
      settings: {
        layout: "boxed",
        background_background: "classic",
        background_color: "#F7F5F1",
        padding: { top: "80", right: "20", bottom: "80", left: "20", unit: "px", isLinked: false },
        _css_classes: "beauty-cream-bg"
      },
      elements: [
        // Left Column
        {
          id: "bs_hero_col_left",
          elType: "column",
          isInner: false,
          settings: {
            _column_size: 55,
            padding: { top: "0", right: "30", bottom: "0", left: "0", unit: "px", isLinked: false }
          },
          elements: [
            {
              id: "hero_badge",
              elType: "widget",
              widgetType: "button",
              settings: {
                text: "ORGANIC & CLEAN BEAUTY",
                size: "xs",
                _css_classes: "beauty-btn-primary"
              }
            },
            {
              id: "hero_title",
              elType: "widget",
              widgetType: "heading",
              settings: {
                title: "Effortless Beauty with Natural Skincare & Cosmetics",
                header_size: "h1",
                typography_typography: "custom",
                typography_font_family: "Jost",
                typography_font_size: { unit: "px", size: 46 },
                typography_font_weight: "700"
              }
            },
            {
              id: "hero_desc",
              elType: "widget",
              widgetType: "text-editor",
              settings: {
                editor: "<p>Discover our holistic collection of certified organic, biocompatible formulas crafted from cold-pressed botanical lipids to nourish and restore your natural dewy glow.</p>",
                typography_font_family: "Plus Jakarta Sans"
              }
            },
            {
              id: "hero_btn_shop",
              elType: "widget",
              widgetType: "button",
              settings: {
                text: "Explore Products",
                link: { url: "#best-sellers-section" },
                _css_classes: "beauty-btn-primary"
              }
            }
          ]
        },
        // Right Column
        {
          id: "bs_hero_col_right",
          elType: "column",
          isInner: false,
          settings: {
            _column_size: 45
          },
          elements: [
            {
              id: "hero_img",
              elType: "widget",
              widgetType: "image",
              settings: {
                image: {
                  url: BANNER_ASSETS.hero
                },
                image_size: "full",
                border_radius: { top: "28", right: "28", bottom: "28", left: "28", unit: "px" }
              }
            }
          ]
        }
      ]
    },

    // 2. CATEGORIES SECTION (Section -> 5 Columns)
    {
      id: "bs_categories_section",
      elType: "section",
      isInner: false,
      settings: {
        layout: "boxed",
        padding: { top: "70", right: "20", bottom: "70", left: "20", unit: "px", isLinked: false }
      },
      elements: [
        {
          id: "bs_cat_col_full",
          elType: "column",
          isInner: false,
          settings: { _column_size: 100 },
          elements: [
            {
              id: "cat_heading",
              elType: "widget",
              widgetType: "heading",
              settings: {
                title: "Shop By Category",
                align: "center",
                header_size: "h2",
                typography_font_family: "Jost"
              }
            },
            // Inner section with 5 columns
            {
              id: "cat_inner_sec",
              elType: "section",
              isInner: true,
              settings: {
                padding: { top: "30", right: "0", bottom: "0", left: "0", unit: "px" }
              },
              elements: [
                {
                  id: "cat_col_1",
                  elType: "column",
                  isInner: true,
                  settings: { _column_size: 20, _css_classes: "beauty-category-card" },
                  elements: [
                    {
                      id: "cat_img_1",
                      elType: "widget",
                      widgetType: "image",
                      settings: {
                        image: { url: CATEGORY_ASSETS.skincare }
                      }
                    },
                    {
                      id: "cat_title_1",
                      elType: "widget",
                      widgetType: "heading",
                      settings: { title: "Skin Care", header_size: "h4", align: "center" }
                    }
                  ]
                },
                {
                  id: "cat_col_2",
                  elType: "column",
                  isInner: true,
                  settings: { _column_size: 20, _css_classes: "beauty-category-card" },
                  elements: [
                    {
                      id: "cat_img_2",
                      elType: "widget",
                      widgetType: "image",
                      settings: {
                        image: { url: CATEGORY_ASSETS.makeup }
                      }
                    },
                    {
                      id: "cat_title_2",
                      elType: "widget",
                      widgetType: "heading",
                      settings: { title: "Make Up", header_size: "h4", align: "center" }
                    }
                  ]
                },
                {
                  id: "cat_col_3",
                  elType: "column",
                  isInner: true,
                  settings: { _column_size: 20, _css_classes: "beauty-category-card" },
                  elements: [
                    {
                      id: "cat_img_3",
                      elType: "widget",
                      widgetType: "image",
                      settings: {
                        image: { url: CATEGORY_ASSETS.haircare }
                      }
                    },
                    {
                      id: "cat_title_3",
                      elType: "widget",
                      widgetType: "heading",
                      settings: { title: "Hair Care", header_size: "h4", align: "center" }
                    }
                  ]
                },
                {
                  id: "cat_col_4",
                  elType: "column",
                  isInner: true,
                  settings: { _column_size: 20, _css_classes: "beauty-category-card" },
                  elements: [
                    {
                      id: "cat_img_4",
                      elType: "widget",
                      widgetType: "image",
                      settings: {
                        image: { url: CATEGORY_ASSETS.fragrances }
                      }
                    },
                    {
                      id: "cat_title_4",
                      elType: "widget",
                      widgetType: "heading",
                      settings: { title: "Fragrances", header_size: "h4", align: "center" }
                    }
                  ]
                },
                {
                  id: "cat_col_5",
                  elType: "column",
                  isInner: true,
                  settings: { _column_size: 20, _css_classes: "beauty-category-card" },
                  elements: [
                    {
                      id: "cat_img_5",
                      elType: "widget",
                      widgetType: "image",
                      settings: {
                        image: { url: CATEGORY_ASSETS.nailcare }
                      }
                    },
                    {
                      id: "cat_title_5",
                      elType: "widget",
                      widgetType: "heading",
                      settings: { title: "Nail Care", header_size: "h4", align: "center" }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },

    // 3. DUAL PROMO BANNERS
    {
      id: "bs_promo_section",
      elType: "section",
      isInner: false,
      settings: {
        layout: "boxed",
        background_background: "classic",
        background_color: "#F7F5F1",
        padding: { top: "50", right: "20", bottom: "50", left: "20", unit: "px" }
      },
      elements: [
        {
          id: "bs_promo_col_1",
          elType: "column",
          isInner: false,
          settings: {
            _column_size: 50,
            background_background: "classic",
            background_image: { url: BANNER_ASSETS.summer },
            padding: { top: "40", right: "30", bottom: "40", left: "30", unit: "px" },
            border_radius: { top: "24", right: "24", bottom: "24", left: "24", unit: "px" },
            _css_classes: "beauty-rounded-card"
          },
          elements: [
            {
              id: "promo_badge_1",
              elType: "widget",
              widgetType: "button",
              settings: { text: "Flat 25% Discount", size: "xs" }
            },
            {
              id: "promo_heading_1",
              elType: "widget",
              widgetType: "heading",
              settings: { title: "Special Hair Care Deals", header_size: "h3", typography_color: "#FFFFFF" }
            },
            {
              id: "promo_btn_1",
              elType: "widget",
              widgetType: "button",
              settings: { text: "Shop Now", _css_classes: "beauty-btn-primary" }
            }
          ]
        },
        {
          id: "bs_promo_col_2",
          elType: "column",
          isInner: false,
          settings: {
            _column_size: 50,
            background_background: "classic",
            background_image: { url: BANNER_ASSETS.weekly },
            padding: { top: "40", right: "30", bottom: "40", left: "30", unit: "px" },
            border_radius: { top: "24", right: "24", bottom: "24", left: "24", unit: "px" },
            _css_classes: "beauty-rounded-card"
          },
          elements: [
            {
              id: "promo_badge_2",
              elType: "widget",
              widgetType: "button",
              settings: { text: "Flat 20% Discount", size: "xs" }
            },
            {
              id: "promo_heading_2",
              elType: "widget",
              widgetType: "heading",
              settings: { title: "Save Big on Skincare", header_size: "h3", typography_color: "#FFFFFF" }
            },
            {
              id: "promo_btn_2",
              elType: "widget",
              widgetType: "button",
              settings: { text: "Shop Now", _css_classes: "beauty-btn-secondary" }
            }
          ]
        }
      ]
    },

    // 4. ABOUT STORY SECTION (4-photo collage left, text & counters right)
    {
      id: "bs_about_section",
      elType: "section",
      isInner: false,
      settings: {
        layout: "boxed",
        padding: { top: "80", right: "20", bottom: "80", left: "20", unit: "px" }
      },
      elements: [
        {
          id: "about_col_img",
          elType: "column",
          isInner: false,
          settings: { _column_size: 50 },
          elements: [
            {
              id: "about_photo",
              elType: "widget",
              widgetType: "image",
              settings: {
                image: { url: BANNER_ASSETS.story1 },
                border_radius: { top: "24", right: "24", bottom: "24", left: "24", unit: "px" }
              }
            }
          ]
        },
        {
          id: "about_col_txt",
          elType: "column",
          isInner: false,
          settings: { _column_size: 50, padding: { top: "0", right: "0", bottom: "0", left: "30", unit: "px" } },
          elements: [
            {
              id: "about_eyebrow",
              elType: "widget",
              widgetType: "heading",
              settings: { title: "ABOUT US", header_size: "h6" }
            },
            {
              id: "about_title",
              elType: "widget",
              widgetType: "heading",
              settings: { title: "Your Journey to Effortless Elegance", header_size: "h2" }
            },
            {
              id: "about_text",
              elType: "widget",
              widgetType: "text-editor",
              settings: {
                editor: "<p>Born from a deep reverence for botanical chemistry, Serenity Salon crafts clean, biocompatible formulas that honor your natural rhythm without synthetic fillers or harsh preservatives.</p>"
              }
            },
            {
              id: "about_stats_inner",
              elType: "section",
              isInner: true,
              settings: {
                background_background: "classic",
                background_color: "#1F3A26",
                padding: { top: "20", right: "20", bottom: "20", left: "20", unit: "px" },
                border_radius: { top: "18", right: "18", bottom: "18", left: "18", unit: "px" },
                _css_classes: "beauty-dark-green-bg"
              },
              elements: [
                {
                  id: "counter_1",
                  elType: "column",
                  isInner: true,
                  settings: { _column_size: 33 },
                  elements: [
                    {
                      id: "cnt_w_1",
                      elType: "widget",
                      widgetType: "counter",
                      settings: { starting_number: 0, ending_number: 24, suffix: "+", title: "Categories", number_color: "#C9A66B", title_color: "#FFFFFF" }
                    }
                  ]
                },
                {
                  id: "counter_2",
                  elType: "column",
                  isInner: true,
                  settings: { _column_size: 33 },
                  elements: [
                    {
                      id: "cnt_w_2",
                      elType: "widget",
                      widgetType: "counter",
                      settings: { starting_number: 0, ending_number: 2500, suffix: "+", title: "Products", number_color: "#C9A66B", title_color: "#FFFFFF" }
                    }
                  ]
                },
                {
                  id: "counter_3",
                  elType: "column",
                  isInner: true,
                  settings: { _column_size: 33 },
                  elements: [
                    {
                      id: "cnt_w_3",
                      elType: "widget",
                      widgetType: "counter",
                      settings: { starting_number: 0, ending_number: 99, suffix: "%", title: "Happy Users", number_color: "#C9A66B", title_color: "#FFFFFF" }
                    }
                  ]
                }
              ]
            },
            {
              id: "about_signature",
              elType: "widget",
              widgetType: "text-editor",
              settings: {
                editor: "<p class='beauty-script-text'>Aasha Gandal</p><p style='font-size:12px; font-weight:600; text-transform:uppercase; color:#6E6E6E;'>Aasha Gandal — Founder of Serenity Salon</p>"
              }
            }
          ]
        }
      ]
    },

    // 5. TESTIMONIAL SECTION
    {
      id: "bs_test_section",
      elType: "section",
      isInner: false,
      settings: {
        layout: "boxed",
        padding: { top: "80", right: "20", bottom: "80", left: "20", unit: "px" }
      },
      elements: [
        {
          id: "test_col_center",
          elType: "column",
          isInner: false,
          settings: { _column_size: 100 },
          elements: [
            {
              id: "test_heading",
              elType: "widget",
              widgetType: "heading",
              settings: { title: "Testimonials from Our Loyal Customers", header_size: "h2", align: "center" }
            },
            {
              id: "test_quote_widget",
              elType: "widget",
              widgetType: "testimonial",
              settings: {
                testimonial_content: "My sensitive skin used to react to almost every cosmetic until I found Serenity Salon. The Golden Jojoba Elixir restored my moisture barrier in 3 weeks!",
                testimonial_name: "Eleanor Vance",
                testimonial_job: "Verified Holistic Skincare Customer",
                testimonial_image: { url: AVATAR_ASSETS.avatar3 },
                align: "center"
              }
            }
          ]
        }
      ]
    },

    // 6. FAQ & CONTACT SECTION
    {
      id: "bs_faq_section",
      elType: "section",
      isInner: false,
      settings: {
        layout: "boxed",
        background_background: "classic",
        background_color: "#F7F5F1",
        padding: { top: "80", right: "20", bottom: "80", left: "20", unit: "px" }
      },
      elements: [
        {
          id: "faq_col_left",
          elType: "column",
          isInner: false,
          settings: { _column_size: 65 },
          elements: [
            {
              id: "faq_title",
              elType: "widget",
              widgetType: "heading",
              settings: { title: "Question? Look here.", header_size: "h2" }
            },
            {
              id: "faq_accordion",
              elType: "widget",
              widgetType: "accordion",
              settings: {
                tabs: [
                  {
                    tab_title: "Are all Serenity Salon products 100% natural and non-toxic?",
                    tab_content: "Yes, every formula is handcrafted with certified organic, cold-pressed botanicals and biocompatible plant lipids without parabens, sulfates, synthetic fragrances, or silicones."
                  },
                  {
                    tab_title: "How do I choose the right botanical oil for my skin type?",
                    tab_content: "For dry or mature skin, we recommend our Rosehip Regenerative Nectar. For combination or breakout-prone skin, our Golden Jojoba Elixir mirrors your natural sebum to balance without clogging pores."
                  },
                  {
                    tab_title: "What is your shipping policy and delivery timeline?",
                    tab_content: "We provide carbon-neutral expedited shipping on all orders. Domestic orders arrive within 2-4 business days, and orders over $50 receive complimentary free shipping."
                  },
                  {
                    tab_title: "Are your products cruelty-free and vegan?",
                    tab_content: "Absolutely. We are proud to be Leaping Bunny certified and 100% vegan. We never test on animals at any phase of formulation."
                  }
                ],
                _css_classes: "beauty-accordion"
              }
            }
          ]
        },
        {
          id: "faq_col_right",
          elType: "column",
          isInner: false,
          settings: {
            _column_size: 35,
            background_background: "classic",
            background_color: "#1F3A26",
            padding: { top: "35", right: "25", bottom: "35", left: "25", unit: "px" },
            border_radius: { top: "24", right: "24", bottom: "24", left: "24", unit: "px" },
            _css_classes: "beauty-dark-green-bg"
          },
          elements: [
            {
              id: "faq_contact_box",
              elType: "widget",
              widgetType: "icon-box",
              settings: {
                selected_icon: { value: "fas fa-comments", library: "fa-solid" },
                title_text: "You have different questions?",
                description_text: "Our team of certified holistic skincare specialists is here to assist your routine every day.",
                primary_color: "#C9A66B",
                title_color: "#FFFFFF",
                description_color: "rgba(255,255,255,0.8)"
              }
            },
            {
              id: "faq_contact_btn",
              elType: "widget",
              widgetType: "button",
              settings: { text: "Contact Us", _css_classes: "beauty-btn-secondary" }
            }
          ]
        }
      ]
    },

    // 7. TRUST BADGES ROW (3 Columns)
    {
      id: "bs_trust_section",
      elType: "section",
      isInner: false,
      settings: {
        layout: "boxed",
        padding: { top: "40", right: "20", bottom: "60", left: "20", unit: "px" }
      },
      elements: [
        {
          id: "trust_col_1",
          elType: "column",
          isInner: false,
          settings: { _column_size: 33 },
          elements: [
            {
              id: "trust_box_1",
              elType: "widget",
              widgetType: "icon-box",
              settings: {
                selected_icon: { value: "fas fa-truck-fast", library: "fa-solid" },
                title_text: "Free Carbon-Neutral Shipping",
                description_text: "Free expedited delivery across the US on orders over $50.",
                primary_color: "#C9A66B",
                _css_classes: "beauty-trust-box"
              }
            }
          ]
        },
        {
          id: "trust_col_2",
          elType: "column",
          isInner: false,
          settings: { _column_size: 33 },
          elements: [
            {
              id: "trust_box_2",
              elType: "widget",
              widgetType: "icon-box",
              settings: {
                selected_icon: { value: "fas fa-credit-card", library: "fa-solid" },
                title_text: "Flexible & Secure Payment",
                description_text: "Shop safely with Apple Pay, Klarna 4-installments, or credit card.",
                primary_color: "#C9A66B",
                _css_classes: "beauty-trust-box"
              }
            }
          ]
        },
        {
          id: "trust_col_3",
          elType: "column",
          isInner: false,
          settings: { _column_size: 33 },
          elements: [
            {
              id: "trust_box_3",
              elType: "widget",
              widgetType: "icon-box",
              settings: {
                selected_icon: { value: "fas fa-headset", library: "fa-solid" },
                title_text: "24×7 Expert Esthetician Support",
                description_text: "Personalized skincare ritual consultations whenever you need us.",
                primary_color: "#C9A66B",
                _css_classes: "beauty-trust-box"
              }
            }
          ]
        }
      ]
    }
  ]
};
