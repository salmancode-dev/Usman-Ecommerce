const fs = require('fs');
const path = require('path');

const pages = [
    {
        filename: 'electronics.html',
        title: 'Electronics',
        prefix: 'e',
        categories: [
            { val: 'phones', label: 'Phones' },
            { val: 'laptops', label: 'Laptops' },
            { val: 'accessories', label: 'Accessories' }
        ],
        products: [
            { cat: 'phones', name: 'iPhone 14 Pro', price: '999', img: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=400&auto=format&fit=crop' },
            { cat: 'laptops', name: 'MacBook Air M2', price: '1199', img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=400&auto=format&fit=crop' },
            { cat: 'accessories', name: 'AirPods Pro', price: '249', img: 'https://images.unsplash.com/photo-1606220588913-b3eea8f114c0?q=80&w=400&auto=format&fit=crop' },
            { cat: 'accessories', name: 'Fast Charger', price: '45', img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?q=80&w=400&auto=format&fit=crop' }
        ]
    },
    {
        filename: 'home-lifestyle.html',
        title: 'Home & Lifestyle',
        prefix: 'hl',
        categories: [
            { val: 'furniture', label: 'Furniture' },
            { val: 'decor', label: 'Decor' },
            { val: 'kitchen', label: 'Kitchen' }
        ],
        products: [
            { cat: 'furniture', name: 'Modern Sofa', price: '450', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&auto=format&fit=crop' },
            { cat: 'decor', name: 'Wall Clock', price: '45', img: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=400&auto=format&fit=crop' },
            { cat: 'kitchen', name: 'Blender', price: '85', img: 'https://images.unsplash.com/photo-1585515320310-259814833e62?q=80&w=400&auto=format&fit=crop' }
        ]
    },
    {
        filename: 'medicine.html',
        title: 'Medicine',
        prefix: 'med',
        categories: [
            { val: 'supplements', label: 'Supplements' },
            { val: 'firstaid', label: 'First Aid' },
            { val: 'equipment', label: 'Equipment' }
        ],
        products: [
            { cat: 'supplements', name: 'Vitamin C 1000mg', price: '20', img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400&auto=format&fit=crop' },
            { cat: 'firstaid', name: 'First Aid Kit', price: '35', img: 'https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=400&auto=format&fit=crop' },
            { cat: 'equipment', name: 'Blood Pressure Monitor', price: '60', img: 'https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?q=80&w=400&auto=format&fit=crop' }
        ]
    },
    {
        filename: 'sports-outdoor.html',
        title: 'Sports & Outdoor',
        prefix: 'so',
        categories: [
            { val: 'fitness', label: 'Fitness' },
            { val: 'camping', label: 'Camping' },
            { val: 'sports', label: 'Sports Gear' }
        ],
        products: [
            { cat: 'fitness', name: 'Dumbbells Set 10kg', price: '75', img: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?q=80&w=400&auto=format&fit=crop' },
            { cat: 'camping', name: 'Camping Tent', price: '120', img: 'https://images.unsplash.com/photo-1504280327388-780070a273b7?q=80&w=400&auto=format&fit=crop' },
            { cat: 'sports', name: 'Pro Basketball', price: '30', img: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=400&auto=format&fit=crop' }
        ]
    },
    {
        filename: 'babys-toys.html',
        title: 'Baby\'s & Toys',
        prefix: 'bt',
        categories: [
            { val: 'toys', label: 'Toys' },
            { val: 'clothing', label: 'Baby Clothing' },
            { val: 'nursery', label: 'Nursery' }
        ],
        products: [
            { cat: 'toys', name: 'Action Figure Set', price: '25', img: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?q=80&w=400&auto=format&fit=crop' },
            { cat: 'clothing', name: 'Cotton Onesie', price: '15', img: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?q=80&w=400&auto=format&fit=crop' },
            { cat: 'nursery', name: 'Baby Crib', price: '250', img: 'https://images.unsplash.com/photo-1611080517865-c335520970a6?q=80&w=400&auto=format&fit=crop' }
        ]
    },
    {
        filename: 'groceries-pets.html',
        title: 'Groceries & Pets',
        prefix: 'gp',
        categories: [
            { val: 'groceries', label: 'Groceries' },
            { val: 'petfood', label: 'Pet Food' },
            { val: 'pettoys', label: 'Pet Toys' }
        ],
        products: [
            { cat: 'groceries', name: 'Organic Honey', price: '12', img: 'https://images.unsplash.com/photo-1587049352847-4d4b1f66060c?q=80&w=400&auto=format&fit=crop' },
            { cat: 'petfood', name: 'Premium Dog Food', price: '40', img: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=400&auto=format&fit=crop' },
            { cat: 'pettoys', name: 'Cat Teaser Wand', price: '10', img: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?q=80&w=400&auto=format&fit=crop' }
        ]
    },
    {
        filename: 'health-beauty.html',
        title: 'Health & Beauty',
        prefix: 'hb',
        categories: [
            { val: 'skincare', label: 'Skincare' },
            { val: 'makeup', label: 'Makeup' },
            { val: 'haircare', label: 'Haircare' }
        ],
        products: [
            { cat: 'skincare', name: 'Vitamin C Face Serum', price: '35', img: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=400&auto=format&fit=crop' },
            { cat: 'makeup', name: 'Matte Lipstick', price: '20', img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=400&auto=format&fit=crop' },
            { cat: 'haircare', name: 'Ionic Hair Dryer', price: '55', img: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=400&auto=format&fit=crop' }
        ]
    }
];

const template = fs.readFileSync(path.join(__dirname, 'womens-fashion.html'), 'utf-8');

pages.forEach(p => {
    let content = template;
    
    // Replace Title
    content = content.replace(/<title>.*?<\/title>/, `<title>${p.title} | Exclusive</title>`);
    
    // Replace Breadcrumb Title
    content = content.replace(/<span>Women's Fashion<\/span>/, `<span>${p.title}</span>`);
    
    // Replace Results Text
    content = content.replace(/"Women's Fashion"/g, `"${p.title}"`);
    
    // Replace Subcategories
    let catsHtml = `                        <li><label><input type="radio" name="${p.prefix}_category" value="all" checked> All</label></li>\n`;
    p.categories.forEach(c => {
        catsHtml += `                        <li><label><input type="radio" name="${p.prefix}_category" value="${c.val}"> ${c.label}</label></li>\n`;
    });
    const catBlockRegex = /(<div class="filter-block">\s*<h3>Sub Categories<\/h3>\s*<ul>)[\s\S]*?(<\/ul>\s*<\/div>)/;
    content = content.replace(catBlockRegex, `$1\n${catsHtml}                    $2`);
    
    // Replace Products
    let prodHtml = '';
    p.products.forEach(prod => {
        prodHtml += `
                    <div class="product-card" data-category="${prod.cat}">
                        <div class="product-image">
                            <img src="${prod.img}" alt="${prod.name}">
                            <div class="card-actions">
                                <button class="icon-action"><i class="fa-regular fa-heart"></i></button>
                                <button class="icon-action"><i class="fa-regular fa-eye"></i></button>
                            </div>
                            <button class="add-to-cart">Add To Cart</button>
                        </div>
                        <div class="product-info">
                            <h4 class="product-title">${prod.name}</h4>
                            <div class="product-price">
                                <span class="current-price">$${prod.price}</span>
                            </div>
                            <div class="product-rating">
                                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                                <span class="reviews">(50)</span>
                            </div>
                        </div>
                    </div>`;
    });
    const prodBlockRegex = /(<div class="product-grid">)[\s\S]*?(<\/div>\s*<div style="display: flex; justify-content: center; margin-top: 40px;">)/;
    content = content.replace(prodBlockRegex, `$1\n${prodHtml}\n                $2`);

    fs.writeFileSync(path.join(__dirname, p.filename), content);
    console.log(`Generated ${p.filename}`);
});
