document.addEventListener("DOMContentLoaded", function (event) {
    const cardPhoto = document.getElementById('managerCardPhoto');
    const cardName = document.getElementById('managerName');
    const cardEmail = document.getElementById('email');
    const cardPhone = document.getElementById('phone');
    const hallName = document.getElementById('hallName');
    const hallLocation = document.getElementById('hallLocation');
    const hallImg = document.getElementById('hallImg');
    const roomNum = document.getElementById('numOfRooms');
    const details = document.getElementById('details');
    const roomName = document.getElementById('roomName');
    const roomImg = document.getElementById('roomImg');
    const roomPrice = document.getElementById('price');
    const capacity = document.getElementById('capacity');
    const service = document.getElementById('serv');

    let url = new URL(document.location).href;
    let id = url.split('#')[1].slice(2);


    const docRef = firebase.firestore().collection("requests").doc(id);
    // const hallTable = document.querySelector('#hallTable');

    docRef.get().then(function (doc) {
        if (doc.exists) {
            const data = doc.data();
            console.log(data);
            let servType = "";
            if(data.freeService) {
                servType = "Free" ;
            }else {
                servType = "Paid";
            }
            cardPhoto.src = data.managerImgURL;
            cardName.innerHTML = data.ownerName;
            cardEmail.innerHTML = data.ownerEmail;
            cardPhone.innerHTML = data.ownerPhone;
            hallName.innerHTML = data.hallName;
            hallLocation.innerHTML = data.category + ', ' + data.hallAddress;
            hallImg.src = data.hallImgURL;
            details.innerHTML =  data.hallDescription;
            roomNum.innerHTML = 'عدد القاعات :  ' + data.numOfRoom;

            roomName.innerHTML = data.roomName ;
            roomImg.src = data.roomImgURL;
            capacity.innerHTML = 'تتسع إلى ' + data.roomPersons + ' شخص ';
            roomPrice.innerHTML = data.roomPrice ;

            service.innerHTML = data.serviceName
            // let row = hallTable.insertRow(1);
            // for(let i = 0; i<=5 ;i++){
            // row.insertCell(0).innerHTML = 1;
            // row.insertCell(1).innerHTML = data.hallName;
            // row.insertCell(2).innerHTML = data.hallAddress;
            // row.insertCell(3).innerHTML = data.roomName;
            // row.insertCell(4).innerHTML = data.roomPersons;
            // row.insertCell(5).innerHTML = data.roomPrice;
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });


});