// ============================================================
// GOWTHAM TYRES - SPIN & WIN
// FINAL script.js
// ============================================================

const form = document.getElementById("leadForm");

// Google Apps Script Web App URL
const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbw5nqfrdU7Oe8n-pdhW9uUnfG3k9nPq-pVSbJBN7VQHeURqoOEpf4ebzCg-MW61pJCl/exec";

// ------------------------------------------------------------
// IMPORTANT:
// This variable stores the CUSTOMER'S number before form.reset()
// so WhatsApp will still know which customer to open.
// ------------------------------------------------------------

let customerMobileForWhatsApp = "";
let customerNameForWhatsApp = "";
let customerVehicleForWhatsApp = "";


// ============================================================
// GET LINK FROM EXISTING PAGE
// This keeps the exact links already present in your HTML.
// ============================================================

function getPageLink(selectors) {

    for (const selector of selectors) {

        const element = document.querySelector(selector);

        if (element && element.href) {
            return element.href;
        }
    }

    return "";
}


// ============================================================
// FORM SUBMISSION
// ============================================================

if (form) {

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const nameElement =
            document.getElementById("name");

        const mobileElement =
            document.getElementById("mobile");

        const vehicleElement =
            document.getElementById("vehicle");


        const name =
            nameElement ? nameElement.value.trim() : "";

        const mobile =
            mobileElement ? mobileElement.value.trim() : "";

        const vehicle =
            vehicleElement ? vehicleElement.value.trim() : "";


        // --------------------------------------------------------
        // MOBILE VALIDATION
        // --------------------------------------------------------

        if (!/^[6-9]\d{9}$/.test(mobile)) {

            alert(
                "Please enter a valid 10-digit mobile number."
            );

            return;
        }


        // --------------------------------------------------------
        // SAVE CUSTOMER DETAILS BEFORE form.reset()
        // --------------------------------------------------------

        customerMobileForWhatsApp = mobile;
        customerNameForWhatsApp = name;
        customerVehicleForWhatsApp = vehicle;


        // --------------------------------------------------------
        // PRIZES
        // --------------------------------------------------------

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


        // --------------------------------------------------------
        // RANDOM PRIZE
        // --------------------------------------------------------

        const prize =
            prizes[
                Math.floor(
                    Math.random() * prizes.length
                )
            ];


        // --------------------------------------------------------
        // COUPON CODE
        // --------------------------------------------------------

        const coupon =
            "GT" +
            Date.now()
                .toString()
                .slice(-6);


        // --------------------------------------------------------
        // COLLECT OPTIONAL FIELDS IF THEY EXIST
        // --------------------------------------------------------

        let interest = "";

        let dealership = "";


        const interestElement =
            document.getElementById("interest") ||
            document.getElementById("technology") ||
            document.getElementById("areaOfInterest");


        if (interestElement) {
            interest = interestElement.value.trim();
        }


        const dealershipElement =
            document.getElementById("dealership") ||
            document.getElementById("dealershipType") ||
            document.getElementById("g1Technology");


        if (dealershipElement) {
            dealership = dealershipElement.value.trim();
        }


        // --------------------------------------------------------
        // DATA SENT TO GOOGLE SHEETS
        // --------------------------------------------------------

        const data = {

            name: name,

            mobile: mobile,

            vehicle: vehicle,

            interest: interest,

            dealership: dealership,

            prize: prize,

            coupon: coupon

        };


        // --------------------------------------------------------
        // SUBMIT BUTTON
        // --------------------------------------------------------

        const submitBtn =
            form.querySelector("button[type='submit']") ||
            form.querySelector("button");


        try {

            if (submitBtn) {

                submitBtn.disabled = true;

                submitBtn.innerText =
                    "Processing...";

            }


            // ----------------------------------------------------
            // SAVE TO GOOGLE SHEETS
            // ----------------------------------------------------

            const response =
                await fetch(
                    GOOGLE_SCRIPT_URL,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "text/plain;charset=utf-8"

                        },

                        body:
                            JSON.stringify(data)

                    }
                );


            const result =
                await response.json();


            // ----------------------------------------------------
            // DUPLICATE MOBILE
            // ----------------------------------------------------

            if (
                result.status ===
                "duplicate"
            ) {

                if (submitBtn) {

                    submitBtn.disabled =
                        false;

                    submitBtn.innerText =
                        "🎁 CLAIM MY COUPON";

                }


                alert(
                    "This mobile number has already claimed a coupon."
                );


                return;

            }


            // ----------------------------------------------------
            // SUCCESS
            // ----------------------------------------------------

            if (
                result.status ===
                "success"
            ) {


                // -----------------------------------------------
                // SHOW COUPON
                // -----------------------------------------------

                const couponCodeElement =
                    document.getElementById(
                        "couponCode"
                    );


                if (couponCodeElement) {

                    couponCodeElement.innerText =
                        coupon;

                }


                // -----------------------------------------------
                // SHOW PRIZE
                // -----------------------------------------------

                const prizeElement =
                    document.getElementById(
                        "prizeWon"
                    );


                if (prizeElement) {

                    prizeElement.innerText =
                        prize;

                }


                // -----------------------------------------------
                // SHOW RESULT PAGE
                // -----------------------------------------------

                const winnerModal =
                    document.getElementById(
                        "winnerModal"
                    );


                if (winnerModal) {

                    winnerModal.style.display =
                        "flex";

                }


                // -----------------------------------------------
                // RESET FORM
                // IMPORTANT:
                // customerMobileForWhatsApp remains saved.
                // -----------------------------------------------

                form.reset();


                // -----------------------------------------------
                // RESET BUTTON
                // -----------------------------------------------

                if (submitBtn) {

                    submitBtn.disabled =
                        false;

                    submitBtn.innerText =
                        "🎁 CLAIM MY COUPON";

                }


            } else {

                throw new Error(
                    "Unexpected server response"
                );

            }


        } catch (error) {


            console.error(
                "Submission error:",
                error
            );


            if (submitBtn) {

                submitBtn.disabled =
                    false;

                submitBtn.innerText =
                    "🎁 CLAIM MY COUPON";

            }


            alert(
                "Error saving data. Please try again."
            );

        }

    });

}


