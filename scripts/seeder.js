const mongoose = require('mongoose');
require('dotenv').config();
const Admin = require('../models/Admin');
const Category = require('../models/Category');
const ProductCategory = require('../models/ProductCategory');
const Product = require('../models/Product');
const Slider = require('../models/Slider');
const Term = require('../models/Term');
const Box = require('../models/Box');
const connectDB = require('../config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Admin.deleteMany({});
    await Category.deleteMany({});
    await ProductCategory.deleteMany({});
    await Product.deleteMany({});
    await Slider.deleteMany({});
    await Term.deleteMany({});
    await Box.deleteMany({});

    console.log('Cleared existing collections...');

    // 1. Seed Admin
    const admins = await Admin.create([
      {
        admin_name: 'Admin',
        admin_email: 'Admin',
        admin_pass: 'Admin@123', // Plain text matching supported by auth route
        admin_image: '',
        admin_country: 'India',
        admin_about: "SmartCart Administrator Account.",
        admin_contact: '9408090310',
        admin_job: 'Administrator'
      }
    ]);
    console.log('Seeded Admins...');

    // 2. Seed Categories
    const categoriesData = [
      { id: 1, cat_title: 'Vivo' },
      { id: 2, cat_title: 'Apple' },
      { id: 3, cat_title: 'Oppo' },
      { id: 4, cat_title: 'Samsung' },
      { id: 6, cat_title: 'Realme' },
      { id: 7, cat_title: 'Redmi' }
    ];

    const categoryMap = {};
    for (const cat of categoriesData) {
      const created = await Category.create({ cat_title: cat.cat_title });
      categoryMap[cat.id] = created._id;
    }
    console.log('Seeded Categories...');

    // 3. Seed Boxes
    await Box.create([
      {
        box_title: 'best Cart',
        box_desc: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae officia aspernatur, labore eum obcaecati minima, dolorum harum modi beatae recusandae deleniti quam placeat molestias eos nisi, odit dicta reprehenderit ea!'
      },
      {
        box_title: 'like ',
        box_desc: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae officia aspernatur, labore eum obcaecati minima, dolorum harum modi beatae recusandae deleniti quam placeat molestias eos nisi, odit dicta reprehenderit ea!'
      },
      {
        box_title: 'service',
        box_desc: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Repudiandae officia aspernatur, labore eum obcaecati minima, dolorum harum modi beatae recusandae deleniti quam placeat molestias eos nisi, odit dicta reprehenderit ea!'
      }
    ]);
    console.log('Seeded Boxes...');

    // 4. Seed Sliders
    await Slider.create([
      {
        slide_name: 'Oppo Find N3 Flip',
        slide_image: 'oppoflip2.jpg',
        slide_url: '/checkout'
      },
      {
        slide_name: 'Realme 12x 5G',
        slide_image: 'realme12x2.jpg',
        slide_url: '/register'
      },
      {
        slide_name: 'Samsung Galaxy S23 FE 5G',
        slide_image: 's23fe_3.jpg',
        slide_url: '/shop'
      },
      {
        slide_name: 'Samsung Galaxy S23 FE 5G',
        slide_image: 's23fe_2.jpg',
        slide_url: '/shop'
      },
      {
        slide_name: 'Apple iPhone 15 Pro',
        slide_image: 'iphone_15_pro.jpg',
        slide_url: '/shop'
      },
      {
        slide_name: 'Samsung Galaxy Z Flip 5',
        slide_image: 'samsung_z_flip_5.jpg',
        slide_url: '/shop'
      },
      {
        slide_name: 'Vivo X100 Pro 5G',
        slide_image: 'vivo_x100_pro.jpg',
        slide_url: '/shop'
      },
      {
        slide_name: 'OPPO Find X7 Ultra',
        slide_image: 'oppo_find_x7_ultra.jpg',
        slide_url: '/shop'
      }
    ]);
    console.log('Seeded Sliders...');

    // 5. Seed Terms
    await Term.create([
      {
        term_title: 'Terms & Conditions',
        term_link: 'termLink',
        term_desc: 'By using our mobile shopping platform, you agree to abide by these Terms and Conditions, along with our Privacy Policy. If you do not agree, please do not use our services.\n\nYou must be at least 18 years old to use our services.\n\nBy registering an account, you confirm that the information provided is accurate and complete.'
      },
      {
        term_title: 'Refund Policy',
        term_link: 'refundLink',
        term_desc: 'We have 7 days easy return policy.\n\nAt least 1 Year warranty on all product'
      },
      {
        term_title: 'Promo & Other Conditions',
        term_link: 'promoTermConditions',
        term_desc: 'Each promotion is valid only during the period mentioned in the promotional material.\n\nDiscounts or promo codes are non-transferable and cannot be redeemed for cash.'
      }
    ]);
    console.log('Seeded Terms...');

    // 6. Seed Products
    const productsData = [
      {
        product_title: 'Samsung Galaxy S23 FE 5G',
        product_url: 'S23-FE',
        product_img1: 's23fe_1.jpg',
        product_img2: 's23fe_2.jpg',
        product_img3: 's23fe_3.jpg',
        product_price: 80000,
        product_keywords: 's23',
        product_desc: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">8 GB RAM | 256 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">16.26 cm (6.4 inch) Full HD+ Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">50MP + 12MP | 10MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">4500 mAh Battery</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">Samsung Exynos 2200 Processor</li></ul>',
        product_features: '<p>Pattern:Self Design,Women</p><p>Pack of 1</p><p>occasion Party & Festive</p><p>Fabric Care: Dry Clean Only</p><p>Fabric:Pure Silk,Cotton Silk</p><p>Type:Kanjivaram</p><p>Blouse Piece : Unstitched</p><p>Sari Style:Regular Sari</p>',
        product_label: 'sale',
        product_sale: 50000,
        cat_id: 4
      },
      {
        product_title: 'Apple iPhone 15 Pro Max',
        product_url: '15-pro-max',
        product_img1: '15promax1.jpg',
        product_img2: '15promax2.jpg',
        product_img3: '15promax3.jpg',
        product_price: 159999,
        product_keywords: '15-pro-max',
        product_desc: '<p><span style="color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;">iPhone 15 Pro Max is the first iPhone to feature an aerospace‑grade titanium design, using the same alloy that spacecraft use for missions to Mars. Titanium has one of the best strength‑to‑weight ratios of any metal, making these our lightest Pro Max models ever. You&rsquo;ll notice the difference the moment you pick one up.</span></p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">256 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.02 cm (6.7 inch) Super Retina XDR Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">48MP + 12MP + 12MP | 12MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">A17 Pro Chip, 6 Core Processor Processor</li></ul>',
        product_label: 'new',
        product_sale: 123999,
        cat_id: 2
      },
      {
        product_title: 'Oppo Find N3 Flip',
        product_url: 'oppo-flip-n3',
        product_img1: 'oppoflip1.jpg',
        product_img2: 'oppoflip2.jpg',
        product_img3: 'oppoflip3.jpg',
        product_price: 99999,
        product_keywords: 'oppo-flip-n3',
        product_desc: '<p><span style="color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;">The OPPO Find N3 Flip smartphone features a compact structure that can be folded to fit even in skinny jeans or small backpacks. This enables you to experience a slick and sophisticated performance wherever you go.</span></p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">8 GB RAM | 256 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.27 cm (6.8 inch) Full HD+ Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">50MP + 8MP | 32MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">4300 mAh Battery</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">Mediatek Dimensity 9000+ Processor</li></ul>',
        product_label: 'sale',
        product_sale: 49999,
        cat_id: 3
      },
      {
        product_title: 'Realme 12x 5G',
        product_url: 'realme-12x',
        product_img1: 'realme12x1.jpg',
        product_img2: 'realme12x2.jpg',
        product_img3: 'realme12x3.jpg',
        product_price: 18999,
        product_keywords: 'real-12x',
        product_desc: '<p><span style="color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;">Indulge in swift charging with the 45W SUPERVOOC Charge, accompanied by a robust 5000mAh battery for prolonged usage. Enhance your connectivity experience with minimized wait times. The VCVT Intelligent Tuning Algorithm mitigates unnecessary heat loss during charging, and the VFC Trickle Charging Optimization Algorithm boosts efficiency within the 90%-100% charging interval. An intelligent 4-core protection system ensures both efficient charging and top-tier device safety.</span></p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">8 GB RAM | 128 GB ROM | Expandable Upto 2 TB</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.07 cm (6.72 inch) Full HD+ Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">50MP + 2MP | 8MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">5000 mAh Battery</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">Dimensity 6100+ Processor</li></ul>',
        product_label: 'new',
        product_sale: 12499,
        cat_id: 6
      },
      {
        product_title: 'Iphone 13',
        product_url: 'iphone-13',
        product_img1: '13_1.jpg',
        product_img2: '13_2.jpg',
        product_img3: '13_3.jpg',
        product_price: 69900,
        product_keywords: 'iphone-13',
        product_desc: '<p><span style="color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;">iPhone 13. boasts an advanced dual-camera system that allows you to click mesmerising pictures with immaculate clarity. Furthermore, the lightning-fast A15 Bionic chip allows for seamless multitasking, elevating your performance to a new dimension. A big leap in battery life, a durable design, and a bright Super Retina XDR display facilitate boosting your user experience.</span></p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">128 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">15.49 cm (6.1 inch) Super Retina XDR Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">12MP + 12MP | 12MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">A15 Bionic Chip Processor</li></ul>',
        product_label: 'new',
        product_sale: 42999,
        cat_id: 2
      },
      {
        product_title: 'Iphone 14 Plus',
        product_url: '14-plus',
        product_img1: '14plus1.jpg',
        product_img2: '14plus2.jpg',
        product_img3: '14plus3.jpg',
        product_price: 69900,
        product_keywords: '14-plus',
        product_desc: '<p><span style="color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;">The iPhone 14 Plus display has rounded corners that follow a beautiful curved design, and these corners are within a standard rectangle. When measured as a standard rectangular shape, the screen is 16.95 centimetres (6.68) diagonally.</span></p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">128 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.02 cm (6.7 inch) Super Retina XDR Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">12MP + 12MP | 12MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">A15 Bionic Chip, 6 Core Processor Processor</li></ul>',
        product_label: 'new',
        product_sale: 56999,
        cat_id: 2
      },
      {
        product_title: 'Iphone 15 mini',
        product_url: '15-mini',
        product_img1: '15mini1.jpg',
        product_img2: '15mini2.jpg',
        product_img3: '15mini3.jpg',
        product_price: 79600,
        product_keywords: '15-mini',
        product_desc: '<p><span style="color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;">Enjoy video content in superb contrast and high resolution as this phone packs the Super Retina XDR Display. Ceramic Shield, on the other hand, makes for up drop performance that&rsquo;s better by up to 4 times.</span></p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">256 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">13.72 cm (5.4 inch) Super Retina XDR Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">12MP + 12MP | 12MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">A14 Bionic Chip with Next Generation Neural Engine Processor</li></ul>',
        product_label: 'new',
        product_sale: 66900,
        cat_id: 2
      },
      {
        product_title: 'Iphone 16',
        product_url: 'iphone-16',
        product_img1: '16_1.jpg',
        product_img2: '16_2.jpg',
        product_img3: '16_3.jpg',
        product_price: 85000,
        product_keywords: 'iphone-16',
        product_desc: '<p><span style="color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;">iPhone 16. Built for Apple Intelligence. Featuring Camera Control. 48 MP Fusion camera. Five vibrant colours. And A18 chip.</span></p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">128 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">15.49 cm (6.1 inch) Super Retina XDR Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">48MP + 12MP | 12MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">A18 chip, 6 Core Processor</li></ul>',
        product_label: 'sale',
        product_sale: 79900,
        cat_id: 2
      },
      {
        product_title: 'Samsung Galaxy S24 Ultra 5G',
        product_url: 's24',
        product_img1: 's24_1.jpg',
        product_img2: 's24_2.jpg',
        product_img3: 's24_3.jpg',
        product_price: 134999,
        product_keywords: 's24',
        product_desc: '<p><span style="color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;">Search like never before, get real-time interpretation on a call, format your notes into a clear summary, and effortlessly edit your photos - all from your smartphone, all with AI.</span></p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">12 GB RAM | 256 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.27 cm (6.8 inch) Quad HD+ Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">200MP + 50MP + 12MP + 10MP | 12MP Front Camera</li></ul>',
        product_label: 'new',
        product_sale: 114999,
        cat_id: 4
      },
      {
        product_title: 'Samsung Galaxy A14 5G',
        product_url: 'a-14',
        product_img1: 'A14_1.jpg',
        product_img2: 'A14_2.jpg',
        product_img3: 'A14_3.jpg',
        product_price: 17499,
        product_keywords: 'a-14',
        product_desc: '<p>1 Year Manufacturer Warranty for Device and 6 Months Manufacturer Warranty for In-Box Accessories</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">6 GB RAM | 128 GB ROM | Expandable Upto 1 TB</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">16.76 cm (6.6 inch) Full HD+ Display</li></ul>',
        product_label: 'new',
        product_sale: 10977,
        cat_id: 4
      },
      {
        product_title: 'Samsung Galaxy M05',
        product_url: 'm-05',
        product_img1: 'M05_1.jpg',
        product_img2: 'M05_2.jpg',
        product_img3: 'M05_3.jpg',
        product_price: 9999,
        product_keywords: 'm-05',
        product_desc: '<p>16.39 Centimeters (6.5\"Inch) Display</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">6 GB RAM | 128 GB ROM</li></ul>',
        product_label: 'sale',
        product_sale: 6499,
        cat_id: 4
      },
      {
        product_title: 'Samsung Galaxy M55s 5G',
        product_url: 'm-55',
        product_img1: 'M55_1.jpg',
        product_img2: 'M55_2.jpg',
        product_img3: 'M55_3.jpg',
        product_price: 28999,
        product_keywords: 'm-55',
        product_desc: '<p>16.95 Centimeters (6.7\"Inch) Super AMOLED Plus Display</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">12 GB RAM | 256 GB ROM</li></ul>',
        product_label: 'sale',
        product_sale: 17999,
        cat_id: 4
      },
      {
        product_title: 'OPPO A3X 4G',
        product_url: 'oppo-a3',
        product_img1: 'oppoa3_1.jpg',
        product_img2: 'oppoa3_2.jpg',
        product_img3: 'oppoa3_3.jpg',
        product_price: 12999,
        product_keywords: 'oppo-a3',
        product_desc: '<p>NA</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">4 GB RAM | 64 GB ROM</li></ul>',
        product_label: 'new',
        product_sale: 8999,
        cat_id: 3
      },
      {
        product_title: 'Realme Narzo 60x 5G',
        product_url: 'narzo-1',
        product_img1: 'narjo_1.jpg',
        product_img2: 'narzo_2.jpg',
        product_img3: 'narzo_3.jpg',
        product_price: 14999,
        product_keywords: 'Narzo-1',
        product_desc: '<p>6.72-inch touchscreen display</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">6 GB RAM | 128 GB ROM</li></ul>',
        product_label: 'sale',
        product_sale: 11999,
        cat_id: 6
      },
      {
        product_title: 'Realme Narzo N61',
        product_url: 'narzo-61',
        product_img1: 'narz61_1.jpg',
        product_img2: 'narz61_2.jpg',
        product_img3: 'narz61_3.jpg',
        product_price: 10999,
        product_keywords: 'narzo-61',
        product_desc: '<p>NA</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">4 GB RAM | 64 GB ROM</li></ul>',
        product_label: 'new',
        product_sale: 8498,
        cat_id: 6
      },
      {
        product_title: 'Vivo V40e 5G AI Smartphone',
        product_url: 'v40e',
        product_img1: 'vivo40_1.jpg',
        product_img2: 'vivo40_2.jpg',
        product_img3: 'vivo40_3.jpg',
        product_price: 33999,
        product_keywords: 'v40e',
        product_desc: '<h2>Made By Vivo</h2>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">8 GB RAM | 256 GB ROM</li></ul>',
        product_label: 'new',
        product_sale: 26400,
        cat_id: 1
      },
      {
        product_title: 'Vivo V30e 5G',
        product_url: 'v30e',
        product_img1: 'v30_1.jpg',
        product_img2: 'v30_2.jpg',
        product_img3: 'v30_3.jpg',
        product_price: 34999,
        product_keywords: 'v30e',
        product_desc: '<p><strong>NA</strong></p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">8 GB RAM | 128 GB ROM</li></ul>',
        product_label: 'new',
        product_sale: 25221,
        cat_id: 1
      },
      {
        product_title: 'Vivo T1-X',
        product_url: 't1-x',
        product_img1: 'vivo4.jpeg',
        product_img2: 'vivo3.jpeg',
        product_img3: 'vivo2.jpeg',
        product_price: 17999,
        product_keywords: 't1-x',
        product_desc: '<ul><li>Snapdragon 680 octa-core processor</li></ul>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">4 GB RAM | 128 GB ROM</li></ul>',
        product_label: 'new',
        product_sale: 14999,
        cat_id: 1
      },
      {
        product_title: 'Vivo X100 Pro 5G',
        product_url: 'vivo-x100-pro',
        product_img1: 'vivo_x100_pro.jpg',
        product_img2: 'vivo_x100_pro.jpg',
        product_img3: 'vivo_x100_pro.jpg',
        product_price: 96999,
        product_keywords: 'x100, x100pro, vivo-x100',
        product_desc: '<p>Co-engineered with ZEISS. Vivo X100 Pro features the ZEISS APO Floating Telephoto Camera, Dimensity 9300 processor, and premium design.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">16 GB RAM | 512 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.22 cm (6.78 inch) AMOLED Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">50MP + 50MP + 50MP | 32MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">5400 mAh Battery</li></ul>',
        product_label: 'new',
        product_sale: 89999,
        cat_id: 1
      },
      {
        product_title: 'Vivo V40 5G',
        product_url: 'vivo-v40-standard',
        product_img1: 'vivo_v40.jpg',
        product_img2: 'vivo_v40.jpg',
        product_img3: 'vivo_v40.jpg',
        product_price: 42999,
        product_keywords: 'v40-standard, vivo-v40',
        product_desc: '<p>Vivo V40 5G brings Zeiss style portraits and professional level camera specs to the mid-ranger class. Elegant thin design with Aura light.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">8 GB RAM | 256 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.22 cm (6.78 inch) AMOLED Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">50MP + 50MP | 50MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">5500 mAh Battery</li></ul>',
        product_label: 'sale',
        product_sale: 39999,
        cat_id: 1
      },
      {
        product_title: 'Vivo Y200 5G',
        product_url: 'vivo-y200',
        product_img1: 'vivo_y200.jpg',
        product_img2: 'vivo_y200.jpg',
        product_img3: 'vivo_y200.jpg',
        product_price: 26999,
        product_keywords: 'y200, vivo-y200, y200-5g',
        product_desc: '<p>Slim, light and powerful, the Vivo Y200 5G comes with a beautiful premium green back panel design, high refresh rate screen, and reliable performance.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">8 GB RAM | 128 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">16.94 cm (6.67 inch) Full HD+ AMOLED Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">64MP + 2MP | 16MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">4800 mAh Battery</li></ul>',
        product_label: 'new',
        product_sale: 21999,
        cat_id: 1
      },
      {
        product_title: 'Apple iPhone 15 Pro',
        product_url: 'iphone-15-pro',
        product_img1: 'iphone_15_pro.jpg',
        product_img2: 'iphone_15_pro.jpg',
        product_img3: 'iphone_15_pro.jpg',
        product_price: 134900,
        product_keywords: 'iphone-15-pro, 15pro, apple',
        product_desc: '<p><span style="color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;">iPhone 15 Pro is forged in titanium and features the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.</span></p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">128 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">15.49 cm (6.1 inch) Super Retina XDR Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">48MP + 12MP + 12MP | 12MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">A17 Pro Chip, 6 Core Processor</li></ul>',
        product_label: 'sale',
        product_sale: 121900,
        cat_id: 2
      },
      {
        product_title: 'OPPO Reno 11 Pro 5G',
        product_url: 'oppo-reno-11-pro',
        product_img1: 'oppo_reno_11_pro.jpg',
        product_img2: 'oppo_reno_11_pro.jpg',
        product_img3: 'oppo_reno_11_pro.jpg',
        product_price: 44999,
        product_keywords: 'reno-11, reno-11-pro, oppo-reno',
        product_desc: '<p>Elevate your portrait photography with the OPPO Reno 11 Pro 5G. Featuring a flagship 32MP Telephoto Portrait Camera, ultra-clear imaging system, and slim 3D curved design.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">12 GB RAM | 256 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.02 cm (6.7 inch) Full HD+ Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">50MP + 32MP + 8MP | 32MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">4600 mAh Battery</li></ul>',
        product_label: 'sale',
        product_sale: 37999,
        cat_id: 3
      },
      {
        product_title: 'OPPO F25 Pro 5G',
        product_url: 'oppo-f25-pro',
        product_img1: 'oppo_f25_pro.jpg',
        product_img2: 'oppo_f25_pro.jpg',
        product_img3: 'oppo_f25_pro.jpg',
        product_price: 28999,
        product_keywords: 'f25-pro, oppo-f25',
        product_desc: '<p>OPPO F25 Pro 5G is the segment leading slim device featuring a 64MP Triple Camera, 4K Ultra-Clear Video recording front and back, and 67W SUPERVOOC Flash Charge.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">8 GB RAM | 128 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.02 cm (6.7 inch) Full HD+ Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">64MP + 8MP + 2MP | 32MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">5000 mAh Battery</li></ul>',
        product_label: 'new',
        product_sale: 23999,
        cat_id: 3
      },
      {
        product_title: 'OPPO A79 5G',
        product_url: 'oppo-a79',
        product_img1: 'oppo_a79.jpg',
        product_img2: 'oppo_a79.jpg',
        product_img3: 'oppo_a79.jpg',
        product_price: 22999,
        product_keywords: 'oppo-a79, a79, a79-5g',
        product_desc: '<p>OPPO A79 5G offers a stunning design with dual stereo speakers, high refresh rate display, 50MP AI camera, and 33W SUPERVOOC fast charge.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">8 GB RAM | 128 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.02 cm (6.72 inch) Full HD+ Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">50MP + 2MP | 8MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">5000 mAh Battery</li></ul>',
        product_label: 'new',
        product_sale: 18999,
        cat_id: 3
      },
      {
        product_title: 'OPPO Find X7 Ultra',
        product_url: 'oppo-find-x7-ultra',
        product_img1: 'oppo_find_x7_ultra.jpg',
        product_img2: 'oppo_find_x7_ultra.jpg',
        product_img3: 'oppo_find_x7_ultra.jpg',
        product_price: 84999,
        product_keywords: 'find-x7, find-x7-ultra, oppo-find',
        product_desc: '<p>The ultimate photography flagship. OPPO Find X7 Ultra features the world\'s first dual periscope camera system, 1-inch Sony sensor, Hasselblad portrait system, and Snapdragon 8 Gen 3.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">16 GB RAM | 512 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.32 cm (6.82 inch) AMOLED 120Hz Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">50MP + 50MP + 50MP + 50MP | 32MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">5000 mAh Battery</li></ul>',
        product_label: 'new',
        product_sale: 79999,
        cat_id: 3
      },
      {
        product_title: 'Samsung Galaxy Z Flip 5',
        product_url: 'galaxy-z-flip-5',
        product_img1: 'samsung_z_flip_5.jpg',
        product_img2: 'samsung_z_flip_5.jpg',
        product_img3: 'samsung_z_flip_5.jpg',
        product_price: 99999,
        product_keywords: 'flip-5, z-flip-5, samsung-flip',
        product_desc: '<p>Galaxy Z Flip5 debuts a 3.4-inch Flex Window built for self-expression. Compact and eye-catching from every angle, this pocketable fold is as versatile as it is portable.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">8 GB RAM | 256 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.02 cm (6.7 inch) Full HD+ Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">12MP + 12MP | 10MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">3700 mAh Battery</li></ul>',
        product_label: 'sale',
        product_sale: 82999,
        cat_id: 4
      },
      {
        product_title: 'Realme GT 6',
        product_url: 'realme-gt-6',
        product_img1: 'realme_gt_6.jpg',
        product_img2: 'realme_gt_6.jpg',
        product_img3: 'realme_gt_6.jpg',
        product_price: 40999,
        product_keywords: 'gt6, realme-gt, realme-gt-6',
        product_desc: '<p>The AI Flagship Killer. Armed with Snapdragon 8s Gen 3, NextAI smart features, and the brightest 6000nit Ultra Bright Display.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">12 GB RAM | 256 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.22 cm (6.78 inch) Full HD+ Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">50MP + 50MP + 8MP | 32MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">5500 mAh Battery</li></ul>',
        product_label: 'new',
        product_sale: 35999,
        cat_id: 6
      },
      {
        product_title: 'Realme 12 Pro+ 5G',
        product_url: 'realme-12-pro-plus',
        product_img1: 'realme_12_pro_plus.jpg',
        product_img2: 'realme_12_pro_plus.jpg',
        product_img3: 'realme_12_pro_plus.jpg',
        product_price: 36999,
        product_keywords: '12pro+, realme-12-pro-plus',
        product_desc: '<p>Realme 12 Pro+ 5G features a flagship 64MP Periscope Portrait Camera with 3x optical zoom, Snapdragon 7s Gen 2 chip, and a luxury watch design by Ollivier Saveo.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">8 GB RAM | 256 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.02 cm (6.7 inch) Full HD+ Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">64MP + 50MP + 8MP | 32MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">5000 mAh Battery</li></ul>',
        product_label: 'new',
        product_sale: 31999,
        cat_id: 6
      },
      {
        product_title: 'Realme C67 5G',
        product_url: 'realme-c67',
        product_img1: 'realme_c67.jpg',
        product_img2: 'realme_c67.jpg',
        product_img3: 'realme_c67.jpg',
        product_price: 18999,
        product_keywords: 'c67, realme-c67, c67-5g',
        product_desc: '<p>Superfast 5G with a premium design. Realme C67 5G packs a 50MP AI camera, 33W SUPERVOOC charge, and a beautiful slim body.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">6 GB RAM | 128 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.07 cm (6.72 inch) Full HD+ Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">50MP + 2MP | 8MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">5000 mAh Battery</li></ul>',
        product_label: 'new',
        product_sale: 14999,
        cat_id: 6
      },
      {
        product_title: 'Redmi 12 5G',
        product_url: 'redmi-12-5g',
        product_img1: 'redmi_12_5g.jpg',
        product_img2: 'redmi_12_5g.jpg',
        product_img3: 'redmi_12_5g.jpg',
        product_price: 15999,
        product_keywords: 'redmi-12, redmi-12-5g, redmi12',
        product_desc: '<p>Redmi 12 5G sets a new benchmark with a premium glass back, Snapdragon 4 Gen 2 5G processor, and 50MP AI Dual Camera.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">6 GB RAM | 128 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.24 cm (6.79 inch) Full HD+ Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">50MP + 2MP | 8MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">5000 mAh Battery</li></ul>',
        product_label: 'sale',
        product_sale: 11999,
        cat_id: 7
      },
      {
        product_title: 'Redmi Note 13 Pro+ 5G',
        product_url: 'redmi-note-13-pro-plus',
        product_img1: 'redmi_note_13_pro_plus.jpg',
        product_img2: 'redmi_note_13_pro_plus.jpg',
        product_img3: 'redmi_note_13_pro_plus.jpg',
        product_price: 35999,
        product_keywords: 'note-13-pro-plus, redmi-note-13',
        product_desc: '<p>Redmi Note 13 Pro+ 5G features a flagship 200MP camera with OIS, 1.5K curved AMOLED display, and 120W HyperCharge.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">12 GB RAM | 256 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">16.94 cm (6.67 inch) 1.5K AMOLED Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">200MP + 8MP + 2MP | 16MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">5000 mAh Battery</li></ul>',
        product_label: 'new',
        product_sale: 31999,
        cat_id: 7
      },
      {
        product_title: 'Redmi 13C 5G',
        product_url: 'redmi-13c',
        product_img1: 'redmi_13c.jpg',
        product_img2: 'redmi_13c.jpg',
        product_img3: 'redmi_13c.jpg',
        product_price: 13999,
        product_keywords: '13c, redmi-13c',
        product_desc: '<p>Redmi 13C 5G brings superfast 5G connectivity, MediaTek Dimensity 6100+ processor, and a gorgeous starrail design to the budget class.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">4 GB RAM | 128 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.12 cm (6.74 inch) HD+ Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">50MP Dual Camera | 5MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">5000 mAh Battery</li></ul>',
        product_label: 'sale',
        product_sale: 10499,
        cat_id: 7
      },
      {
        product_title: 'Redmi Note 12 5G',
        product_url: 'redmi-note-12-5g',
        product_img1: 'redmi_note_12_5g.jpg',
        product_img2: 'redmi_note_12_5g.jpg',
        product_img3: 'redmi_note_12_5g.jpg',
        product_price: 19999,
        product_keywords: 'note-12, redmi-note-12',
        product_desc: '<p>Redmi Note 12 5G features a 120Hz Super AMOLED display, Snapdragon 4 Gen 1 5G processor, and 48MP triple camera setup.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">6 GB RAM | 128 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">16.94 cm (6.67 inch) AMOLED Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">48MP + 8MP + 2MP | 13MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">5000 mAh Battery</li></ul>',
        product_label: 'new',
        product_sale: 15499,
        cat_id: 7
      },
      {
        product_title: 'Redmi A3',
        product_url: 'redmi-a3',
        product_img1: 'redmi_a3.jpg',
        product_img2: 'redmi_a3.jpg',
        product_img3: 'redmi_a3.jpg',
        product_price: 9999,
        product_keywords: 'a3, redmi-a3',
        product_desc: '<p>Redmi A3 comes with a premium halo circular camera design, 90Hz display, large battery, and clean Android Go experience.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">3 GB RAM | 64 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">17.04 cm (6.71 inch) Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">8MP Dual Rear Camera | 5MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">5000 mAh Battery</li></ul>',
        product_label: 'sale',
        product_sale: 6999,
        cat_id: 7
      },
      {
        product_title: 'Redmi Note 13 5G',
        product_url: 'redmi-note-13',
        product_img1: 'redmi_note_13.jpg',
        product_img2: 'redmi_note_13.jpg',
        product_img3: 'redmi_note_13.jpg',
        product_price: 20999,
        product_keywords: 'note-13, redmi-note-13-5g',
        product_desc: '<p>Redmi Note 13 5G features a super-slim profile with a 108MP triple camera, 120Hz AMOLED display, and MediaTek Dimensity 6080 chip.</p>',
        product_features: '<ul style="box-sizing: border-box; margin: 0px; padding: 0px; color: #212121; font-family: Inter, -apple-system, Helvetica, Arial, sans-serif;"><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">6 GB RAM | 128 GB ROM</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">16.94 cm (6.67 inch) AMOLED Display</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 8px 16px; list-style: none; position: relative;">108MP + 8MP + 2MP | 16MP Front Camera</li><li class="_7eSDEz" style="box-sizing: border-box; margin: 0px; padding: 0px 0px 0px 16px; list-style: none; position: relative;">5000 mAh Battery</li></ul>',
        product_label: 'new',
        product_sale: 16999,
        cat_id: 7
      }
    ];

    for (const prod of productsData) {
      const dbCatId = categoryMap[prod.cat_id];
      if (dbCatId) {
        await Product.create({
          ...prod,
          cat_id: dbCatId
        });
      }
    }
    console.log('Seeded Products...');

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
