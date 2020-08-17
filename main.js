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

            <div>
                <h2>Reviews</h2>
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul v-else>
                    <li v-for="(review, index) in reviews">
                        <p>{{review.name}}</p>
                        <p>Rating: {{review.rating}}</p>
                        <p>{{review.review}}</p>
                    </li>
                </ul>
            </div>

            <product-review
                @review-submitted="addReview"
            ></product-review>
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
            reviews: []
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
        },
        addReview(productReview) {
            this.reviews.push(productReview)
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

Vue.component('product-review', {
    template:
        `<form class="review-form" @submit.prevent="onSubmit">

            <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="error in errors">{{error}}</li>
                </ul>
            </p>

            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="name">
            </p>
      
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review"></textarea>
            </p>
      
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>

            <p>Would you recommend this product?</p>
            <label>
                Yes
                <input type="radio" name="recommend" value="Yes" v-model="recommend">
            </label>
            <label>
                No
                <input type="radio" name="recommend" value="No" v-model="recommend">
            </label>
      
            <p>
                <input type="submit" value="Submit">  
            </p>
      
        </form>`,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            recommend: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = []
            if(this.name && this.review && this.rating && this.recommend) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating,
                    recommend: this.recommend
                }
                this.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
                this.recommend = null
            } else {
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
                if(!this.recommend) this.errors.push("Recommendation required.")
            }
        }
    }
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
