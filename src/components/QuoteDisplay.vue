<script setup lang="ts">
import { ref } from 'vue';
import { useWindowStore } from '../stores/window';

const windowStore = useWindowStore();

const quote = ref('Success is not final, failure is not fatal: it is the courage to continue that counts.');
const author = ref('Winston Churchill');
const showQuote = ref(true);
const imageUrl = ref();
let count = 0;
let imageCount = 0;

const desktopImages = ['pebbles-desktop.jpg', 'mountains-desktop.jpg', 'trees-desktop.jpg', 'winter-mountains-desktop.jpg', 'forest-desktop.jpg', 'beach-desktop.jpg'];
const mobileImages = ['pebbles-mobile.jpg', 'mountains-mobile.jpg', 'trees-mobile.jpg', 'winter-mountains-mobile.jpg', 'forest-mobile.jpg', 'beach-mobile.jpg'];

if (windowStore.windowWidth < 687) {
    imageUrl.value = new URL('../assets/images/forest-mobile.jpg', import.meta.url);
} else {    
    imageUrl.value = new URL('../assets/images/beach-desktop.jpg', import.meta.url);
}

const quotes = [
    {
        quote: "If I cannot do great things, I can do small things in a great way.",
        author: "Martin Luther King, Jr."
    },
    {
        quote: "Act as if what you do makes a difference. It does.",
        author: "William James"
    },
    {
        quote: "Be the change that you wish to see in the world.",
        author: "Mahatma Ghandi"
    },
    {
        quote: "Don't sit down and wait for the opportunities to come. Get up and make them.",
        author: "Madam C.J. Walker"
    },
    {
        quote: "Opportunity is missed by most people because it is dressed in overalls and looks like work.",
        author: "Thomas Edison"
    },
    {
        quote: "The most difficult thing is the decision to act; the rest is merely tenacity.",
        author: "Amelia Earhart"
    },
    {
        quote: "The bad news is time flies. The good news is you're the pilot.",
        author: "Michael Altshuler"
    },
    {
        quote: "I can't change the direction of the wind, but I can adjust my sails to always reach my destination." ,
        author: "Jimmy Dean"
    },
    {
        quote: "You get what you give.",
        author: "Jennifer Lopez"
    },
    {
        quote: "It is often the small steps, not the giant leaps, that bring about the most lasting change.",
        author: "Queen Elizabeth II"
    },
    {
        quote: "If what you have done yesterday still looks big to you, you haven't done much today.",
        author: "Mikhail Gorbachev"
    },
    {
        quote: "In the long run, you make your own luck — good, bad, or indifferent.",
        author: "Loretta Lynn"
    },
    {
        quote: "If my mind can conceive it, if my heart can believe it, then I can achieve it." ,
        author: "Muhammad Ali"
    },
    {
        quote: "Believe you can and you're halfway there." ,
        author: "Theodore Roosevelt"
    },
    {
        quote: "Never limit yourself because of others' limited imagination; never limit others because of your own limited imagination",
        author: "Mae Jemison"
    },
    {
        quote: "We must believe that we are gifted for something, and that this thing, at whatever cost, must be attained.",
        author: "Marie Curie"
    },
    {
        quote: "The people who are crazy enough to think they can change the world are the ones who do.",
        author: "Steve Jobs"
    },
    {
        quote: "I scorched the earth with my talent and I let my light shine.",
        author: "André Leon Talley"
    },
    {
        quote: "Nothing is impossible. The word itself says 'I'm possible!'",
        author: "Audrey Hepburn"
    },
    {
        quote: "Never bend your head. Always hold it high. Look the world straight in the eye.",
        author: "Helen Keller"
    },
    {
        quote: "Never allow a person to tell you no who doesn't have the power to say yes.",
        author: "Eleanor Roosevelt"
    },
    {
        quote: "It took me quite a long time to develop a voice, and now that I have it, I am not going to be silent.",
        author: "Madeleine Albright"
    },
    {
        quote: "You are never too old to set another goal or to dream a new dream.",
        author: "C.S. Lewis"
    },
    {
        quote: "When you have a dream, you've got to grab it and never let go." ,
        author: "Carol Burnett"
    },
    {
        quote: "Let us make our future now, and let us make our dreams tomorrow's reality.",
        author: "Malala Yousafzai"
    },
    {
        quote: "All our dreams can come true — if we have the courage to pursue them.",
        author: "Walt Disney"
    },
    {
        quote: "Go confidently in the direction of your dreams. Live the life you have imagined.",
        author: "Henry David Thoreau"
    },
    {
        quote: "All dreams are within reach. All you have to do is keep moving towards them.",
        author: "Viola Davis"
    },
    {
        quote: "Dreams don't have to just be dreams. You can make it a reality; if you just keep pushing and keep trying, then eventually you'll reach your goal.",
        author: "Naomi Osaka"
    },
    {
        quote: "Shoot for the moon. Even if you miss, you'll land among the stars.",
        author: "Norman Vincent Peale"
    },
    {
        quote: "There is nothing impossible to they who will try.",
        author: "Alexander the Great"
    },
    {
        quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
    },
    {
        quote: "Champions keep playing until they get it right.",
        author: "Billie Jean King"
    },
    {
        quote: "We will fail when we fail to try.",
        author: "Rosa Parks"
    },
    {
        quote: "A person who never made a mistake never tried anything new.",
        author: "Albert Einstein"
    },
    {
        quote: "Challenges are gifts that force us to search for a new center of gravity. Don't fight them. Just find a new way to stand.",
        author: "Oprah Winfrey"
    },
    {
        quote: "It ain't about how hard you hit. It's about how hard you can get hit and keep moving forward.",
        author: "Sylvester Stallone"
    },
    {
        quote: "Our predecessors overcame many troubles and much suffering, but each time got back up stronger than before.",
        author: "Shinzo Abe"
    },
    {
        quote: "I have learned not to allow rejection to move me.",
        author: "Cicely Tyson"
    },
    {
        quote: "Just don't give up trying to do what you really want to do. Where there is love and inspiration, I don't think you can go wrong.",
        author: "Ella Fitzgerald"
    },
    {
        quote: "It is our attitude at the beginning of a difficult task which, more than anything else, will affect its successful outcome.",
        author: "William James"
    },
    {
        quote: "Attitude is the 'little' thing that makes a big difference.",
        author: "Winston Churchill"
    },
    {
        quote: "Once you replace negative thoughts with positive ones, you'll start having positive results.",
        author: "Willie Nelson"
    },
    {
        quote: "If you're not positive energy, you're negative energy.",
        author: "Mark Cuban"
    },
    {
        quote: "Inspiration comes from within yourself. One has to be positive. When you're positive, good things happen.",
        author: "Deep Roy"
    },
    {
        quote: "Optimism is a happiness magnet. If you stay positive, good things and good people will be drawn to you.",
        author: "Mary Lou Retton"
    },
    {
        quote: "I don't harp on the negative because if you do, then there's no progression. There's no forward movement. You got to always look on the bright side of things, and we are in control. Like, you have control over the choices you make.",
        author: "Taraji P. Henson"
    },
    {
        quote: "I know not all that may be coming, but be it what it will, I'll go to it laughing.",
        author: "Herman Melville"
    },
    {
        quote: "Where there's hope, there's life. It fills us with fresh courage and makes us strong again.",
        author: "Anne Frank"
    },
    {
        quote: "Once you face your fear, nothing is ever as hard as you think.",
        author: "Olivia Newton-John"
    },
    {
        quote: "You're braver than you believe, stronger than you seem, and smarter than you think.",
        author: "A.A. Milne"
    },
    {
        quote: "You must do the things you think you cannot do.",
        author: "Eleanor Roosevelt"
    },
    {
        quote: "The Sun himself is weak when he first rises, and gathers strength and courage as the day gets on.",
        author: "Charles Dickens"
    },
    {
        quote: "When your dreams are bigger than the places you find yourself in, sometimes you need to seek out your own reminders that there is more. And there is always more waiting for you on the other side of fear.",
        author: "Elaine Welteroth"
    },
    {
        quote: "Happiness is not something readymade; it comes from your own actions.",
        author: "The Dalai Lama"
    },
    {
        quote: "You do not find the happy life. You make it.",
        author: "Camilla Eyring Kimball"
    },
    {
        quote: "Happiness is not by chance, but by choice.",
        author: "Jim Rohn"
    },
    {
        quote: "Happiness often sneaks in through a door you didn't know you left open.",
        author: "John Barrymore"
    },
    {
        quote: "The miracle is not that we do this work, but that we are happy to do it.",
        author: "Mother Theresa"
    },
    {
        quote: "Some people look for a beautiful place. Others make a place beautiful.",
        author: "Hazrat Inayat Khan"
    },
    {
        quote: "Stay close to anything that makes you glad you are alive.",
        author: "Hafez"
    },
    {
        quote: "For one to have complete satisfaction from flowers, you must have time to spend with them.",
        author: "Grace Kelly"
    },
    {
        quote: "Always work hard and have fun in what you do because I think that's when you're more successful. You have to choose to do it.",
        author: "Simone Biles"
    },
    {
        quote: "I never dreamed about success. I worked for it.",
        author: "Esteé Lauder"
    },
    {
        quote: "Failure is the condiment that gives success its flavor.",
        author: "Truman Capote"
    },
    {
        quote: "What's money? A man is a success if he gets up in the morning and goes to bed at night and in between does what he wants to do.",
        author: "Bob Dylan"
    },
    {
        quote: "The best revenge is massive success.",
        author: "Frank Sinatra"
    },
    {
        quote: "Try to be a rainbow in someone else's cloud.",
        author: "Maya Angelou"
    },
    {
        quote: "If you want to lift yourself up, lift up someone else.",
        author: "Booker T. Washington"
    },
    {
        quote: "We can't help everyone, but everyone can help someone.",
        author: "Ronald Reagan"
    },
    {
        quote: "It has always been easy to hate and destroy. To build and to cherish is much more difficult.",
        author: "Queen Elizabeth II"
    },
    {
        quote: "You can't rely on how you look to sustain you, what sustains us, what is fundamentally beautiful is compassion; for yourself and your those around you.",
        author: "Lupita Nyong'o"
    },
    {
        quote: "Life is like riding a bicycle. To keep your balance, you must keep moving.",
        author: "Albert Einstein"
    },
    {
        quote: "It's no use going back to yesterday because I was a different person then.",
        author: "Lewis Caroll"
    },
    {
        quote: "It isn't where you came from. It's where you're going that counts.",
        author: "Ella Fitzgerald"
    },
    {
        quote: "Tough times never last, but tough people do.",
        author: "Robert H. Schuller"
    },
    {
        quote: "One of the lessons that I grew up with was to always stay true to yourself and never let what somebody else says distract you from your goals.",
        author: "Michelle Obama"
    },
    {
        quote: "You define your own life. Don't let other people write your script.",
        author: "Oprah Winfrey"
    },
    {
        quote: "You make a choice: continue living your life feeling muddled in this abyss of self-misunderstanding, or you find your identity independent of it. You draw your own box.",
        author: "Meghan Markle"
    },
    {
        quote: "It is never too late to be what you might have been.",
        author: "George Eliot"
    },
    {
        quote: "I always wanted to be somebody, but now I realize I should have been more specific.",
        author: "Lily Tomlin"
    },
    {
        quote: "What you get by achieving your goals is not as important as what you become by achieving your goals.",
        author: "Zig Ziglar"
    },
    {
        quote: "You don't always need a plan. Sometimes you just need to breathe, trust, let go and see what happens.",
        author: "Mandy Hale"
    },
    {
        quote: "Life has got all those twists and turns. You've got to hold on tight and off you go.",
        author: "Nicole Kidman"
    },
    {
        quote: "Life changes very quickly, in a very positive way, if you let it.",
        author: "Lindsey Vonn"
    },
    {
        quote: "We must be willing to let go of the life we planned so as to have the life that is waiting for us.",
        author: "Joseph Campbell"
    },
    {
        quote: "Keep your face always toward the sunshine — and shadows will fall behind you.",
        author: "Walt Whitman"
    },
    {
        quote: "There is always light. If only we're brave enough to see it. If only we're brave enough to be it.",
        author: "Amanda Gorman"
    },
    {
        quote: "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle"
    },
    {
        quote: "No matter what you're going through, there's a light at the end of the tunnel.",
        author: "Demi Lovato"
    },
    {
        quote: "Remember that the airplane takes off against the wind, not with it.",
        author: "Henry Ford"
    },
    {
        quote: "Education is the most powerful weapon which you can use to change the world.",
        author: "Nelson Mandela"
    },
    {
        quote: "A dead-end street is a good place to turn around.",
        author: "Naomi Judd"
    },
    {
        quote: "The most wasted of days is one without laughter.",
        author: "E.E. Cummings"
    },
    {
        quote: "Don't save your best for when you think the material calls for it. Always bring your full potential to every take, and be on top of your job, or they will replace you.",
        author: "Gabrielle Union"
    },
    {
        quote: "My mission in life is not merely to survive, but to thrive.",
        author: "Maya Angelou"
    },
    {
        quote: "We do not fall in love with the package of the person; we fall in love with the inside of a person.",
        author: "Anne Heche"
    },
    {
        quote: "Limit your 'always' and your 'nevers.'",
        author: "Amy Poehler"
    },
    {
        quote: "Sometimes you will never know the value of a moment, until it becomes a memory.",
        author: "Dr. Seuss"
    },
    {
        quote: "My least favorite phrase in the English language is 'I don't care.'",
        author: "James Caan"
    },
];

