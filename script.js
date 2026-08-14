// ============================================================
// GOWTHAM TYRES - SPIN & WIN
// FINAL script.js
// ============================================================

const GOOGLE_SCRIPT_URL =
"https://script.google.com/macros/s/AKfycbw5nqfrdU7Oe8n-pdhW9uUnfG3k9nPq-pVSbJBN7VQHeURqoOEpf4ebzCg-MW61pJCl/exec";

const form = document.getElementById("leadForm");

let customerMobile = "";
let customerName = "";
let customerVehicle = "";
let customerInterest = "";
let customerDealership = "";


// ============================================================
// PRIZES
// ============================================================

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


// ============================================================
// ELEMENT HELPER
// ============================================================

function getElement(id) {
    return document.getElementById(id);
}


// ============================================================
// SHOW COUPON PAGE
// ============================================================

function showCouponResult(coupon, prize) {

    const couponElement = getElement("couponCode");
    const prizeElement = getElement("prizeWon");

    if (couponElement) {
        couponElement.innerText = coupon;
    }

    if (prizeElement) {
        prizeElement.innerText = prize;
    }

    const claimPage = getElement("claimPage");
    const resultPage = getElement("resultPage");

    if (claimPage) {
        claimPage.style.display = "none";
    }

    if (resultPage) {
        resultPage.style.display = "block";

        resultPage.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}


// ============================================================
// FORM SUBMISSION
// ============================================================

if (form) {

    form.addEventListener("submit", async function (e) {

        e.preventDefault();

        const nameInput = getElement("name");
        const mobileInput = getElement("mobile");
        const vehicleInput = getElement("vehicle");

        const name =
            nameInput ? nameInput.value.trim() : "";

        const mobile =
            mobileInput ? mobileInput.value.trim() : "";

        const vehicle =
            vehicleInput ? vehicleInput.value.trim() : "";


        // ----------------------------------------------------
        // MOBILE VALIDATION
        // ----------------------------------------------------

        if (!/^[6-9]\d{9}$/.test(mobile)) {

            alert(
                "Please enter a valid 10-digit mobile number."
            );

            return;
        }


        // ----------------------------------------------------
        // OPTIONAL FIELDS
        // ----------------------------------------------------

        let interest = "";
        let dealership = "";

        const technologySelect =
            getElement("technology");

        const dealershipSelect =
            getElement("dealership");

        if (technologySelect) {
            interest = technologySelect.value;
        }

        if (dealershipSelect) {
            dealership = dealershipSelect.value;
        }


        // ----------------------------------------------------
        // SAVE CUSTOMER DETAILS FOR WHATSAPP
        // ----------------------------------------------------

        customerMobile = mobile;
        customerName = name;
        customerVehicle = vehicle;
        customerInterest = interest;
        customerDealership = dealership;


        // ----------------------------------------------------
        // GENERATE OFFER
        // ----------------------------------------------------

        const prize =
            prizes[
                Math.floor(
                    Math.random() * prizes.length
                )
            ];


        // ----------------------------------------------------
        // GENERATE COUPON
        // ----------------------------------------------------

        const coupon =
            "GT" +
            Date.now()
                .toString()
                .slice(-6);


        // ----------------------------------------------------
        // DATA FOR GOOGLE SHEET
        // ----------------------------------------------------

        const data = {

            name: name,
            mobile: mobile,
            vehicle: vehicle,
            interest: interest,
            dealership: dealership,
            prize: prize,
            coupon: coupon

        };


        // ----------------------------------------------------
        // BUTTON PROCESSING
        // ----------------------------------------------------

        const submitBtn =
            getElement("claimButton");

        if (submitBtn) {

            submitBtn.disabled = true;
            submitBtn.innerText = "Processing...";

        }


        // ====================================================
        // SEND TO GOOGLE APPS SCRIPT
        // ====================================================

        try {

            const response = await fetch(
                GOOGLE_SCRIPT_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body: JSON.stringify(data)
                }
            );


            // ------------------------------------------------
            // READ RESPONSE AS TEXT
            // NOT response.json()
            // ------------------------------------------------

            let responseText = "";

            try {

                responseText =
                    await response.text();

            } catch (error) {

                console.log(
                    "Could not read Apps Script response:",
                    error
                );

            }


            // ------------------------------------------------
            // CHECK FOR DUPLICATE
            // ------------------------------------------------

            if (responseText) {

                try {

                    const result =
                        JSON.parse(responseText);

                    if (
                        result &&
                        result.status === "duplicate"
                    ) {

                        if (submitBtn) {

                            submitBtn.disabled = false;

                            submitBtn.innerText =
                                "🎁 CLAIM MY COUPON";

                        }

                        alert(
                            "This mobile number has already claimed a coupon."
                        );

                        return;
                    }

                } catch (error) {

                    console.log(
                        "Apps Script returned non-JSON response."
                    );

                }

            }


            // ------------------------------------------------
            // SHOW RESULT
            // ------------------------------------------------

            showCouponResult(
                coupon,
                prize
            );


        } catch (error) {

            console.error(
                "Apps Script request error:",
                error
            );


            // ------------------------------------------------
            // FALLBACK
            // ------------------------------------------------

            showCouponResult(
                coupon,
                prize
            );

        }


        // ----------------------------------------------------
        // RESTORE BUTTON
        // ----------------------------------------------------

        if (submitBtn) {

            submitBtn.disabled = false;

            submitBtn.innerText =
                "🎁 CLAIM MY COUPON";

        }

    });

}


