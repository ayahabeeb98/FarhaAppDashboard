document.addEventListener("DOMContentLoaded", function (event) {
    let url = new URL(document.location).href;
    let id = url.split('#')[1].slice(2);
    // console.log(id);

    const docRef = firebase.firestore().collection("requests").doc(id);
    const hallTable = document.querySelector('#hallTable');

    docRef.get().then(function (doc) {
        if (doc.exists) {
            const data = doc.data();
            console.log(data);
            let row = hallTable.insertRow(1);
            // for(let i = 0; i<=5 ;i++){
            row.insertCell(0).innerHTML = 1;
            row.insertCell(1).innerHTML = data.hallName;
            row.insertCell(2).innerHTML = data.hallAddress;
            row.insertCell(3).innerHTML = data.roomName;
            row.insertCell(4).innerHTML = data.roomPersons;
            row.insertCell(5).innerHTML = data.roomPrice;
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });


});