function cycleQuotes() {
    const index = count % 100;
    showQuote.value = !showQuote.value;
    quote.value = quotes[index].quote;
    author.value = quotes[index].author;
    count++;
}

setInterval(cycleQuotes, 10000);

function cycleImages() {
    const index = imageCount % 6;
    if (windowStore.windowWidth < 687) {
        imageUrl.value = new URL(`../assets/images/${mobileImages[index]}`, import.meta.url);   
    } else {
        imageUrl.value = new URL(`../assets/images/${desktopImages[index]}`, import.meta.url);
    }
    imageCount++;        
}

setInterval(cycleImages, 600000);

</script>

<template>
    <div id="quote-container">        
        <div id="quote-content" :style="{ backgroundImage: 'url(' + imageUrl + ')' }">
            <Transition name="fade-out" mode="out-in" appear>
                <div v-if="showQuote">
                    <p>"{{ quote }}"</p>
                    <span>{{ author }}</span>
                </div>
                <div v-else>
                    <p>"{{ quote }}"</p>
                    <span>{{ author }}</span>
                </div>
            </Transition>
        </div>        
    </div>    
</template>

<style lang="scss" scoped>
@use '../assets/css/mixins.scss';
@use '../assets/css/variables.scss';

.fade-out-enter-active,
.fade-out-leave-active {
    @include mixins.enter-leave;
}

.fade-out-enter-from,
.fade-out-leave-to {
    @include mixins.from-to-fade;
}

#quote-container {
    flex: 1 1 auto;
    width: 31.875rem;
    min-width: 20.5rem;
    min-height: 20.5rem;
    padding: 1.4375rem;  
}

#quote-content {
    min-height: 17.625rem;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    padding: 1.4375rem;
    border-radius: 0.3125rem;
    box-shadow: variables.$box-shadow;  

    p {
        font-size: 2rem;
        font-weight: 700;
        color: white;
        text-shadow: 0.0625rem 0.0625rem 0.125rem black;
    }

    span {
        font-style: italic;
        font-size: 20px;
        color: white;
        text-shadow: 0.0625rem 0.0625rem 0.125rem black;
    }

    @include mixins.mobile {
        min-height: 54.4375rem;
    }
}

</style>