// ============================================================
// SEND COUPON TO CUSTOMER'S WHATSAPP
// ============================================================

function sendCouponToWhatsApp() {

    // --------------------------------------------------------
    // CHECK CUSTOMER MOBILE
    // --------------------------------------------------------

    if (
        !/^[6-9]\d{9}$/.test(
            customerMobile
        )
    ) {

        alert(
            "Customer mobile number is not available."
        );

        return;
    }


    // --------------------------------------------------------
    // GET COUPON
    // --------------------------------------------------------

    const couponElement =
        getElement("couponCode");

    const prizeElement =
        getElement("prizeWon");

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


    // ========================================================
    // CUSTOMER WHATSAPP MESSAGE
    // ========================================================

    const message =
`Welcome to GOWTHAM TYRES! 🚗

Thank you for visiting us.

Your Coupon Code: ${coupon}

Your Offer: ${prize}

Gowtham Tyres - The Tyre Bazaar

Simmakal, Madurai

Location:
https://maps.app.goo.gl/m8zWTLQjn55cpST28

Call: 96778 41063

Your coupon is valid until 31 December 2026.

Follow GOWTHAM TYRES:

Instagram:
https://www.instagram.com/gowthamtyres/

YouTube:
https://youtube.com/@gowthamtyresindia

Facebook:
https://www.facebook.com/share/1BfZFw7s9X/?mibextid=wwXIfr

Thank you for choosing GOWTHAM TYRES! 🙏`;


    // ========================================================
    // CUSTOMER'S NUMBER
    // ========================================================

    const whatsappNumber =
        "91" + customerMobile;


    // ========================================================
    // WHATSAPP URL
    // ========================================================

    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(message);


    // ========================================================
    // OPEN CUSTOMER WHATSAPP
    // ========================================================

    window.location.href =
        whatsappURL;

}


// ============================================================
// WHATSAPP BUTTON
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const whatsappButton =
            getElement("whatsappButton");

        if (whatsappButton) {

            whatsappButton.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    sendCouponToWhatsApp();

                }
            );

        }

    }
);


// ============================================================
// MAKE WHATSAPP FUNCTION AVAILABLE TO HTML
// ============================================================

window.sendCouponToWhatsApp =
    sendCouponToWhatsApp;