

document.addEventListener("DOMContentLoaded", function(event) {
    //we ready baby

    const reqTable = document.querySelector('#requestTable');

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

                    const approve = document.createElement('BUTTON');
                    const approveText = document.createTextNode('approve');
                    approve.setAttribute("id",`approve${doc.id}`);
                    approve.appendChild(approveText);

                    let hallId = null;
                    let hallAdded = false;
                    let roomAdded = false;
                    let userUpdated = false;
                    approve.addEventListener('click',()=> {
                        let id = approve.getAttribute("id").slice(7);
                        //remove from requests + add to hall & room table
                        firebase.firestore().collection('halls').add({
                            name: data.hallName,
                            address : data.hallAddress,
                            owner : data.userId,
                            roomNum : 1
                        }).then((ref)=>{
                            hallId = ref.id;
                            hallAdded = true;
                            console.log('hall added successfully',hallId);

                        });

                        setTimeout(()=>{
                            firebase.firestore().collection('rooms').add({
                                name: data.roomName,
                                numberOfPeople : data.roomPersons,
                                hallId: hallId,
                                price : data.roomPrice,
                                services: data.serviceName ,
                                servicePrice : data.servicePrice,
                                address: data.hallAddress,
                                description: data.hallDescription,
                                roomNum : 1
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


                        setTimeout(()=> {
                            try{
                                firebase.firestore().collection('requests').doc(id).delete().then(function() {
                                    if (doc.exists) {
                                        console.log("Document successfully deleted!");
                                    }else {
                                        console.log('doc not exist')
                                    }
                                }).catch(function(error) {
                                    console.error("Error removing document: ", error);
                                });
                            } catch (e) {
                                console.log(e)
                            }
                        },5000);

                        console.log(id);
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

                    row.insertCell(5).append(approve,'  ' , reject);
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

