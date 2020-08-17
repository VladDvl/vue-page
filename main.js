Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        },
        cart: []
    },
    template: 
        `<div class="product">
            <div class="product-image">
                <img 
                    v-bind:src="image"
                    v-bind:alt="altText"
                />
            </div>

            <div class="product-info">
                <h1>{{title}}</h1>
                <p>{{description}}</p>

                <p v-if="inventory > 10 && inStock">In stock</p>
                <p v-else-if="inventory <= 10 && inventory > 0 && inStock">Almost sold out!</p>
                <p
                    v-else
                    :class="{outOfStock: !inStock}"
                >
                    Out of stock
                </p>
                <p>Shipping: {{shipping}}</p>

                <span>{{sale}}</span>

                <product-details :details="details"></product-details>

                <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{backgroundColor: variant.variantColor}"
                    @mouseover="updateProduct(index)"
                ></div>

                <ul>
                    <li v-for="size in sizes">{{size}}</li>
                </ul>

                <div class="btn-block">
                    <button 
                        v-on:click="addToCart"
                        :disabled="!inStock"
                        :class="{disabledButton: !inStock}"
                    >
                        Add to cart
                    </button>
                    <button
                        v-on:click="removeFromCart"
                        :disabled="!inStock || cart.length < 1"
                        :class="{disabledButton: !inStock || cart.length < 1}"
                    >
                        Remove from cart
                    </button>
                </div>
            </div>

            <a 
                v-bind:href="link"
            >
                More products like this.
            </a>
        </div>`,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks.",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inventory: 100,
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            }
        },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' are on sale!';
            }

            return this.brand + ' ' + this.product + ' are not on sale!';
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }
    }
});

Vue.component('product-details', {
    template: 
        `<ul>
            <li v-for="detail in details">{{detail}}</li>
        </ul>`,
    props: {
        details: {
            type: Array,
            required: true
        }
    },
});

/*
    var app = new Vue({options})
        el: '#app' - connect vue with element
        data
*/
var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        addToCart(id) {
            this.cart.push(id);
        }
        ,
        removeFromCart(id) {
            this.cart.pop(id);
        }
    }
});
