// ============================================================
// GOWTHAM TYRES - SPIN & WIN
// FINAL script.js
// ============================================================

const GOOGLE_SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbw5nqfrdU7Oe8n-pdhW9uUnfG3k9nPq-pVSbJBN7VQHeURqoOEpf4ebzCg-MW61pJCl/exec";

const form = document.getElementById("leadForm");

// Store customer details BEFORE form.reset()
let customerMobile = "";
let customerName = "";
let customerVehicle = "";
let customerInterest = "";
let customerDealership = "";


// ============================================================
// FIND ELEMENT SAFELY
// ============================================================

function getElement(id) {
    return document.getElementById(id);
}


// ============================================================
// SUBMIT FORM
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
        // OPTIONAL FIELDS
        // --------------------------------------------------------

        let interest = "";
        let dealership = "";

        const allSelects =
            form.querySelectorAll("select");

        allSelects.forEach(function (select) {

            const label =
                select.parentElement
                    ? select.parentElement.innerText.toLowerCase()
                    : "";

            if (
                label.includes("interest") ||
                label.includes("technology")
            ) {
                interest = select.value;
            }

            if (
                label.includes("dealership") ||
                label.includes("₹1 lakh") ||
                label.includes("1 lakh")
            ) {
                dealership = select.value;
            }

        });


        // --------------------------------------------------------
        // SAVE CUSTOMER DETAILS FOR WHATSAPP
        // --------------------------------------------------------

        customerMobile = mobile;
        customerName = name;
        customerVehicle = vehicle;
        customerInterest = interest;
        customerDealership = dealership;


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


        const prize =
            prizes[
                Math.floor(
                    Math.random() * prizes.length
                )
            ];


        // --------------------------------------------------------
        // COUPON
        // --------------------------------------------------------

        const coupon =
            "GT" +
            Date.now()
                .toString()
                .slice(-6);


        // --------------------------------------------------------
        // SEND TO GOOGLE SHEETS
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
        // BUTTON
        // --------------------------------------------------------

        const submitBtn =
            form.querySelector("button");

        if (submitBtn) {

            submitBtn.disabled = true;

            submitBtn.innerText =
                "Processing...";

        }


        try {

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
            // DUPLICATE
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
                // PUT COUPON ON RESULT PAGE
                // -----------------------------------------------

                const couponElement =
                    getElement("couponCode");

                if (couponElement) {

                    couponElement.innerText =
                        coupon;

                }


                // -----------------------------------------------
                // PUT PRIZE ON RESULT PAGE
                // -----------------------------------------------

                const prizeElement =
                    getElement("prizeWon");

                if (prizeElement) {

                    prizeElement.innerText =
                        prize;

                }


                // -----------------------------------------------
                // HIDE FORM PAGE
                // -----------------------------------------------

                const resultPage =
                    getElement("resultPage");


                // Try to find the form container
                let formPage =
                    getElement("formPage");


                if (!formPage) {

                    formPage =
                        form.closest(
                            ".container"
                        );

                }


                if (
                    formPage &&
                    formPage !== resultPage
                ) {

                    formPage.style.display =
                        "none";

                }


                // -----------------------------------------------
                // SHOW RESULT PAGE
                // -----------------------------------------------

                if (resultPage) {

                    resultPage.style.display =
                        "block";

                }


                // -----------------------------------------------
                // ALSO SUPPORT OLD MODAL VERSION
                // -----------------------------------------------

                const winnerModal =
                    getElement("winnerModal");

                if (winnerModal) {

                    winnerModal.style.display =
                        "flex";

                }


                // -----------------------------------------------
                // RESET FORM
                // -----------------------------------------------

                form.reset();


                if (submitBtn) {

                    submitBtn.disabled =
                        false;

                    submitBtn.innerText =
                        "🎁 CLAIM MY COUPON";

                }


                // -----------------------------------------------
                // SCROLL TO RESULT
                // -----------------------------------------------

                if (resultPage) {

                    resultPage.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }

        } catch (error) {

            console.error(
                "Google Apps Script error:",
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
// WHATSAPP
// ============================================================

function sendCouponToWhatsApp() {


    // ----------------------------------------------------------
    // CUSTOMER NUMBER
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // COUPON
    // ----------------------------------------------------------

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


    // ----------------------------------------------------------
    // MESSAGE
    // ----------------------------------------------------------

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
https://www.facebook.com/

Thank you for choosing GOWTHAM TYRES! 🙏`;


    // ----------------------------------------------------------
    // CUSTOMER'S WHATSAPP NUMBER
    // ----------------------------------------------------------

    const whatsappNumber =
        "91" + customerMobile;


    // ----------------------------------------------------------
    // WHATSAPP URL
    // ----------------------------------------------------------

    const whatsappURL =
        "https://wa.me/" +
        whatsappNumber +
        "?text=" +
        encodeURIComponent(message);


    // ----------------------------------------------------------
    // OPEN
    // ----------------------------------------------------------

    window.open(
        whatsappURL,
        "_blank"
    );

}


// ============================================================
// CLOSE WINNER
// ============================================================

function closeWinner() {

    const winnerModal =
        getElement("winnerModal");

    if (winnerModal) {

        winnerModal.style.display =
            "none";

    }

}


// ============================================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// ============================================================

window.sendCouponToWhatsApp =
    sendCouponToWhatsApp;

window.closeWinner =
    closeWinner;