// ============================================================
// CLOSE WINNER / RESULT
// ============================================================

function closeWinner() {

    const winnerModal =
        document.getElementById(
            "winnerModal"
        );


    if (winnerModal) {

        winnerModal.style.display =
            "none";

    }

}


// ============================================================
// SEND COUPON TO CUSTOMER'S WHATSAPP
// ============================================================
//
// VERY IMPORTANT:
// The number used here is the number entered by the CUSTOMER.
// It is NOT your Gowtham Tyres number.
//
// Example:
// Customer enters 8940516202
//
// WhatsApp opens:
// https://wa.me/918940516202
//
// ============================================================

function sendCouponToWhatsApp() {


    // ----------------------------------------------------------
    // CHECK CUSTOMER MOBILE
    // ----------------------------------------------------------

    const mobile =
        customerMobileForWhatsApp.trim();


    if (!/^[6-9]\d{9}$/.test(mobile)) {

        alert(
            "Customer mobile number is not available."
        );

        return;

    }


    // ----------------------------------------------------------
    // GET COUPON
    // ----------------------------------------------------------

    const couponElement =
        document.getElementById(
            "couponCode"
        );


    const prizeElement =
        document.getElementById(
            "prizeWon"
        );


    const coupon =
        couponElement
            ? couponElement.innerText.trim()
            : "";


    const prize =
        prizeElement
            ? prizeElement.innerText.trim()
            : "";


    if (!coupon || !prize) {

        alert(
            "Coupon details are not available."
        );

        return;

    }


    // ----------------------------------------------------------
    // GET EXISTING PAGE LINKS
    // ----------------------------------------------------------

    const instagramLink =
        getPageLink([
            ".insta-btn",
            "#instagramBtn",
            "a[href*='instagram.com']"
        ]);


    const youtubeLink =
        getPageLink([
            ".yt-btn",
            "#youtubeBtn",
            "a[href*='youtube.com']",
            "a[href*='youtu.be']"
        ]);


    const facebookLink =
        getPageLink([
            ".fb-btn",
            "#facebookBtn",
            "a[href*='facebook.com']"
        ]);


    const reviewLink =
        getPageLink([
            ".review-btn",
            "#reviewBtn",
            "a[href*='google.com']",
            "a[href*='g.page']"
        ]);


    const directionsLink =
        getPageLink([
            ".direction-btn",
            "#directionsBtn",
            "a[href*='maps.app.goo.gl']",
            "a[href*='google.com/maps']"
        ]);


    // ----------------------------------------------------------
    // BUILD WHATSAPP MESSAGE
    // ----------------------------------------------------------

    let message =

`Welcome to GOWTHAM TYRES! 🚗

Thank you for visiting us.

Your Coupon Code: ${coupon}

Your Offer: ${prize}

Gowtham Tyres - The Tyre Bazaar
Simmakal, Madurai

Location:
${directionsLink || "https://maps.app.goo.gl/m8zWTLQjn55cpST28"}

Call: 96778 41063

Your coupon is valid until 31 December 2026.

Follow GOWTHAM TYRES:`;


    // ----------------------------------------------------------
    // SOCIAL LINKS
    // ----------------------------------------------------------

    if (instagramLink) {

        message +=

`\n\nInstagram:
${instagramLink}`;

    }


    if (youtubeLink) {

        message +=

`\n\nYouTube:
${youtubeLink}`;

    }


    if (facebookLink) {

        message +=

`\n\nFacebook:
${facebookLink}`;

    }


    if (reviewLink) {

        message +=

`\n\nGoogle Review:
${reviewLink}`;

    }


    message +=

`

Thank you for choosing GOWTHAM TYRES! 🙏`;


    // ----------------------------------------------------------
    // CUSTOMER'S WHATSAPP NUMBER
    // ----------------------------------------------------------

    const whatsappNumber =
        "91" + mobile;


    // ----------------------------------------------------------
    // CREATE WHATSAPP URL
    // ----------------------------------------------------------

    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(
            message
        );


    // ----------------------------------------------------------
    // OPEN CUSTOMER'S WHATSAPP
    // ----------------------------------------------------------

    window.open(
        whatsappURL,
        "_blank"
    );

}


// ============================================================
// MAKE FUNCTION AVAILABLE TO HTML onclick="..."
// ============================================================

window.sendCouponToWhatsApp =
    sendCouponToWhatsApp;


window.closeWinner =
    closeWinner;


// ============================================================
// EXTRA SAFETY:
// If the WhatsApp button exists but does not have onclick,
// attach the function automatically.
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const whatsappButton =
            document.querySelector(
                "#sendWhatsAppBtn"
            ) ||
            document.querySelector(
                ".whatsapp-btn"
            ) ||
            document.querySelector(
                "a[href*='wa.me']"
            );


        if (
            whatsappButton &&
            !whatsappButton.getAttribute(
                "onclick"
            )
        ) {

            whatsappButton.addEventListener(
                "click",
                function (e) {

                    e.preventDefault();

                    sendCouponToWhatsApp();

                }
            );

        }

    }
);