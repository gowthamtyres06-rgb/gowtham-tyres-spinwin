const form = document.getElementById("leadForm");

const claimButton =
    document.getElementById("claimButton");


/* =========================
   GOOGLE APPS SCRIPT
========================= */

const APPS_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbw5nqfrdU7Oe8n-pdhW9uUnfG3k9nPq-pVSbJBN7VQHeURqoOEpf4ebzCg-MW61pJCl/exec";


/* =========================
   GOWTHAM TYRES WHATSAPP
========================= */

const WHATSAPP_NUMBER =
"917305563422";


/* =========================
   SOCIAL MEDIA LINKS
========================= */

const INSTAGRAM_URL =
"https://www.instagram.com/gowthamtyres?utm_source=qr";

const YOUTUBE_URL =
"https://youtube.com/@gowthamtyresindia?si=mVM0eIkitLG9nRw3";

const FACEBOOK_URL =
"https://www.facebook.com/share/1BfZFw7s9X/?mibextid=wwXIfr";


/* =========================
   GOOGLE MAPS LOCATION
========================= */

const LOCATION_URL =
"https://maps.app.goo.gl/m8zWTLQjn55cpSt28?g_st=ic";


/* =========================
   GUARANTEED 8 OFFERS
========================= */

const prizes = [

    "FREE Tyre Fitting",

    "FREE Tubeless Valve Worth ₹100",

    "2% OFF Final Bill",

    "50% OFF Tube MRP",

    "50% OFF Puncture Kit MRP",

    "₹100 OFF Two Wheeler Tyres",

    "₹100 OFF Car Tyres",

    "₹1000 OFF Super Bike Tyres"

];


/* =========================
   FORM SUBMISSION
========================= */

form.addEventListener(
    "submit",
    async function(e){

        e.preventDefault();


        const name =
            document.getElementById("name")
            .value
            .trim();


        const mobile =
            document.getElementById("mobile")
            .value
            .trim();


        const vehicle =
            document.getElementById("vehicle")
            .value
            .trim();


        const technology =
            document.getElementById("technology")
            .value
            .trim();


        const dealership =
            document.getElementById("dealership")
            .value
            .trim();


        /* =========================
           MOBILE VALIDATION
        ========================== */

        if(
            !/^[6-9]\d{9}$/.test(mobile)
        ){

            alert(
                "Please enter a valid 10-digit mobile number."
            );

            return;
        }


        /* =========================
           RANDOM GUARANTEED OFFER
        ========================== */

        const prize =
            prizes[
                Math.floor(
                    Math.random() *
                    prizes.length
                )
            ];


        /* =========================
           UNIQUE COUPON
        ========================== */

        const coupon =
            "GT" +
            Date.now()
            .toString()
            .slice(-6);


        /* =========================
           DATA TO GOOGLE SHEET
        ========================== */

        const data = {

            name: name,

            mobile: mobile,

            vehicle: vehicle,

            technology: technology,

            dealership: dealership,

            prize: prize,

            coupon: coupon

        };


        try{

            claimButton.disabled = true;

            claimButton.innerText =
                "GENERATING YOUR COUPON...";


            const response =
                await fetch(
                    APPS_SCRIPT_URL,
                    {
                        method:"POST",

                        headers:{
                            "Content-Type":
                            "text/plain;charset=utf-8"
                        },

                        body:
                        JSON.stringify(data)
                    }
                );


            const result =
                await response.json();


            /* =========================
               DUPLICATE MOBILE
            ========================== */

            if(
                result.status ===
                "duplicate"
            ){

                claimButton.disabled = false;

                claimButton.innerText =
                    "🎁 CLAIM MY COUPON";


                alert(
                    "This mobile number has already claimed a coupon."
                );

                return;
            }


            /* =========================
               SERVER ERROR
            ========================== */

            if(
                result.status !==
                "success"
            ){

                throw new Error(
                    result.message ||
                    "Server error"
                );
            }


            /* =========================
               SHOW COUPON
            ========================== */

            showCouponResult(
                coupon,
                prize,
                technology
            );

        }


        catch(error){

            console.error(error);

            claimButton.disabled = false;

            claimButton.innerText =
                "🎁 CLAIM MY COUPON";


            alert(
                "Error saving data. Please try again."
            );

        }

    }
);


/* =========================
   SHOW COUPON RESULT
========================= */

function showCouponResult(
    coupon,
    prize,
    technology
){

    document.getElementById(
        "claimPage"
    ).style.display = "none";


    document.getElementById(
        "resultPage"
    ).style.display = "block";


    document.getElementById(
        "couponCode"
    ).innerText = coupon;


    document.getElementById(
        "prizeWon"
    ).innerText = prize;


    /* =========================
       TECHNOLOGY MESSAGE
    ========================== */

    let interestMessage;


    if(technology){

        interestMessage =
            "Our team will contact you regarding " +
            technology +
            ".";

    }else{

        interestMessage =
            "Our team will contact you regarding your tyre requirement.";

    }


    /* =========================
       FINAL WHATSAPP MESSAGE
       NO EMOJIS
========================= */

    const message =

`Welcome to GOWTHAM TYRES!

Thank you for visiting us.

Your Coupon Code: ${coupon}

Your Offer: ${prize}

Gowtham Tyres - The Tyre Bazaar

Simmakal, Madurai

Location:
${LOCATION_URL}

Call: 96778 41063

${interestMessage}

Your coupon is valid until 31 December 2026.

Follow GOWTHAM TYRES:

Instagram:
${INSTAGRAM_URL}

YouTube:
${YOUTUBE_URL}

Facebook:
${FACEBOOK_URL}

Thank you for choosing GOWTHAM TYRES!`;


    /* =========================
       WHATSAPP BUTTON
========================= */

    const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(
            message
        );


    const whatsappButton =
        document.getElementById(
            "whatsappButton"
        );


    if(whatsappButton){

        whatsappButton.href =
            whatsappURL;

    }


    /* =========================
       UPDATE SOCIAL BUTTONS
       IF THEIR IDs EXIST
========================= */

    const instagramButton =
        document.getElementById(
            "instagramButton"
        );

    if(instagramButton){

        instagramButton.href =
            INSTAGRAM_URL;

    }


    const youtubeButton =
        document.getElementById(
            "youtubeButton"
        );

    if(youtubeButton){

        youtubeButton.href =
            YOUTUBE_URL;

    }


    const facebookButton =
        document.getElementById(
            "facebookButton"
        );

    if(facebookButton){

        facebookButton.href =
            FACEBOOK_URL;

    }

}