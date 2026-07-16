const form = document.getElementById("leadForm");

form.addEventListener("submit", async function(e){

    e.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const mobile =
        document.getElementById("mobile").value.trim();

    const vehicle =
        document.getElementById("vehicle").value.trim();

    // Mobile Validation

    if (!/^[6-9]\d{9}$/.test(mobile)) {

        alert(
            "Please enter a valid 10-digit mobile number."
        );

        return;
    }

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
        prizes[Math.floor(Math.random() * prizes.length)];

    const coupon =
        "GT" + Date.now().toString().slice(-6);

    const data = {
        name,
        mobile,
        vehicle,
        prize,
        coupon
    };

    try {
const submitBtn = form.querySelector("button");

submitBtn.disabled = true;

submitBtn.innerText = "Processing...";
        const response = await fetch(
            "https://script.google.com/macros/s/AKfycbw5nqfrdU7Oe8n-pdhW9uUnfG3k9nPq-pVSbJBN7VQHeURqoOEpf4ebzCg-MW61pJCl/exec",
            {
                method: "POST",
                headers: {
                    "Content-Type": "text/plain"
                },
                body: JSON.stringify(data)
            }
        );

        const result = await response.json();

        if (result.status === "duplicate") {

    submitBtn.disabled = false;

    submitBtn.innerText = "🎁 CLAIM MY COUPON";

    alert(
        "This mobile number has already claimed a coupon."
    );

    return;
}

        if (result.status === "success") {

            document.getElementById(
                "couponCode"
            ).innerText = coupon;

            document.getElementById(
                "prizeWon"
            ).innerText = prize;

            document.getElementById(
                "winnerModal"
            ).style.display = "flex";

            form.reset();
            document.getElementById("name").focus();
            submitBtn.disabled = false;

submitBtn.innerText = "🎁 CLAIM MY COUPON";
        }

    } catch(error){
submitBtn.disabled = false;

submitBtn.innerText = "🎁 CLAIM MY COUPON";
        alert(
            "Error saving data. Please try again."
        );

        console.error(error);
    }

});

function closeWinner(){

    document.getElementById(
        "winnerModal"
    ).style.display = "none";

}