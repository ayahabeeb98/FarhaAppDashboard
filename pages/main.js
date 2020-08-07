

document.addEventListener("DOMContentLoaded", function(event) {

    const reqTable = document.querySelector('#requestTable');


    async function sendPushNotification(expoPushToken) {
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: 'Farha App',
            body: 'تم قبول طلبك للإنضمام لأصحاب الصالات, يمكنك عرض الصالات الخاصة بك وإضافة صالات جديدة',

        };

        await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        }).then(response => console.log(response.text()))
    }

    try {

            const snapshot =  firebase.firestore().collection('requests').get().then((querySnapshot) => {
                // console.log(querySnapshot.size);
                let c = 1;
                querySnapshot.forEach((doc,index) => {
                    const data = doc.data();
                    console.log(data);
                    let row = reqTable.insertRow(-1);
                    // for(let i = 0; i<=5 ;i++){
                    row.insertCell(0).innerHTML = c;
                    row.insertCell(1).innerHTML = data.ownerName;
                    row.insertCell(2).innerHTML = data.ownerPhone;
                    const anchor = document.createElement('A');
                    anchor.href = `./hallDetails.html#i=${doc.id}`;
                    const anchorVal = document.createTextNode(data.hallName);
                    anchor.appendChild(anchorVal);
                    row.insertCell(3).appendChild(anchor);
                    row.insertCell(4).innerHTML = data.hallAddress;


                    const statusSpan = document.createElement('SPAN');
                    statusSpan.setAttribute('id','status');
                    const statusVal = document.createTextNode(data.status);

                    statusSpan.style.fontWeight = "bold";

                    statusSpan.appendChild(statusVal);

                    row.insertCell(5).appendChild(statusSpan);
                    console.log(data.status, data.status === "Suspended");
                    if (data.status === "Suspended") {
                    var approve = document.createElement('BUTTON');
                    approve.classList.add('btn');
                    approve.classList.add('btn-submit');
                    approve.classList.add('mt-sweetalert');
                    approve.setAttribute('data-title','Done');
                    approve.setAttribute('data-allow','success');
                    approve.setAttribute('data-allow-outside-click','true');
                    approve.setAttribute('data-confirm-button-class','btn-success');
                    approve.setAttribute('data-message','Wedding Hall added successfully');
                    approve.style.backgroundColor = "rgb(37, 186, 37)";
                    approve.style.color = "#FFF";
                    approve.style.borderColor = "rgb(37, 186 ,37)";
                    approve.style.fontSize = "14px";
                    var approveText = document.createTextNode('approve');
                    approve.setAttribute("id",`approve${doc.id}`);
                    approve.appendChild(approveText);

                    approve.addEventListener('click',()=> {
                        swal("Done", "Wedding Hall added Successfully", "success");

                            var id = approve.getAttribute("id").slice(7);
                        //remove from requests + add to hall & room table
                        firebase.firestore().collection('halls').add({
                            name: data.hallName,
                            address : data.category,
                            location:data.hallAddress,
                            owner : data.userId,
                            hallImage: data.hallImgURL,
                            description: data.hallDescription,
                            roomNum : data.numOfRoom,
                            earnest: data.earnest,
                            ordersCounter: "20-000",

                            isFav:false
                        }).then((ref)=>{
                            hallId = ref.id;
                            hallAdded = true;
                            console.log('hall added successfully',hallId);

                        });


                        setTimeout(()=>{
                            firebase.firestore().collection('rooms').add({
                                roomName: data.roomName,
                                roomPersons : data.roomPersons,
                                hallId: hallId,
                                roomPrice : data.roomPrice,
                                serviceName: data.serviceName ,
                                servicePrice : data.servicePrice,
                                address: data.hallAddress,
                                roomImage: data.roomImgURL,
                                freeService:data.freeService,
                                paidService:data.paidService,
                            }).then(()=>{
                                roomAdded = true;
                                console.log('room added successfully')
                            });
                        },4000);


                        firebase.firestore().collection('users').doc(data.userId).update({
                            manager: true,
                            businessEmail : data.ownerEmail,
                            businessPhone: data.ownerPhone,
                            photoURL: data.managerImgURL
                        }).then(()=>{
                            userUpdated = true;
                            console.log('user updated')
                        });



                        setTimeout(()=> {
                            firebase.firestore().collection('hallImages').add({
                                hallId: hallId,
                                hallImage: data.hallImgURL,
                                roomImage: data.roomImgURL,
                                caption:data.hallName
                            }).then(()=>{
                                console.log('Images added successfully');

                            });
                        },6000);



                        var status = document.getElementById('status');

                        firebase.firestore().collection('requests').doc(id).update({
                            status:"Approved"
                        }).then(()=> {
                            status.innerText = " Approved ";
                        }).catch(e=>console.log(e));

                        // Create a reference to the cities collection
                        let userInfo = firebase.firestore().collection("users");
                        let query = userInfo.where("uid", "==", data.userId)
                            .get()
                            .then(function(querySnapshot) {
                                querySnapshot.forEach(function(doc) {
                                    // doc.data() is never undefined for query doc snapshots
                                    console.log(doc.id, " => ", doc.data());
                                    let expoToken = doc.data().expoPushToken;
                                    console.log('token ' , doc.data().expoPushToken );
                                    sendPushNotification(expoToken);
                                });
                            })
                            .catch(function(error) {
                                console.log("Error getting documents: ", error);
                            });

                        var btn = document.getElementById(`approve${doc.id}`);

                        btn.disabled=true;

                    });

                    };





                    const reject = document.createElement('BUTTON');
                    reject.classList.add('btn');
                    reject.classList.add('btn-danger');

                    reject.style.backgroundColor = "rgb(255,60,41)";
                    reject.style.color = "#FFF";
                    reject.style.borderColor = "rgb(255,60,41)";
                    reject.style.fontSize = "14px";
                    const rejectText = document.createTextNode('reject');
                    reject.setAttribute("id",`reject${doc.id}`);
                    reject.appendChild(rejectText);

                    reject.addEventListener('click',  () => {
                        swal({
                                title: "Are you sure?",
                                type: "warning",
                                showCancelButton: true,
                                confirmButtonClass: "btn-danger",
                                confirmButtonText: "Yes, delete it!",
                                closeOnConfirm: false,
                            },
                            function(){
                                swal("Deleted!", "The request has been deleted.", "success");

                        let id = reject.getAttribute("id").slice(6);
                        try{
                            firebase.firestore().collection('requests').doc(id).delete().then(function() {
                                if (doc.exists) {
                                    console.log("Document successfully deleted!");
                                    location.reload();
                                }else {
                                    console.log('doc not exist')
                                }
                            }).catch(function(error) {
                                console.error("Error removing document: ", error);
                            });
                        } catch (e) {
                            console.log(e)
                        }
                            });
                    });


                   if (data.status === "Suspended") {
                       row.insertCell(6).append(approve,'  ' , reject);
                   }else {
                       row.insertCell(6).append( reject);
                   }
                    // row.insertCell(5).appendChild(reject);

                    c++;

                });
            })

            // snapshot.forEach(doc => {
            //     const id = doc.id;
            //     const data = doc.data();
            //
            //     console.log({ id, data });
            // });

    }catch (e) {
        console.log(e)
    }

});

