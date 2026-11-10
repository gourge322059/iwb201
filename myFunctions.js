// jQuery: show/hide details and the booking form
$(document).ready(function () {
    $(".show-details").click(function () {
        $("#details-" + this.id).toggle(300);
    });
    $("#continueBtn").click(function () {
        if ($(".select-car:checked").length === 0) {
            alert("الرجاء اختيار سيارة واحدة على الأقل");
            return;
        }
        $("#bookingForm").slideDown(400);
    });
});

function getSelectedCars() {
    var cars = [];
    var boxes = document.getElementsByClassName("select-car");
    for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].checked) {
            var row = boxes[i].parentNode.parentNode;
            var model = row.cells[1].textContent;
            var price = parseInt(row.cells[3].textContent, 10);
            cars.push({ code: boxes[i].value, model: model, price: price });
        }
    }
    return cars;
}

function validateForm() {
    var errors = [];
    var name = document.getElementById("fullName").value.trim();
    var nid = document.getElementById("nationalId").value.trim();
    var start = document.getElementById("startDate").value;
    var end = document.getElementById("endDate").value;
    var mobile = document.getElementById("mobile").value.trim();
    var email = document.getElementById("email").value.trim();
    var datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (name !== "" && !/^[\u0621-\u064A\s]+$/.test(name)) {
        errors.push("الاسم يجب أن يحتوي أحرفاً عربية فقط");
    }
    if (!/^\d{11}$/.test(nid)) {
        errors.push("الرقم الوطني إلزامي ويجب أن يتكون من 11 رقماً");
    } else {
        var gov = parseInt(nid.substring(0, 2), 10);
        if (gov < 1 || gov > 14) {
            errors.push("أول خانتين من الرقم الوطني يجب أن تكونا بين 01 و 14");
        }
    }
    if (!datePattern.test(start)) {
        errors.push("تاريخ البداية إلزامي وبصيغة yyyy-mm-dd");
    }
    if (!datePattern.test(end)) {
        errors.push("تاريخ النهاية إلزامي وبصيغة yyyy-mm-dd");
    }
    if (datePattern.test(start) && datePattern.test(end) && new Date(end) <= new Date(start)) {
        errors.push("تاريخ النهاية يجب أن يكون لاحقاً لتاريخ البداية");
    }
    // Syriatel: 093, 098, 099 - MTN: 094, 095, 096
    if (mobile !== "" && !/^09[3-689]\d{7}$/.test(mobile)) {
        errors.push("رقم الموبايل غير صحيح (Syriatel أو MTN)");
    }
    if (email !== "" && !/^[\w.\-]+@[\w\-]+(\.[\w\-]+)+$/.test(email)) {
        errors.push("البريد الإلكتروني غير صحيح");
    }

    var errBox = document.getElementById("errors");
    if (errors.length > 0) {
        errBox.innerHTML = errors.join("<br />");
        return false;
    }
    errBox.innerHTML = "";
    showResult(start, end);
    return false;
}

function showResult(start, end) {
    var days = Math.round((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
    var cars = getSelectedCars();
    var total = 0;
    var html = "<h2>تفاصيل الحجز</h2><table border='1' cellspacing='0' cellpadding='8' style='width:100%; text-align:center;'><tr><th>السيارة</th><th>عدد الأيام</th><th>السعر اليومي</th><th>المبلغ</th></tr>";
    for (var i = 0; i < cars.length; i++) {
        var cost = cars[i].price * days;
        total += cost;
        html += "<tr><td>" + cars[i].code + "<br>" + cars[i].model + "</td><td>" + days + "</td><td>" + cars[i].price + " ل.س</td><td>" + cost + " ل.س</td></tr>";
    }
    html += "</table>";
    var discount = 0;
    if (days > 10) {
        discount = total * 0.05;
    }
    html += "<p>المجموع: " + total + " ل.س</p>";
    html += "<p>الخصم (5% عند تجاوز 10 أيام): " + discount + " ل.س</p>";
    html += "<p><strong>المبلغ النهائي: " + (total - discount) + " ل.س</strong></p>";

    // فتح نافذة جديدة وكتابة المحتوى فيها
    var newWindow = window.open("", "_blank","width=700,height=500");
    newWindow.document.write("<!DOCTYPE html><html lang='ar' dir='rtl'><head><title>تفاصيل الحجز</title><style>body{font-family:Tahoma, sans-serif; padding: 20px;} table{border-collapse: collapse; width: 100%; margin-top: 15px;} th, td{border: 1px solid #ccc; padding: 10px;} th{background-color: #f4f4f4;}</style></head><body>" + html + "</body></html>");
    newWindow.document.close();
}