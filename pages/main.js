

document.addEventListener("DOMContentLoaded", function(event) {

    const reqTable = document.querySelector('#requestTable');


    async function sendPushNotification(expoPushToken) {
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: 'Farha App',
            body: 'تم قبول طلبك',

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
                    statusSpan.className = 'label label-sm';
                    if (data.status === "Approved") {
                        statusSpan.classList.add('label-success');
                        console.log('a')
                    }else {
                        statusSpan.classList.add('label-warning');
                        console.log('s', data.status === "Approved")
                    }

                    statusSpan.appendChild(statusVal);

                    row.insertCell(5).appendChild(statusSpan);


                    const approve = document.createElement('BUTTON');
                    const approveText = document.createTextNode('approve');
                    approve.setAttribute("id",`approve${doc.id}`);
                    approve.appendChild(approveText);


                    approve.addEventListener('click',()=> {
                        let id = approve.getAttribute("id").slice(7);
                        //remove from requests + add to hall & room table
                        firebase.firestore().collection('halls').add({
                            name: data.hallName,
                            address : data.hallAddress,
                            owner : data.userId,
                            hallImage: data.hallImgURL,
                            description: data.hallDescription,
                            roomNum : 1
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
                            businessPhone: data.ownerPhone
                        }).then(()=>{
                            userUpdated = true;
                            console.log('user updated')
                        });



                        // setTimeout(()=> {
                        //     try{
                        //         firebase.firestore().collection('requests').doc(id).delete().then(function() {
                        //             if (doc.exists) {
                        //                 console.log("Document successfully deleted!");
                        //             }else {
                        //                 console.log('doc not exist')
                        //             }
                        //         }).catch(function(error) {
                        //             console.error("Error removing document: ", error);
                        //         });
                        //     } catch (e) {
                        //         console.log(e)
                        //     }
                        // },8000);

                        const status = document.getElementById('status');

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

                        const btn = document.getElementById(`approve${doc.id}`);

                        btn.disabled=true;

                    });




                    const reject = document.createElement('BUTTON');
                    const rejectText = document.createTextNode('reject');
                    reject.setAttribute("id",`reject${doc.id}`);
                    reject.appendChild(rejectText);

                    reject.addEventListener('click',  () => {
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


                    row.insertCell(6).append(approve,'  ' , reject);
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

