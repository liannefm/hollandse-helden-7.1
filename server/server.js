import { Server } from "socket.io";

const io = new Server(3000, {
    cors: { origin: "*" },
});

const categories = [
    {
        category_id: 1,
        name: "Breakfast",
        description: null
    },
    {
        category_id: 2,
        name: "Lunch & Dinner",
        description: null
    },
    {
        category_id: 3,
        name: "Handhelds",
        description: null
    },
    {
        category_id: 4,
        name: "Sides & Small Plates",
        description: null
    }
]

const images = [
    {
        image_id: 1,
        filename: "1.png",
        description: "Morning Boost Açaí Bowl"
    },
    {
        image_id: 2,
        filename: "2.png",
        description: "The Garden Breakfast Wrap"
    },
    {
        image_id: 3,
        filename: "3.png",
        description: "Peanut Butter & Cacao Toast"
    },
    {
        image_id: 4,
        filename: "4.png",
        description: "Overnight Oats: Apple Pie Style"
    },
    {
        image_id: 5,
        filename: "5.png",
        description: "Tofu Power Tahini Bowl"
    },
    {
        image_id: 6,
        filename: "6.png",
        description: "The Supergreen Harvest"
    },
    {
        image_id: 7,
        filename: "7.png",
        description: "Mediterranean Falafel Bowl"
    },
    {
        image_id: 8,
        filename: "8.png",
        description: "Warm Teriyaki Tempeh Bowl"
    }
]

const products = [
    {
        product_id: 1,
        category_id: 1,
        image: "1.png",
        name: "Morning Boost Açaí Bowl",
        description: "A chilled blend of açaí and banana topped with crunchy granola, chia seeds, and coconut.",
        price: 7.50,
        kcal: 320,
        diet_type: "VG",
        available: 1,
    },
    {
        product_id: 2,
        category_id: 1,
        image: "2.png",
        name: "The Garden Breakfast Wrap",
        description: "Whole-grain wrap with fluffy scrambled eggs, baby spinach, and a light yogurt-herb sauce.",
        price: 6.50,
        kcal: 280,
        diet_type: "V",
        available: 1,
    },
    {
        product_id: 3,
        category_id: 1,
        image: "3.png",
        name: "Peanut Butter & Cacao Toast",
        description: "Sourdough toast with 100% natural peanut butter, banana, and a sprinkle of cacao nibs.",
        price: 5.00,
        kcal: 240,
        diet_type: "VG",
        available: 1,
    },
    {
        product_id: 4,
        category_id: 1,
        image: "4.png",
        name: "Overnight Oats: Apple Pie Style",
        description: "Oats soaked in almond milk with grated apple, cinnamon, and crushed walnuts.",
        price: 5.50,
        kcal: 290,
        diet_type: "VG",
        available: 1,
    },
    {
        product_id: 5,
        category_id: 2,
        image: "5.png",
        name: "Tofu Power Tahini Bowl",
        description: "Tri-color quinoa, maple-glazed tofu, roasted sweet potatoes, and kale with tahini dressing.",
        price: 10.50,
        kcal: 480,
        diet_type: "VG",
        available: 1,
    },
    {
        product_id: 6,
        category_id: 2,
        image: "6.png",
        name: "The Supergreen Harvest",
        description: "Massaged kale, edamame, avocado, cucumber, and toasted pumpkin seeds with lemon-olive oil.",
        price: 9.50,
        kcal: 310,
        diet_type: "VG",
        available: 1,
    },
    {
        product_id: 7,
        category_id: 2,
        image: "7.png",
        name: "Mediterranean Falafel Bowl",
        description: "Baked falafel, hummus, pickled red onions, cherry tomatoes, and cucumber on a bed of greens.",
        price: 10.00,
        kcal: 440,
        diet_type: "VG",
        available: 1,
    },
    {
        product_id: 8,
        category_id: 2,
        image: "8.png",
        name: "Warm Teriyaki Tempeh Bowl",
        description: "Steamed brown rice, seared tempeh, broccoli, and shredded carrots with a ginger-soy glaze.",
        price: 11.00,
        kcal: 500,
        diet_type: "VG",
        available: 1,
    },
]

io.on("connection", (socket) => {
    console.log("Client connected");

    const sendProducts = products.map((product) => {
        return {
            product_id: product.product_id,
            category_id: product.category_id,
            image: product.image,
            name: product.name,
            description: product.description,
            price: product.price,
            kcal: product.kcal,
            diet_type: product.diet_type,
        };
    });

    socket.emit("products", sendProducts);
    socket.emit("categories", categories);
});